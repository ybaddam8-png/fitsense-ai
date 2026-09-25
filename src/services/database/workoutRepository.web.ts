import AsyncStorage from "@react-native-async-storage/async-storage";
import type { WorkoutSummary } from "@/src/types/pose";
import { parseWorkoutSummaries, storageKey, stringifyJson } from "@/src/types/pose";
export async function loadWorkouts(userId = "local"): Promise<WorkoutSummary[]> { return parseWorkoutSummaries(JSON.parse((await AsyncStorage.getItem(storageKey(userId))) ?? "[]")); }
export async function saveWorkout(workout: WorkoutSummary, userId = "local"): Promise<void> { const existing = await loadWorkouts(userId); await AsyncStorage.setItem(storageKey(userId), stringifyJson([workout, ...existing.filter((item) => item.id !== workout.id)])); }
export async function deleteWorkout(id: string, userId = "local"): Promise<void> { const existing = await loadWorkouts(userId); await AsyncStorage.setItem(storageKey(userId), stringifyJson(existing.filter((item) => item.id !== id))); }
export async function clearWorkouts(userId = "local"): Promise<void> { await AsyncStorage.removeItem(storageKey(userId)); }
export async function saveWorkouts(workouts: WorkoutSummary[], userId = "local"): Promise<void> { for (const workout of workouts) await saveWorkout(workout, userId); }
export const repositoryStatus = (): string => "AsyncStorage fallback";
