from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.responses import StreamingResponse
import io
import csv

from backend.app.database.db import get_db
from backend.app.models.prediction import Prediction
from backend.app.models.attack import Attack
from backend.app.models.server import Server

router = APIRouter()

def stream_csv(data: list[dict]):
    """Helper function to stream a list of dictionaries as a CSV file."""
    if not data:
        return StreamingResponse(iter(["No data available"]), media_type="text/csv")

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    writer.writerows(data)
    
    response = StreamingResponse(iter([output.getvalue()]), media_type="text/csv")
    output.close()
    return response

@router.get("/threats/csv")
def export_threats_report(db: Session = Depends(get_db)):
    """
    Export a CSV report of all threats.
    """
    query = db.query(
        Prediction.id.label("prediction_id"),
        Prediction.threat_id,
        Attack.attack_type,
        Prediction.created_at.label("timestamp"),
        Prediction.prediction.label("risk_level"),
        Prediction.confidence
    ).join(Attack, Prediction.threat_id == Attack.id, isouter=True).order_by(Prediction.created_at.desc())

    results = query.all()
    
    data = [
        {
            "prediction_id": r.prediction_id,
            "threat_id": r.threat_id,
            "attack_type": r.attack_type or "N/A",
            "timestamp": r.timestamp.isoformat(),
            "risk_level": r.risk_level,
            "confidence": r.confidence,
        }
        for r in results
    ]

    response = stream_csv(data)
    response.headers["Content-Disposition"] = "attachment; filename=threat_report.csv"
    return response

@router.get("/predictions/csv")
def export_predictions_report(db: Session = Depends(get_db)):
    """
    Export a CSV report of all predictions.
    """
    predictions = db.query(Prediction).order_by(Prediction.created_at.desc()).all()
    data = [
        {
            "id": p.id,
            "threat_id": p.threat_id,
            "prediction": p.prediction,
            "confidence": p.confidence,
            "created_at": p.created_at.isoformat(),
        }
        for p in predictions
    ]
    response = stream_csv(data)
    response.headers["Content-Disposition"] = "attachment; filename=prediction_report.csv"
    return response

@router.get("/servers/csv")
def export_servers_report(db: Session = Depends(get_db)):
    """
    Export a CSV report of all servers.
    """
    servers = db.query(Server).order_by(Server.server_name).all()
    data = [
        {
            "id": s.id,
            "server_name": s.server_name,
            "ip_address": s.ip_address,
            "operating_system": s.operating_system,
            "status": s.status,
            "cpu_usage": s.cpu_usage,
            "memory_usage": s.memory_usage,
            "disk_usage": s.disk_usage,
        }
        for s in servers
    ]
    response = stream_csv(data)
    response.headers["Content-Disposition"] = "attachment; filename=server_report.csv"
    return response