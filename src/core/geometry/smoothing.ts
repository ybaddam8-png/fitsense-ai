import type { Landmark, PoseLandmarks } from "@/src/types/pose";
import { median, smooth } from "./vector";
export class ExponentialSmoother { private value: number | null = null; constructor(private readonly alpha = 0.35) {} update(next: number): number { this.value = this.value === null ? next : smooth(this.value, next, this.alpha); return this.value; } reset(): void { this.value = null; } }
export class LandmarkSmoother { private values: PoseLandmarks | null = null; constructor(private readonly alpha = 0.35) {} update(next: PoseLandmarks): PoseLandmarks { if (!this.values) { this.values = next.map((point) => ({ ...point })); return this.values; } this.values = next.map((point, index) => { const previous = this.values![index]; return { x: smooth(previous.x, point.x, this.alpha), y: smooth(previous.y, point.y, this.alpha), z: smooth(previous.z, point.z, this.alpha), visibility: smooth(previous.visibility, point.visibility, this.alpha) }; }); return this.values; } reset(): void { this.values = null; } }
export class MedianFilter { private values: number[] = []; constructor(private readonly size = 5) {} update(next: number): number { this.values = [...this.values, next].slice(-this.size); return median(this.values); } reset(): void { this.values = []; } }
export const smoothLandmark = (previous: Landmark, next: Landmark, alpha = 0.35): Landmark => ({ x: smooth(previous.x, next.x, alpha), y: smooth(previous.y, next.y, alpha), z: smooth(previous.z, next.z, alpha), visibility: smooth(previous.visibility, next.visibility, alpha) });
export const smoothLandmarks = (previous: PoseLandmarks, next: PoseLandmarks, alpha = 0.35): PoseLandmarks => next.map((point, index) => smoothLandmark(previous[index] ?? point, point, alpha));
export const deadband = (value: number, threshold: number): number => Math.abs(value) < threshold ? 0 : value;
export const hysteresis = (value: number, low: number, high: number, active: boolean): boolean => active ? value > low : value >= high;
export const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));
export const normalize = (value: number, min: number, max: number): number => max === min ? 0 : clamp((value - min) / (max - min), 0, 1);
export const denormalize = (value: number, min: number, max: number): number => min + normalize(value, 0, 1) * (max - min);
export const ema = (previous: number, next: number, alpha = 0.35): number => smooth(previous, next, alpha);
export const movingAverage = (values: number[]): number => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
export const lastValue = <T>(values: T[]): T | undefined => values[values.length - 1];
