# ai_service/comic_generator.py

from gemini_client import generate_with_gemini

GENRE_STYLE = {
    "superhero": """
SUPERHERO COMIC RULES (MUST FOLLOW):
- Characters must have SUPERHERO NAMES and POWERS that match the lesson topic (like "Captain Index" who can jump to any position instantly, or "Array Knight" who brings order to chaos)
- Every panel must have ONE clear action moment: a hero punching chaos, flying through code, using their power, or fighting a villain
- Use classic comic sound effects in scene descriptions: BAM! ZAP! WHOOSH! KA-BOOM! SNAP!
- Panel 3 is the CLIMAX — the hero must USE the concept as a superpower to beat the villain. This must be the most exciting panel.
- Dialogue must feel like a real comic: short, punchy, and dramatic. Example: "No more disorder! INDEX STRIKE!" NOT "Let me show you how arrays work."
- There MUST be a VILLAIN who stands for the problem or wrong idea (like "Lord NullPointer", "The Chaos Compiler", or "Baron Overflow")
- Panel 4 ends with a short hero catchphrase that also teaches the lesson
""",
    "sci-fi": """
SCI-FI COMIC RULES (MUST FOLLOW):
- Set fully inside a future digital world, space station, or AI computer
- Characters are scientist-astronauts, AI robots, or cyber-engineers wearing neon suits
- Use sci-fi words naturally: "quantum array", "neural dataspace", "sector grid", "binary warp"
- Panel 3 MUST show a big hologram of the concept being used to stop a crisis
- The problem is a system crash, alien data virus, or broken sector that puts the station at risk
- Dialogue is urgent and technical: "Starting emergency sort protocol — sector 7 is going critical!"
- End with a mission-log lesson: "Mission complete. Remember: indexed access = O(1). Always."
""",
    "fantasy": """
FANTASY COMIC RULES (MUST FOLLOW):
- Set in a magic kingdom where coding ideas exist as old spells, magic objects, or powerful forces
- Characters are wizards, knights, or magic scholars with glowing staffs or spell books
- The lesson concept IS a powerful spell or legendary item
- Panel 3 MUST show an epic magic battle or spell scene — glowing effects, energy blasts, big transformation
- There is a dark sorcerer or monster who stands for the problem
- Use fantasy language: "By the enchanted tome!", "The realm trembles!", "Ancient algorithm, awaken!"
- End with a wise wizard's saying that teaches the lesson
""",
    "thriller": """
THRILLER COMIC RULES (MUST FOLLOW):
- Set in a rainy dark city at night, or a tense underground lab
- Characters are sharp detectives or secret agents in long coats, speaking in short tense lines
- The lesson concept is the KEY that solves a crime, breaks a code, or stops a countdown
- Panel 3 MUST be the big moment — suspect caught, code cracked, clock stopped
- There is a shadowy enemy or a ticking deadline creating non-stop tension
- Dialogue is short and tense: "Forty seconds. Think. What does O(1) mean?" "It means I go straight to the answer."
- End with a cool detective line that wraps up the lesson
""",
    "educational": """
EDUCATIONAL COMIC RULES:
- Two Indian school students you can relate to — one curious and expressive, one calm and logical (age 14)
- Both wear school uniforms; their body language and expressions show as much as their words
- The story follows a simple arc: one asks a real question → they explore together → one has an insight → both understand
- Panel 3 is the lightbulb moment — use a simple real-world example to explain the concept visually
- Dialogue sounds like how students actually talk: casual, curious, a little funny
- Setting feels real: school rooftop, classroom after school, library, science lab, canteen
- End with one student saying the lesson in their own words — something easy to remember
"""
}

GENRE_IMAGE_STYLE = {
    "superhero":   "Marvel-style superhero comic art, bold ink outlines, action poses with speed lines, bright red blue yellow colors, dramatic lighting, caped heroes, explosive energy effects",
    "sci-fi":      "retro-futuristic sci-fi comic art, neon cyan and purple colors, holographic displays, sleek metallic suits with glowing visors, space or server-room background, cinematic lighting",
    "fantasy":     "high fantasy comic style, warm gold and green colors, glowing magic effects, detailed wizard robes and knight armor, mystical forest or old castle background, dramatic lighting",
    "thriller":    "noir thriller comic art, high-contrast black and white with dark red accents, heavy ink shadows, rainy dark city streets, trench coat figures, single spotlight lighting, tense cinematic shot",
    "educational": "bright cheerful children's comic art, clean flat 2D style, warm pastel colors, expressive Indian school students in uniforms, simple clean backgrounds, friendly and fun style",
}


