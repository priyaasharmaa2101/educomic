# ai_service/image_generator.py

import os, re, base64, logging, requests, time, io, textwrap
from PIL import Image, ImageDraw, ImageFont
from dotenv import load_dotenv

load_dotenv()
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("image_generator")

CF_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID", "")
CF_API_TOKEN  = os.getenv("CLOUDFLARE_API_TOKEN", "")
CF_MODEL      = "@cf/stabilityai/stable-diffusion-xl-base-1.0"

COMIC_SIZE = 768  # 1024 → 768, MongoDB friendly (~500KB), quality bhi achhi

PANEL_COLORS = ["#FFE0B2", "#E1F5FE", "#F3E5F5", "#E8F5E9"]

GENRE_PALETTES = {
    "superhero":   {"accent": "#e94560"},
    "sci-fi":      {"accent": "#00d4ff"},
    "fantasy":     {"accent": "#f5c518"},
    "thriller":    {"accent": "#ff4444"},
    "educational": {"accent": "#1976D2"},
}


def _get_fonts():
    bold_paths = ["Bangers-Regular.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "C:/Windows/Fonts/arialbd.ttf"]
    reg_paths  = ["arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "C:/Windows/Fonts/arial.ttf"]
    fb, fr = ImageFont.load_default(), ImageFont.load_default()
    for p in bold_paths:
        try: fb = ImageFont.truetype(p, 16); break  # 18 → 16
        except: pass
    for p in reg_paths:
        try: fr = ImageFont.truetype(p, 22); break  # 26 → 22
        except: pass
    return fb, fr


def _parse_panel(panel_text):
    m = re.search(r'Scene\s*:\s*(.+)', panel_text, re.IGNORECASE)
    scene = m.group(1).strip() if m else ""

    m2 = re.search(r'Visual\s*:\s*(.+)', panel_text, re.IGNORECASE)
    visual = m2.group(1).strip() if m2 else ""

    m3 = re.search(r'Camera\s*:\s*(.+)', panel_text, re.IGNORECASE)
    camera = m3.group(1).strip() if m3 else ""

    SKIP = {"scene", "visual", "camera"}
    dialogues = []
    for m in re.finditer(r'^([A-Za-z\s]+)\s*:\s*["\']?(.+?)["\']?\s*$', panel_text, re.MULTILINE):
        name = m.group(1).strip()
        if name.lower() in SKIP:
            continue
        dialogues.append(f'{name}: "{m.group(2).strip()}"')

    return scene, visual, camera, dialogues


def _build_prompt(scene, visual="", camera="", genre="educational"):
    styles = {
        "superhero":   "superhero comic book art, dynamic poses, bold colors, Marvel style",
        "sci-fi":      "sci-fi comic art, futuristic neon, space, glowing tech",
        "fantasy":     "fantasy comic art, magical aura, dragons, mystical lighting",
        "thriller":    "noir thriller comic, dramatic shadows, dark atmosphere",
        "educational": "children's comic art, bright cheerful colors, cute friendly Indian school students",
    }
    style = styles.get(genre.lower(), styles["educational"])
    parts = [p for p in [scene, visual, f"{camera} shot" if camera else ""] if p]
    detail = ". ".join(parts)[:250]
    return f"{style}, {detail}, bold black outlines, flat colors, no text, blank banner top and bottom"[:450]


def _draw_comic_elements(draw, scene, dialogues, sz, font_bold, font_regular):
    if scene:
        lines = textwrap.TextWrapper(width=42).wrap(scene[:160])
        pad_y, lh = 10, 24  # padding aur line height thoda kam
        bh = len(lines) * lh + pad_y * 2
        draw.rectangle([10, 10, sz - 10, 10 + bh], fill="#FFF9C4", outline="black", width=2)
        y = 10 + pad_y
        for line in lines:
            try:
                bbox = font_regular.getbbox(line)
                tw = bbox[2] - bbox[0]
            except Exception:
                tw = len(line) * 10
            tx = (sz - tw) // 2
            draw.text((tx, y), line, fill="#1a1a1a", font=font_regular)
            y += lh

    if dialogues:
        BW   = 280  # 340 → 280
        LH   = 22   # 26 → 22
        PAD  = 12   # 16 → 12
        WRAP = 20   # 22 → 20
        by   = sz - 170  # 200 → 170

        for idx, dlg in enumerate(dialogues[:2]):
            wrapped = textwrap.TextWrapper(width=WRAP).wrap(dlg[:100].upper())
            if not wrapped:
                continue

            bh = len(wrapped) * LH + PAD * 2
            x  = 15 if idx == 0 else sz - BW - 15

            draw.ellipse([x+4, by+4, x+BW+4, by+bh+4], fill="#333333")
            draw.ellipse([x, by, x+BW, by+bh], fill="white", outline="black", width=3)

            tail_cx = x + BW // 4 if idx == 0 else x + (BW * 3) // 4
            draw.polygon(
                [(tail_cx - 10, by + bh - 2),
                 (tail_cx,      by + bh + 20),
                 (tail_cx + 10, by + bh - 2)],
                fill="white", outline="black", width=2
            )

            cy = by + PAD
            for line in wrapped:
                try:
                    bbox = font_bold.getbbox(line)
                    tw = bbox[2] - bbox[0]
                except Exception:
                    tw = len(line) * 11
                tx = x + (BW - tw) // 2
                draw.text((tx, cy), line, fill="black", font=font_bold)
                cy += LH

            by -= bh + 12


def _process_final_comic(img_bytes, scene, dialogues):
    try:
        img  = Image.open(io.BytesIO(img_bytes)).convert("RGB").resize((COMIC_SIZE, COMIC_SIZE), Image.Resampling.LANCZOS)
        draw = ImageDraw.Draw(img)
        fb, fr = _get_fonts()
        _draw_comic_elements(draw, scene, dialogues, COMIC_SIZE, fb, fr)
        draw.rectangle([0, 0, COMIC_SIZE - 1, COMIC_SIZE - 1], outline="black", width=12)  # 18 → 12
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        return base64.b64encode(buf.getvalue()).decode()
    except Exception as e:
        log.error(f"Processing error: {e}")
        return base64.b64encode(img_bytes).decode()


def _generate_placeholder(scene, dialogues, index, genre="educational"):
    accent = GENRE_PALETTES.get(genre.lower(), GENRE_PALETTES["educational"])["accent"]
    img    = Image.new("RGB", (COMIC_SIZE, COMIC_SIZE), PANEL_COLORS[index % len(PANEL_COLORS)])
    draw   = ImageDraw.Draw(img)
    fb, fr = _get_fonts()

    for row in range(0, COMIC_SIZE, 30):
        for col in range(0, COMIC_SIZE, 30):
            draw.ellipse([col+10, row+10, col+18, row+18], fill="#00000012")

    for cx, color in [(192, accent), (576, "#888888")]:  # 260/760 → 192/576 (768 scale)
        cy = 420  # 560 → 420
        draw.ellipse([cx-35, cy-100, cx+35, cy-35], fill=color)   # size thoda kam
        draw.rectangle([cx-42, cy-35, cx+42, cy+100], fill=color)
        draw.rectangle([cx-42, cy+100, cx-10, cy+185], fill=color)
        draw.rectangle([cx+10, cy+100, cx+42, cy+185], fill=color)

    draw.rectangle([0, 0, COMIC_SIZE - 1, COMIC_SIZE - 1], outline="black", width=12)
    _draw_comic_elements(draw, scene, dialogues, COMIC_SIZE, fb, fr)
    draw.text((COMIC_SIZE - 50, COMIC_SIZE - 40), f"#{index+1}", fill=accent, font=fb)

    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return base64.b64encode(buf.getvalue()).decode()


def _try_cloudflare(prompt, index):
    if not CF_ACCOUNT_ID or not CF_API_TOKEN:
        log.warning(f"Panel {index+1}: Cloudflare credentials missing.")
        return None

    url     = f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}/ai/run/{CF_MODEL}"
    headers = {"Authorization": f"Bearer {CF_API_TOKEN}", "Content-Type": "application/json"}
    payload = {"prompt": prompt}

    try:
        log.info(f"Panel {index+1}: Sending to Cloudflare AI...")
        response = requests.post(url, headers=headers, json=payload, timeout=90)

        if response.status_code != 200:
            log.warning(f"Panel {index+1}: Cloudflare rejected. Status {response.status_code}: {response.text}")
            return None

        content_type = response.headers.get("content-type", "").lower()
        if "image" not in content_type:
            log.warning(f"Panel {index+1}: Not an image response: {content_type}. Body: {response.text[:100]}")
            return None

        log.info(f"Panel {index+1}: Cloudflare image received ✅")
        return response.content

    except requests.exceptions.RequestException as e:
        log.warning(f"Panel {index+1}: Network error — {e}")
    except Exception as e:
        log.warning(f"Panel {index+1}: Unexpected error — {e}")

    return None


def _generate_single_panel(panel_text, index, genre):
    time.sleep(index * 0.5)
    scene, visual, camera, dialogues = _parse_panel(panel_text)
    log.info(f"Panel {index+1} scene: {scene[:70]}...")

    prompt   = _build_prompt(scene, visual, camera, genre)
    img_data = _try_cloudflare(prompt, index)

    if img_data:
        return index, _process_final_comic(img_data, scene, dialogues)

    log.warning(f"Panel {index+1}: Cloudflare failed — using PIL placeholder")
    return index, _generate_placeholder(scene, dialogues, index, genre)


def generate_comic_images(story_text, title="", genre="educational"):
    panels = [
        p.strip()
        for p in re.split(r'Panel\s*\d+\s*:', story_text, flags=re.IGNORECASE)
        if p.strip()
    ][:4]

    log.info(f"Found {len(panels)} panels to generate")
    images = [""] * len(panels)

    from concurrent.futures import ThreadPoolExecutor, as_completed
    with ThreadPoolExecutor(max_workers=2) as executor:
        futures = {
            executor.submit(_generate_single_panel, panel, i, genre): i
            for i, panel in enumerate(panels)
        }
        for future in as_completed(futures):
            try:
                idx, img_b64 = future.result()
                images[idx]  = img_b64
                log.info(f"Panel {idx+1} complete ✅")
            except Exception as e:
                log.error(f"Thread error: {e}")

    return {"images": images}