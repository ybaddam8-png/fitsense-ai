# FitSense AI

FitSense AI is an offline-first Expo mobile app for explainable movement coaching. The app uses a deterministic pose stream in Demo Mode and keeps the pose-processing boundary ready for MediaPipe Pose Landmarker camera inference. Camera frames and raw landmarks are never sent to the API.

## Mobile app

```bash
pnpm install
pnpm dev
```

The most useful route for evaluating the product is **Demo Mode**: Home → Start a workout → Demo → Start Demo Mode. The engine runs on normalized landmarks, applies angle-based form rules, smooths temporal noise, advances through a rep state machine, and stores only the completed workout summary in local SQLite (or AsyncStorage on web).

## FastAPI service

The service is intentionally limited to optional summary sync and analytics export:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Run tests with `pytest backend/tests`. The service exposes `/health`, `GET /api/v1/workouts`, `POST /api/v1/workouts`, `GET /api/v1/workouts/{id}`, and `GET /api/v1/workouts/analytics`.

## Architecture

- `src/core/geometry`: vector, joint-angle, and smoothing helpers.
- `src/core/engine`: form analyzer and rep state machine.
- `src/core/exercises`: squat, push-up, curl, and lunge rules.
- `src/hooks`: demo landmark stream and camera estimator adapter.
- `src/services/database`: native SQLite plus web fallback.
- `src/services/sync`: optional summary-only sync.
- `backend/app`: FastAPI summary storage and analytics.

This is movement guidance software, not medical advice. It should not be used to diagnose injury or replace a qualified professional.
