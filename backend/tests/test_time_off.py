import pytest
from datetime import date


@pytest.mark.asyncio
async def test_create_time_off(client):
    emp_payload = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.to@example.com",
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-15",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "request_type": "vacation",
        "start_date": "2024-07-01",
        "end_date": "2024-07-05",
        "days": 5,
        "reason": "Summer holiday",
    }
    response = await client.post("/api/v1/time-off", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["request_type"] == "vacation"
    assert data["status"] == "pending"
    assert data["employee"]["email"] == "alice.to@example.com"


@pytest.mark.asyncio
async def test_list_time_off_by_employee(client):
    emp_payload = {
        "first_name": "Bob",
        "last_name": "Jones",
        "email": "bob.to@example.com",
        "department": "sales",
        "job_title": "Sales Rep",
        "hire_date": "2024-02-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "request_type": "sick",
        "start_date": "2024-08-01",
        "end_date": "2024-08-02",
        "days": 2,
    }
    await client.post("/api/v1/time-off", json=payload)
    response = await client.get(f"/api/v1/time-off?employee_id={emp_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["employee_id"] == emp_id


@pytest.mark.asyncio
async def test_list_time_off_by_status(client):
    emp_payload = {
        "first_name": "Carol",
        "last_name": "White",
        "email": "carol.to@example.com",
        "department": "marketing",
        "job_title": "Marketer",
        "hire_date": "2024-03-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "request_type": "personal",
        "start_date": "2024-09-01",
        "end_date": "2024-09-01",
        "days": 1,
    }
    create_resp = await client.post("/api/v1/time-off", json=payload)
    req_id = create_resp.json()["id"]
    await client.patch(f"/api/v1/time-off/{req_id}", json={"status": "approved"})

    response = await client.get("/api/v1/time-off?status=approved")
    assert response.status_code == 200
    data = response.json()
    assert all(r["status"] == "approved" for r in data)


@pytest.mark.asyncio
async def test_update_time_off(client):
    emp_payload = {
        "first_name": "Dave",
        "last_name": "Brown",
        "email": "dave.to@example.com",
        "department": "hr",
        "job_title": "HR Manager",
        "hire_date": "2024-04-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "request_type": "bereavement",
        "start_date": "2024-10-01",
        "end_date": "2024-10-03",
        "days": 3,
    }
    create_resp = await client.post("/api/v1/time-off", json=payload)
    req_id = create_resp.json()["id"]
    response = await client.patch(f"/api/v1/time-off/{req_id}", json={"status": "rejected"})
    assert response.status_code == 200
    assert response.json()["status"] == "rejected"


@pytest.mark.asyncio
async def test_delete_time_off(client):
    emp_payload = {
        "first_name": "Eve",
        "last_name": "Black",
        "email": "eve.to@example.com",
        "department": "finance",
        "job_title": "Accountant",
        "hire_date": "2024-05-01",
    }
    emp_resp = await client.post("/api/v1/employees", json=emp_payload)
    emp_id = emp_resp.json()["id"]

    payload = {
        "employee_id": emp_id,
        "request_type": "other",
        "start_date": "2024-11-01",
        "end_date": "2024-11-02",
        "days": 2,
    }
    create_resp = await client.post("/api/v1/time-off", json=payload)
    req_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/time-off/{req_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/time-off/{req_id}")
    assert get_resp.status_code == 404
