from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from app.database.db import Base
from sqlalchemy.orm import relationship

class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)

    server_name = Column(String, nullable=False)

    operating_system = Column(String)

    cpu_usage = Column(Float)

    memory_usage = Column(Float)

    storage_usage = Column(Float)

    network_usage = Column(Float)

    ip_address = Column(String)

    status = Column(String, default="active")
    
    health_status = Column(String, default="Normal")


    created_at = Column(
        DateTime,
        server_default=func.now()
    )
    
    attacks = relationship("Attack", back_populates="server")