from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.shoutout import Shoutout


class ShoutoutRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, shoutout_id: UUID) -> Shoutout | None:
        result = await self.session.execute(select(Shoutout).where(Shoutout.id == shoutout_id))
        return result.scalar_one_or_none()

    async def list(self) -> list[Shoutout]:
        result = await self.session.execute(select(Shoutout).order_by(Shoutout.created_at.desc()))
        return list(result.scalars().all())

    async def create(self, shoutout: Shoutout) -> Shoutout:
        self.session.add(shoutout)
        await self.session.commit()
        await self.session.refresh(shoutout)
        return shoutout

    async def delete(self, shoutout: Shoutout) -> None:
        await self.session.delete(shoutout)
        await self.session.commit()