def generate_comic_story(lesson_text: str, genre: str) -> str:
    genre_rules = GENRE_STYLE.get(genre.lower(), GENRE_STYLE["educational"])

    prompt = f"""
You are a comic book writer. Your job is to write a SHORT, FUN, comic for students aged 10-16.

The comic must feel like a REAL {genre.upper()} comic — not a textbook with pictures.
The lesson should come through the story, not just be said out loud in the dialogue.
Someone reading only the script should feel excited, curious, or thrilled.

Lesson Topic: {lesson_text}
Genre: {genre.upper()}

--- GENRE RULES ---
{genre_rules}

--- CHARACTER RULES ---
- You choose the character names — pick names that fit the genre and the lesson topic
- Do NOT use names like "Character A" or "Hero 1" — give them real names that fit the world
- Each character has ONE clear look (cape color, glowing staff, trench coat, school uniform)
- Characters must DO things — fight, cast spells, crack codes, point at things. They should not just stand and talk
- Emotions must be clear and specific: shocked, determined, happy, scared, curious, amazed

--- STORY STRUCTURE ---
Panel 1 — HOOK: Start right in the middle of the action. Show the problem clearly. No slow start.
Panel 2 — RISING ACTION: The hero figures out what is needed. Build tension or curiosity.
Panel 3 — CLIMAX: The most exciting panel. The concept is USED, not just explained. Lots of action.
Panel 4 — RESOLUTION: Win. The lesson lands through one good line — not a lecture.

--- WRITING RULES ---
- Dialogue: SHORT and PUNCHY. Max 2 sentences per character per panel. No long speeches.
- Every line must sound natural for the genre — not like a teacher explaining to a student
- The concept must be SHOWN through the story, not just said out loud
- Use clear details in scene descriptions: colors, sounds, movement — make it feel like a movie
- Each panel should feel like one clear movie frame the reader can picture right away

--- FORMAT RULES ---
- Do NOT write anything before Panel 1 or after Panel 4
- Do NOT use markdown bold or italic anywhere
- Follow the exact format below with no changes
- IMPORTANT: You must finish ALL 4 panels. Do not stop in the middle.
- Each panel MUST have Scene, Visual, Camera, and exactly 2 character dialogues

FORMAT:

Panel 1:
Scene: [Location + time + lighting + main colors + mood — one clear cinematic sentence]
Visual: [What we SEE — character positions, expressions, poses, what they are doing, key background details]
Camera: [one of: wide shot / medium shot / close-up / over-the-shoulder / bird's-eye view / low angle]
[Character Name]: "[dialogue]"
[Character Name]: "[dialogue]"

Panel 2:
Scene: [Location + time + lighting + colors + mood]
Visual: [What we SEE — poses, expressions, actions, background]
Camera: [angle]
[Character Name]: "[dialogue]"
[Character Name]: "[dialogue]"

Panel 3:
Scene: [Location + time + lighting + colors + mood — CLIMAX, most detailed and exciting]
Visual: [Action — power effects, transformations, reactions, lots of energy and movement]
Camera: [angle]
[Character Name]: "[dialogue]"
[Character Name]: "[dialogue]"

Panel 4:
Scene: [Location + lighting + colors + mood — calm after the action, victory]
Visual: [Happy or warm closing image — lesson concept shown in the background or around them]
Camera: [angle]
[Character Name]: "[closing line that teaches the lesson in a natural way]"
[Character Name]: "[response or reaction that supports it]"
"""
    return generate_with_gemini(prompt)


def generate_image_prompt(panel_scene: str, panel_visual: str, panel_camera: str, genre: str) -> str:
    """
    Takes parsed panel fields and returns a rich image generation prompt.
    Call this after parsing the comic story output — once per panel.
    """
    art_style = GENRE_IMAGE_STYLE.get(genre.lower(), GENRE_IMAGE_STYLE["educational"])

    prompt = f"""
You write image prompts for Stable Diffusion and DALL-E.
Your prompts create clear, genre-accurate comic panel images.

Panel Scene: {panel_scene}
Panel Visual: {panel_visual}
Camera Angle: {panel_camera}
Genre: {genre}
Art Style: {art_style}

RULES:
- Start right away with the art style — no intro
- Describe the scene: location, lighting, colors, mood
- Describe the characters: what they look like, their pose, expression, and action
- Use the camera angle to set the framing
- Be specific and visual — paint a picture with words
- Do NOT include any text, speech bubbles, or written words in the image description
- Do NOT explain or add labels — only write the image prompt
- Length: 60-80 words
- End every prompt with: ", comic book panel style, vivid colors, high detail, sharp ink lines"

Write the image prompt now:
"""
    return generate_with_gemini(prompt)