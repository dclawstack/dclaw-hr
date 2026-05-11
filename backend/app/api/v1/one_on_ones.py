from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.one_on_one import OneOnOne
from app.repositories.one_on_one_repo import OneOnOneRepository
from app.schemas.one_on_one import OneOnOneCreate, OneOnOneUpdate, OneOnOneResponse

router = APIRouter(prefix="/one-on-ones", tags=["one-on-ones"])


@router.get("", response_model=list[OneOnOneResponse])
async def list_one_on_ones(
    manager_id: UUID | None = None,
    employee_id: UUID | None = None,
    db: AsyncSession = Depends(get_db),
) -> list[OneOnOne]:
    repo = OneOnOneRepository(db)
    return await repo.list(manager_id=manager_id, employee_id=employee_id)


@router.post("", response_model=OneOnOneResponse, status_code=status.HTTP_201_CREATED)
async def create_one_on_one(
    data: OneOnOneCreate,
    db: AsyncSession = Depends(get_db),
) -> OneOnOne:
    repo = OneOnOneRepository(db)
    oo = OneOnOne(**data.model_dump())
    return await repo.create(oo)


@router.get("/{oo_id}", response_model=OneOnOneResponse)
async def get_one_on_one(
    oo_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> OneOnOne:
    repo = OneOnOneRepository(db)
    oo = await repo.get(oo_id)
    if not oo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    return oo


@router.patch("/{oo_id}", response_model=OneOnOneResponse)
async def update_one_on_one(
    oo_id: UUID,
    data: OneOnOneUpdate,
    db: AsyncSession = Depends(get_db),
) -> OneOnOne:
    repo = OneOnOneRepository(db)
    oo = await repo.get(oo_id)
    if not oo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(oo, field, value)
    return await repo.update(oo)


@router.delete("/{oo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_one_on_one(
    oo_id: UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    repo = OneOnOneRepository(db)
    oo = await repo.get(oo_id)
    if not oo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Meeting not found")
    await repo.delete(oo)
