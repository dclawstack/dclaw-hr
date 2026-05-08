import pytest
from datetime import date


@pytest.mark.asyncio
async def test_create_employee(client):
    payload = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice@example.com",
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-15",
        "salary": 85000.0,
    }
    response = await client.post("/api/v1/employees", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["first_name"] == "Alice"
    assert data["email"] == "alice@example.com"
    assert data["department"] == "engineering"


@pytest.mark.asyncio
async def test_create_employee_duplicate_email(client):
    payload = {
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice.dup@example.com",
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-15",
    }
    response = await client.post("/api/v1/employees", json=payload)
    assert response.status_code == 201
    response2 = await client.post("/api/v1/employees", json=payload)
    assert response2.status_code == 409


@pytest.mark.asyncio
async def test_list_employees(client):
    payload = {
        "first_name": "Bob",
        "last_name": "Jones",
        "email": "bob@example.com",
        "department": "sales",
        "job_title": "Sales Rep",
        "hire_date": "2024-02-01",
    }
    await client.post("/api/v1/employees", json=payload)
    response = await client.get("/api/v1/employees")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


@pytest.mark.asyncio
async def test_list_employees_by_department(client):
    payload = {
        "first_name": "Carol",
        "last_name": "White",
        "email": "carol@example.com",
        "department": "marketing",
        "job_title": "Marketer",
        "hire_date": "2024-03-01",
    }
    await client.post("/api/v1/employees", json=payload)
    response = await client.get("/api/v1/employees?department=marketing")
    assert response.status_code == 200
    data = response.json()
    assert all(e["department"] == "marketing" for e in data)


@pytest.mark.asyncio
async def test_get_employee(client):
    payload = {
        "first_name": "Dave",
        "last_name": "Brown",
        "email": "dave@example.com",
        "department": "hr",
        "job_title": "HR Manager",
        "hire_date": "2024-04-01",
    }
    create_resp = await client.post("/api/v1/employees", json=payload)
    emp_id = create_resp.json()["id"]
    response = await client.get(f"/api/v1/employees/{emp_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Dave"


@pytest.mark.asyncio
async def test_update_employee(client):
    payload = {
        "first_name": "Eve",
        "last_name": "Black",
        "email": "eve@example.com",
        "department": "finance",
        "job_title": "Accountant",
        "hire_date": "2024-05-01",
    }
    create_resp = await client.post("/api/v1/employees", json=payload)
    emp_id = create_resp.json()["id"]
    update = {"job_title": "Senior Accountant"}
    response = await client.patch(f"/api/v1/employees/{emp_id}", json=update)
    assert response.status_code == 200
    assert response.json()["job_title"] == "Senior Accountant"


@pytest.mark.asyncio
async def test_delete_employee(client):
    payload = {
        "first_name": "Frank",
        "last_name": "Green",
        "email": "frank@example.com",
        "department": "operations",
        "job_title": "Ops",
        "hire_date": "2024-06-01",
    }
    create_resp = await client.post("/api/v1/employees", json=payload)
    emp_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/employees/{emp_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/employees/{emp_id}")
    assert get_resp.status_code == 404
