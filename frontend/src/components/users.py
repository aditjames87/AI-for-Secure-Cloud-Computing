from fastapi import APIRouter, Depends, HTTPException
from backend.app import schemas

router = APIRouter()

# This is a mock user and dependency. In a real app, this would come from
# your authentication logic (e.g., decoding a JWT token).
mock_current_user = schemas.User(id=1, email="user@example.com", name="Default User")

async def get_current_user() -> schemas.User:
    """
    Mock dependency to get the current authenticated user.
    """
    return mock_current_user


@router.get("/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    """
    Get current user's profile.
    """
    return current_user


@router.put("/me", response_model=schemas.User)
async def update_user_me(
    user_update: schemas.UserUpdate,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Update current user's name.
    """
    # In a real app, you would update the user in the database.
    mock_current_user.name = user_update.name
    return mock_current_user


@router.put("/me/password")
async def update_password_me(
    password_update: schemas.PasswordUpdate,
    current_user: schemas.User = Depends(get_current_user)
):
    """
    Update current user's password.
    """
    # In a real app, you would verify the current_password and then hash and save the new_password.
    if password_update.current_password != "current_password_placeholder":
        raise HTTPException(status_code=401, detail="Incorrect current password")
    
    print(f"User {current_user.email} password updated successfully.")
    
    return {"message": "Password updated successfully"}