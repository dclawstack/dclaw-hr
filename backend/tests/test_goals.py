import pytest


async def _create_employee(client, email: str = "goal.owner@example.com"):
    payload = {
        "first_name": "Goal",
        "last_name": "Owner",
        "email": email,
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-01",
    }
    resp = await client.post("/api/v1/employees", json=payload)
    return resp.json()["id"]


@pytest.mark.asyncio
async def test_create_goal(client):
    emp_id = await _create_employee(client)
    payload = {
        "owner_id": emp_id,
        "title": "Launch v2",
        "description": "Ship v2 features",
        "progress": 25,
        "due_date": "2026-12-31",
        "status": "active",
    }
    response = await client.post("/api/v1/goals", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Launch v2"
    assert data["progress"] == 25
    assert data["owner"]["id"] == emp_id


@pytest.mark.asyncio
async def test_create_goal_no_owner(client):
    payload = {"title": "Company OKR", "progress": 0, "status": "active"}
    response = await client.post("/api/v1/goals", json=payload)
    assert response.status_code == 201
    assert response.json()["owner"] is None


@pytest.mark.asyncio
async def test_list_goals(client):
    await client.post("/api/v1/goals", json={"title": "Goal A", "progress": 10, "status": "active"})
    response = await client.get("/api/v1/goals")
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_list_goals_by_status(client):
    await client.post("/api/v1/goals", json={"title": "Completed Goal", "progress": 100, "status": "completed"})
    response = await client.get("/api/v1/goals?status=completed")
    assert response.status_code == 200
    assert all(g["status"] == "completed" for g in response.json())


@pytest.mark.asyncio
async def test_update_goal_progress(client):
    create_resp = await client.post("/api/v1/goals", json={"title": "Milestone", "progress": 0})
    goal_id = create_resp.json()["id"]
    response = await client.patch(f"/api/v1/goals/{goal_id}", json={"progress": 75})
    assert response.status_code == 200
    assert response.json()["progress"] == 75


@pytest.mark.asyncio
async def test_invalid_progress(client):
    response = await client.post("/api/v1/goals", json={"title": "Bad", "progress": 150})
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_delete_goal(client):
    create_resp = await client.post("/api/v1/goals", json={"title": "To Delete", "progress": 0})
    goal_id = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/goals/{goal_id}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/goals/{goal_id}")
    assert get_resp.status_code == 404
