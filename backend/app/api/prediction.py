from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.db import get_db
from app.models.prediction import Prediction

router = APIRouter(
    prefix="/api/v1/prediction",
    tags=["Prediction"]
)


# ---------------------------------------------------------
# GET DASHBOARD SUMMARY
# ---------------------------------------------------------
@router.get("/summary")
def prediction_summary(db: Session = Depends(get_db)):
    """
    Returns prediction counts for dashboard KPIs.
    """

    return {
        "total_predictions": db.query(Prediction).count(),
        "high_risk": db.query(Prediction)
            .filter(Prediction.prediction == "HIGH_RISK")
            .count(),
        "medium_risk": db.query(Prediction)
            .filter(Prediction.prediction == "MEDIUM_RISK")
            .count(),
        "low_risk": db.query(Prediction)
            .filter(Prediction.prediction == "LOW_RISK")
            .count(),
        "safe": db.query(Prediction)
            .filter(Prediction.prediction == "SAFE")
            .count(),
    }


# ---------------------------------------------------------
# GET ALL PREDICTIONS
# ---------------------------------------------------------
@router.get("/")
def get_predictions(db: Session = Depends(get_db)):
    """
    Returns all predictions.
    """

    predictions = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    return [
        {
            "id": p.id,
            "threat_id": p.threat_id,
            "prediction": p.prediction,
            "confidence": round(float(p.confidence), 2),
            "created_at": p.created_at,
        }
        for p in predictions
    ]


# ---------------------------------------------------------
# GET PREDICTIONS BY THREAT
# ---------------------------------------------------------
@router.get("/threat/{threat_id}")
def get_prediction_by_threat(
    threat_id: int,
    db: Session = Depends(get_db),
):
    """
    Returns all predictions for a specific threat.
    """

    predictions = (
        db.query(Prediction)
        .filter(Prediction.threat_id == threat_id)
        .all()
    )

    return [
        {
            "id": p.id,
            "threat_id": p.threat_id,
            "prediction": p.prediction,
            "confidence": round(float(p.confidence), 2),
            "created_at": p.created_at,
        }
        for p in predictions
    ]


# ---------------------------------------------------------
# GET SINGLE PREDICTION
# ---------------------------------------------------------
@router.get("/{prediction_id}")
def get_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    """
    Returns a single prediction.
    """

    prediction = (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found",
        )

    return {
        "id": prediction.id,
        "threat_id": prediction.threat_id,
        "prediction": prediction.prediction,
        "confidence": round(float(prediction.confidence), 2),
        "created_at": prediction.created_at,
    }


# ---------------------------------------------------------
# DELETE PREDICTION
# ---------------------------------------------------------
@router.delete("/{prediction_id}")
def delete_prediction(
    prediction_id: int,
    db: Session = Depends(get_db),
):
    """
    Deletes a prediction.
    """

    prediction = (
        db.query(Prediction)
        .filter(Prediction.id == prediction_id)
        .first()
    )

    if prediction is None:
        raise HTTPException(
            status_code=404,
            detail="Prediction not found",
        )

    db.delete(prediction)
    db.commit()

    return {
        "message": "Prediction deleted successfully"
    }