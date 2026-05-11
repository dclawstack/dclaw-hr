from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict, Field


class EmployeeNested(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    first_name: str
    last_name: str


class GoalCreate(BaseModel):
    owner_id: UUID | None = None
    title: str
    description: str | None = None
    progress: int = Field(default=0, ge=0, le=100)
    due_date: date | None = None
    status: str = "active"


class GoalUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    due_date: date | None = None
    status: str | None = None


class GoalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    owner_id: UUID | None
    title: str
    description: str | None
    progress: int
    due_date: date | None
    status: str
    created_at: datetime
    updated_at: datetime
    owner: EmployeeNested | None
