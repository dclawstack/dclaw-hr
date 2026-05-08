from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.time_off_request import TimeOffRequest


class TimeOffRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, request_id: UUID) -> TimeOffRequest | None:
        result = await self.session.execute(select(TimeOffRequest).where(TimeOffRequest.id == request_id))
        return result.scalar_one_or_none()

    async def list(self) -> list[TimeOffRequest]:
        result = await self.session.execute(select(TimeOffRequest))
        return result.scalars().all()

    async def list_by_employee(self, employee_id: UUID) -> list[TimeOffRequest]:
        result = await self.session.execute(
            select(TimeOffRequest).where(TimeOffRequest.employee_id == employee_id)
        )
        return result.scalars().all()

    async def list_by_status(self, status: str) -> list[TimeOffRequest]:
        result = await self.session.execute(select(TimeOffRequest).where(TimeOffRequest.status == status))
        return result.scalars().all()

    async def list_pending(self) -> list[TimeOffRequest]:
        result = await self.session.execute(
            select(TimeOffRequest).where(TimeOffRequest.status == "pending")
        )
        return result.scalars().all()

    async def create(self, request: TimeOffRequest) -> TimeOffRequest:
        self.session.add(request)
        await self.session.commit()
        await self.session.refresh(request)
        return request

    async def update(self, request: TimeOffRequest) -> TimeOffRequest:
        await self.session.commit()
        await self.session.refresh(request)
        return request

    async def delete(self, request: TimeOffRequest) -> None:
        await self.session.delete(request)
        await self.session.commit()
