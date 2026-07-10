from pydantic import BaseModel
from typing import List

class PredictionDistributionItem(BaseModel):
    name: str
    value: int

class PredictionDistribution(BaseModel):
    data: List[PredictionDistributionItem]