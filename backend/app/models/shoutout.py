from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import Text, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base


class Shoutout(Base):
    __tablename__ = "shoutouts"

    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    from_employee_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    to_employee_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    from_employee: Mapped["Employee"] = relationship("Employee", foreign_keys="[Shoutout.from_employee_id]", lazy="selectin")
    to_employee: Mapped["Employee"] = relationship("Employee", foreign_keys="[Shoutout.to_employee_id]", lazy="selectin")
