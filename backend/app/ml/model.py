import numpy as np
from sklearn.linear_model import LogisticRegression
from app.ml.model_loader import load_model
import joblib
import os

MODEL_PATH = "app/ml/model.pkl"


def train_and_save_model():
    """
    Dummy training model (replace later with real dataset)
    """

    # fake dataset: [cpu, memory, network]
    X = np.array([
        [10, 20, 15],
        [20, 30, 25],
        [50, 60, 55],
        [70, 80, 75],
        [90, 95, 88],
    ])

    # 0 = Low, 1 = Medium, 2 = High risk
    y = np.array([0, 0, 1, 2, 2])

    model = LogisticRegression()
    model.fit(X, y)

    os.makedirs("app/ml", exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    return model


def load_model():
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)

    return train_and_save_model()