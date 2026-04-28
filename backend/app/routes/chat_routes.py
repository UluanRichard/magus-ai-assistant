import os
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.magus_service import gerar_resposta_magus

router = APIRouter()


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    answer: str


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    resposta = gerar_resposta_magus(request.message)

    return {
        "answer": resposta
    }


@router.get("/status")
def status():
    provider = os.getenv("MAGUS_AI_PROVIDER", "mock").lower()
    model = os.getenv("MAGUS_MODEL", "gpt-5.4-mini")

    modo = "IA Real" if provider == "openai" else "Modo Simulado"

    return {
        "status": "online",
        "provider": provider,
        "mode": modo,
        "model": model
    }