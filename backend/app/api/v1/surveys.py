from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.survey import Survey
from app.repositories.survey_repo import SurveyRepository
from app.schemas.survey import SurveyCreate, SurveyResponse

router = APIRouter(prefix="/surveys", tags=["surveys"])


@router.get("/summary")
async def get_survey_summary(db: AsyncSession = Depends(get_db)) -> dict:
    repo = SurveyRepository(db)
    return await repo.summary()


@router.get("", response_model=list[SurveyResponse])
async def list_surveys(
    employee_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[Survey]:
    repo = SurveyRepository(db)
    return await repo.list(employee_id=employee_id)


@router.post("", response_model=SurveyResponse, status_code=status.HTTP_201_CREATED)
async def create_survey(
    data: SurveyCreate,
    db: AsyncSession = Depends(get_db),
) -> Survey:
    repo = SurveyRepository(db)
    survey = Survey(**data.model_dump())
    return await repo.create(survey)


@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_survey(
    survey_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    repo = SurveyRepository(db)
    survey = await repo.get(survey_id)
    if not survey:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Survey not found")
    await repo.delete(survey)
