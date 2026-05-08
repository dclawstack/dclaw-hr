from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict

from app.schemas.employee import EmployeeResponse


class TimeOffBase(BaseModel):
    employee_id: UUID
    request_type: str
    start_date: date
    end_date: date
    days: int
    reason: str | None = None
    status: str = "pending"


class TimeOffCreate(TimeOffBase):
    pass


class TimeOffUpdate(BaseModel):
    request_type: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    days: int | None = None
    reason: str | None = None
    status: str | None = None


class TimeOffResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    employee_id: UUID
    request_type: str
    start_date: date
    end_date: date
    days: int
    reason: str | None
    status: str
    employee: EmployeeResponse
    created_at: datetime
    updated_at: datetime
