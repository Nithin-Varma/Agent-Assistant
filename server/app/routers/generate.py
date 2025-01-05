from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.chat import QueryRequest
from app.services.chat import chat_agent

router = APIRouter(
    prefix="/generate",
    tags=["Generate"],
    responses={404: {"description": "Not found"}},
)

@router.post("/action_items")
async def query_agent(request: QueryRequest):
    try:

        response = chat_agent.chat(request.query)
        return {"response": response.response}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error processing query")