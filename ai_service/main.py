import base64
import html
import re
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from config import AI_PORT
from schemas import (
    ComicRequest, ComicResponse, FlashQuizResponse,
    ComicImageRequest, QuizSubmission, FeedbackResponse, ComicImagesResponse
)
from comic_generator import generate_comic_story
from flashquiz_generator import generate_flashcards_and_quiz, generate_feedback
from image_generator import generate_comic_images

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="EduComic AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ------------------ HELPERS ------------------

def _panels_from_story(story_text: str) -> List[str]:
    """Full panel blocks extract karta hai — Scene + dialogues sab kuch."""
    panels = [
        p.strip()
        for p in re.split(r'Panel\s*\d+\s*:', story_text, flags=re.IGNORECASE)
        if p.strip()
    ]
    return panels[:4]

def _svg_for_text(desc: str, idx: int, width=600, height=400) -> str:
    """Fallback agar AI image fail ho jaye."""
    safe = html.escape(desc)
    words = safe.split()
    lines = []
    line = ""
    for w in words:
        if len(line) + len(w) + 1 > 40:
            lines.append(line)
            line = w
        else:
            line = (line + " " + w).strip()
    if line: lines.append(line)

    colors = ["#FFEDD5","#E6FFFA","#FFF7ED","#F0FDF4","#EEF2FF"]
    bg = colors[idx % len(colors)]
    lines_svg = "\n".join([f'<tspan x="40" dy="1.2em">{l}</tspan>' if i>0 else f'<tspan x="40" dy="0">{l}</tspan>' for i,l in enumerate(lines)])
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}">
  <rect width="100%" height="100%" fill="#1f2937" /> 
  <rect x="5" y="5" width="{width-10}" height="{height-10}" fill="{bg}" rx="10" ry="10"/> 
  <text x="40" y="60" font-family="Arial" font-size="16" fill="#0f172a">{lines_svg}</text>
</svg>'''
    return base64.b64encode(svg.encode('utf-8')).decode('utf-8')

# ------------------ TEXT & QUIZ ROUTES ------------------

@app.post("/generate-comic", response_model=ComicResponse)
async def generate_comic(req: ComicRequest):
    if not req.lesson_text:
        raise HTTPException(status_code=400, detail="Lesson text is required.")
    comic_story = generate_comic_story(req.lesson_text, req.genre)
    return {"comic_story": comic_story}

@app.post("/generate-flashquiz", response_model=FlashQuizResponse)
async def generate_flashquiz(req: ComicRequest):
    """
    Flashcards aur Quiz generate karne ka main endpoint.
    """
    logger.info("📚 Generating flashcards and quiz...")
    if not req.lesson_text:
        raise HTTPException(status_code=400, detail="Text is empty")
        
    data = generate_flashcards_and_quiz(req.lesson_text)
    
    
    if not data["flashcards"] and not data["quiz"]:
        logger.error("❌ Failed to generate any study material.")
       
        return {"flashcards": [], "quiz": []}
        
    return data

@app.post("/generate-feedback", response_model=FeedbackResponse)
async def get_feedback(req: QuizSubmission):
    """Quiz results par feedback dene ke liye route."""
    feedback_text = generate_feedback(req.quiz_questions, req.student_answers)
    return {"feedback": feedback_text}

# ------------------ IMAGE GENERATION ROUTE ------------------

@app.post("/generate-images", response_model=ComicImagesResponse)
async def generate_images(data: ComicImageRequest):
    story_text = (data.comic_story or "").strip()
    if not story_text:
        raise HTTPException(status_code=400, detail="Missing comic_story")

    panels = _panels_from_story(story_text)
    if not panels:
     
        return {"images": [_svg_for_text(story_text, 0)]}

    try:
        # image_generator.py ko call karna
        logger.info("🚀 Generating comic images with bubbles...")
        result = generate_comic_images(story_text, genre=data.genre or "educational")
        generated_list = result.get("images", [])

        final_images = []
        for i, desc in enumerate(panels):
            b64img = None
            # Check agar AI ne image di hai
            if i < len(generated_list):
                candidate = generated_list[i]
                if candidate and len(candidate) > 100:  # real image will always be > 100 chars
                      b64img = candidate.split("base64,")[-1]

            if not b64img:
                logger.warning(f"⚠️ Panel {i} AI failed or empty, using SVG fallback.")
                b64img = _svg_for_text(desc, i)
            
            final_images.append(b64img)
            
        return {"images": final_images}

    except Exception as e:
        logger.error(f"❌ Critical Image failure: {e}")
        # Error hone par saare panels ke liye SVG fallback
        return {"images": [_svg_for_text(p, i) for i, p in enumerate(panels)]}

# ------------------ START SERVER ------------------

if __name__ == "__main__":
    import uvicorn
    # Node.js spawn logic ko hata kar uvicorn start karein
    
    uvicorn.run(app, host="0.0.0.0", port=8000)