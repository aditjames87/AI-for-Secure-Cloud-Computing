from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.db import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)

    threat_id = Column(
        Integer,
        ForeignKey("attacks.id"),
        nullable=False,
        index=True,
    )

    prediction = Column(
        String(50),
        nullable=False,
    )

    confidence = Column(
        Float,
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    attack = relationship("Attack")