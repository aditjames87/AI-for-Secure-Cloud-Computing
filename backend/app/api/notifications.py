from fastapi import APIRouter

router = APIRouter(
    prefix="/api/v1/notifications",
    tags=["Notifications"],
)

@router.get("/")
def get_notifications():
    return [
        {
            "id": 1,
            "title": "Threat Detected",
            "message": "High Risk attack detected.",
            "read": False,
        },
        {
            "id": 2,
            "title": "Server Alert",
            "message": "CPU usage exceeded 90%.",
            "read": True,
        },
    ]