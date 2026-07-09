from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db
from app.models.prediction import Prediction
from app.models.server import Server
from app.models.attack import Attack
from app.models.resource import CloudResource

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

# ==========================
# Dashboard KPIs
# ==========================
@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):

    total_servers = db.query(Server).count()

    active_servers = db.query(Server).filter(
        Server.status == "active"
    ).count()

    offline_servers = db.query(Server).filter(
        Server.status == "offline"
    ).count()

    total_threats = db.query(Attack).count()

    avg_cpu = db.query(func.avg(Server.cpu_usage)).scalar() or 0
    avg_memory = db.query(func.avg(Server.memory_usage)).scalar() or 0
    avg_storage = db.query(func.avg(Server.storage_usage)).scalar() or 0
    avg_network = db.query(func.avg(Server.network_usage)).scalar() or 0

    high_risk = (
        db.query(Prediction)
        .filter(Prediction.prediction == "HIGH_RISK")
        .count()
    )

    print("Total Servers:", total_servers)
    print("Active Servers:", active_servers)
    print("Offline Servers:", offline_servers)

    servers = db.query(Server).all()

    for server in servers:
        print(server.server_name, server.status)

    return {
        "total_servers": total_servers,
        "active_servers": active_servers,
        "offline_servers": offline_servers,
        "total_threats": total_threats,
        "cpu_usage": round(avg_cpu, 2),
        "memory_usage": round(avg_memory, 2),
        "storage_usage": round(avg_storage, 2),
        "network_usage": round(avg_network, 2),
        "prediction_accuracy": 97,
        "high_risk_alerts": high_risk,
    }
        
        

# ==========================
# Threat History Chart
# ==========================
@router.get("/threat-history")
def get_threat_history():

    return [
        {"day": "Mon", "threats": 5},
        {"day": "Tue", "threats": 8},
        {"day": "Wed", "threats": 12},
        {"day": "Thu", "threats": 7},
        {"day": "Fri", "threats": 3},
        {"day": "Sat", "threats": 0},
        {"day": "Sun", "threats": 0},
    ]


# ==========================
# Cloud Usage Chart
# ==========================
@router.get("/cloud-usage")
def get_cloud_usage(db: Session = Depends(get_db)):

    avg_cpu = db.query(func.avg(CloudResource.cpu)).scalar() or 0
    avg_memory = db.query(func.avg(CloudResource.memory)).scalar() or 0
    avg_storage = db.query(func.avg(CloudResource.storage)).scalar() or 0
    avg_network = db.query(func.avg(CloudResource.network)).scalar() or 0

    return [
        {"resource": "CPU", "value": round(avg_cpu, 2)},
        {"resource": "Memory", "value": round(avg_memory, 2)},
        {"resource": "Storage", "value": round(avg_storage, 2)},
        {"resource": "Network", "value": round(avg_network, 2)},
    ]


# ==========================
# Prediction Distribution Chart (FIXED)
# ==========================
@router.get("/prediction-distribution")
def get_prediction_distribution(db: Session = Depends(get_db)):

    distribution = (
        db.query(
            Prediction.prediction,
            func.count(Prediction.id)
        )
        .group_by(Prediction.prediction)
        .all()
    )

    # FIX 1: handle empty DB safely
    if not distribution:
        return [
            {"name": "High Risk", "value": 0},
            {"name": "Medium Risk", "value": 0},
            {"name": "Low Risk", "value": 0},
        ]

    # FIX 2: normalize output (frontend-safe)
    return [
        {
            "name": prediction or "Unknown",
            "value": count or 0
        }
        for prediction, count in distribution
    ]