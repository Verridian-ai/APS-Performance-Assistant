from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, Text, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("Preferences", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    aps_level = Column(String, nullable=True) # e.g. "APS 6"
    department = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    goals = Column(Text, nullable=True)

    user = relationship("User", back_populates="profile")

class Preferences(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False)
    theme = Column(String, default="system") # light, dark, system
    notifications_enabled = Column(Boolean, default=True)
    data_sharing_opt_in = Column(Boolean, default=False)

    user = relationship("User", back_populates="preferences")
