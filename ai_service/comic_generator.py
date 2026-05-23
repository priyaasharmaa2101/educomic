# ai_service/comic_generator.py

from gemini_client import generate_with_gemini

GENRE_STYLE = {
    "superhero": """
SUPERHERO COMIC RULES (MANDATORY):
- Characters must have SUPERHERO NAMES and POWERS directly tied to the concept (e.g., "Captain Index" can teleport to any position instantly, "Array Knight" organizes chaos into order)
- Every panel needs ONE clear action moment: a hero punching data chaos, flying through code, using their power, or fighting a villain
- Use classic comic sound effects naturally in scene descriptions: BAM! ZAP! WHOOSH! KA-BOOM! SNAP!
- Panel 3 is the CLIMAX — hero must actively USE the concept as a superpower to defeat the villain. This is the most action-packed panel.
- Dialogue must feel like a real comic book: short, punchy, dramatic. Example: "No more disorder! INDEX STRIKE!" not "Let me show you how arrays work."
- There MUST be a VILLAIN who represents the problem or misconception (e.g., "Lord NullPointer", "The Chaos Compiler", "Baron Overflow")
- Panel 4 ends with a heroic one-liner catchphrase that also teaches the lesson
""",
    "sci-fi": """
SCI-FI COMIC RULES (MANDATORY):
- Set entirely inside a futuristic digital universe, space station, or AI mainframe
- Characters are astronaut-scientists, AI androids, or cyber-engineers in sleek neon-lit suits
- Naturally weave in sci-fi terms: "quantum array", "neural dataspace", "sector grid", "binary warp"
- Panel 3 MUST show a dramatic holographic visualization of the concept being activated to stop a crisis
- The problem is a system meltdown, alien data virus, or corrupted sector threatening the station
- Dialogue is urgent and technical: "Initiating emergency sort protocol — sector 7 is going critical!"
- End with a mission-log style lesson: "Mission complete. Remember: indexed access = O(1). Always."
""",
    "fantasy": """
FANTASY COMIC RULES (MANDATORY):
- Set in a magical kingdom where programming concepts exist as ancient spells, enchanted artifacts, or mystical forces
- Characters are robed wizards, armored knights, or magical scholars carrying glowing staffs or spell-books
- The lesson concept IS a powerful spell or legendary artifact
- Panel 3 MUST show an epic magical battle or spell-casting scene — glowing effects, energy blasts, dramatic transformation
- There is a dark sorcerer or monster who represents the problem
- Use rich fantasy language: "By the enchanted tome!", "The realm trembles!", "Ancient algorithm, awaken!"
- End with a wise wizard's proverb that teaches the lesson
""",
    "thriller": """
THRILLER COMIC RULES (MANDATORY):
- Set in a rain-soaked noir city at midnight, or a tense underground laboratory
- Characters are sharp detectives or secret agents in long coats, speaking in clipped tense sentences
- The lesson concept is the KEY that solves a crime, cracks a code, or stops a countdown
- Panel 3 MUST be the confrontation or revelation moment — suspect cornered, code cracked, clock stopped
- There is a shadowy antagonist or a ticking deadline creating constant tension
- Dialogue is short and tense: "Forty seconds. Think. What does O(1) mean?" "It means I go straight to the answer."
- End with a detective's cool closing line that wraps up the lesson
""",
    "educational": """
EDUCATIONAL COMIC RULES:
- Two relatable Indian school students — one curious and expressive, one logical and calm (age 14)
- Both wear school uniforms; their body language and expressions tell as much as their words
- The story follows a natural curiosity arc: one asks a real question → they explore together → the other has an insight → both understand
- Panel 3 is the lightbulb moment — use a simple, memorable real-world analogy to explain the concept visually
- Dialogue sounds like how students actually talk: casual, curious, a little funny
- Setting feels real: school rooftop, classroom after hours, library, science lab, canteen
- End with one student summarizing the lesson in their own words — something a student would actually remember
"""
}

GENRE_IMAGE_STYLE = {
    "superhero":   "Marvel-style superhero comic book art, bold ink outlines, dynamic action poses with speed lines, vivid primary colors red blue yellow, dramatic upward lighting, muscular caped heroes, explosive energy effects",
    "sci-fi":      "retro-futuristic sci-fi comic art, neon cyan and purple palette, holographic grid displays, sleek metallic suits with glowing visors, deep space or server-room background, cinematic dramatic lighting",
    "fantasy":     "high fantasy illustration comic style, warm golden and emerald color palette, glowing magical spell effects, detailed wizard robes and knight armor, mystical forest or ancient castle backdrop, painterly dramatic lighting",
    "thriller":    "noir thriller comic art, stark high-contrast black and white with deep red accents, heavy ink shadows, rain-slicked dark city streets, trench coat figures, single spotlight dramatic lighting, tense cinematic composition",
    "educational": "bright cheerful children's comic art, clean flat 2D illustration, warm pastel colors, expressive cute Indian school students in uniforms, clean simple backgrounds, friendly approachable style",
}


