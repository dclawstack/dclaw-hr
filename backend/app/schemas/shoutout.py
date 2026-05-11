from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class EmployeeNested(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    first_name: str
    last_name: str


class ShoutoutCreate(BaseModel):
    from_employee_id: UUID
    to_employee_id: UUID
    message: str


class ShoutoutResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    from_employee_id: UUID
    to_employee_id: UUID
    message: str
    created_at: datetime
    from_employee: EmployeeNested
    to_employee: EmployeeNested
