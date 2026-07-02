from fastapi import APIRouter, Depends
from typing import List
import datetime
import random

from backend.app import schemas

router = APIRouter()

# In-memory "database" for demonstration
db_predictions: List[schemas.Prediction] = [
    schemas.Prediction(
        id=i,
        threat_id=random.randint(1, 100),
        prediction=random.choice(["High Risk", "Medium Risk", "Normal"]),
        confidence=random.uniform(0.5, 0.99),
        created_at=datetime.datetime.now() - datetime.timedelta(hours=i*2)
    ) for i in range(1, 21)
]

@router.get("/history", response_model=List[schemas.Prediction])
def get_prediction_history():
    """Retrieve the history of all predictions."""
    return sorted(db_predictions, key=lambda p: p.created_at, reverse=True)