from datetime import datetime, timedelta, timezone
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def payload():
    start = datetime.now(timezone.utc)
    return {"id": "test-session-1", "exercise_id": "squat", "started_at": start.isoformat(), "ended_at": (start + timedelta(seconds=75)).isoformat(), "reps": 10, "duration_seconds": 75, "average_form_score": 86, "best_form_score": 94, "feedback_highlights": ["Keep your chest proud"], "source": "demo"}


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_and_list_workout():
    created = client.post("/api/v1/workouts", json=payload())
    assert created.status_code == 201
    assert created.json()["reps"] == 10
    listed = client.get("/api/v1/workouts")
    assert listed.status_code == 200
    assert any(item["id"] == "test-session-1" for item in listed.json())


def test_invalid_exercise_is_rejected():
    invalid = payload() | {"exercise_id": "deadlift"}
    assert client.post("/api/v1/workouts", json=invalid).status_code == 422
