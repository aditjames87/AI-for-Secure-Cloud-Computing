from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.prediction import Prediction
from ..schemas.server import ServerMetrics

PREDICTION_CATEGORIES = ["SAFE", "LOW_RISK", "MEDIUM_RISK", "HIGH_RISK"]

def calculate_and_update_prediction(db: Session, server_id: int, metrics: ServerMetrics):
    """
    Calculates the risk score and updates the prediction for a server.
    """
    risk_score = (
        0.40 * metrics.cpu_usage +
        0.30 * metrics.memory_usage +
        0.20 * metrics.storage_usage +
        0.10 * metrics.network_usage
    )

    if risk_score < 30:
        prediction_label = "SAFE"
    elif risk_score < 50:
        prediction_label = "LOW_RISK"
    elif risk_score < 75:
        prediction_label = "MEDIUM_RISK"
    else:
        prediction_label = "HIGH_RISK"

    prediction = db.query(Prediction).filter(Prediction.server_id == server_id).first()

    if prediction:
        prediction.prediction = prediction_label
    else:
        prediction = Prediction(server_id=server_id, prediction=prediction_label)
        db.add(prediction)
    
    db.commit()
    db.refresh(prediction)
    return prediction

def get_prediction_distribution(db: Session):
    """
    Gets the distribution of predictions across all servers.
    """
    distribution = (
        db.query(Prediction.prediction, func.count(Prediction.prediction))
        .group_by(Prediction.prediction)
        .all()
    )

    # Convert list of tuples to a dictionary for easy lookup
    dist_map = dict(distribution)

    # Ensure all categories are present, with a count of 0 if they don't exist
    result = [{"name": category, "value": dist_map.get(category, 0)} for category in PREDICTION_CATEGORIES]
    
    return result