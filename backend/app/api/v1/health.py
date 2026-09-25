from fastapi import APIRouter
from ...config import settings
from ...models.schemas import HealthOut
router = APIRouter(tags=["health"])
@router.get("/health", response_model=HealthOut)
def health() -> HealthOut:
    return HealthOut(status="ok", service=settings.app_name, storage="sqlite")
