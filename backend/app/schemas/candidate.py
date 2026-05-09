from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CandidateCreate(BaseModel):
    name: str
    role: str
    email: str
    status: str = "screening"
    notes: str | None = None


class CandidateUpdate(BaseModel):
    name: str | None = None
    role: str | None = None
    email: str | None = None
    status: str | None = None
    notes: str | None = None


class CandidateResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    role: str
    email: str
    status: str
    notes: str | None
    created_at: datetime
    updated_at: datetime
