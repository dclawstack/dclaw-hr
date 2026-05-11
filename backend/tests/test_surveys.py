import pytest


async def _create_employee(client):
    payload = {
        "first_name": "Survey",
        "last_name": "User",
        "email": "survey.user@example.com",
        "department": "engineering",
        "job_title": "Engineer",
        "hire_date": "2024-01-01",
    }
    resp = await client.post("/api/v1/employees", json=payload)
    return resp.json()["id"]


@pytest.mark.asyncio
async def test_create_survey(client):
    emp_id = await _create_employee(client)
    payload = {"employee_id": emp_id, "score": 8, "comment": "Great workplace!"}
    response = await client.post("/api/v1/surveys", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["score"] == 8
    assert data["comment"] == "Great workplace!"
    assert data["employee_id"] == emp_id


@pytest.mark.asyncio
async def test_create_survey_invalid_score(client):
    emp_id = await _create_employee(client)
    payload = {"employee_id": emp_id, "score": 11}
    response = await client.post("/api/v1/surveys", json=payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_surveys(client):
    emp_id = await _create_employee(client)
    await client.post("/api/v1/surveys", json={"employee_id": emp_id, "score": 7})
    response = await client.get("/api/v1/surveys")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_get_survey_summary(client):
    emp_id = await _create_employee(client)
    await client.post("/api/v1/surveys", json={"employee_id": emp_id, "score": 6})
    await client.post("/api/v1/surveys", json={"employee_id": emp_id, "score": 8})
    response = await client.get("/api/v1/surveys/summary")
    assert response.status_code == 200
    data = response.json()
    assert "avg_score" in data
    assert "response_count" in data
    assert data["response_count"] >= 2
    assert data["avg_score"] == 7.0


@pytest.mark.asyncio
async def test_delete_survey(client):
    emp_id = await _create_employee(client)
    create_resp = await client.post("/api/v1/surveys", json={"employee_id": emp_id, "score": 5})
    sid = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/surveys/{sid}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_survey_not_found(client):
    response = await client.delete("/api/v1/surveys/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
