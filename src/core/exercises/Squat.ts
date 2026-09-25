import type { ExerciseAnalysis, PoseFrame } from "@/src/types/pose";
import { squat } from "./ExerciseAnalyzers";
export const analyzeSquat = (frame: PoseFrame): ExerciseAnalysis => squat(frame);
