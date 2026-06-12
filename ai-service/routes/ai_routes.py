from fastapi import APIRouter
from pydantic import BaseModel
from services.categorizer import categorize

router = APIRouter()


class TicketRequest(BaseModel):
    description: str


@router.post("/categorize")
def classify_ticket(data: TicketRequest):

    result = categorize(
        data.description
    )

    return result