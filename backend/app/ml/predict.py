from sqlalchemy.orm import Session

from app.models.attack import Attack
from app.models.server import Server
from app.models.prediction import Prediction


def calculate_risk(cpu, memory, storage, network):
    """
    Calculate a weighted risk score.
    """

    score = (
        cpu * 0.40 +
        memory * 0.30 +
        storage * 0.20 +
        network * 0.10
    )

    if score >= 85:
        return "HIGH_RISK", score

    elif score >= 65:
        return "MEDIUM_RISK", score

    elif score >= 40:
        return "LOW_RISK", score

    else:
        return "SAFE", score


def generate_predictions(db: Session):
    """
    Generate predictions for attacks that don't already have one.
    """

    attacks = db.query(Attack).all()

    if not attacks:
        return

    servers = db.query(Server).all()

    if not servers:
        return

    for attack in attacks:

        already_exists = (
            db.query(Prediction)
            .filter(Prediction.threat_id == attack.id)
            .first()
        )

        if already_exists:
            continue

        server = servers[attack.id % len(servers)]

        prediction, confidence = calculate_risk(
            server.cpu_usage,
            server.memory_usage,
            server.storage_usage,
            server.network_usage,
        )

        db.add(
            Prediction(
                threat_id=attack.id,
                prediction=prediction,
                confidence=round(confidence, 2),
            )
        )

    db.commit()