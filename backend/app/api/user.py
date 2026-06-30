from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.user import User
from schemas.user import UserCreate, UserResponse
from security.password import hash_password
from api.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.post("/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create new user
    db_user = User(
        name=user.name,
        email=user.email,
        password=hashed_password,
    )

    # Save to database
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user