from uuid import UUID, uuid4
from datetime import datetime, date
from sqlalchemy import Enum, Text, Date, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class OneOnOne(Base):
    __tablename__ = "one_on_ones"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    manager_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    employee_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    scheduled_date: Mapped[date] = mapped_column(Date, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    action_items: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        Enum("scheduled", "completed", "cancelled", name="one_on_one_status"),
        default="scheduled",
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())

    manager: Mapped["Employee"] = relationship("Employee", foreign_keys="[OneOnOne.manager_id]", lazy="selectin")
    employee: Mapped["Employee"] = relationship("Employee", foreign_keys="[OneOnOne.employee_id]", lazy="selectin")
