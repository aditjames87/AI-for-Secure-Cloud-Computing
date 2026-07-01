from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import random

from database.db import get_db
from models.prediction import Prediction
from models.attack import Attack

router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)

# -----------------------------------
# SIMPLE ML SIMULATION (replace later with real model)
# -----------------------------------
def fake_ml_model(data: dict):
    """
    Simulated ML model:
    Replace this later with:
    - sklearn model
    - xgboost
    - tensorflow
    - or ollama AI
    """

    risk_score = random.random()

    if risk_score > 0.7:
        return "High Risk", risk_score
    elif risk_score > 0.4:
        return "Medium Risk", risk_score
    else:
        return "Normal", risk_score


# -----------------------------------
# MAIN PREDICTION ENDPOINT
# -----------------------------------
@router.post("/predict-threat")
def predict_threat(payload: dict, db: Session = Depends(get_db)):

    prediction, confidence = fake_ml_model(payload)

    # Save prediction in DB
    new_prediction = Prediction(
        threat_id=payload.get("threat_id", 0),
        prediction=prediction,
        confidence=float(confidence),
        created_at=datetime.utcnow()
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    # Optional: also create attack record if threat
    if prediction != "Normal":
        attack = Attack(
            severity=prediction,
            description="AI detected anomaly",
        )
        db.add(attack)
        db.commit()

    return {
        "prediction": prediction,
        "confidence": round(confidence, 3),
        "status": "saved"
    }


# -----------------------------------
# GET ALL PREDICTIONS (for chart)
# -----------------------------------
@router.get("/all")
def get_all_predictions(db: Session = Depends(get_db)):

    data = db.query(Prediction).all()

    return [
        {
            "id": p.id,
            "threat_id": p.threat_id,
            "prediction": p.prediction,
            "confidence": p.confidence,
            "created_at": p.created_at
        }
        for p in data
    ]