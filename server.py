from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from backend.app.database.db import Base


class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String(255), unique=True, index=True, nullable=False)
    ip_address = Column(String(45), unique=True, index=True, nullable=False)
    status = Column(String(50), default="active")

    resources = relationship("CloudResource", back_populates="server")
    attacks = relationship("Attack", back_populates="server")