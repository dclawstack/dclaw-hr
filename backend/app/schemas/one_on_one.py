from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict


class EmployeeNested(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    first_name: str
    last_name: str


class OneOnOneCreate(BaseModel):
    manager_id: UUID
    employee_id: UUID
    scheduled_date: date
    notes: str | None = None
    action_items: str | None = None
    status: str = "scheduled"


class OneOnOneUpdate(BaseModel):
    scheduled_date: date | None = None
    notes: str | None = None
    action_items: str | None = None
    status: str | None = None


class OneOnOneResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    manager_id: UUID
    employee_id: UUID
    scheduled_date: date
    notes: str | None
    action_items: str | None
    status: str
    created_at: datetime
    updated_at: datetime
    manager: EmployeeNested
    employee: EmployeeNested
