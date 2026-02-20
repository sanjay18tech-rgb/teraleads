import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

from .config import GEMINI_API_KEY, GEMINI_MODEL
from .prompts import build_prompt

app = FastAPI(title="Teraleads AI Service", description="Dental assistant AI")

# Configure Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


class GenerateRequest(BaseModel):
    message: str
    patient_context: Optional[dict] = None


class GenerateResponse(BaseModel):
    reply: str


FALLBACK_MESSAGE = (
    "I apologize, but I'm having trouble generating a response at the moment. "
    "Please try again in a moment, or contact the clinic directly for immediate assistance."
)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/generate", response_model=GenerateResponse)
async def generate(request: GenerateRequest):
    if not GEMINI_API_KEY:
        return GenerateResponse(reply=FALLBACK_MESSAGE)

    prompt = build_prompt(request.message, request.patient_context)

    try:
        model = genai.GenerativeModel(GEMINI_MODEL)
        
        # Using generate_content for a simple request response pattern
        response = await model.generate_content_async(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=512,
                temperature=0.7,
            )
        )

        if not response.text:
            return GenerateResponse(reply=FALLBACK_MESSAGE)

        return GenerateResponse(reply=response.text.strip())

    except Exception as e:
        print(f"Gemini API error: {e}")
        return GenerateResponse(reply=FALLBACK_MESSAGE)
