from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.time_off_request import TimeOffRequest
from app.repositories.time_off_repo import TimeOffRepository
from app.repositories.employee_repo import EmployeeRepository
from app.schemas.time_off import TimeOffCreate, TimeOffUpdate, TimeOffResponse

router = APIRouter(prefix="/time-off", tags=["time-off"])


@router.get("", response_model=list[TimeOffResponse])
async def list_time_off(
    employee_id: UUID | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[TimeOffRequest]:
    repo = TimeOffRepository(db)
    if employee_id:
        return await repo.list_by_employee(employee_id)
    if status:
        return await repo.list_by_status(status)
    return await repo.list()


@router.post("", response_model=TimeOffResponse, status_code=status.HTTP_201_CREATED)
async def create_time_off(
    data: TimeOffCreate,
    db: AsyncSession = Depends(get_db),
) -> TimeOffRequest:
    emp_repo = EmployeeRepository(db)
    employee = await emp_repo.get(data.employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    repo = TimeOffRepository(db)
    request = TimeOffRequest(**data.model_dump())
    return await repo.create(request)


@router.get("/{request_id}", response_model=TimeOffResponse)
async def get_time_off(
    request_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> TimeOffRequest:
    repo = TimeOffRepository(db)
    request = await repo.get(request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Time-off request not found")
    return request


@router.patch("/{request_id}", response_model=TimeOffResponse)
async def update_time_off(
    request_id: UUID,
    data: TimeOffUpdate,
    db: AsyncSession = Depends(get_db),
) -> TimeOffRequest:
    repo = TimeOffRepository(db)
    request = await repo.get(request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Time-off request not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(request, field, value)
    return await repo.update(request)


@router.delete("/{request_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_time_off(
    request_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    repo = TimeOffRepository(db)
    request = await repo.get(request_id)
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Time-off request not found")
    await repo.delete(request)
