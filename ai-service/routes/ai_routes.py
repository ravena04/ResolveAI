from fastapi import APIRouter
from pydantic import BaseModel
from services.categorizer import categorize_ticket

router = APIRouter()


class TicketRequest(BaseModel):
    description: str


@router.post("/categorize")
def categorize(data: TicketRequest):
    result = categorize_ticket(
        data.description
    )

    return result