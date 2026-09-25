import type { ExerciseAnalysis, ExerciseDefinition, ExerciseId, PoseFrame } from "@/src/types/pose";
export abstract class BaseExercise { constructor(public readonly definition: ExerciseDefinition) {} abstract analyze(frame: PoseFrame): ExerciseAnalysis; get id(): ExerciseId { return this.definition.id; } }
