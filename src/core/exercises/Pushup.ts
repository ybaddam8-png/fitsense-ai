import type { ExerciseAnalysis, PoseFrame } from "@/src/types/pose";
import { pushup } from "./ExerciseAnalyzers";
export const analyzePushup = (frame: PoseFrame): ExerciseAnalysis => pushup(frame);
