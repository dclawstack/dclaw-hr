from __future__ import annotations
from uuid import UUID
from datetime import date

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.payroll_record import PayrollRecord


class PayrollRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, record_id: UUID) -> PayrollRecord | None:
        result = await self.session.execute(select(PayrollRecord).where(PayrollRecord.id == record_id))
        return result.scalar_one_or_none()

    async def list(self) -> list[PayrollRecord]:
        result = await self.session.execute(select(PayrollRecord))
        return result.scalars().all()

    async def list_by_employee(self, employee_id: UUID) -> list[PayrollRecord]:
        result = await self.session.execute(
            select(PayrollRecord).where(PayrollRecord.employee_id == employee_id)
        )
        return result.scalars().all()

    async def get_monthly_total(self, year: int, month: int) -> float:
        from sqlalchemy import extract
        result = await self.session.execute(
            select(func.sum(PayrollRecord.net_pay)).where(
                extract("year", PayrollRecord.pay_period_start) == year,
                extract("month", PayrollRecord.pay_period_start) == month,
            )
        )
        total = result.scalar_one_or_none()
        return float(total) if total else 0.0

    async def create(self, record: PayrollRecord) -> PayrollRecord:
        self.session.add(record)
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def update(self, record: PayrollRecord) -> PayrollRecord:
        await self.session.commit()
        await self.session.refresh(record)
        return record

    async def delete(self, record: PayrollRecord) -> None:
        await self.session.delete(record)
        await self.session.commit()
