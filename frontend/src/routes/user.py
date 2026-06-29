from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db import get_db
from models.user import User
from schemas.user import UserCreate

router = APIRouter()

@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user