from pydantic import BaseModel
from datetime import datetime
from typing import List


class ReportItem(BaseModel):
    prediction_id: int
    threat_id: int
    attack_type: str
    timestamp: datetime
    prediction: str
    confidence: float

    class Config:
        orm_mode = True

class ReportResponse(BaseModel):
    count: int
    reports: List[ReportItem]