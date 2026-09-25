import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Iterator
from ..config import settings

DB_PATH = Path(__file__).resolve().parents[2] / "fitsense.db"

@contextmanager
def connection() -> Iterator[sqlite3.Connection]:
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    try:
        yield db
        db.commit()
    finally:
        db.close()

def init_db() -> None:
    with connection() as db:
        db.execute("""CREATE TABLE IF NOT EXISTS workouts (id TEXT PRIMARY KEY, exercise_id TEXT NOT NULL, started_at TEXT NOT NULL, ended_at TEXT NOT NULL, reps INTEGER NOT NULL, duration_seconds REAL NOT NULL, average_form_score REAL NOT NULL, best_form_score REAL NOT NULL, feedback_highlights TEXT NOT NULL, source TEXT NOT NULL, created_at TEXT NOT NULL)""")
        db.execute("CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON workouts(started_at)")

def upsert_workout(values: tuple) -> dict:
    with connection() as db:
        db.execute("""INSERT OR REPLACE INTO workouts (id, exercise_id, started_at, ended_at, reps, duration_seconds, average_form_score, best_form_score, feedback_highlights, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""", values)
        row = db.execute("SELECT * FROM workouts WHERE id = ?", (values[0],)).fetchone()
        return dict(row)

def list_workouts(limit: int = 100) -> list[dict]:
    with connection() as db:
        return [dict(row) for row in db.execute("SELECT * FROM workouts ORDER BY started_at DESC LIMIT ?", (limit,)).fetchall()]

def get_workout(workout_id: str) -> dict | None:
    with connection() as db:
        row = db.execute("SELECT * FROM workouts WHERE id = ?", (workout_id,)).fetchone()
        return dict(row) if row else None

def export_analytics() -> dict:
    with connection() as db:
        row = db.execute("SELECT COUNT(*) AS count, COALESCE(SUM(reps), 0) AS total_reps, COALESCE(SUM(duration_seconds), 0) AS total_duration_seconds, COALESCE(AVG(average_form_score), 0) AS average_form_score FROM workouts").fetchone()
        return dict(row)

init_db()
