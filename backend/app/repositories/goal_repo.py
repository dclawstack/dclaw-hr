from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.goal import Goal


class GoalRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, goal_id: UUID) -> Goal | None:
        result = await self.session.execute(select(Goal).where(Goal.id == goal_id))
        return result.scalar_one_or_none()

    async def list(self, owner_id: UUID | None = None, status: str | None = None) -> list[Goal]:
        q = select(Goal).order_by(Goal.created_at.desc())
        if owner_id:
            q = q.where(Goal.owner_id == owner_id)
        if status:
            q = q.where(Goal.status == status)
        result = await self.session.execute(q)
        return list(result.scalars().all())

    async def create(self, goal: Goal) -> Goal:
        self.session.add(goal)
        await self.session.commit()
        await self.session.refresh(goal)
        return goal

    async def update(self, goal: Goal) -> Goal:
        await self.session.commit()
        await self.session.refresh(goal)
        return goal

    async def delete(self, goal: Goal) -> None:
        await self.session.delete(goal)
        await self.session.commit()
