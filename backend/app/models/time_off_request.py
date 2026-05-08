from uuid import UUID, uuid4
from datetime import datetime, date
from sqlalchemy import String, Enum, Integer, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class TimeOffRequest(Base):
    __tablename__ = "time_off_requests"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    employee_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    request_type: Mapped[str] = mapped_column(Enum("vacation", "sick", "personal", "bereavement", "other", name="timeoff_type"), nullable=False)
    start_date: Mapped[date] = mapped_column(nullable=False)
    end_date: Mapped[date] = mapped_column(nullable=False)
    days: Mapped[int] = mapped_column(nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Enum("pending", "approved", "rejected", name="timeoff_status"), default="pending")
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
    
    employee: Mapped["Employee"] = relationship(back_populates="time_off_requests", lazy="selectin")
