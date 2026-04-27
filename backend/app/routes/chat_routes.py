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