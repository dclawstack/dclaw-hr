from uuid import UUID
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.payroll_record import PayrollRecord
from app.repositories.payroll_repo import PayrollRepository
from app.repositories.employee_repo import EmployeeRepository
from app.schemas.payroll import PayrollCreate, PayrollUpdate, PayrollResponse

router = APIRouter(prefix="/payroll", tags=["payroll"])


@router.get("", response_model=list[PayrollResponse])
async def list_payroll(
    employee_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[PayrollRecord]:
    repo = PayrollRepository(db)
    if employee_id:
        return await repo.list_by_employee(employee_id)
    return await repo.list()


@router.post("", response_model=PayrollResponse, status_code=status.HTTP_201_CREATED)
async def create_payroll(
    data: PayrollCreate,
    db: AsyncSession = Depends(get_db),
) -> PayrollRecord:
    emp_repo = EmployeeRepository(db)
    employee = await emp_repo.get(data.employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    repo = PayrollRepository(db)
    record = PayrollRecord(**data.model_dump())
    return await repo.create(record)


@router.get("/{record_id}", response_model=PayrollResponse)
async def get_payroll(
    record_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> PayrollRecord:
    repo = PayrollRepository(db)
    record = await repo.get(record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found")
    return record


@router.patch("/{record_id}", response_model=PayrollResponse)
async def update_payroll(
    record_id: UUID,
    data: PayrollUpdate,
    db: AsyncSession = Depends(get_db),
) -> PayrollRecord:
    repo = PayrollRepository(db)
    record = await repo.get(record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(record, field, value)
    return await repo.update(record)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payroll(
    record_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    repo = PayrollRepository(db)
    record = await repo.get(record_id)
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payroll record not found")
    await repo.delete(record)
