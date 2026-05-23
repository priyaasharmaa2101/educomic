from pydantic import BaseModel
from typing import List

class ComicRequest(BaseModel):
    lesson_text: str
    genre: str

class ComicResponse(BaseModel):
    comic_story: str

# === FIX: Ensure this class is correctly defined ===
class ComicImageRequest(BaseModel):
    comic_story: str

class Flashcard(BaseModel):
    question: str
    answer: str

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: str

class FlashQuizResponse(BaseModel):
    flashcards: List[Flashcard]
    quiz: List[QuizQuestion]

class QuizAnswer(BaseModel): # Renamed from QuizQuestion for clarity in submission context
    question: str
    options: List[str]
    correct_answer: str

class QuizSubmission(BaseModel):
    quiz_questions: List[QuizAnswer]
    student_answers: List[str]

class FeedbackResponse(BaseModel):
    feedback: str

class ComicImage(BaseModel):
    mime: str # e.g., "image/png"
    b64: str  # base64 encoded image data

class ComicImagesResponse(BaseModel):
    images: List[str]  # base64 encoded PNG strings only
    # In schemas.py — find ComicImageRequest and add genre field

class ComicImageRequest(BaseModel):
    comic_story: str
    genre: str = "educational"  # ✅ Add this line