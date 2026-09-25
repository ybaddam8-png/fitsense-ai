export const WORKOUTS_TABLE = `CREATE TABLE IF NOT EXISTS workouts (id TEXT PRIMARY KEY NOT NULL, exercise_id TEXT NOT NULL, started_at TEXT NOT NULL, ended_at TEXT NOT NULL, reps INTEGER NOT NULL, duration_seconds REAL NOT NULL, average_form_score REAL NOT NULL, best_form_score REAL NOT NULL, feedback_highlights TEXT NOT NULL, source TEXT NOT NULL);`;
export const PROFILE_TABLE = `CREATE TABLE IF NOT EXISTS profile (id TEXT PRIMARY KEY NOT NULL, display_name TEXT NOT NULL, goal TEXT NOT NULL, created_at TEXT NOT NULL);`;
export const INDEXES = [`CREATE INDEX IF NOT EXISTS workouts_started_at_idx ON workouts(started_at);`, `CREATE INDEX IF NOT EXISTS workouts_exercise_idx ON workouts(exercise_id);`];
export const MIGRATIONS = [WORKOUTS_TABLE, PROFILE_TABLE, ...INDEXES];
