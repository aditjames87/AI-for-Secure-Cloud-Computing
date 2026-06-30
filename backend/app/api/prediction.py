from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.db import get_db
from models.prediction import Prediction

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

@router.get("/")
def get_predictions(db: Session = Depends(get_db)):
    # TODO: Implement actual prediction logic
    predictions = db.query(Prediction).all()
    return predictions
