from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    CheckConstraint,
    Index,
    Text,
)
from sqlalchemy.orm import relationship
from app.database import Base


class Car(Base):
    __tablename__ = "cars"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    make = Column(String(100), nullable=False, index=True)
    model = Column(String(100), nullable=False, index=True)
    year = Column(Integer, nullable=False)
    daily_rate = Column(Float, nullable=False)
    available = Column(Boolean, default=True, nullable=False)  # Operational rental eligibility
    category = Column(String(50), nullable=True, default="Luxury")
    image_url = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)

    __table_args__ = (
        CheckConstraint("daily_rate > 0", name="check_positive_daily_rate"),
        CheckConstraint("year >= 1900 AND year <= 2100", name="check_reasonable_year"),
        Index("idx_cars_make_model", "make", "model"),
    )

    rentals = relationship("Rental", back_populates="car", cascade="all, delete-orphan")


class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    car_id = Column(Integer, ForeignKey("cars.id", ondelete="CASCADE"), nullable=False, index=True)
    user_name = Column(String(150), nullable=False)
    start_date = Column(Date, nullable=False, index=True)
    end_date = Column(Date, nullable=False, index=True)
    rental_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False, index=True)  # ACTIVE or CANCELLED
    total_cost = Column(Float, nullable=True)

    __table_args__ = (
        CheckConstraint("start_date < end_date", name="check_start_before_end"),
        Index("idx_rentals_car_dates", "car_id", "status", "start_date", "end_date"),
    )

    car = relationship("Car", back_populates="rentals")
