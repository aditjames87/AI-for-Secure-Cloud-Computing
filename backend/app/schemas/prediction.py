from pydantic import BaseModel


class PredictionRequest(BaseModel):
    cpu: float
    memory: float
    network: float


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float