import pytest
from datetime import date


@pytest.mark.asyncio
async def test_create_payroll(client):
    emp_payload = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.pr@example.com",
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-15",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "pay_period_start": "2024-06-01",
        "pay_period_end": "2024-06-30",
        "base_salary": 5000.0,
        "bonus": 500.0,
        "deductions": 300.0,
        "net_pay": 5200.0,
    }
    response = await client.post("/api/v1/payroll", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["base_salary"] == 5000.0
    assert data["net_pay"] == 5200.0
    assert data["employee"]["email"] == "alice.pr@example.com"


@pytest.mark.asyncio
async def test_list_payroll_by_employee(client):
    emp_payload = {
        "first_name": "Bob",
        "last_name": "Jones",
        "email": "bob.pr@example.com",
        "department": "sales",
        "job_title": "Sales Rep",
        "hire_date": "2024-02-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "pay_period_start": "2024-07-01",
        "pay_period_end": "2024-07-31",
        "base_salary": 4000.0,
        "net_pay": 4000.0,
    }
    await client.post("/api/v1/payroll", json=payload)
    response = await client.get(f"/api/v1/payroll?employee_id={emp_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["employee_id"] == emp_id


@pytest.mark.asyncio
async def test_update_payroll(client):
    emp_payload = {
        "first_name": "Carol",
        "last_name": "White",
        "email": "carol.pr@example.com",
        "department": "marketing",
        "job_title": "Marketer",
        "hire_date": "2024-03-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "pay_period_start": "2024-08-01",
        "pay_period_end": "2024-08-31",
        "base_salary": 4500.0,
        "net_pay": 4500.0,
    }
    create_resp = await client.post("/api/v1/payroll", json=payload)
    record_id = create_resp.json()["id"]
    response = await client.patch(f"/api/v1/payroll/{record_id}", json={"bonus": 200.0})
    assert response.status_code == 200
    assert response.json()["bonus"] == 200.0


@pytest.mark.asyncio
async def test_delete_payroll(client):
    emp_payload = {
        "first_name": "Dave",
        "last_name": "Brown",
        "email": "dave.pr@example.com",
        "department": "hr",
        "job_title": "HR Manager",
        "hire_date": "2024-04-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "pay_period_start": "2024-09-01",
        "pay_period_end": "2024-09-30",
        "base_salary": 5500.0,
        "net_pay": 5500.0,
    }
    create_resp = await client.post("/api/v1/payroll", json=payload)
    record_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/payroll/{record_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/payroll/{record_id}")
    assert get_resp.status_code == 404
