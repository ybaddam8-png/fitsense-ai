import { describe, expect, it } from "vitest";
import { parseNativePoseEvent } from "@/src/core/pose/nativeMapper";
function landmarks() { return Array.from({ length: 33 }, (_, index) => ({ x: index / 32, y: 0.25, z: -0.1, visibility: 0.9, presence: 0.9 })); }
describe("native MediaPipe mapper", () => {
  it("maps Android JSON event payloads into a camera pose frame", () => { const frame = parseNativePoseEvent(JSON.stringify({ landmarks: landmarks(), additionalData: { width: 720, height: 1280 } }), 123); expect(frame?.source).toBe("camera"); expect(frame?.timestampMs).toBe(123); expect(frame?.landmarks).toHaveLength(33); expect(frame?.landmarks[11].x).toBeCloseTo(11 / 32); });
  it("accepts MediaPipe multi-pose array shape and rejects incomplete detections", () => { expect(parseNativePoseEvent({ landmarks: [landmarks()] })).not.toBeNull(); expect(parseNativePoseEvent({ landmarks: landmarks().slice(0, 10) })).toBeNull(); expect(parseNativePoseEvent("not json")).toBeNull(); });
});
