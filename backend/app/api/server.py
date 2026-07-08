from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import random

from app.database.db import get_db

from app.models.server import Server

from app.schemas.server import (
    ServerCreate,
    ServerUpdate,
    ServerResponse,
)

router = APIRouter(
    prefix="/servers",
    tags=["Servers"]
)


@router.get("/", response_model=list[ServerResponse])
def get_servers(db: Session = Depends(get_db)):
    return db.query(Server).all()


@router.get("/{server_id}", response_model=ServerResponse)
def get_server(server_id: int, db: Session = Depends(get_db)):

    server = db.query(Server).filter(Server.id == server_id).first()

    if not server:
        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    return server


@router.post("/", response_model=ServerResponse)
def create_server(
    server: ServerCreate,
    db: Session = Depends(get_db)
):

    new_server = Server(
        server_name=server.server_name,
        ip_address=server.ip_address,
        operating_system=server.operating_system,
    )

    db.add(new_server)
    db.commit()
    db.refresh(new_server)

    return new_server


@router.put("/{server_id}", response_model=ServerResponse)
def update_server(
    server_id: int,
    updated_server: ServerUpdate,
    db: Session = Depends(get_db)
):

    server = db.query(Server).filter(Server.id == server_id).first()

    if not server:
        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    server.cpu_usage = updated_server.cpu_usage
    server.memory_usage = updated_server.memory_usage
    server.storage_usage = updated_server.storage_usage
    server.network_usage = updated_server.network_usage
    server.status = updated_server.status

    db.commit()
    db.refresh(server)

    return server


@router.delete("/{server_id}")
def delete_server(
    server_id: int,
    db: Session = Depends(get_db)
):

    server = db.query(Server).filter(Server.id == server_id).first()

    if not server:
        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    db.delete(server)
    db.commit()

    return {
        "message": "Server deleted successfully"
    }


# -----------------------------
# ✅ ADD THIS NEW ENDPOINT
# -----------------------------
@router.post("/simulate")
def simulate_server_metrics(db: Session = Depends(get_db)):

    servers = db.query(Server).all()

    if not servers:
        return {
            "message": "No servers found to simulate"
        }

    for server in servers:
        server.cpu_usage = random.randint(10, 95)
        server.memory_usage = random.randint(10, 95)
        server.storage_usage = random.randint(10, 95)
        server.network_usage = random.randint(10, 95)

        # Optional: auto status update
        server.status = "High Load" if server.cpu_usage > 80 else "Normal"

    db.commit()

    return {
        "message": "Server metrics simulated successfully",
        "servers_updated": len(servers)
    }