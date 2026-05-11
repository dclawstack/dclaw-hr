from uuid import UUID
from datetime import date

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, extract, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.employee import Employee
from app.models.time_off_request import TimeOffRequest
from app.repositories.employee_repo import EmployeeRepository
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeResponse])
async def list_employees(
    department: str | None = None,
    status: str | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[Employee]:
    repo = EmployeeRepository(db)
    if department:
        return await repo.list_by_department(department)
    if status:
        return await repo.list_by_status(status)
    return await repo.list()


@router.post("", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
async def create_employee(
    data: EmployeeCreate,
    db: AsyncSession = Depends(get_db),
) -> Employee:
    repo = EmployeeRepository(db)
    existing = await repo.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
    employee = Employee(**data.model_dump())
    return await repo.create(employee)


@router.get("/{employee_id}/time-off-balance")
async def get_time_off_balance(
    employee_id: UUID,
    year: int | None = None,
    db: AsyncSession = Depends(get_db),
) -> dict:
    repo = EmployeeRepository(db)
    employee = await repo.get(employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")

    target_year = year or date.today().year
    result = await db.execute(
        select(TimeOffRequest.request_type, func.sum(TimeOffRequest.days)).where(
            TimeOffRequest.employee_id == employee_id,
            TimeOffRequest.status == "approved",
            extract("year", TimeOffRequest.start_date) == target_year,
        ).group_by(TimeOffRequest.request_type)
    )
    used: dict[str, int] = {"vacation": 0, "sick": 0, "personal": 0, "bereavement": 0, "other": 0}
    for rtype, days in result.all():
        used[rtype] = int(days or 0)

    return {
        "year": target_year,
        "vacation_used": used["vacation"],
        "sick_used": used["sick"],
        "personal_used": used["personal"],
        "vacation_allocated": 20,
        "sick_allocated": 10,
    }


@router.get("/{employee_id}/leave-analysis")
async def get_leave_analysis(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> dict:
    from app.services.ai_service import analyze_leave_trends
    repo = EmployeeRepository(db)
    employee = await repo.get(employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return await analyze_leave_trends(employee_id, db)


@router.get("/{employee_id}/salary-benchmark")
async def get_salary_benchmark(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> dict:
    from app.services.ai_service import benchmark_salary
    repo = EmployeeRepository(db)
    employee = await repo.get(employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return await benchmark_salary(employee_id, db)


@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> Employee:
    repo = EmployeeRepository(db)
    employee = await repo.get(employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.patch("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: UUID,
    data: EmployeeUpdate,
    db: AsyncSession = Depends(get_db),
) -> Employee:
    repo = EmployeeRepository(db)
    employee = await repo.get(employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(employee, field, value)
    return await repo.update(employee)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_employee(
    employee_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    repo = EmployeeRepository(db)
    employee = await repo.get(employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    await repo.delete(employee)
