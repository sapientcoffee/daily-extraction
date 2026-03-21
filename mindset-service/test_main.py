import pytest
from fastapi.testclient import TestClient
from main import app
from tips import TIPS

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_all_tips():
    response = client.get("/tips")
    assert response.status_code == 200
    assert response.json() == TIPS

def test_get_random_tip():
    response = client.get("/tips/random")
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "title" in data
    assert "tip" in data
    assert "author" in data
    assert any(t["id"] == data["id"] for t in TIPS)
