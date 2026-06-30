from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.attack import Attack

router = APIRouter(
    prefix="/threats",
    tags=["Threats"]
)

@router.get("/")
def get_threats(db: Session = Depends(get_db)):
    threats = db.query(Attack).all()
    return threats
