from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime, date

from app.database.db import get_db
from app.models.prediction import Prediction
from app.models.attack import Attack
from app.schemas.report import ReportItem, ReportResponse

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)

@router.get("/", response_model=ReportResponse)
def get_reports(
    start_date: Optional[date] = Query(None, description="Filter reports from this date"),
    end_date: Optional[date] = Query(None, description="Filter reports up to this date"),
    db: Session = Depends(get_db),
):
    """
    Retrieve a report of all threat predictions, with optional date filtering.
    """
    query = db.query(
        Prediction.id.label("prediction_id"),
        Prediction.threat_id,
        Attack.attack_type,
        Prediction.created_at.label("timestamp"),
        Prediction.prediction,
        Prediction.confidence
    ).join(Attack, Prediction.threat_id == Attack.id)

    if start_date:
        query = query.filter(Prediction.created_at >= datetime.combine(start_date, datetime.min.time()))
    
    if end_date:
        query = query.filter(Prediction.created_at <= datetime.combine(end_date, datetime.max.time()))

    results = query.order_by(Prediction.created_at.desc()).all()

    # The results are tuples, so we map them to our Pydantic model
    report_items = [ReportItem.from_orm(row) for row in results]

    return {
        "count": len(report_items),
        "reports": report_items
    }