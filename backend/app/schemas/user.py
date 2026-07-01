from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# ==========================
# User Base
# ==========================
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str = "user"
    is_active: bool = True


# ==========================
# Create User
# ==========================
class UserCreate(UserBase):
    password: str


# ==========================
# Update User
# ==========================
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


# ==========================
# Response Model
# ==========================
class UserResponse(UserBase):
    id: int
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


# ==========================
# Login Token
# ==========================
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ==========================
# Token Data
# ==========================
class TokenData(BaseModel):
    email: Optional[str] = None