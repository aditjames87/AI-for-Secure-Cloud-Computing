from backend.crud.base import CRUDBase
from backend.app.models.prediction import Prediction
from backend.app.schemas.prediction import (
    PredictionCreate,
    PredictionUpdate,
)


class CRUDPrediction(
    CRUDBase[Prediction, PredictionCreate, PredictionUpdate]
):
    pass


prediction = CRUDPrediction(Prediction)