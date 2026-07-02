from fastapi import APIRouter, HTTPException, Depends
from typing import List
import datetime
import random

from backend.app import schemas

router = APIRouter()

# In-memory "database" for demonstration
db_threats: List[schemas.Threat] = [
    schemas.Threat(
        id=i,
        server_name=random.choice(["prod-web-1", "prod-db-1", "api-gateway", "auth-service"]),
        threat_type=random.choice(["SQL Injection", "XSS", "DDoS Attempt", "Brute Force", "Malware"]),
        risk_level=random.choice(["Low", "Medium", "High", "Critical"]),
        timestamp=datetime.datetime.now() - datetime.timedelta(days=random.randint(0, 30)),
        status=random.choice(["New", "Investigating", "Resolved"]),
        source_ip=f"192.168.1.{random.randint(10, 200)}",
        description=f"Detected potential threat activity of type {random.choice(['SQLi', 'XSS'])}.",
        details={"user_agent": "Mozilla/5.0...", "request_path": "/login"}
    ) for i in range(1, 51)
]


@router.get("/", response_model=schemas.PaginatedThreats)
def read_threats(filters: schemas.ThreatFilters = Depends()):
    """
    Retrieve threats with optional filtering and searching.
    """
    threats = db_threats

    if filters.search:
        search_lower = filters.search.lower()
        threats = [
            t for t in threats if
            search_lower in t.server_name.lower() or
            search_lower in t.threat_type.lower() or
            search_lower in t.source_ip
        ]

    if filters.risk_level:
        threats = [t for t in threats if t.risk_level == filters.risk_level]

    if filters.status:
        threats = [t for t in threats if t.status == filters.status]

    return schemas.PaginatedThreats(total=len(threats), threats=threats)


@router.get("/{threat_id}", response_model=schemas.Threat)
def read_threat(threat_id: int):
    """
    Retrieve a single threat by its ID.
    """
    threat = next((t for t in db_threats if t.id == threat_id), None)
    if not threat:
        raise HTTPException(status_code=404, detail="Threat not found")
    return threat


@router.delete("/{threat_id}", status_code=204)
def delete_threat(threat_id: int):
    """
    Delete a threat.
    """
    global db_threats
    threat_to_delete = next((t for t in db_threats if t.id == threat_id), None)
    if not threat_to_delete:
        raise HTTPException(status_code=404, detail="Threat not found")
    db_threats = [t for t in db_threats if t.id != threat_id]
    return