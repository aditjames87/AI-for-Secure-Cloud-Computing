from sqlalchemy import Column, Integer, String, Float, DateTime
from database.db import Base
import datetime

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    prediction_result = Column(String)
    confidence = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
