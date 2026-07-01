from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ThreatBase(BaseModel):
    attack_type: str
    source_ip: str
    destination_ip: str
    severity: str
    status: str


class ThreatCreate(ThreatBase):
    user_id: int


class ThreatUpdate(BaseModel):
    severity: str
    status: str


class ThreatResponse(ThreatBase):
    id: int
    user_id: int
    timestamp: datetime

    model_config = ConfigDict(from_attributes=True)