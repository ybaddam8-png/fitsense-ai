import type { ExerciseDefinition, ExerciseId } from "@/src/types/pose";
export const EXERCISES: ExerciseDefinition[] = [
  { id: "squat", name: "Squat", shortName: "Squats", description: "Lower body strength", targetReps: 10, primaryMetric: "Knee angle", requiredLandmarks: ["leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"] },
  { id: "pushup", name: "Push-up", shortName: "Push-ups", description: "Upper body control", targetReps: 12, primaryMetric: "Elbow angle", requiredLandmarks: ["leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip"] },
  { id: "bicep-curl", name: "Bicep curl", shortName: "Curls", description: "Arm strength", targetReps: 10, primaryMetric: "Elbow angle", requiredLandmarks: ["leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist"] },
  { id: "lunge", name: "Lunge", shortName: "Lunges", description: "Single-leg stability", targetReps: 12, primaryMetric: "Knee angle", requiredLandmarks: ["leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"] },
];
export const exerciseById = (id: ExerciseId): ExerciseDefinition => EXERCISES.find((exercise) => exercise.id === id) ?? EXERCISES[0];
export const exerciseAccent = (id: ExerciseId): string => id === "squat" ? "#B9F06B" : id === "pushup" ? "#6EE7F2" : id === "bicep-curl" ? "#F7B267" : "#C4B5FD";
export const exerciseIcon = (id: ExerciseId): string => id === "squat" ? "fitness-center" : id === "pushup" ? "self-improvement" : id === "bicep-curl" ? "sports-handball" : "directions-run";
