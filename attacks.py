from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Attack])
def read_attacks(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve attacks.
    """
    attacks = crud.attack.get_multi(db, skip=skip, limit=limit)
    return attacks


@router.post("/", response_model=schemas.Attack)
def create_attack(
    *,
    db: Session = Depends(deps.get_db),
    attack_in: schemas.AttackCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new attack.
    """
    attack = crud.attack.create(db=db, obj_in=attack_in)
    return attack


@router.get("/{id}", response_model=schemas.Attack)
def read_attack(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get attack by ID.
    """
    attack = crud.attack.get(db=db, id=id)
    if not attack:
        raise HTTPException(status_code=404, detail="Attack not found")
    return attack