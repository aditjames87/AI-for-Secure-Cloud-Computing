from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database.db import Base


class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)

    server_name = Column(String, index=True)
    ip_address = Column(String)
    operating_system = Column(String)

    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    storage_usage = Column(Float)
    network_usage = Column(Float)

    status = Column(String)

    created_at = Column(DateTime)