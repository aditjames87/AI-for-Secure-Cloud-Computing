from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
import datetime


class ThreatBase(BaseModel):
    attack_type: str
    source_ip: str
    destination_ip: str
    severity: str
    status: str
    user_id: int


class ThreatCreate(ThreatBase):
    pass


class ThreatUpdate(BaseModel):
    severity: str
    status: str


class ThreatResponse(ThreatBase):
    id: int
    timestamp: datetime.datetime
    model_config = ConfigDict(from_attributes=True)


class Threat(BaseModel):
    id: int
    server_name: str
    threat_type: str
    risk_level: str
    timestamp: datetime.datetime
    status: str
    source_ip: str
    description: str
    details: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)


class ThreatFilters(BaseModel):
    search: Optional[str] = None
    risk_level: Optional[str] = Field(None, description="Filter by risk level (e.g., High, Medium, Low)")
    status: Optional[str] = Field(None, description="Filter by status (e.g., New, Resolved)")


class PaginatedThreats(BaseModel):
    total: int
    threats: list[Threat]