from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.api_old import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.CloudResource])
def read_cloud_resources(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve cloud resources.
    """
    resources = crud.cloud_resource.get_multi(db, skip=skip, limit=limit)
    return resources


@router.post("/", response_model=schemas.CloudResource)
def create_cloud_resource(
    *,
    db: Session = Depends(deps.get_db),
    resource_in: schemas.CloudResourceCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new cloud resource.
    """
    resource = crud.cloud_resource.create(db=db, obj_in=resource_in)
    return resource


@router.get("/{id}", response_model=schemas.CloudResource)
def read_cloud_resource(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get cloud resource by ID.
    """
    resource = crud.cloud_resource.get(db=db, id=id)
    if not resource:
        raise HTTPException(status_code=404, detail="Cloud resource not found")
    return resource