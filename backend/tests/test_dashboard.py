import pytest
from datetime import date


@pytest.mark.asyncio
async def test_dashboard_empty(client):
    response = await client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_employees"] == 0
    assert data["on_leave_today"] == 0
    assert data["pending_time_off"] == 0
    assert data["monthly_payroll"] == 0.0
    assert data["department_breakdown"] == {}
    assert data["recent_hires"] == []


@pytest.mark.asyncio
async def test_dashboard_with_data(client):
    emp_payload = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.db@example.com",
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": date.today().isoformat(),
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    to_payload = {
        "employee_id": emp_id,
        "request_type": "vacation",
        "start_date": "2024-07-01",
        "end_date": "2024-07-05",
        "days": 5,
    }
    await client.post("/api/v1/time-off", json=to_payload)

    pr_payload = {
        "employee_id": emp_id,
        "pay_period_start": date.today().replace(day=1).isoformat(),
        "pay_period_end": date.today().isoformat(),
        "base_salary": 5000.0,
        "net_pay": 5000.0,
    }
    await client.post("/api/v1/payroll", json=pr_payload)

    response = await client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert data["total_employees"] == 1
    assert data["pending_time_off"] == 1
    assert data["monthly_payroll"] == 5000.0
    assert data["department_breakdown"]["engineering"] == 1
    assert len(data["recent_hires"]) == 1
