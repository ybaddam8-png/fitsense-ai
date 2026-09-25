import { create } from "zustand";
import type { ActivityDay, ExerciseId, WorkoutSession, WorkoutSummary } from "@/src/types/pose";
import { activityFromWorkouts, makeSummary, makeSession, sortNewestFirst, totalWorkoutMinutes, totalWorkoutReps } from "@/src/types/pose";
import { loadWorkouts, saveWorkout, saveWorkouts } from "@/src/services/database/workoutRepository";
import { pullWorkoutSummaries, syncWorkoutSummary, syncWorkouts, type SyncResult } from "@/src/services/sync/syncService";
type WorkoutState = { workouts: WorkoutSummary[]; loading: boolean; session: WorkoutSession | null; load: () => Promise<void>; startSession: (exerciseId: ExerciseId, source: WorkoutSession["source"]) => void; updateSession: (patch: Partial<WorkoutSession>) => void; finishSession: (scores: number[], feedback: string[]) => Promise<WorkoutSummary | null>; syncNow: () => Promise<SyncResult>; activity: () => ActivityDay[]; stats: () => { minutes: number; reps: number; sessions: number } };
export const useWorkoutStore = create<WorkoutState>((set, get) => ({ workouts: [], loading: true, session: null,
  load: async () => { set({ loading: true }); const workouts = await loadWorkouts(); set({ workouts: sortNewestFirst(workouts), loading: false }); },
  startSession: (exerciseId, source) => set({ session: makeSession(exerciseId, source) }),
  updateSession: (patch) => set((state) => state.session ? { session: { ...state.session, ...patch } } : state),
  finishSession: async (scores, feedback) => { const session = get().session; if (!session) return null; const summary = makeSummary(session, scores, feedback); await saveWorkout(summary); void syncWorkoutSummary(summary); set((state) => ({ session: null, workouts: sortNewestFirst([summary, ...state.workouts.filter((item) => item.id !== summary.id)]) })); return summary; },
  syncNow: async () => { const local = await loadWorkouts(); const result = await syncWorkouts(local); const remote = await pullWorkoutSummaries(); if (remote) { const merged = Array.from(new Map([...local, ...remote].map((item) => [item.id, item])).values()); await saveWorkouts(merged); set({ workouts: sortNewestFirst(merged) }); } else set({ workouts: sortNewestFirst(local) }); return result; },
  activity: () => activityFromWorkouts(get().workouts),
  stats: () => ({ minutes: totalWorkoutMinutes(get().workouts), reps: totalWorkoutReps(get().workouts), sessions: get().workouts.length }),
}));
