from uuid import UUID, uuid4
from datetime import datetime, date
from sqlalchemy import String, Enum, Float, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base

class Employee(Base):
    __tablename__ = "employees"
    
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    department: Mapped[str] = mapped_column(Enum("engineering", "sales", "marketing", "hr", "finance", "operations", name="department"), nullable=False)
    job_title: Mapped[str] = mapped_column(String(255), nullable=False)
    salary: Mapped[float | None] = mapped_column(nullable=True)
    hire_date: Mapped[date] = mapped_column(nullable=False)
    status: Mapped[str] = mapped_column(Enum("active", "on_leave", "terminated", name="employee_status"), default="active")
    manager_id: Mapped[UUID | None] = mapped_column(ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now(), onupdate=func.now())
    
    manager: Mapped["Employee | None"] = relationship(remote_side="Employee.id", lazy="selectin")
    time_off_requests: Mapped[list["TimeOffRequest"]] = relationship(back_populates="employee", lazy="selectin", cascade="all, delete-orphan")
    payroll_records: Mapped[list["PayrollRecord"]] = relationship(back_populates="employee", lazy="selectin", cascade="all, delete-orphan")
