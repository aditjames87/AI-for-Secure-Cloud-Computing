from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.user import User

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/")
def get_dashboard_stats(db: Session = Depends(get_db)):
    user_count = db.query(User).count()
    return {"users": user_count}
