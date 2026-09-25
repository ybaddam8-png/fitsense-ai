import type { ExerciseAnalysis, PoseFrame } from "@/src/types/pose";
import { bicepCurl } from "./ExerciseAnalyzers";
export const analyzeBicepCurl = (frame: PoseFrame): ExerciseAnalysis => bicepCurl(frame);
