from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.employee import Employee


class EmployeeRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, employee_id: UUID) -> Employee | None:
        result = await self.session.execute(select(Employee).where(Employee.id == employee_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Employee | None:
        result = await self.session.execute(select(Employee).where(Employee.email == email))
        return result.scalar_one_or_none()

    async def list(self) -> list[Employee]:
        result = await self.session.execute(select(Employee))
        return result.scalars().all()

    async def list_by_department(self, department: str) -> list[Employee]:
        result = await self.session.execute(select(Employee).where(Employee.department == department))
        return result.scalars().all()

    async def list_by_status(self, status: str) -> list[Employee]:
        result = await self.session.execute(select(Employee).where(Employee.status == status))
        return result.scalars().all()

    async def create(self, employee: Employee) -> Employee:
        self.session.add(employee)
        await self.session.commit()
        await self.session.refresh(employee)
        return employee

    async def update(self, employee: Employee) -> Employee:
        await self.session.commit()
        await self.session.refresh(employee)
        return employee

    async def delete(self, employee: Employee) -> None:
        await self.session.delete(employee)
        await self.session.commit()
