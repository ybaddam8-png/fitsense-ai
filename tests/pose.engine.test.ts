import { describe, expect, it } from "vitest";
import { RepEngine } from "@/src/core/engine/RepEngine";
import { demoLandmarksAt } from "@/src/hooks/useDemoLandmarks";
import { angleBetween } from "@/src/core/geometry/vector";

describe("FitSense pose engine", () => {
  it("calculates a right angle from three landmarks", () => {
    expect(Math.round(angleBetween({ x: 0, y: 0, z: 0, visibility: 1 }, { x: 0, y: 1, z: 0, visibility: 1 }, { x: 1, y: 1, z: 0, visibility: 1 }))).toBe(90);
  });

  it("counts deterministic squat repetitions", () => {
    const engine = new RepEngine("squat");
    let last = engine.process(demoLandmarksAt("squat", 0));
    for (let time = 80; time < 9000; time += 80) last = engine.process(demoLandmarksAt("squat", time));
    expect(engine.count).toBeGreaterThan(2);
    expect(last.score).toBeGreaterThan(0);
    expect(last.feedback).toBeTruthy();
  });
});
