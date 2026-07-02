from fastapi import APIRouter
from backend.app.api.v1.endpoints import dashboard, servers

api_router = APIRouter()
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(servers.router, prefix="/servers", tags=["servers"])