from uuid import UUID, uuid4
from datetime import datetime, date
from sqlalchemy import Float, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    employee_id: Mapped[UUID] = mapped_column(ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    pay_period_start: Mapped[date] = mapped_column(nullable=False)
    pay_period_end: Mapped[date] = mapped_column(nullable=False)
    base_salary: Mapped[float] = mapped_column(default=0.0)
    bonus: Mapped[float] = mapped_column(default=0.0)
    deductions: Mapped[float] = mapped_column(default=0.0)
    net_pay: Mapped[float] = mapped_column(default=0.0)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
    
    employee: Mapped["Employee"] = relationship(back_populates="payroll_records", lazy="selectin")
