export type Landmark = { x: number; y: number; z: number; visibility: number; presence?: number };
export type PoseLandmarks = Landmark[];
export type PoseFrame = { landmarks: PoseLandmarks; timestampMs: number; source: "camera" | "demo" };

export type PosePointName =
  | "nose" | "leftShoulder" | "rightShoulder" | "leftElbow" | "rightElbow"
  | "leftWrist" | "rightWrist" | "leftHip" | "rightHip" | "leftKnee"
  | "rightKnee" | "leftAnkle" | "rightAnkle";

export const LANDMARK_INDEX: Record<PosePointName, number> = {
  nose: 0, leftShoulder: 11, rightShoulder: 12, leftElbow: 13, rightElbow: 14,
  leftWrist: 15, rightWrist: 16, leftHip: 23, rightHip: 24, leftKnee: 25,
  rightKnee: 26, leftAnkle: 27, rightAnkle: 28,
};

export const POSE_CONNECTIONS: ReadonlyArray<[PosePointName, PosePointName]> = [
  ["leftShoulder", "rightShoulder"], ["leftShoulder", "leftElbow"], ["leftElbow", "leftWrist"],
  ["rightShoulder", "rightElbow"], ["rightElbow", "rightWrist"], ["leftShoulder", "leftHip"],
  ["rightShoulder", "rightHip"], ["leftHip", "rightHip"], ["leftHip", "leftKnee"],
  ["leftKnee", "leftAnkle"], ["rightHip", "rightKnee"], ["rightKnee", "rightAnkle"],
];

export type ExerciseId = "squat" | "pushup" | "bicep-curl" | "lunge";
export type ExercisePhase = "ready" | "eccentric" | "concentric";
export type PoseFeedbackTone = "positive" | "warning" | "neutral";

export type ExerciseAnalysis = {
  phase: ExercisePhase;
  repCompleted: boolean;
  score: number;
  feedback: string;
  tone: PoseFeedbackTone;
  metrics: Record<string, number>;
};

export type ExerciseDefinition = {
  id: ExerciseId;
  name: string;
  shortName: string;
  description: string;
  targetReps: number;
  primaryMetric: string;
  requiredLandmarks: PosePointName[];
};

export type WorkoutSummary = {
  id: string;
  exerciseId: ExerciseId;
  startedAt: string;
  endedAt: string;
  reps: number;
  durationSeconds: number;
  averageFormScore: number;
  bestFormScore: number;
  feedbackHighlights: string[];
  source: "camera" | "demo";
};

export type WorkoutSession = {
  id: string;
  exerciseId: ExerciseId;
  startedAt: string;
  elapsedSeconds: number;
  reps: number;
  source: "camera" | "demo";
  formScore: number;
  feedback: string;
  phase: ExercisePhase;
};

export type ActivityDay = { day: string; minutes: number; reps: number };

export function landmark(frame: PoseFrame | PoseLandmarks, name: PosePointName): Landmark | null {
  const points = Array.isArray(frame) ? frame : frame.landmarks;
  return points[LANDMARK_INDEX[name]] ?? null;
}

export function createEmptyLandmarks(): PoseLandmarks {
  return Array.from({ length: 33 }, () => ({ x: 0.5, y: 0.5, z: 0, visibility: 0 }));
}

