from uuid import UUID
from datetime import datetime, date
from pydantic import BaseModel, ConfigDict

from app.schemas.employee import EmployeeResponse


class PayrollBase(BaseModel):
    employee_id: UUID
    pay_period_start: date
    pay_period_end: date
    base_salary: float = 0.0
    bonus: float = 0.0
    deductions: float = 0.0
    net_pay: float = 0.0


class PayrollCreate(PayrollBase):
    pass


class PayrollUpdate(BaseModel):
    pay_period_start: date | None = None
    pay_period_end: date | None = None
    base_salary: float | None = None
    bonus: float | None = None
    deductions: float | None = None
    net_pay: float | None = None


class PayrollResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    employee_id: UUID
    pay_period_start: date
    pay_period_end: date
    base_salary: float
    bonus: float
    deductions: float
    net_pay: float
    employee: EmployeeResponse
    created_at: datetime
    updated_at: datetime
