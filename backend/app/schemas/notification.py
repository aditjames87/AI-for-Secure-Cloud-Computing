from pydantic import BaseModel
from typing import List
import datetime


class Notification(BaseModel):
    id: int
    title: str
    description: str
    risk_level: str  # e.g., 'High', 'Medium', 'Low'
    read: bool
    created_at: datetime.datetime


class NotificationsResponse(BaseModel):
    unread_count: int
    notifications: List[Notification]