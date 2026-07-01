from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from database.db import Base


class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id = Column(Integer, primary_key=True, index=True)

    server_id = Column(
        Integer,
        ForeignKey("servers.id"),
        nullable=False
    )

    cpu = Column(Float, default=0.0)
    memory = Column(Float, default=0.0)
    storage = Column(Float, default=0.0)
    network = Column(Float, default=0.0)

    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<CloudResource(server_id={self.server_id})>"