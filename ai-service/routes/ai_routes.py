from fastapi import APIRouter
from pydantic import BaseModel

from services.categorizer import categorize
from services.suggestor import generate_solution

import json

router = APIRouter()


class TicketRequest(BaseModel):
    description: str


@router.post("/categorize")
def classify_ticket(data: TicketRequest):

    result = categorize(
        data.description
    )

    return result


@router.post("/suggest")
def suggest_solution(data: TicketRequest):

    result = generate_solution(
        data.description
    )

    try:
        return json.loads(result)
    except:
        return {
            "suggestion": result,
            "confidence": 70
        }