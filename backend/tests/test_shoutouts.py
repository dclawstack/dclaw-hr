import pytest


async def _create_employee(client, email: str, first: str = "Sender", last: str = "User"):
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
async def test_create_shoutout(client):
    from_id = await _create_employee(client, "shout.from@example.com", "Alice", "Giver")
    to_id = await _create_employee(client, "shout.to@example.com", "Bob", "Receiver")
    payload = {
        "from_employee_id": from_id,
        "to_employee_id": to_id,
        "message": "Great work on the release!",
    }
    response = await client.post("/api/v1/shoutouts", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["message"] == "Great work on the release!"
    assert data["from_employee"]["first_name"] == "Alice"
    assert data["to_employee"]["first_name"] == "Bob"


@pytest.mark.asyncio
async def test_list_shoutouts(client):
    from_id = await _create_employee(client, "shout2.from@example.com", "Carol", "Sender")
    to_id = await _create_employee(client, "shout2.to@example.com", "Dave", "Receiver")
    await client.post("/api/v1/shoutouts", json={
        "from_employee_id": from_id,
        "to_employee_id": to_id,
        "message": "Amazing job!",
    })
    response = await client.get("/api/v1/shoutouts")
    assert response.status_code == 200
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_delete_shoutout(client):
    from_id = await _create_employee(client, "shout3.from@example.com", "Eve", "Sender")
    to_id = await _create_employee(client, "shout3.to@example.com", "Frank", "Receiver")
    create_resp = await client.post("/api/v1/shoutouts", json={
        "from_employee_id": from_id,
        "to_employee_id": to_id,
        "message": "Well done!",
    })
    sid = create_resp.json()["id"]
    response = await client.delete(f"/api/v1/shoutouts/{sid}")
    assert response.status_code == 204


@pytest.mark.asyncio
async def test_delete_shoutout_not_found(client):
    response = await client.delete("/api/v1/shoutouts/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404
