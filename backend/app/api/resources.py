from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.db import get_db
from app.models.cloud_resource import CloudResource
from app.schemas.cloud_resource import (
    CloudResourceCreate,
    CloudResourceUpdate,
    CloudResource as CloudResourceSchema,
)

router = APIRouter(
    prefix="/resources",
    tags=["Cloud Resources"],
)

@router.post("/", response_model=CloudResourceSchema)
def create_resource(
    resource: CloudResourceCreate, db: Session = Depends(get_db)
):
    db_resource = CloudResource(**resource.dict())
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.get("/", response_model=List[CloudResourceSchema])
def read_resources(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    resources = db.query(CloudResource).offset(skip).limit(limit).all()
    return resources

@router.get("/{resource_id}", response_model=CloudResourceSchema)
def read_resource(resource_id: int, db: Session = Depends(get_db)):
    db_resource = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
    if db_resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    return db_resource

@router.put("/{resource_id}", response_model=CloudResourceSchema)
def update_resource(
    resource_id: int, resource: CloudResourceUpdate, db: Session = Depends(get_db)
):
    db_resource = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
    if db_resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")

    update_data = resource.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_resource, key, value)

    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

@router.delete("/{resource_id}", response_model=CloudResourceSchema)
def delete_resource(resource_id: int, db: Session = Depends(get_db)):
    db_resource = db.query(CloudResource).filter(CloudResource.id == resource_id).first()
    if db_resource is None:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    db.delete(db_resource)
    db.commit()
    return db_resource