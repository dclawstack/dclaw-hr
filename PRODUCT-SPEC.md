# PRODUCT-SPEC: HR

## Overview

**App Name:** HR
**Domain:** Human Resources — Employee Directory, Time-Off, Payroll tracking
**Target User:** HR managers, team leads, employees

## Core Entities

### Employee
```
Employee
├── id: UUID (PK)
├── first_name: str (required)
├── last_name: str (required)
├── email: str (unique, required)
├── phone: str (optional)
├── department: enum ["engineering", "sales", "marketing", "hr", "finance", "operations"] (required)
├── job_title: str (required)
├── salary: float (optional)
├── hire_date: date (required)
├── status: enum ["active", "on_leave", "terminated"] (default: "active")
├── manager_id: UUID (FK → Employee, ondelete=SET NULL, optional)
├── created_at: datetime
└── updated_at: datetime
```

### TimeOffRequest
```
TimeOffRequest
├── id: UUID (PK)
├── employee_id: UUID (FK → Employee, ondelete=CASCADE)
├── request_type: enum ["vacation", "sick", "personal", "bereavement", "other"] (required)
├── start_date: date (required)
├── end_date: date (required)
├── days: int (required)
├── reason: str (optional)
├── status: enum ["pending", "approved", "rejected"] (default: "pending")
├── created_at: datetime
└── updated_at: datetime
```

### PayrollRecord
```
PayrollRecord
├── id: UUID (PK)
├── employee_id: UUID (FK → Employee, ondelete=CASCADE)
├── pay_period_start: date (required)
├── pay_period_end: date (required)
├── base_salary: float (required)
├── bonus: float (default 0)
├── deductions: float (default 0)
├── net_pay: float (required)
├── created_at: datetime
└── updated_at: datetime
```

## User Stories / Screens

### Screen 1: Dashboard
- Summary cards: total employees, on leave today, pending time-off requests, monthly payroll total
- Department breakdown pie chart
- Recent hire announcements
- Pending approvals queue (for managers)

### Screen 2: Employee Directory
- Card grid view with avatars (initials), name, title, department
- Table view toggle
- Search by name, email, department, job title
- Department filter
- "Add Employee" form

### Screen 3: Employee Profile
- Full profile with contact info, department, manager
- Employment timeline (hire date, status history)
- Related time-off requests
- Related payroll records
- Edit / terminate actions

### Screen 4: Time-Off
- Calendar view showing approved time-off
- My requests list (for employees)
- Pending approvals list (for managers)
- "Request Time-Off" form with date picker, type, reason
- Approve/Reject buttons for managers

### Screen 5: Payroll
- Monthly payroll table
- Employee payroll history
- "Run Payroll" form (select pay period, auto-calculate)
- Export to CSV mock

## AI Features

- **Time-off trend analysis:** Predict burnout risk based on time-off patterns
- **Salary benchmarking:** Compare employee salaries to market ranges (mock data)
- **Headcount planning:** Suggest hiring needs based on department workload

## API Endpoints (v1.0)

```
GET    /api/v1/employees          → List employees
POST   /api/v1/employees          → Create employee
GET    /api/v1/employees/{id}     → Get employee
PUT    /api/v1/employees/{id}     → Update employee
DELETE /api/v1/employees/{id}     → Delete employee
GET    /api/v1/time-off           → List time-off requests
POST   /api/v1/time-off           → Create time-off request
GET    /api/v1/time-off/{id}      → Get time-off request
PUT    /api/v1/time-off/{id}      → Update time-off request (approve/reject)
DELETE /api/v1/time-off/{id}      → Delete time-off request
GET    /api/v1/payroll            → List payroll records
POST   /api/v1/payroll            → Create payroll record
GET    /api/v1/payroll/{id}       → Get payroll record
PUT    /api/v1/payroll/{id}       → Update payroll record
DELETE /api/v1/payroll/{id}       → Delete payroll record
GET    /api/v1/dashboard          → Dashboard stats
```

## Non-Functional Requirements

- Backend tests: 70%+ coverage
- Frontend: Responsive, Tailwind + shadcn/ui
- Docker: All services start with `docker compose up -d`
- No mock data — everything persisted to PostgreSQL
