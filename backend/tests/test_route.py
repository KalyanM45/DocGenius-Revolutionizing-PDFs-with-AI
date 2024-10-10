import pytest
from backend.app import app

@pytest.fixture
def client():
    app.config.update({"TESTING": True})
    with app.test_client() as client:
        yield client


def test_ping(client):
    response = client.get("/api/ping")
    assert response.status_code == 200
    assert response.json["ping"] == "pong"

def test_ask(client):
    response = client.post("/api/ask", json={
        "question": "What is 2 + 2 = ?"
    })
    assert response.json["ai"] is not None