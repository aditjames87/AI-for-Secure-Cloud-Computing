from pydantic import BaseModel, ConfigDict


class ServerBase(BaseModel):
    server_name: str
    ip_address: str
    operating_system: str


class ServerCreate(ServerBase):
    pass


class ServerUpdate(BaseModel):
    cpu_usage: float
    memory_usage: float
    storage_usage: float
    network_usage: float
    status: str


class ServerResponse(ServerBase):
    id: int
    cpu_usage: float
    memory_usage: float
    storage_usage: float
    network_usage: float
    status: str

    model_config = ConfigDict(from_attributes=True)