import { useEffect, useRef, useState } from "react";
import type { ExerciseId, Landmark, PoseFrame } from "@/src/types/pose";
import { createEmptyLandmarks, LANDMARK_INDEX, poseFrame } from "@/src/types/pose";
const set = (points: Landmark[], name: keyof typeof LANDMARK_INDEX, point: Landmark) => { points[LANDMARK_INDEX[name]] = point; };
const point = (x: number, y: number): Landmark => ({ x, y, z: 0, visibility: 0.98 });
export function demoLandmarksAt(exerciseId: ExerciseId, elapsedMs: number): PoseFrame {
  const points = createEmptyLandmarks(); const cycle = (elapsedMs % 2400) / 2400; const depth = (1 - Math.cos(cycle * Math.PI * 2)) / 2;
  if (exerciseId === "squat" || exerciseId === "lunge") {
    const knee = 170 - depth * (exerciseId === "squat" ? 82 : 70); const direction = (90 - knee) * Math.PI / 180; const kneeY = 0.58 + depth * 0.08; const ankleY = 0.9; const leg = 0.29;
    const hipX = 0.35 + Math.cos(direction) * leg; const hipY = kneeY + Math.sin(direction) * leg;
    set(points, "leftHip", point(hipX, hipY)); set(points, "rightHip", point(1 - hipX, hipY)); set(points, "leftKnee", point(0.35, kneeY)); set(points, "rightKnee", point(0.65, kneeY)); set(points, "leftAnkle", point(0.35, ankleY)); set(points, "rightAnkle", point(0.65, ankleY));
    set(points, "leftShoulder", point(0.38, hipY - 0.28)); set(points, "rightShoulder", point(0.62, hipY - 0.28)); set(points, "leftElbow", point(0.3, hipY - 0.12)); set(points, "rightElbow", point(0.7, hipY - 0.12)); set(points, "leftWrist", point(0.28, hipY - 0.02)); set(points, "rightWrist", point(0.72, hipY - 0.02));
  } else if (exerciseId === "pushup") {
    const elbow = 170 - depth * 90; const elbowY = 0.58 - depth * 0.08; set(points, "leftShoulder", point(0.34, 0.45)); set(points, "rightShoulder", point(0.38, 0.48)); set(points, "leftHip", point(0.55, 0.55)); set(points, "rightHip", point(0.59, 0.58)); set(points, "leftElbow", point(0.45, elbowY)); set(points, "rightElbow", point(0.49, elbowY + 0.02)); set(points, "leftWrist", point(0.58, 0.72)); set(points, "rightWrist", point(0.62, 0.74)); set(points, "leftAnkle", point(0.85, 0.82)); set(points, "rightAnkle", point(0.89, 0.84));
  } else {
    const elbow = 165 - depth * 125; const wristY = 0.64 - depth * 0.18; set(points, "leftShoulder", point(0.38, 0.35)); set(points, "rightShoulder", point(0.62, 0.35)); set(points, "leftElbow", point(0.35, 0.55)); set(points, "rightElbow", point(0.65, 0.55)); set(points, "leftWrist", point(0.35 - Math.sin((elbow * Math.PI) / 180) * 0.12, wristY)); set(points, "rightWrist", point(0.65 + Math.sin((elbow * Math.PI) / 180) * 0.12, wristY)); set(points, "leftHip", point(0.43, 0.7)); set(points, "rightHip", point(0.57, 0.7)); set(points, "leftKnee", point(0.42, 0.86)); set(points, "rightKnee", point(0.58, 0.86)); set(points, "leftAnkle", point(0.4, 0.98)); set(points, "rightAnkle", point(0.6, 0.98));
  }
  set(points, "nose", point(0.5, 0.15)); return poseFrame(points, "demo", elapsedMs);
}
export function useDemoLandmarks(exerciseId: ExerciseId, running = true): PoseFrame | null {
  const startedAt = useRef(Date.now()); const [frame, setFrame] = useState<PoseFrame>(() => demoLandmarksAt(exerciseId, 0));
  useEffect(() => { startedAt.current = Date.now(); if (!running) return undefined; const timer = setInterval(() => setFrame(demoLandmarksAt(exerciseId, Date.now() - startedAt.current)), 80); return () => clearInterval(timer); }, [exerciseId, running]);
  return frame;
}
