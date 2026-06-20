from fastapi import APIRouter
from pydantic import BaseModel

from services.rag_service import (
    add_document,
    search_documents,
    generate_solution
)

router = APIRouter()


class KBRequest(BaseModel):
    id: str
    title: str
    content: str


class SearchRequest(BaseModel):
    query: str


class SolutionRequest(BaseModel):
    query: str


@router.post("/kb/add")
def add_kb_document(
    data: KBRequest
):
    return add_document(
        data.id,
        data.title,
        data.content
    )


@router.post("/kb/search")
def search_kb(
    data: SearchRequest
):
    return search_documents(
        data.query
    )


@router.post("/kb/solution")
def get_solution(
    data: SolutionRequest
):
    return generate_solution(
        data.query
    )