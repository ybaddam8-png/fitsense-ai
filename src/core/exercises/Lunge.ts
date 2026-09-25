import type { ExerciseAnalysis, PoseFrame } from "@/src/types/pose";
import { lunge } from "./ExerciseAnalyzers";
export const analyzeLunge = (frame: PoseFrame): ExerciseAnalysis => lunge(frame);
