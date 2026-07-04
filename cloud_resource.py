from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from backend.app.database.base_class import Base


class CloudResource(Base):
    __tablename__ = "cloud_resources"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    resource_type = Column(String(50), nullable=False)
    status = Column(String(50), default="running")
    server_id = Column(Integer, ForeignKey("servers.id"), nullable=False)

    server = relationship("Server", back_populates="resources")