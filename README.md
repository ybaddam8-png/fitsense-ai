# FitSense AI

FitSense AI is an offline-first Expo mobile app for explainable movement coaching. Demo Mode uses deterministic normalized landmarks; native camera mode uses a bundled MediaPipe BlazePose task model through `@thinksys/react-native-mediapipe`. Camera frames and raw landmarks stay on-device. Only completed workout summaries may be synchronized after OAuth authentication.

## Mobile app

```bash
pnpm install
pnpm dev
```

The web preview supports Home, Demo Mode, local history, profile settings, and the camera permission state. The native MediaPipe camera requires a development build; it is not available in Expo Go because the native view module must be compiled into the app.

```bash
npx expo prebuild
npx expo run:android
# On macOS with Xcode:
npx expo run:ios
```

The native configuration sets iOS camera usage text, iOS deployment compatibility, Android camera permission, Android minimum SDK 26, and the legacy React Native bridge required by the selected native MediaPipe view. The bundled `pose_landmarker_full.task` model is shipped by the native dependency.

## Authenticated cross-device sync

OAuth is initiated from **Profile → Sign in to sync**. Native sessions are stored in Expo SecureStore, while the existing web flow uses the server cookie. Protected tRPC procedures write and list summaries in the `workouts` table under the authenticated user. Local summaries remain available without an account; the profile sync action pushes local records, pulls remote records, merges by client workout ID, and persists the merged set locally.

The API base URL for native builds should be supplied with `EXPO_PUBLIC_API_BASE_URL` in the build environment. The tRPC client attaches the native bearer session token automatically. Sync payloads contain exercise, timestamps, reps, duration, scores, feedback highlights, and source only; no frames or landmark arrays are included.

## FastAPI service

The separate FastAPI service remains available for local summary storage and analytics experiments:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run tests with `pytest backend/tests`. The production mobile sync path uses the Expo app's protected tRPC server procedures and Drizzle `workouts` table instead of this optional service.

## Architecture

- `src/core/geometry`: vector, joint-angle, and smoothing helpers.
- `src/core/engine`: form analyzer and rep state machine.
- `src/core/exercises`: squat, push-up, curl, and lunge rules.
- `src/core/pose/nativeMapper.ts`: converts native MediaPipe event payloads into the shared 33-point pose frame.
- `src/hooks`: demo landmark stream and camera estimator adapter.
- `src/components/camera/NativePoseCamera.native.tsx`: iOS/Android MediaPipe view wrapper.
- `src/components/camera/NativePoseCamera.web.tsx`: web-safe camera fallback.
- `src/services/database`: native SQLite plus web AsyncStorage fallback.
- `src/services/sync`: protected tRPC summary sync and local/remote merge.
- `server/routers.ts`, `server/db.ts`, and `drizzle/schema.ts`: authenticated workout synchronization contract and persistence.
- `docs/native-qa.md`: native permission, build, and accessibility QA record.

This is movement guidance software, not medical advice. It should not be used to diagnose injury or replace a qualified professional.
