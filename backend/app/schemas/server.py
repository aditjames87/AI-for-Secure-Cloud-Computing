from pydantic import BaseModel, Field, ConfigDict
from typing import Optional


class ServerBase(BaseModel):
    server_name: str
    ip_address: str = Field(..., pattern=r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
    operating_system: str


class ServerCreate(ServerBase):
    pass


class ServerUpdate(BaseModel):
    server_name: Optional[str] = None
    ip_address: Optional[str] = Field(None, pattern=r"^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$")
    operating_system: Optional[str] = None


class ServerResponse(ServerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class Server(ServerBase):
    id: int
    status: str
    cpu_usage: float
    memory_usage: float
    disk_usage: float

    class Config:
        from_attributes = True # This is a mock schema for an in-memory endpoint, leaving as-is.