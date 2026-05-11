from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.shoutout import Shoutout
from app.repositories.shoutout_repo import ShoutoutRepository
from app.schemas.shoutout import ShoutoutCreate, ShoutoutResponse

router = APIRouter(prefix="/shoutouts", tags=["shoutouts"])


@router.get("", response_model=list[ShoutoutResponse])
async def list_shoutouts(db: AsyncSession = Depends(get_db)) -> list[Shoutout]:
    repo = ShoutoutRepository(db)
    return await repo.list()


@router.post("", response_model=ShoutoutResponse, status_code=status.HTTP_201_CREATED)
async def create_shoutout(
    data: ShoutoutCreate,
    db: AsyncSession = Depends(get_db),
) -> Shoutout:
    repo = ShoutoutRepository(db)
    shoutout = Shoutout(**data.model_dump())
    return await repo.create(shoutout)


@router.delete("/{shoutout_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_shoutout(
    shoutout_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    repo = ShoutoutRepository(db)
    shoutout = await repo.get(shoutout_id)
    if not shoutout:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shoutout not found")
    await repo.delete(shoutout)
