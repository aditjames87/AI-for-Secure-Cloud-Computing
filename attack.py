from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    Text,
    ForeignKey,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from backend.app.database.db import Base


class Attack(Base):
    __tablename__ = "attacks"

    id = Column(Integer, primary_key=True, index=True)
    attack_type = Column(String(100), nullable=False)
    source_ip = Column(String(45), nullable=True, index=True)
    description = Column(Text, nullable=True)
    detected_at = Column(DateTime(timezone=True), server_default=func.now())
    target_server_id = Column(Integer, ForeignKey("servers.id"), nullable=False)
    prediction_id = Column(
        Integer, ForeignKey("predictions.id"), nullable=False, unique=True
    )

    server = relationship("Server", back_populates="attacks")
    prediction = relationship("Prediction", back_populates="attack")