import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import type { WorkoutSummary } from "@/src/types/pose";
import { parseWorkoutSummaries, storageKey, stringifyJson } from "@/src/types/pose";
import { MIGRATIONS } from "./schema";
let database: SQLite.SQLiteDatabase | null = null;
const getDatabase = (): SQLite.SQLiteDatabase => { if (!database) database = SQLite.openDatabaseSync("fitsense.db"); return database; };
const ensureSchema = () => { if (Platform.OS !== "web") MIGRATIONS.forEach((sql) => getDatabase().execSync(sql)); };
export async function loadWorkouts(userId = "local"): Promise<WorkoutSummary[]> {
  if (Platform.OS === "web") return parseWorkoutSummaries(JSON.parse((await AsyncStorage.getItem(storageKey(userId))) ?? "[]"));
  ensureSchema(); const rows = getDatabase().getAllSync<{ id: string; exercise_id: string; started_at: string; ended_at: string; reps: number; duration_seconds: number; average_form_score: number; best_form_score: number; feedback_highlights: string; source: string }>("SELECT * FROM workouts ORDER BY started_at DESC");
  return parseWorkoutSummaries(rows.map((row) => ({ id: row.id, exerciseId: row.exercise_id, startedAt: row.started_at, endedAt: row.ended_at, reps: row.reps, durationSeconds: row.duration_seconds, averageFormScore: row.average_form_score, bestFormScore: row.best_form_score, feedbackHighlights: JSON.parse(row.feedback_highlights), source: row.source })));
}
export async function saveWorkout(workout: WorkoutSummary, userId = "local"): Promise<void> {
  if (Platform.OS === "web") { const existing = await loadWorkouts(userId); await AsyncStorage.setItem(storageKey(userId), stringifyJson([workout, ...existing.filter((item) => item.id !== workout.id)])); return; }
  ensureSchema(); getDatabase().runSync("INSERT OR REPLACE INTO workouts (id, exercise_id, started_at, ended_at, reps, duration_seconds, average_form_score, best_form_score, feedback_highlights, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", workout.id, workout.exerciseId, workout.startedAt, workout.endedAt, workout.reps, workout.durationSeconds, workout.averageFormScore, workout.bestFormScore, JSON.stringify(workout.feedbackHighlights), workout.source);
}
export async function deleteWorkout(id: string, userId = "local"): Promise<void> { if (Platform.OS === "web") { const existing = await loadWorkouts(userId); await AsyncStorage.setItem(storageKey(userId), stringifyJson(existing.filter((item) => item.id !== id))); return; } ensureSchema(); getDatabase().runSync("DELETE FROM workouts WHERE id = ?", id); }
export async function clearWorkouts(userId = "local"): Promise<void> { if (Platform.OS === "web") { await AsyncStorage.removeItem(storageKey(userId)); return; } ensureSchema(); getDatabase().runSync("DELETE FROM workouts"); }
export async function saveWorkouts(workouts: WorkoutSummary[], userId = "local"): Promise<void> { for (const workout of workouts) await saveWorkout(workout, userId); }
export const repositoryStatus = (): string => Platform.OS === "web" ? "AsyncStorage fallback" : "SQLite local database";
