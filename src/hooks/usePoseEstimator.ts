import { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import type { ExerciseId, PoseFrame } from "@/src/types/pose";
import { useDemoLandmarks } from "./useDemoLandmarks";
export type PoseEstimatorMode = "camera" | "demo";
export function usePoseEstimator(exerciseId: ExerciseId, mode: PoseEstimatorMode, running = true): { frame: PoseFrame | null; permission: boolean | null; requestPermission: () => Promise<void>; isReady: boolean } {
  const [permission, setPermission] = useState<boolean | null>(mode === "demo" ? true : null);
  const demoFrame = useDemoLandmarks(exerciseId, mode === "demo" && running);
  useEffect(() => { if (mode === "camera") Camera.getCameraPermissionsAsync().then((result) => setPermission(result.granted)); else setPermission(true); }, [mode]);
  const requestPermission = async () => { const result = await Camera.requestCameraPermissionsAsync(); setPermission(result.granted); };
  return { frame: mode === "demo" ? demoFrame : null, permission, requestPermission, isReady: mode === "demo" || permission === true };
}
export const poseEstimatorNote = "MediaPipe Pose Landmarker integration point; camera frames remain on-device.";
