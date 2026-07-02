from fastapi import APIRouter
from backend.app.api.v1.endpoints import dashboard, servers, threats, predictions, notifications, reports, users

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(servers.router, prefix="/servers", tags=["servers"])
api_router.include_router(threats.router, prefix="/threats", tags=["threats"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["predictions"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["notifications"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(users.router, prefix="/users", tags=["users"])