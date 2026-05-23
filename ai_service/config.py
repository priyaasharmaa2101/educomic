import os
from dotenv import load_dotenv

# load .env file
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
STABILITY_API_KEY = os.getenv("STABILITY_API_KEY", "")

AI_PORT = os.getenv("AI_PORT", 8000)