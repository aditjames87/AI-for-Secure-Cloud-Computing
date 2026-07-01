import joblib
from pathlib import Path
import numpy as np
  

class ThreatPredictor:
    def __init__(self):
        # Correct path to model file
        base_dir = Path(__file__).resolve().parent
        model_path = base_dir / "threat_model.pkl"

        self.model = joblib.load(model_path)

    def predict(self, cpu: float, memory: float):
        X = np.array([[cpu, memory]])
        return self.model.predict(X)[0]

    def predict_proba(self, cpu: float, memory: float):
        X = np.array([[cpu, memory]])
        return self.model.predict_proba(X)[0].max()