from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.db import Base
import datetime

class Attack(Base):
    __tablename__ = "attacks"

    id = Column(Integer, primary_key=True, index=True)
    attack_type = Column(String, index=True)
    source_ip = Column(String)
    destination_ip = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    severity = Column(String)
    status = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User")
