from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict
from typing import Optional


class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str | None = None
    department: str
    job_title: str
    salary: float | None = None
    hire_date: date
    status: str = "active"
    manager_id: UUID | None = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    email: str | None = None
    phone: str | None = None
    department: str | None = None
    job_title: str | None = None
    salary: float | None = None
    hire_date: date | None = None
    status: str | None = None
    manager_id: UUID | None = None


class EmployeeResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: str
    last_name: str
    email: str
    phone: str | None
    department: str
    job_title: str
    salary: float | None
    hire_date: date
    status: str
    manager_id: UUID | None
    manager: Optional["EmployeeResponse"] = None
    created_at: datetime
    updated_at: datetime
