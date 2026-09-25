import type { WorkoutSummary } from "@/src/types/pose";
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "";
export type SyncResult = { synced: number; skipped: number; online: boolean };
export async function checkBackend(): Promise<boolean> { if (!API_BASE_URL) return false; try { const response = await fetch(`${API_BASE_URL}/health`); return response.ok; } catch { return false; } }
export async function syncWorkoutSummary(workout: WorkoutSummary): Promise<boolean> { if (!API_BASE_URL) return false; try { const response = await fetch(`${API_BASE_URL}/api/v1/workouts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(workout) }); return response.ok; } catch { return false; } }
export async function syncWorkouts(workouts: WorkoutSummary[]): Promise<SyncResult> { const online = await checkBackend(); if (!online) return { synced: 0, skipped: workouts.length, online: false }; let synced = 0; for (const workout of workouts) if (await syncWorkoutSummary(workout)) synced += 1; return { synced, skipped: workouts.length - synced, online: true }; }
export const syncPrivacyNote = "Only workout summaries are sent; camera frames and raw landmarks never leave the device.";