export function cloneLandmarks(points: PoseLandmarks): PoseLandmarks { return points.map((point) => ({ ...point })); }
export function nowIso(): string { return new Date().toISOString(); }
export function makeId(prefix = "id"): string { return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
export function clamp(value: number, min = 0, max = 100): number { return Math.max(min, Math.min(max, value)); }
export function clampScore(value: number): number { return Math.round(clamp(value)); }
export function average(values: number[]): number { return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0; }
export function round(value: number, decimals = 1): number { const factor = 10 ** decimals; return Math.round(value * factor) / factor; }
export function displayExercise(id: ExerciseId): string { return id === "bicep-curl" ? "Bicep curl" : id.charAt(0).toUpperCase() + id.slice(1); }
export function exerciseTarget(id: ExerciseId): number { return id === "pushup" || id === "lunge" ? 12 : 10; }
export function exerciseColor(id: ExerciseId): string { return id === "squat" ? "#B9F06B" : id === "pushup" ? "#6EE7F2" : id === "bicep-curl" ? "#F7B267" : "#C4B5FD"; }
export function formatSeconds(seconds: number): string { return `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`; }
export function formatScore(score: number): string { return `${Math.round(score)}%`; }
export function dateLabel(iso: string): string { return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(iso)); }
export function titleCase(value: string): string { return value.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()); }
export function isExerciseId(value: string): value is ExerciseId { return ["squat", "pushup", "bicep-curl", "lunge"].includes(value); }
export function asExerciseId(value: unknown): ExerciseId { return typeof value === "string" && isExerciseId(value) ? value : "squat"; }
export function requiredLandmarksFor(id: ExerciseId): PosePointName[] {
  return id === "pushup"
    ? ["leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip"]
    : id === "bicep-curl"
      ? ["leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist"]
      : ["leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"];
}
export function allVisible(frame: PoseFrame, names: PosePointName[], threshold = 0.55): boolean { return names.every((name) => (landmark(frame, name)?.visibility ?? 0) >= threshold); }
export function visibilityAverage(frame: PoseFrame, names: PosePointName[]): number { return average(names.map((name) => landmark(frame, name)?.visibility ?? 0)); }
export function frameConfidence(frame: PoseFrame, id: ExerciseId): number { return visibilityAverage(frame, requiredLandmarksFor(id)); }
export function poseFrame(landmarks: PoseLandmarks, source: PoseFrame["source"], timestampMs = Date.now()): PoseFrame { return { landmarks, source, timestampMs }; }
export function defaultPoseFrame(source: PoseFrame["source"] = "demo"): PoseFrame { return poseFrame(createEmptyLandmarks(), source); }
export function toDateLabel(iso: string): string { return dateLabel(iso); }
export function uniqueFeedback(items: string[]): string[] { return Array.from(new Set(items.filter(Boolean))).slice(0, 4); }
export function safeDate(iso: string): Date { const date = new Date(iso); return Number.isNaN(date.getTime()) ? new Date(0) : date; }
export function sortNewestFirst(workouts: WorkoutSummary[]): WorkoutSummary[] { return [...workouts].sort((a, b) => b.startedAt.localeCompare(a.startedAt)); }
export function totalWorkoutMinutes(workouts: WorkoutSummary[]): number { return Math.round(workouts.reduce((sum, workout) => sum + workout.durationSeconds, 0) / 60); }
export function totalWorkoutReps(workouts: WorkoutSummary[]): number { return workouts.reduce((sum, workout) => sum + workout.reps, 0); }
export function averageWorkoutScore(workouts: WorkoutSummary[]): number { return Math.round(average(workouts.map((workout) => workout.averageFormScore))); }
export function streakCount(workouts: WorkoutSummary[]): number {
  const dates = new Set(workouts.map((workout) => safeDate(workout.startedAt).toISOString().slice(0, 10)));
  let streak = 0; const today = new Date();
  for (let offset = 0; offset < 365; offset += 1) { const date = new Date(today); date.setDate(today.getDate() - offset); if (!dates.has(date.toISOString().slice(0, 10))) break; streak += 1; }
  return streak;
}
export function activityFromWorkouts(workouts: WorkoutSummary[]): ActivityDay[] {
  const labels = ["M", "T", "W", "T", "F", "S", "S"];
  const days = labels.map((day) => ({ day, minutes: 0, reps: 0 }));
  const today = new Date();
  workouts.forEach((workout) => { const date = safeDate(workout.startedAt); const daysAgo = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())) / 86400000); const index = 6 - daysAgo; if (index >= 0 && index < 7) { days[index].minutes += Math.round(workout.durationSeconds / 60); days[index].reps += workout.reps; } });
  return days;
}
export function makeSession(exerciseId: ExerciseId, source: WorkoutSession["source"]): WorkoutSession { return { id: makeId("session"), exerciseId, startedAt: nowIso(), elapsedSeconds: 0, reps: 0, source, formScore: 0, feedback: "Step into frame to begin", phase: "ready" }; }
export function makeSummary(session: WorkoutSession, scores: number[], feedback: string[]): WorkoutSummary { const averageScore = clampScore(average(scores.length ? scores : [session.formScore])); return { id: session.id, exerciseId: session.exerciseId, startedAt: session.startedAt, endedAt: nowIso(), reps: session.reps, durationSeconds: session.elapsedSeconds, averageFormScore: averageScore, bestFormScore: Math.round(Math.max(session.formScore, ...scores, 0)), feedbackHighlights: uniqueFeedback(feedback.length ? feedback : [session.feedback]), source: session.source }; }
export function emptyAnalysis(exerciseId: ExerciseId): ExerciseAnalysis { return { phase: "ready", repCompleted: false, score: 0, feedback: `Prepare for ${displayExercise(exerciseId).toLowerCase()}`, tone: "neutral", metrics: {} }; }
export function scoreTone(score: number): PoseFeedbackTone { return score >= 80 ? "positive" : score >= 60 ? "neutral" : "warning"; }
export function scoreColor(score: number): string { return score >= 80 ? "#B9F06B" : score >= 60 ? "#F7B267" : "#F87171"; }
export function phaseColor(phase: ExercisePhase): string { return phase === "eccentric" ? "#F7B267" : phase === "concentric" ? "#B9F06B" : "#9CA3AF"; }
export function displayPhase(phase: ExercisePhase): string { return phase === "eccentric" ? "Lower" : phase === "concentric" ? "Rise" : "Ready"; }
export function safeNumber(value: unknown, fallback = 0): number { return typeof value === "number" && Number.isFinite(value) ? value : fallback; }
export function parseWorkoutSummary(value: unknown): WorkoutSummary | null { if (!value || typeof value !== "object") return null; const item = value as Partial<WorkoutSummary>; if (typeof item.id !== "string" || !isExerciseId(item.exerciseId ?? "")) return null; return { id: item.id, exerciseId: item.exerciseId as ExerciseId, startedAt: typeof item.startedAt === "string" ? item.startedAt : nowIso(), endedAt: typeof item.endedAt === "string" ? item.endedAt : nowIso(), reps: safeNumber(item.reps), durationSeconds: safeNumber(item.durationSeconds), averageFormScore: safeNumber(item.averageFormScore), bestFormScore: safeNumber(item.bestFormScore), feedbackHighlights: Array.isArray(item.feedbackHighlights) ? item.feedbackHighlights.filter((entry): entry is string => typeof entry === "string") : [], source: item.source === "camera" ? "camera" : "demo" }; }
export function parseWorkoutSummaries(value: unknown): WorkoutSummary[] { return Array.isArray(value) ? value.map(parseWorkoutSummary).filter((item): item is WorkoutSummary => Boolean(item)) : []; }
export function storageKey(userId = "local"): string { return `fitsense:${userId}:workouts`; }
export function profileStorageKey(userId = "local"): string { return `fitsense:${userId}:profile`; }
export function currentWeekLabels(): string[] { return ["M", "T", "W", "T", "F", "S", "S"]; }
export function currentActivityMinutes(activity: ActivityDay[]): number { return activity.reduce((sum, day) => sum + day.minutes, 0); }
export function goalProgress(activity: ActivityDay[], goal = 90): number { return Math.min(1, currentActivityMinutes(activity) / goal); }
export function normalizeLandmarks(raw: Array<Partial<Landmark>>): PoseLandmarks { return Array.from({ length: 33 }, (_, index) => ({ x: raw[index]?.x ?? 0.5, y: raw[index]?.y ?? 0.5, z: raw[index]?.z ?? 0, visibility: raw[index]?.visibility ?? raw[index]?.presence ?? 0 })); }
export function cloneFrame(frame: PoseFrame): PoseFrame { return { ...frame, landmarks: cloneLandmarks(frame.landmarks) }; }
export function formatDuration(seconds: number): string { return formatSeconds(seconds); }
export function requiredPoseHint(id: ExerciseId): string { return id === "pushup" ? "Side-on view works best" : "Full body in frame"; }
export function focusHint(id: ExerciseId): string { return id === "squat" ? "Track knees over toes" : id === "pushup" ? "Keep hips in line" : id === "bicep-curl" ? "Keep elbows close" : "Drive through the front foot"; }
export function exerciseSubtitle(id: ExerciseId): string { return id === "squat" ? "Lower body strength" : id === "pushup" ? "Upper body control" : id === "bicep-curl" ? "Arm strength" : "Single-leg stability"; }
export function exerciseIcon(id: ExerciseId): string { return id === "squat" ? "fitness-center" : id === "pushup" ? "self-improvement" : id === "bicep-curl" ? "sports-handball" : "directions-run"; }
export function legalCopy(): string { return "FitSense provides movement guidance, not medical advice."; }
export function privacyCopy(): string { return "Pose coordinates stay on-device. The optional backend receives workout summaries only."; }
export function demoCopy(): string { return "Demo Mode uses a deterministic landmark stream; no camera or network is required."; }
export function appTagline(): string { return "Move better. Train smarter."; }
export function greeting(hour = new Date().getHours()): string { return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"; }
export function firstName(name: string): string { return name.trim().split(/\s+/)[0] || "Athlete"; }
export function summaryCount(workouts: WorkoutSummary[]): string { return `${workouts.length} ${workouts.length === 1 ? "session" : "sessions"}`; }
export function formLabel(score: number): string { return `${Math.round(score)}% form`; }
export function durationLabel(seconds: number): string { return seconds < 60 ? `${Math.round(seconds)} sec` : `${Math.floor(seconds / 60)} min`; }
export function workoutDescription(summary: WorkoutSummary): string { return `${dateLabel(summary.startedAt)} · ${summary.reps} reps · ${formLabel(summary.averageFormScore)}`; }
export function defaultProfile(): { displayName: string; goal: string; createdAt: string } { return { displayName: "Alex", goal: "Move with confidence", createdAt: nowIso() }; }
export function initials(name: string): string { return firstName(name).slice(0, 2).toUpperCase(); }
export function goalMinutes(): number { return 90; }
export function noSessionsBody(): string { return "Complete a two-minute Demo Mode session and your movement story will appear here."; }
export function exportRows(workouts: WorkoutSummary[]): Array<Record<string, string | number>> { return workouts.map((workout) => ({ id: workout.id, exercise: displayExercise(workout.exerciseId), reps: workout.reps, durationSeconds: workout.durationSeconds, averageFormScore: workout.averageFormScore, source: workout.source, startedAt: workout.startedAt })); }
export function exportJson(workouts: WorkoutSummary[]): string { return JSON.stringify(exportRows(workouts)); }
export function workoutRoute(id: ExerciseId, mode: "camera" | "demo"): string { return `/live-workout?exerciseId=${id}&mode=${mode}`; }
export function parseMode(value: unknown): "camera" | "demo" { return value === "camera" ? "camera" : "demo"; }
export function parseExercise(value: unknown): ExerciseId { return asExerciseId(value); }
export function currentDateKey(date = new Date()): string { return date.toISOString().slice(0, 10); }
export function isSameDay(iso: string, date = new Date()): boolean { return safeDate(iso).toISOString().slice(0, 10) === currentDateKey(date); }
export function trendCopy(workouts: WorkoutSummary[]): string { return workouts.length > 1 ? "Your consistency is building" : "Your first session sets the baseline"; }
export function insightCopy(workouts: WorkoutSummary[]): string { return workouts.length ? `Your average form is ${averageWorkoutScore(workouts)}%. Keep your range consistent.` : "I’ll watch the details so you can focus on the work."; }
export function toPercent(value: number): number { return value <= 1 ? value * 100 : value; }
export function progressPercent(reps: number, target: number): number { return Math.round(Math.min(1, reps / Math.max(1, target)) * 100); }
export function completionText(reps: number, target: number): string { return reps >= target ? "Target reached" : `${Math.max(0, target - reps)} to go`; }
export function validateFrame(frame: PoseFrame): boolean { return frame.landmarks.length === 33 && frame.landmarks.every((point) => [point.x, point.y, point.z, point.visibility].every(Number.isFinite)); }
export function makeTestFrame(points: Partial<Record<PosePointName, Landmark>>): PoseFrame { const landmarks = createEmptyLandmarks(); Object.entries(points).forEach(([name, point]) => { if (point) landmarks[LANDMARK_INDEX[name as PosePointName]] = point; }); return poseFrame(landmarks, "demo"); }
export function testLandmark(x: number, y: number, visibility = 1): Landmark { return { x, y, z: 0, visibility }; }
export function daysAgo(iso: string): number { return Math.floor((Date.now() - safeDate(iso).getTime()) / 86400000); }
export function relativeDate(iso: string): string { const days = daysAgo(iso); return days <= 0 ? "Today" : days === 1 ? "Yesterday" : `${days} days ago`; }
export function emptyActivity(): ActivityDay[] { return currentWeekLabels().map((day) => ({ day, minutes: 0, reps: 0 })); }
export function safeActivity(workouts: WorkoutSummary[]): ActivityDay[] { return activityFromWorkouts(workouts); }
export function displayMode(mode: "camera" | "demo"): string { return mode === "demo" ? "Demo Mode" : "Live camera"; }
export function sourceLabel(source: WorkoutSummary["source"]): string { return source === "demo" ? "Demo" : "Camera"; }
export function statusLabel(phase: ExercisePhase, score: number): string { return `${displayPhase(phase)} · ${formatScore(score)}`; }
export function colorForTone(tone: PoseFeedbackTone): string { return tone === "positive" ? "#B9F06B" : tone === "warning" ? "#F7B267" : "#D1D5DB"; }
export function phaseLabel(phase: ExercisePhase): string { return phase === "eccentric" ? "Lower" : phase === "concentric" ? "Rise" : "Ready"; }
export function feedbackForScore(score: number): string { return score >= 90 ? "Excellent control" : score >= 75 ? "Nice form" : score >= 60 ? "Keep your rhythm" : "Adjust your alignment"; }
export function normaliseName(value: string): string { return value.trim().replace(/\s+/g, " "); }
export function appVersion(): string { return "0.1.0"; }
export function versionLabel(): string { return `Version ${appVersion()}`; }
export function backendNote(): string { return "FastAPI sync receives summaries only; camera frames never leave the device."; }
export function engineNote(): string { return "Angles, vectors, smoothing, and hysteresis drive every rep."; }
export function mediaPipeNote(): string { return "MediaPipe Pose Landmarker adapter is ready for an Expo development build."; }
export function isDemo(source: PoseFrame["source"]): boolean { return source === "demo"; }
export function safeText(value: unknown, fallback = ""): string { return typeof value === "string" ? value : fallback; }
export function parseJson<T>(value: string, fallback: T): T { try { return JSON.parse(value) as T; } catch { return fallback; } }
export function stringifyJson(value: unknown): string { return JSON.stringify(value); }
export function isRecord(value: unknown): value is Record<string, unknown> { return Boolean(value && typeof value === "object" && !Array.isArray(value)); }
export function isFiniteNumber(value: unknown): value is number { return typeof value === "number" && Number.isFinite(value); }
export function noop(): void { return undefined; }
export function summaryStats(workouts: WorkoutSummary[]): { sessions: number; reps: number; minutes: number; score: number } { return { sessions: workouts.length, reps: totalWorkoutReps(workouts), minutes: totalWorkoutMinutes(workouts), score: averageWorkoutScore(workouts) }; }
