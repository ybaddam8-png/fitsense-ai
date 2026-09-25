import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Query
from ...db.database import export_analytics, get_workout, list_workouts, upsert_workout
from ...models.schemas import AnalyticsExport, WorkoutSummaryIn, WorkoutSummaryOut

router = APIRouter(prefix="/workouts", tags=["workouts"])

def to_output(row: dict) -> WorkoutSummaryOut:
    return WorkoutSummaryOut(id=row["id"], exercise_id=row["exercise_id"], started_at=datetime.fromisoformat(row["started_at"]), ended_at=datetime.fromisoformat(row["ended_at"]), reps=row["reps"], duration_seconds=row["duration_seconds"], average_form_score=row["average_form_score"], best_form_score=row["best_form_score"], feedback_highlights=json.loads(row["feedback_highlights"]), source=row["source"], created_at=datetime.fromisoformat(row["created_at"]))

@router.post("", response_model=WorkoutSummaryOut, status_code=201)
def create_or_update_workout(payload: WorkoutSummaryIn) -> WorkoutSummaryOut:
    now = datetime.now(timezone.utc).isoformat()
    row = upsert_workout((payload.id, payload.exercise_id, payload.started_at.isoformat(), payload.ended_at.isoformat(), payload.reps, payload.duration_seconds, payload.average_form_score, payload.best_form_score, json.dumps(payload.feedback_highlights), payload.source, now))
    return to_output(row)

@router.get("", response_model=list[WorkoutSummaryOut])
def get_workouts(limit: int = Query(default=100, ge=1, le=500)) -> list[WorkoutSummaryOut]:
    return [to_output(row) for row in list_workouts(limit)]

@router.get("/analytics", response_model=AnalyticsExport)
def get_analytics() -> AnalyticsExport:
    return AnalyticsExport(**export_analytics())

@router.get("/{workout_id}", response_model=WorkoutSummaryOut)
def get_workout_by_id(workout_id: str) -> WorkoutSummaryOut:
    row = get_workout(workout_id)
    if not row:
        raise HTTPException(status_code=404, detail="Workout not found")
    return to_output(row)
