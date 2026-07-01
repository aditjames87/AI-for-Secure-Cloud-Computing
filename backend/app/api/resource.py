from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.resource import CloudResource

router = APIRouter(
    prefix="/resources",
    tags=["Cloud Resources"]
)


@router.get("/")
def get_resources(db: Session = Depends(get_db)):
    return db.query(CloudResource).all()


@router.get("/{resource_id}")
def get_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = (
        db.query(CloudResource)
        .filter(CloudResource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    return resource


@router.post("/")
def create_resource(
    server_id: int,
    cpu: float,
    memory: float,
    storage: float,
    network: float,
    db: Session = Depends(get_db)
):
    resource = CloudResource(
        server_id=server_id,
        cpu=cpu,
        memory=memory,
        storage=storage,
        network=network,
    )

    db.add(resource)
    db.commit()
    db.refresh(resource)

    return resource


@router.put("/{resource_id}")
def update_resource(
    resource_id: int,
    cpu: float,
    memory: float,
    storage: float,
    network: float,
    db: Session = Depends(get_db)
):
    resource = (
        db.query(CloudResource)
        .filter(CloudResource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    resource.cpu = cpu
    resource.memory = memory
    resource.storage = storage
    resource.network = network

    db.commit()
    db.refresh(resource)

    return resource


@router.delete("/{resource_id}")
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    resource = (
        db.query(CloudResource)
        .filter(CloudResource.id == resource_id)
        .first()
    )

    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    db.delete(resource)
    db.commit()

    return {"message": "Resource deleted successfully"}