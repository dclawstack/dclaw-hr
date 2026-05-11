import pytest


async def _create_employee(client, email: str, first: str = "Manager", last: str = "User"):
    payload = {
        "first_name": first,
        "last_name": last,
        "email": email,
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-01",
    }
    resp = await client.post("/api/v1/employees", json=payload)
    return resp.json()["id"]


@pytest.mark.asyncio
async def test_create_one_on_one(client):
    mgr_id = await _create_employee(client, "mgr@example.com", "Alice", "Manager")
    emp_id = await _create_employee(client, "emp@example.com", "Bob", "Employee")
    payload = {
        "manager_id": mgr_id,
        "employee_id": emp_id,
        "scheduled_date": "2026-06-01",
        "notes": "Quarterly check-in",
        "status": "scheduled",
    }
    response = await client.post("/api/v1/one-on-ones", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["manager_id"] == mgr_id
    assert data["employee_id"] == emp_id
    assert data["status"] == "scheduled"
    assert data["manager"]["first_name"] == "Alice"
    assert data["employee"]["first_name"] == "Bob"


@pytest.mark.asyncio
async def test_list_one_on_ones(client):
    mgr_id = await _create_employee(client, "mgr2@example.com")
    emp_id = await _create_employee(client, "emp2@example.com", "Charlie", "Worker")
    await client.post("/api/v1/one-on-ones", json={
        "manager_id": mgr_id,
        "employee_id": emp_id,
        "scheduled_date": "2026-06-15",
    })
    response = await client.get("/api/v1/one-on-ones")
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_update_one_on_one(client):
    mgr_id = await _create_employee(client, "mgr3@example.com")
    emp_id = await _create_employee(client, "emp3@example.com", "Dave", "Dev")
    create_resp = await client.post("/api/v1/one-on-ones", json={
        "manager_id": mgr_id,
        "employee_id": emp_id,
        "scheduled_date": "2026-07-01",
    })
    oo_id = create_resp.json()["id"]
    response = await client.patch(f"/api/v1/one-on-ones/{oo_id}", json={"status": "completed", "notes": "Done!"})
    assert response.status_code == 200
    assert response.json()["status"] == "completed"
    assert response.json()["notes"] == "Done!"


@pytest.mark.asyncio
async def test_delete_one_on_one(client):
    mgr_id = await _create_employee(client, "mgr4@example.com")
    emp_id = await _create_employee(client, "emp4@example.com", "Eve", "QA")
    create_resp = await client.post("/api/v1/one-on-ones", json={
        "manager_id": mgr_id,
        "employee_id": emp_id,
        "scheduled_date": "2026-08-01",
    })
    oo_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/one-on-ones/{oo_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/one-on-ones/{oo_id}")
    assert get_resp.status_code == 404
