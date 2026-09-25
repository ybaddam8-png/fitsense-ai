from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field

ExerciseId = Literal["squat", "pushup", "bicep-curl", "lunge"]
Source = Literal["camera", "demo"]

class WorkoutSummaryIn(BaseModel):
    id: str = Field(min_length=1, max_length=120)
    exercise_id: ExerciseId
    started_at: datetime
    ended_at: datetime
    reps: int = Field(ge=0, le=10000)
    duration_seconds: float = Field(ge=0, le=86400)
    average_form_score: float = Field(ge=0, le=100)
    best_form_score: float = Field(ge=0, le=100)
    feedback_highlights: list[str] = Field(default_factory=list, max_length=8)
    source: Source

class WorkoutSummaryOut(WorkoutSummaryIn):
    created_at: datetime

class AnalyticsExport(BaseModel):
    count: int
    total_reps: int
    total_duration_seconds: float
    average_form_score: float

class HealthOut(BaseModel):
    status: str
    service: str
    storage: str
