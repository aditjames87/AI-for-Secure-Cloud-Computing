from pydantic import BaseModel
from typing import List, Dict
import datetime

class StatCards(BaseModel):
    total_servers: int
    total_threats: int
    high_risk_threats: int
    predictions_today: int
    avg_prediction_confidence: float


class RecentThreat(BaseModel):
    id: int
    server_name: str
    threat_type: str
    risk_level: str
    timestamp: datetime.datetime


class ChartDataPoint(BaseModel):
    name: str
    value: float


class TimeSeriesDataPoint(BaseModel):
    date: str
    count: int


class DashboardStats(BaseModel):
    stats: StatCards
    recent_threats: List[RecentThreat]
    cloud_usage: List[ChartDataPoint]
    threat_trend: List[TimeSeriesDataPoint]
    prediction_history: List[TimeSeriesDataPoint]