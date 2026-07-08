from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.db import get_db
from app.models.attack import Attack
from app.schemas.threat import (
	ThreatCreate,
	ThreatUpdate,
	ThreatResponse,
)

router = APIRouter(
	prefix="/api/v1/threats",
	tags=["Threats"],
)


@router.get("/")
def get_threats(
    search: str = Query(default=""),
    risk_level: str = Query(default=""),
    status: str = Query(default=""),
    db: Session = Depends(get_db),
):
    query = db.query(Attack)

    if search:
        query = query.filter(
            or_(
                Attack.attack_type.ilike(f"%{search}%"),
                Attack.source_ip.ilike(f"%{search}%"),
                Attack.destination_ip.ilike(f"%{search}%"),
            )
        )

    if risk_level:
        query = query.filter(Attack.severity.ilike(f"%{risk_level}%"))

    if status:
        query = query.filter(Attack.status == status)

    threats = query.order_by(Attack.id.desc()).all()

    return {
        "total": len(threats),
        "threats": [
            {
                "id": threat.id,
                "server_name": threat.destination_ip,
                "threat_type": threat.attack_type,
                "risk_level": threat.severity,
                "timestamp": threat.timestamp,
                "status": threat.status,
                "source_ip": threat.source_ip,
                "description": f"{threat.attack_type} detected from {threat.source_ip}",
                "details": {},
            }
            for threat in threats
        ],
    }


@router.get("/{threat_id}", response_model=ThreatResponse)
def get_threat(
	threat_id: int,
	db: Session = Depends(get_db),
):
	threat = db.query(Attack).filter(Attack.id == threat_id).first()

	if not threat:
		raise HTTPException(
			status_code=404,
			detail="Threat not found",
		)

	return threat


@router.post("/", response_model=ThreatResponse)
def create_threat(
	threat: ThreatCreate,
	db: Session = Depends(get_db),
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


@router.put("/{threat_id}", response_model=ThreatResponse)
def update_threat(
	threat_id: int,
	updated_threat: ThreatUpdate,
	db: Session = Depends(get_db),
):
	threat = db.query(Attack).filter(Attack.id == threat_id).first()

	if not threat:
		raise HTTPException(
			status_code=404,
			detail="Threat not found",
		)

	threat.severity = updated_threat.severity
	threat.status = updated_threat.status

	db.commit()
	db.refresh(threat)

	return threat


@router.delete("/{threat_id}")
def delete_threat(
	threat_id: int,
	db: Session = Depends(get_db),
):
	threat = db.query(Attack).filter(Attack.id == threat_id).first()

	if not threat:
		raise HTTPException(
			status_code=404,
			detail="Threat not found",
		)

	db.delete(threat)
	db.commit()

	return {
		"message": "Threat deleted successfully",
	}