import { useCallback, useEffect, useState } from "react";
import { Camera } from "expo-camera";
import type { ExerciseId, PoseFrame } from "@/src/types/pose";
import { parseNativePoseEvent, type NativePoseEvent } from "@/src/core/pose/nativeMapper";
import { useDemoLandmarks } from "./useDemoLandmarks";
export type PoseEstimatorMode = "camera" | "demo";
export function usePoseEstimator(exerciseId: ExerciseId, mode: PoseEstimatorMode, running = true): { frame: PoseFrame | null; permission: boolean | null; requestPermission: () => Promise<void>; isReady: boolean; onNativeLandmark: (event: NativePoseEvent) => void } {
  const [permission, setPermission] = useState<boolean | null>(mode === "demo" ? true : null);
  const [nativeFrame, setNativeFrame] = useState<PoseFrame | null>(null);
  const demoFrame = useDemoLandmarks(exerciseId, mode === "demo" && running);
  useEffect(() => { setNativeFrame(null); if (mode === "camera") void Camera.getCameraPermissionsAsync().then((result) => setPermission(result.granted)); else setPermission(true); }, [mode]);
  const requestPermission = async () => { const result = await Camera.requestCameraPermissionsAsync(); setPermission(result.granted); };
  const onNativeLandmark = useCallback((event: NativePoseEvent) => { if (mode !== "camera" || !running) return; const next = parseNativePoseEvent(event); if (next) setNativeFrame(next); }, [mode, running]);
  return { frame: mode === "demo" ? demoFrame : nativeFrame, permission, requestPermission, onNativeLandmark, isReady: mode === "demo" || permission === true };
}
export const poseEstimatorNote = "MediaPipe BlazePose runs natively on iOS and Android; raw frames and landmarks remain on-device.";
