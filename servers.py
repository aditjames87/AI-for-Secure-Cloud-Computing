from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.api_old import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Server])
def read_servers(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve servers.
    """
    servers = crud.server.get_multi(db, skip=skip, limit=limit)
    return servers


@router.post("/", response_model=schemas.Server)
def create_server(
    *,
    db: Session = Depends(deps.get_db),
    server_in: schemas.ServerCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new server.
    """
    server = crud.server.create(db=db, obj_in=server_in)
    return server


@router.get("/{id}", response_model=schemas.Server)
def read_server(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get server by ID.
    """
    server = crud.server.get(db=db, id=id)
    if not server:
        raise HTTPException(status_code=404, detail="Server not found")
    return server