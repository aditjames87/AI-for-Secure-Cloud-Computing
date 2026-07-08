from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.security.password import hash_password
from app.api.auth import get_current_user
from app.security.jwt_handler import (
    create_access_token,
    get_current_user,
)
router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


# ==========================================
# Create User
# ==========================================
@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session =Depends(get_db)
):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    db_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
        is_active=user.is_active,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user


# ==========================================
# Current Logged-in User
# ==========================================
@router.get("/me", response_model=UserResponse) # This endpoint is distinct from the mock one in the context
def get_current_logged_user(
    current_user: User = Depends(get_current_user),
):
    return current_user


# ==========================================
# Get All Users
# ==========================================
@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db),
):

    return db.query(User).all()


# ==========================================
# Get User By ID
# ==========================================
@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    return user


# ==========================================
# Delete User
# ==========================================
@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
):

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully."
    }