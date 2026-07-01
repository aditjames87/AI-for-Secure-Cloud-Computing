from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.attack import Attack
from schemas.threat import (
    ThreatCreate,
    ThreatUpdate,
    ThreatResponse,
)

router = APIRouter(
    prefix="/threats",
    tags=["Threats"]
)


# Get all threats
@router.get("/", response_model=list[ThreatResponse])
def get_threats(db: Session = Depends(get_db)):
    return db.query(Attack).all()


# Get a single threat
@router.get("/{threat_id}", response_model=ThreatResponse)
def get_threat(threat_id: int, db: Session = Depends(get_db)):

    threat = db.query(Attack).filter(Attack.id == threat_id).first()

    if not threat:
        raise HTTPException(
            status_code=404,
            detail="Threat not found"
        )

    return threat


# Create a new threat
@router.post("/", response_model=ThreatResponse)
def create_threat(
    threat: ThreatCreate,
    db: Session = Depends(get_db)
):

    new_threat = Attack(
        attack_type=threat.attack_type,
        source_ip=threat.source_ip,
        destination_ip=threat.destination_ip,
        severity=threat.severity,
        status=threat.status,
        user_id=threat.user_id,
    )

    db.add(new_threat)
    db.commit()
    db.refresh(new_threat)

    return new_threat


# Update an existing threat
@router.put("/{threat_id}", response_model=ThreatResponse)
def update_threat(
    threat_id: int,
    updated_threat: ThreatUpdate,
    db: Session = Depends(get_db)
):

    threat = db.query(Attack).filter(Attack.id == threat_id).first()

    if not threat:
        raise HTTPException(
            status_code=404,
            detail="Threat not found"
        )

    threat.severity = updated_threat.severity
    threat.status = updated_threat.status

    db.commit()
    db.refresh(threat)

    return threat


# Delete a threat
@router.delete("/{threat_id}")
def delete_threat(
    threat_id: int,
    db: Session = Depends(get_db)
):

    threat = db.query(Attack).filter(Attack.id == threat_id).first()

    if not threat:
        raise HTTPException(
            status_code=404,
            detail="Threat not found"
        )

    db.delete(threat)
    db.commit()

    return {
        "message": "Threat deleted successfully"
    }