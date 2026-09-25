import type { ExerciseAnalysis, ExerciseId, PoseFrame } from "@/src/types/pose";
import { RepStateMachine } from "./StateMachine";
import { analyzeExercise } from "./FormAnalyzer";
export class RepEngine {
  private readonly machine = new RepStateMachine();
  private reps = 0;
  private scores: number[] = [];
  private feedback: string[] = [];
  constructor(private readonly exerciseId: ExerciseId) {}
  reset(): void { this.machine.reset(); this.reps = 0; this.scores = []; this.feedback = []; }
  process(frame: PoseFrame): ExerciseAnalysis & { reps: number; averageScore: number; highlights: string[] } {
    const analysis = analyzeExercise(this.exerciseId, frame);
    const state = this.machine.update(analysis.metrics.isAtTop === 1, analysis.metrics.isAtBottom === 1, frame.timestampMs);
    if (state.repCompleted) this.reps += 1;
    const result = { ...analysis, phase: state.phase, repCompleted: state.repCompleted, reps: this.reps, averageScore: this.scores.length ? this.scores.reduce((sum, value) => sum + value, 0) / this.scores.length : analysis.score, highlights: Array.from(new Set(this.feedback)).slice(-4) };
    if (analysis.score > 0) this.scores.push(analysis.score);
    if (analysis.feedback && !this.feedback.includes(analysis.feedback)) this.feedback.push(analysis.feedback);
    return result;
  }
  get count(): number { return this.reps; }
  get averageScore(): number { return this.scores.length ? this.scores.reduce((sum, value) => sum + value, 0) / this.scores.length : 0; }
  get highlights(): string[] { return Array.from(new Set(this.feedback)).slice(-4); }
}
export const createRepEngine = (exerciseId: ExerciseId): RepEngine => new RepEngine(exerciseId);
