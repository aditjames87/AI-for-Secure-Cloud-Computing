from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.resource import CloudResource
from models.server import Server

from schemas.resource import (
    ResourceCreate,
    ResourceUpdate,
    ResourceResponse,
)

router = APIRouter(
    prefix="/resources",
    tags=["Cloud Resources"]
)


# Get all resources
@router.get("/", response_model=list[ResourceResponse])
def get_resources(db: Session = Depends(get_db)):
    return db.query(CloudResource).all()


# Get one resource
@router.get("/{resource_id}", response_model=ResourceResponse)
def get_resource(resource_id: int, db: Session = Depends(get_db)):

    resource = (
        db.query(CloudResource)
        .filter(CloudResource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    return resource


# Create resource
@router.post("/", response_model=ResourceResponse)
def create_resource(
    resource: ResourceCreate,
    db: Session = Depends(get_db)
):

    # Verify server exists
    server = (
        db.query(Server)
        .filter(Server.id == resource.server_id)
        .first()
    )

    if not server:
        raise HTTPException(
            status_code=404,
            detail="Server not found"
        )

    # Prevent duplicate resource for the same server
    existing_resource = (
        db.query(CloudResource)
        .filter(CloudResource.server_id == resource.server_id)
        .first()
    )

    if existing_resource:
        raise HTTPException(
            status_code=400,
            detail="Resource already exists for this server"
        )

    new_resource = CloudResource(
        server_id=resource.server_id,
        cpu=resource.cpu,
        memory=resource.memory,
        storage=resource.storage,
        network=resource.network,
    )

    db.add(new_resource)

    # Keep Server table synchronized
    server.cpu_usage = resource.cpu
    server.memory_usage = resource.memory
    server.storage_usage = resource.storage
    server.network_usage = resource.network

    db.commit()
    db.refresh(new_resource)

    return new_resource


# Update resource
@router.put("/{resource_id}", response_model=ResourceResponse)
def update_resource(
    resource_id: int,
    updated_resource: ResourceUpdate,
    db: Session = Depends(get_db)
):

    resource = (
        db.query(CloudResource)
        .filter(CloudResource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    resource.cpu = updated_resource.cpu
    resource.memory = updated_resource.memory
    resource.storage = updated_resource.storage
    resource.network = updated_resource.network

    # Keep Server table synchronized
    server = (
        db.query(Server)
        .filter(Server.id == resource.server_id)
        .first()
    )

    if server:
        server.cpu_usage = updated_resource.cpu
        server.memory_usage = updated_resource.memory
        server.storage_usage = updated_resource.storage
        server.network_usage = updated_resource.network

    db.commit()
    db.refresh(resource)

    return resource


# Delete resource
@router.delete("/{resource_id}")
def delete_resource(
    resource_id: int,
    db: Session = Depends(get_db)
):

    resource = (
        db.query(CloudResource)
        .filter(CloudResource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(
            status_code=404,
            detail="Resource not found"
        )

    db.delete(resource)
    db.commit()

    return {
        "message": "Resource deleted successfully"
    }