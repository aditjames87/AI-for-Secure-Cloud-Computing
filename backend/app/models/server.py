from sqlalchemy import Column, Integer, String, Float
from database.db import Base

class Server(Base):
    __tablename__ = "servers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cpu_usage = Column(Float)
    memory_usage = Column(Float)