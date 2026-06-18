from fastapi import APIRouter
from pydantic import BaseModel

from services.rag_service import (
    add_document
)

router = APIRouter()


class KBRequest(BaseModel):
    id: str
    title: str
    content: str


@router.post("/kb/add")
def add_kb_document(
    data: KBRequest
):
    return add_document(
        data.id,
        data.title,
        data.content
    )