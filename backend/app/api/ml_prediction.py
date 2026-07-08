from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.db import get_db
from app.models.attack import Attack
from app.models.prediction import Prediction
from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.api.ai.predictor import ThreatPredictor

router = APIRouter(
    prefix="/ml",
    tags=["ML Prediction"],
)

# -----------------------------
# Initialize the ML model predictor
# -----------------------------
try:
    # This will load the model from app/api/threat_model.pkl
    predictor = ThreatPredictor()
except FileNotFoundError as e:
    # Handle case where model doesn't exist yet
    predictor = None

@router.post("/predict", response_model=PredictionResponse)
def predict_threat(
    payload: PredictionRequest,
    db: Session = Depends(get_db),
):

    if predictor is None:
        raise HTTPException(
            status_code=500,
            detail="Model not loaded. Please train the model first.",
        )

    # Optional: You could link this prediction to a resource or server
    # For now, we'll just perform the prediction based on metrics.
    attack = (
        db.query(Attack)
        .filter(Attack.id == payload.threat_id)
        .first()
    )

    if attack is None:
        raise HTTPException(
            status_code=404,
            detail=f"Attack with ID {payload.threat_id} not found."
        )

    prediction, confidence = predictor.predict(payload.cpu, payload.memory)
    db_prediction = Prediction(
        threat_id=payload.threat_id,
        prediction=prediction,
        confidence=confidence,
    )

    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)

    return {
        "threat_id": payload.threat_id,
        "prediction_id": db_prediction.id,
        "prediction": prediction,
        "confidence": confidence,
    }