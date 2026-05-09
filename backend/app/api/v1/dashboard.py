from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.employee import Employee
from app.models.time_off_request import TimeOffRequest
from app.models.payroll_record import PayrollRecord
from app.repositories.time_off_repo import TimeOffRepository

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("")
async def get_dashboard(db: AsyncSession = Depends(get_db)) -> dict:  # noqa: C901
    # Total employees
    total_result = await db.execute(select(func.count()).select_from(Employee))
    total_employees = total_result.scalar_one()

    # On leave today
    on_leave_result = await db.execute(
        select(func.count()).select_from(Employee).where(Employee.status == "on_leave")
    )
    on_leave_today = on_leave_result.scalar_one()

    # Pending time-off
    pending_result = await db.execute(
        select(func.count()).select_from(TimeOffRequest).where(TimeOffRequest.status == "pending")
    )
    pending_time_off = pending_result.scalar_one()

    # Monthly payroll
    today = date.today()
    monthly_payroll_result = await db.execute(
        select(func.sum(PayrollRecord.net_pay)).where(
            func.extract("year", PayrollRecord.pay_period_start) == today.year,
            func.extract("month", PayrollRecord.pay_period_start) == today.month,
        )
    )
    monthly_payroll = monthly_payroll_result.scalar_one_or_none() or 0.0

    # Department breakdown
    dept_result = await db.execute(
        select(Employee.department, func.count()).group_by(Employee.department)
    )
    department_breakdown = {}
    for dept, count in dept_result.all():
        department_breakdown[dept] = count

    # Recent hires (last 30 days)
    from datetime import timedelta
    thirty_days_ago = today - timedelta(days=30)
    recent_hires_result = await db.execute(
        select(Employee).where(Employee.hire_date >= thirty_days_ago).order_by(Employee.hire_date.desc())
    )
    recent_hires = recent_hires_result.scalars().all()

    # Pending approvals list
    to_repo = TimeOffRepository(db)
    pending_list = await to_repo.list_pending()

    return {
        "total_employees": total_employees,
        "on_leave_today": on_leave_today,
        "pending_time_off": pending_time_off,
        "monthly_payroll": float(monthly_payroll),
        "department_breakdown": department_breakdown,
        "recent_hires": [
            {
                "id": str(e.id),
                "first_name": e.first_name,
                "last_name": e.last_name,
                "department": e.department,
                "hire_date": e.hire_date.isoformat(),
            }
            for e in recent_hires
        ],
        "pending_approvals": [
            {
                "id": str(r.id),
                "employee_name": f"{r.employee.first_name} {r.employee.last_name}",
                "request_type": r.request_type,
                "start_date": r.start_date.isoformat(),
                "end_date": r.end_date.isoformat(),
                "days": r.days,
            }
            for r in pending_list
        ],
    }
