import type { Landmark, PoseFrame, PoseLandmarks } from "@/src/types/pose";
import { createEmptyLandmarks, poseFrame } from "@/src/types/pose";
export type NativePoseEvent = unknown;
function asObject(value: unknown): Record<string, unknown> | null { return value && typeof value === "object" ? value as Record<string, unknown> : null; }
function asNumber(value: unknown, fallback = 0): number { return typeof value === "number" && Number.isFinite(value) ? value : fallback; }
function normalizePoint(value: unknown): Landmark | null { const item = asObject(value); if (!item) return null; return { x: asNumber(item.x, 0.5), y: asNumber(item.y, 0.5), z: asNumber(item.z), visibility: asNumber(item.visibility, asNumber(item.presence)) }; }
export function parseNativePoseEvent(event: NativePoseEvent, timestampMs = Date.now()): PoseFrame | null {
  let payload: unknown = event;
  if (typeof payload === "string") { try { payload = JSON.parse(payload); } catch { return null; } }
  const object = asObject(payload); const raw = object?.landmarks; const first = Array.isArray(raw) && Array.isArray(raw[0]) ? raw[0] : raw;
  if (!Array.isArray(first) || first.length < 33) return null;
  const landmarks: PoseLandmarks = createEmptyLandmarks(); first.slice(0, 33).forEach((point, index) => { const normalized = normalizePoint(point); if (normalized) landmarks[index] = normalized; });
  const visibleCount = landmarks.filter((point) => point.visibility > 0).length;
  return visibleCount >= 13 ? poseFrame(landmarks, "camera", timestampMs) : null;
}
export function nativePoseEventToLandmarks(event: NativePoseEvent): PoseLandmarks | null { return parseNativePoseEvent(event)?.landmarks ?? null; }
export const nativeModelName = "MediaPipe BlazePose full · bundled native task model";
