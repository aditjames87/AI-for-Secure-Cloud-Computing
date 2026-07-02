from fastapi import APIRouter, HTTPException
from typing import List
import datetime
import random

from backend.app import schemas

router = APIRouter()

# In-memory "database" for demonstration
db_notifications: List[schemas.Notification] = [
    schemas.Notification(id=1, title="High Risk Threat Detected", description="SQL Injection attempt on prod-db-1.", risk_level="High", read=False, created_at=datetime.datetime.now() - datetime.timedelta(minutes=5)),
    schemas.Notification(id=2, title="Server Offline", description="prod-web-3 is unresponsive.", risk_level="Medium", read=False, created_at=datetime.datetime.now() - datetime.timedelta(hours=1)),
    schemas.Notification(id=3, title="Unusual Login Activity", description="Multiple failed login attempts for user 'admin'.", risk_level="Medium", read=True, created_at=datetime.datetime.now() - datetime.timedelta(hours=3)),
    schemas.Notification(id=4, title="System Update", description="All dev servers will be updated tonight at 2 AM.", risk_level="Low", read=True, created_at=datetime.datetime.now() - datetime.timedelta(days=1)),
    schemas.Notification(id=5, title="Critical Vulnerability Found", description="Log4j vulnerability detected on staging-api-1.", risk_level="High", read=False, created_at=datetime.datetime.now() - datetime.timedelta(minutes=15)),
]


@router.get("/", response_model=schemas.NotificationsResponse)
def get_notifications():
    """
    Retrieve all notifications and the count of unread ones.
    """
    unread_count = len([n for n in db_notifications if not n.read])
    return schemas.NotificationsResponse(
        unread_count=unread_count,
        notifications=sorted(db_notifications, key=lambda n: n.created_at, reverse=True)
    )


@router.post("/{notification_id}/read", response_model=schemas.Notification)
def mark_as_read(notification_id: int):
    """
    Mark a single notification as read.
    """
    notification = next((n for n in db_notifications if n.id == notification_id), None)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    notification.read = True
    return notification


@router.post("/read-all", status_code=200)
def mark_all_as_read():
    """
    Mark all notifications as read.
    """
    for n in db_notifications:
        n.read = True
    
    # In a real app, you'd return the updated list or a success message.
    # For this demo, we'll just return a success status.
    return {"message": "All notifications marked as read"}