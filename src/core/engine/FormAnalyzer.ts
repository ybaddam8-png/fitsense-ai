import type { ExerciseAnalysis, ExerciseId, PoseFrame } from "@/src/types/pose";
import { landmark, frameConfidence, requiredLandmarksFor } from "@/src/types/pose";
import { angleScore, kneeAngle, elbowAngle, hipAngle, symmetryScore, formScore } from "../geometry/angle";
import { scoreTone } from "../geometry/vector";
import { analyzeSquat } from "../exercises/Squat";
import { analyzePushup } from "../exercises/Pushup";
import { analyzeBicepCurl } from "../exercises/BicepCurl";
import { analyzeLunge } from "../exercises/Lunge";
export { kneeAngle, elbowAngle, hipAngle, angleScore, symmetryScore, formScore };
export function analyzeExercise(id: ExerciseId, frame: PoseFrame): ExerciseAnalysis {
  if (frameConfidence(frame, id) < 0.55) return { phase: "ready", repCompleted: false, score: 0, feedback: "Move into frame so I can see your joints", tone: "warning", metrics: { confidence: frameConfidence(frame, id), isAtTop: 0, isAtBottom: 0 } };
  if (id === "squat") return analyzeSquat(frame);
  if (id === "pushup") return analyzePushup(frame);
  if (id === "bicep-curl") return analyzeBicepCurl(frame);
  return analyzeLunge(frame);
}
export const visiblePoint = (frame: PoseFrame, name: Parameters<typeof landmark>[1]) => landmark(frame, name);
export const jointVisibility = (frame: PoseFrame, id: ExerciseId): number => frameConfidence(frame, id);
export const makeAnalysis = (score: number, feedback: string, metrics: Record<string, number>): ExerciseAnalysis => ({ phase: "ready", repCompleted: false, score: formScore([score]), feedback, tone: scoreTone(score), metrics });
export const confidenceMetric = (frame: PoseFrame, id: ExerciseId): number => frameConfidence(frame, id);
export const requiredFor = requiredLandmarksFor;
