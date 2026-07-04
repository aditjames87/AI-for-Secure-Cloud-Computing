from fastapi import APIRouter

from . import auth, users, servers, attacks, cloud_resources, predictions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(servers.router, prefix="/servers", tags=["servers"])
api_router.include_router(
    cloud_resources.router, prefix="/cloud-resources", tags=["cloud-resources"]
)
api_router.include_router(attacks.router, prefix="/attacks", tags=["attacks"])
api_router.include_router(
    predictions.router, prefix="/predictions", tags=["predictions"]
)