import pytest


@pytest.mark.asyncio
async def test_create_candidate(client):
    payload = {"name": "Alice Recruiter", "role": "Software Engineer", "email": "alice.r@example.com"}
    response = await client.post("/api/v1/candidates", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Alice Recruiter"
    assert data["status"] == "screening"
    assert data["email"] == "alice.r@example.com"


@pytest.mark.asyncio
async def test_create_candidate_duplicate_email(client):
    payload = {"name": "Bob Dup", "role": "Designer", "email": "bob.dup@example.com"}
    await client.post("/api/v1/candidates", json=payload)
    response = await client.post("/api/v1/candidates", json=payload)
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_list_candidates(client):
    payload = {"name": "Carol List", "role": "PM", "email": "carol.l@example.com"}
    await client.post("/api/v1/candidates", json=payload)
    response = await client.get("/api/v1/candidates")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


@pytest.mark.asyncio
async def test_list_candidates_by_status(client):
    payload = {"name": "Dave Status", "role": "QA", "email": "dave.s@example.com", "status": "interviewed"}
    await client.post("/api/v1/candidates", json=payload)
    response = await client.get("/api/v1/candidates?status=interviewed")
    assert response.status_code == 200
    assert all(c["status"] == "interviewed" for c in response.json())


@pytest.mark.asyncio
async def test_get_candidate(client):
    payload = {"name": "Eve Get", "role": "DevOps", "email": "eve.g@example.com"}
    create = await client.post("/api/v1/candidates", json=payload)
    cid = create.json()["id"]
    response = await client.get(f"/api/v1/candidates/{cid}")
    assert response.status_code == 200
    assert response.json()["name"] == "Eve Get"


@pytest.mark.asyncio
async def test_update_candidate(client):
    payload = {"name": "Frank Update", "role": "Analyst", "email": "frank.u@example.com"}
    create = await client.post("/api/v1/candidates", json=payload)
    cid = create.json()["id"]
    response = await client.patch(f"/api/v1/candidates/{cid}", json={"status": "offered", "notes": "Strong fit"})
    assert response.status_code == 200
    assert response.json()["status"] == "offered"
    assert response.json()["notes"] == "Strong fit"


@pytest.mark.asyncio
async def test_delete_candidate(client):
    payload = {"name": "Grace Delete", "role": "HR", "email": "grace.d@example.com"}
    create = await client.post("/api/v1/candidates", json=payload)
    cid = create.json()["id"]
    response = await client.delete(f"/api/v1/candidates/{cid}")
    assert response.status_code == 204
    get_resp = await client.get(f"/api/v1/candidates/{cid}")
    assert get_resp.status_code == 404