def generate_comic_story(lesson_text: str, genre: str) -> str:
    genre_rules = GENRE_STYLE.get(genre.lower(), GENRE_STYLE["educational"])

    prompt = f"""
You are an award-winning comic book writer. Your job is to create a SHORT, ENGAGING, GENRE-AUTHENTIC comic for students aged 10-16.

The comic must feel like a REAL {genre.upper()} comic — not a textbook with pictures.
The lesson should be FELT through the story, not just explained through dialogue.
Someone reading only the script should feel excited, curious, or thrilled — the story must work on its own.

Lesson Topic: {lesson_text}
Genre: {genre.upper()}

--- GENRE RULES ---
{genre_rules}

--- CHARACTER RULES ---
- You decide the character names — pick names that perfectly fit the genre and the concept being taught
- Do NOT use placeholder names like "Character A" or "Hero 1" — give them real, memorable, genre-fitting names
- Each character has ONE strong visual identity (cape color, glowing staff, trench coat, school uniform style)
- Characters ACT — they fight, cast spells, crack codes, point at discoveries. They do not just stand and talk
- Emotions must be visible and specific: shocked, determined, triumphant, fearful, curious, amazed

--- STORY STRUCTURE ---
Panel 1 — HOOK: Drop the reader into the world instantly. Show the problem or conflict dramatically. No slow introductions.
Panel 2 — RISING ACTION: The hero understands what is needed. Build tension or curiosity.
Panel 3 — CLIMAX: The most dynamic panel. The concept is USED, not just explained. Maximum visual action.
Panel 4 — RESOLUTION: Victory. The lesson lands through a memorable line — not a lecture.

--- WRITING RULES ---
- Dialogue: SHORT and PUNCHY. Max 2 sentences per character per panel. No paragraphs.
- Every line must sound natural for the genre — not like a teacher explaining to a student
- The concept must be SHOWN through action and story, not just stated out loud
- Use SPECIFIC sensory details in scene descriptions: colors, sounds, textures, motion — make it cinematic
- Each panel should feel like a movie frame the reader can picture instantly

--- FORMAT RULES ---
- Do NOT write anything before Panel 1 or after Panel 4
- Do NOT use markdown bold or italic anywhere
- Follow the exact format below with no changes
- CRITICAL: You must complete ALL 4 panels fully. Do not stop midway.
- Each panel MUST have Scene, Visual, Camera, and exactly 2 character dialogues

FORMAT:

Panel 1:
Scene: [Specific location + time + lighting + dominant colors + mood — one vivid cinematic sentence]
Visual: [Exactly what we SEE — character positions, expressions, poses, what they are doing, key background details]
Camera: [one of: wide shot / medium shot / close-up / over-the-shoulder / bird's-eye view / low angle]
[Character Name]: "[dialogue]"
[Character Name]: "[dialogue]"

Panel 2:
Scene: [Specific location + time + lighting + colors + mood]
Visual: [Exactly what we SEE — poses, expressions, actions, background]
Camera: [angle]
[Character Name]: "[dialogue]"
[Character Name]: "[dialogue]"

Panel 3:
Scene: [Specific location + time + lighting + colors + mood — CLIMAX, most detailed and energetic]
Visual: [Dynamic action — power effects, transformations, reactions, maximum energy and movement]
Camera: [angle]
[Character Name]: "[dialogue]"
[Character Name]: "[dialogue]"

Panel 4:
Scene: [Specific location + lighting + colors + mood — calm after the storm, victory]
Visual: [Triumphant or warm closing image — lesson concept visible in the background or environment]
Camera: [angle]
[Character Name]: "[memorable closing line that teaches the lesson naturally]"
[Character Name]: "[response or reaction that reinforces it]"
"""
    return generate_with_gemini(prompt)


def generate_image_prompt(panel_scene: str, panel_visual: str, panel_camera: str, genre: str) -> str:
    """
    Takes parsed panel fields and returns a rich image generation prompt.
    Call this after parsing the comic story output — once per panel.
    """
    art_style = GENRE_IMAGE_STYLE.get(genre.lower(), GENRE_IMAGE_STYLE["educational"])

    prompt = f"""
You are a specialist at writing image generation prompts for Stable Diffusion and DALL-E.
Your prompts produce vivid, genre-accurate comic panel illustrations.

Panel Scene: {panel_scene}
Panel Visual: {panel_visual}
Camera Angle: {panel_camera}
Genre: {genre}
Art Style: {art_style}

RULES:
- Begin immediately with the art style description — no preamble
- Describe the scene setting: location, lighting, colors, atmosphere
- Describe the characters: what they look like, their pose, expression, and action
- Apply the camera angle to frame the composition
- Be specific and visual — paint a picture with words
- Do NOT include any text, speech bubbles, or written words in the image description
- Do NOT explain or add labels — only the image prompt itself
- Length: 60-80 words
- End every prompt with: ", comic book panel style, vibrant colors, high detail, sharp ink lines"

Write the image generation prompt now:
"""
    return generate_with_gemini(prompt)