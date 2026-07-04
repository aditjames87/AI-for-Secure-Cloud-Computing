from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.api_old import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Prediction])
def read_predictions(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve predictions.
    """
    predictions = crud.prediction.get_multi(db, skip=skip, limit=limit)
    return predictions


@router.post("/", response_model=schemas.Prediction)
def create_prediction(
    *,
    db: Session = Depends(deps.get_db),
    prediction_in: schemas.PredictionCreate,
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    """
    Create new prediction.
    """
    prediction = crud.prediction.create(db=db, obj_in=prediction_in)
    return prediction


@router.get("/{id}", response_model=schemas.Prediction)
def read_prediction(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get prediction by ID.
    """
    prediction = crud.prediction.get(db=db, id=id)
    if not prediction:
        raise HTTPException(status_code=404, detail="Prediction not found")
    return prediction