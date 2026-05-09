from __future__ import annotations
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.candidate import Candidate


class CandidateRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, candidate_id: UUID) -> Candidate | None:
        result = await self.session.execute(select(Candidate).where(Candidate.id == candidate_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Candidate | None:
        result = await self.session.execute(select(Candidate).where(Candidate.email == email))
        return result.scalar_one_or_none()

    async def list(self, status: str | None = None) -> list[Candidate]:
        q = select(Candidate)
        if status:
            q = q.where(Candidate.status == status)
        result = await self.session.execute(q)
        return list(result.scalars().all())

    async def create(self, candidate: Candidate) -> Candidate:
        self.session.add(candidate)
        await self.session.commit()
        await self.session.refresh(candidate)
        return candidate

    async def update(self, candidate: Candidate) -> Candidate:
        await self.session.commit()
        await self.session.refresh(candidate)
        return candidate

    async def delete(self, candidate: Candidate) -> None:
        await self.session.delete(candidate)
        await self.session.commit()
