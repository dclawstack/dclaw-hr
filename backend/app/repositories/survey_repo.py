from __future__ import annotations
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.survey import Survey


class SurveyRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, survey_id: UUID) -> Survey | None:
        result = await self.session.execute(select(Survey).where(Survey.id == survey_id))
        return result.scalar_one_or_none()

    async def list(self, employee_id: UUID | None = None) -> list[Survey]:
        q = select(Survey).order_by(Survey.submitted_at.desc())
        if employee_id:
            q = q.where(Survey.employee_id == employee_id)
        result = await self.session.execute(q)
        return list(result.scalars().all())

    async def summary(self) -> dict:
        result = await self.session.execute(
            select(func.avg(Survey.score), func.count(Survey.id))
        )
        row = result.one()
        avg_score, count = row
        return {"avg_score": round(float(avg_score), 2) if avg_score else 0.0, "response_count": count}

    async def create(self, survey: Survey) -> Survey:
        self.session.add(survey)
        await self.session.commit()
        await self.session.refresh(survey)
        return survey

    async def delete(self, survey: Survey) -> None:
        await self.session.delete(survey)
        await self.session.commit()
