from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.one_on_one import OneOnOne


class OneOnOneRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, oo_id: UUID) -> OneOnOne | None:
        result = await self.session.execute(select(OneOnOne).where(OneOnOne.id == oo_id))
        return result.scalar_one_or_none()

    async def list(self, manager_id: UUID | None = None, employee_id: UUID | None = None) -> list[OneOnOne]:
        q = select(OneOnOne).order_by(OneOnOne.scheduled_date.desc())
        if manager_id:
            q = q.where(OneOnOne.manager_id == manager_id)
        if employee_id:
            q = q.where(OneOnOne.employee_id == employee_id)
        result = await self.session.execute(q)
        return list(result.scalars().all())

    async def create(self, oo: OneOnOne) -> OneOnOne:
        self.session.add(oo)
        await self.session.commit()
        await self.session.refresh(oo)
        return oo

    async def update(self, oo: OneOnOne) -> OneOnOne:
        await self.session.commit()
        await self.session.refresh(oo)
        return oo

    async def delete(self, oo: OneOnOne) -> None:
        await self.session.delete(oo)
        await self.session.commit()
