from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from database.db import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    # Link to threat (IMPORTANT for relational integrity)
    threat_id = Column(Integer, nullable=False, index=True)

    # Prediction result (e.g., High Risk, Low Risk)
    prediction = Column(String(50), nullable=False)

    # Confidence score (0–100 or 0–1, but be consistent in app logic)
    confidence = Column(Float, nullable=False)

    # Better than datetime.utcnow (DB-side timestamp generation)
    created_at = Column(DateTime(timezone=True), server_default=func.now())