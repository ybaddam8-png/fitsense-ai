from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .db.database import init_db
from .api.v1.health import router as health_router
from .api.v1.workouts import router as workouts_router

app = FastAPI(title=settings.app_name, version="1.0.0", description="Summary sync and analytics export for FitSense AI. Camera frames stay on-device.")
app.add_middleware(CORSMiddleware, allow_origins=settings.allowed_origins.split(","), allow_credentials=False, allow_methods=["GET", "POST"], allow_headers=["*"])
app.include_router(health_router)
app.include_router(workouts_router, prefix="/api/v1")

@app.on_event("startup")
def startup() -> None:
    init_db()

@app.get("/")
def root() -> dict[str, str]:
    return {"service": settings.app_name, "docs": "/docs", "privacy": "No camera frames are accepted."}
