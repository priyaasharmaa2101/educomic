import json
import re
import logging
from typing import List, Dict, Any
from gemini_client import generate_with_gemini

log = logging.getLogger(__name__)

def generate_flashcards_and_quiz(lesson_text: str) -> dict:
    """
    Gemini se flashcards aur quiz generate karta hai aur JSON parse karta hai.
    """
    prompt = f"""
You are an expert educational assistant. Your task is to convert the provided lesson into study materials.

STRICT INSTRUCTIONS:
1. Create exactly 5 flashcards: {{"question": "...", "answer": "..."}}
2. Create exactly 5 multiple-choice questions: {{"question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "Letter"}}
3. Use simple, child-friendly English.
4. Output ONLY the raw JSON object. No markdown, no backticks, no explanations.

Lesson Content:
{lesson_text}

JSON STRUCTURE:
{{
  "flashcards": [
    {{"question": "text", "answer": "text"}}
  ],
  "quiz": [
    {{
      "question": "text",
      "options": ["text", "text", "text", "text"],
      "correct_answer": "A"
    }}
  ]
}}
"""
    response = generate_with_gemini(prompt, expect_json=True)

    if response == "AI_ERROR" or not response:
        log.error("❌ Gemini API failed to respond.")
        return {"flashcards": [], "quiz": []}

    try:
        cleaned = response.strip()
        cleaned = re.sub(r"```json\s*|```", "", cleaned)

        start_idx = cleaned.find('{')
        end_idx = cleaned.rfind('}')

        if start_idx == -1 or end_idx == -1:
            raise ValueError("No JSON object found")

        json_str = cleaned[start_idx : end_idx + 1]

        # Fix 1: trailing commas remove karo
        json_str = re.sub(r',\s*([}\]])', r'\1', json_str)

        # Fix 2: truncated JSON — missing closing brackets add karo
        open_braces   = json_str.count('{') - json_str.count('}')
        open_brackets = json_str.count('[') - json_str.count(']')
        json_str += ']' * open_brackets + '}' * open_braces

        parsed = json.loads(json_str)

        parsed.setdefault("flashcards", [])
        parsed.setdefault("quiz", [])

        # Incomplete entries remove karo
        parsed["flashcards"] = [
            f for f in parsed["flashcards"]
            if f.get("question") and f.get("answer")
        ]
        parsed["quiz"] = [
            q for q in parsed["quiz"]
            if q.get("question") and q.get("options") and q.get("correct_answer")
        ]

        return parsed

    except Exception as e:
        log.error(f"❌ JSON Parsing Error: {e}")
        return {"flashcards": [], "quiz": []}


def generate_feedback(quiz_questions: List[Any], student_answers: List[str]) -> str:
    """
    Student ke answers check karke feedback generate karta hai.
    """
    incorrect_details = []

    for i, q in enumerate(quiz_questions):
        if hasattr(q, "model_dump"):
            q_data = q.model_dump()
        elif hasattr(q, "dict"):
            q_data = q.dict()
        else:
            q_data = q

        correct = q_data.get("correct_answer", "").strip().upper()
        student_raw = student_answers[i] if i < len(student_answers) else "Not Answered"
        student = str(student_raw).strip().upper()

        if student != correct:
            incorrect_details.append({
                "q": q_data.get("question"),
                "correct": correct,
                "yours": student
            })

    if not incorrect_details:
        return "🌟 Amazing! You got a perfect score! Keep it up, superstar!"

    summary_text = "\n".join([
        f"- Question: {item['q']} (Correct: {item['correct']}, You chose: {item['yours']})"
        for item in incorrect_details
    ])

    prompt = f"""
You are a very kind and encouraging primary school teacher.
A student took a quiz and got these questions wrong:
{summary_text}

Write a short, 4-line encouraging feedback:
1. Start with a positive note.
2. Gently explain what they missed.
3. Give one simple tip to improve.
4. End with 'Keep learning!'.
Use very simple words.
"""
    feedback = generate_with_gemini(prompt)
    return feedback if feedback != "AI_ERROR" else "Great effort! Review the lesson and try again."