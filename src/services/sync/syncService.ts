import { asExerciseId, type WorkoutSummary } from "@/src/types/pose";
import { getApiBaseUrl } from "@/constants/oauth";
import { createTRPCClient } from "@/lib/trpc";
export type SyncResult = { synced: number; skipped: number; online: boolean; authenticated: boolean };
export async function checkBackend(): Promise<boolean> { const baseUrl = getApiBaseUrl(); if (!baseUrl) return false; try { const response = await fetch(`${baseUrl}/health`); return response.ok; } catch { return false; } }
export async function syncWorkoutSummary(workout: WorkoutSummary): Promise<boolean> { try { await createTRPCClient().workouts.upsert.mutate(workout); return true; } catch { return false; } }
export async function pullWorkoutSummaries(): Promise<WorkoutSummary[] | null> { try { const rows = await createTRPCClient().workouts.list.query(); return rows.map((row) => ({ ...row, exerciseId: asExerciseId(row.exerciseId) })); } catch { return null; } }
export async function syncWorkouts(workouts: WorkoutSummary[]): Promise<SyncResult> { const online = await checkBackend(); if (!online) return { synced: 0, skipped: workouts.length, online: false, authenticated: false }; const remote = await pullWorkoutSummaries(); if (!remote) return { synced: 0, skipped: workouts.length, online: true, authenticated: false }; let synced = 0; for (const workout of workouts) if (await syncWorkoutSummary(workout)) synced += 1; return { synced, skipped: workouts.length - synced, online: true, authenticated: true }; }
export const syncPrivacyNote = "Only authenticated workout summaries are synced; camera frames and raw landmarks never leave the device.";
