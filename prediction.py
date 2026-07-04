from sqlalchemy import Column, Integer, String, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.database.base_class import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    input_features = Column(JSON, nullable=False)
    prediction_class = Column(String(100), index=True)
    prediction_score = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    attack = relationship("Attack", back_populates="prediction", uselist=False)