import sys
import json
import google.generativeai as genai
from config import GEMINI_API_KEY

# Existing Configuration
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-3-flash-preview")

def generate_with_gemini(prompt: str, expect_json: bool = False):
    try:
        mime_type = "application/json" if expect_json else "text/plain"

        response = model.generate_content(
            prompt,
            generation_config={
                "response_mime_type": mime_type,
                "max_output_tokens": 2048,
                "temperature": 0.7
            }
        )

        if not response or not response.text:
            raise ValueError("Empty response from Gemini")

        return response.text.strip()

    except Exception as e:
        print("❌ Gemini Error:", e)
        return "AI_ERROR"

# --- YE HAI EXTRA CONNECTIVITY BLOCK FOR NODE.JS ---
if __name__ == "__main__":
    try:
        # Node.js se bheja gaya topic (pehla argument) check karna
        if len(sys.argv) > 1:
            user_topic = sys.argv[1]
            
            # EduComic ke liye specific prompt
            refined_prompt = f"Create an educational comic script about {user_topic}. " \
                             f"Provide exactly 4 panels in JSON format with 'description' and 'dialogue'."
            
            # Aapka function call karna
            result = generate_with_gemini(refined_prompt, expect_json=True)
            
            # Ye 'print' hi Node.js ke 'stdout' mein jayega
            print(result)
        else:
            print(json.dumps({"error": "No topic provided"}))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))