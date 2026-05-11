from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class SurveyCreate(BaseModel):
    employee_id: UUID
    score: int = Field(ge=1, le=10)
    comment: str | None = None


class SurveyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    employee_id: UUID
    score: int
    comment: str | None
    submitted_at: datetime
