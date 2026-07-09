from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from backend.app.database.db import Base


class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)

    server_name = Column(String(255), unique=True, index=True, nullable=False)
    ip_address = Column(String(45), unique=True, index=True, nullable=False)
    status = Column(String(50), default="active")

    operating_system = Column(String(100))
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    storage_usage = Column(Float)
    network_usage = Column(Float)
    created_at = Column(DateTime, server_default=func.now())

    resources = relationship("CloudResource", back_populates="server")
    attacks = relationship("Attack", back_populates="server")