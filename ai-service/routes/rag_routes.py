from fastapi import APIRouter
from pydantic import BaseModel

from services.rag_service import (
    add_document,
    search_documents,
    generate_solution,
    find_similar_tickets
)

from services.auto_resolution_service import (
    should_auto_resolve
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


class SimilarRequest(BaseModel):
    query: str


class AutoResolveRequest(BaseModel):
    confidence: float
    rag_context_count: int


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


@router.post("/kb/similar")
def similar_tickets(
    data: SimilarRequest
):
    return find_similar_tickets(
        data.query
    )


@router.post("/auto-resolve")
def auto_resolve(
    data: AutoResolveRequest
):
    return should_auto_resolve(
        data.confidence,
        data.rag_context_count
    )