import type { ExercisePhase } from "@/src/types/pose";
export type StateTransition = { phase: ExercisePhase; repCompleted: boolean };
export class RepStateMachine {
  private phase: ExercisePhase = "ready";
  private lastTransitionMs = 0;
  constructor(private readonly cooldownMs = 280) {}
  get currentPhase(): ExercisePhase { return this.phase; }
  reset(): void { this.phase = "ready"; this.lastTransitionMs = 0; }
  update(isAtTop: boolean, isAtBottom: boolean, timestampMs = Date.now()): StateTransition {
    if (timestampMs - this.lastTransitionMs < this.cooldownMs) return { phase: this.phase, repCompleted: false };
    const previous = this.phase;
    if (this.phase === "ready" && isAtBottom) this.phase = "eccentric";
    else if (this.phase === "eccentric" && isAtTop) this.phase = "concentric";
    else if (this.phase === "concentric" && isAtTop) this.phase = "ready";
    const repCompleted = previous === "eccentric" && this.phase === "concentric";
    if (this.phase !== previous) this.lastTransitionMs = timestampMs;
    return { phase: this.phase, repCompleted };
  }
}
export const phaseLabel = (phase: ExercisePhase): string => phase === "eccentric" ? "Lower" : phase === "concentric" ? "Rise" : "Ready";
export const phaseDescription = (phase: ExercisePhase): string => phase === "eccentric" ? "Controlled descent" : phase === "concentric" ? "Drive to the top" : "Find your start position";
export const isActivePhase = (phase: ExercisePhase): boolean => phase !== "ready";
export const isDescending = (phase: ExercisePhase): boolean => phase === "eccentric";
export const isAscending = (phase: ExercisePhase): boolean => phase === "concentric";
