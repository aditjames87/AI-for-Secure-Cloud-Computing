from sqlalchemy.orm import Session

from app.models.attack import Attack
from app.models.server import Server
from app.models.prediction import Prediction
from app.ml.model_loader import load_model

# Load the model only once
model = load_model()

# Prediction label mapping
RISK_MAP = {
    0: "SAFE",
    1: "LOW_RISK",
    2: "MEDIUM_RISK",
    3: "HIGH_RISK",
}


def generate_predictions(db: Session):
    """
    Generate AI predictions for attacks that don't already have one.
    """

    attacks = db.query(Attack).all()

    if not attacks:
        return

    servers = db.query(Server).all()

    if not servers:
        return

    for attack in attacks:

        # Skip if prediction already exists
        already_exists = (
            db.query(Prediction)
            .filter(Prediction.threat_id == attack.id)
            .first()
        )

        if already_exists:
            db.delete(already_exists)
            db.flush()


        # TODO:
        # Replace this later with:
        # server = db.query(Server).filter(Server.id == attack.server_id).first()
        server = servers[attack.id % len(servers)]

        cpu = float(server.cpu_usage or 0)
        memory = float(server.memory_usage or 0)
        storage = float(server.storage_usage or 0)

        # AI Prediction
        try:
    # AI Prediction
    prediction_class = model.predict([[cpu, memory, storage]])[0]

    # AI Confidence
    probabilities = model.predict_proba([[cpu, memory, storage]])[0]
    confidence = round(float(max(probabilities)) * 100, 2)

    print("=" * 50)
    print(f"Attack ID : {attack.id}")
    print(f"CPU       : {cpu}")
    print(f"Memory    : {memory}")
    print(f"Storage   : {storage}")
    print(f"Prediction: {prediction_class}")
    print(f"Confidence: {confidence}")

except Exception as e:
    print("=" * 50)
    print(f"Prediction Error for Attack {attack.id}")
    print(e)
    continue

        prediction_label = RISK_MAP.get(int(prediction_class), "UNKNOWN")

        db.add(
            Prediction(
                threat_id=attack.id,
                prediction=prediction_label,
                confidence=confidence,
            )
        )

    db.commit()