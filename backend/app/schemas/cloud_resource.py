from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class CloudResourceBase(BaseModel):
    name: str
    resource_type: str
    provider: str
    status: Optional[str] = "active"

class CloudResourceCreate(CloudResourceBase):
    pass

class CloudResourceUpdate(CloudResourceBase):
    name: Optional[str]
    resource_type: Optional[str]
    provider: Optional[str]

class CloudResource(CloudResourceBase):
    id: int
    created_at: datetime

    class UserResponse(BaseModel):
        id: int
        username: str
        email: str

        class Config:
            orm_mode = True

    model_config = ConfigDict(from_attributes=True)