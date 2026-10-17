from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, text
from fastapi import HTTPException, status
from app.models import Car, Rental
from app.schemas import CarCreate, RentalCreate


def get_car_by_id(db: Session, car_id: int) -> Optional[Car]:
    return db.query(Car).filter(Car.id == car_id).first()


def get_available_cars(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    make: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
) -> List[Car]:
    """
    List cars that are operationally available (available == True).
    If start_date and end_date are provided, filter out cars with conflicting active rentals.
    """
    query = db.query(Car).filter(Car.available == True)

    if make:
        query = query.filter(Car.make.ilike(f"%{make}%"))
    if min_price is not None:
        query = query.filter(Car.daily_rate >= min_price)
    if max_price is not None:
        query = query.filter(Car.daily_rate <= max_price)
    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Car.make.ilike(term),
                Car.model.ilike(term),
                Car.category.ilike(term),
            )
        )

    cars = query.offset(skip).limit(limit).all()

    # Optional date-range availability filter
    if start_date and end_date:
        if start_date >= end_date:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="start_date must be before end_date",
            )
        filtered_cars = []
        for car in cars:
            conflicts = (
                db.query(Rental)
                .filter(
                    Rental.car_id == car.id,
                    Rental.status == "ACTIVE",
                    Rental.start_date < end_date,
                    Rental.end_date > start_date,
                )
                .first()
            )
            if not conflicts:
                filtered_cars.append(car)
        return filtered_cars

    return cars


def create_car(db: Session, car_in: CarCreate) -> Car:
    car = Car(
        make=car_in.make.strip(),
        model=car_in.model.strip(),
        year=car_in.year,
        daily_rate=car_in.daily_rate,
        available=car_in.available if car_in.available is not None else True,
        category=car_in.category or "Luxury",
        image_url=car_in.image_url,
        description=car_in.description,
    )
    db.add(car)
    db.commit()
    db.refresh(car)
    return car


def has_conflicting_rental(
    db: Session, car_id: int, start_date: date, end_date: date
) -> Optional[Rental]:
    """
    Half-open interval overlap: [start_date, end_date)
    existing.start_date < requested.end_date AND existing.end_date > requested.start_date
    Only active rentals are considered conflicts.
    """
    return (
        db.query(Rental)
        .filter(
            Rental.car_id == car_id,
            Rental.status == "ACTIVE",
            Rental.start_date < end_date,
            Rental.end_date > start_date,
        )
        .first()
    )


def create_rental(db: Session, car_id: int, rental_in: RentalCreate) -> Rental:
    """
    Creates a new rental with transactional safety and strict overlap prevention.
    """
    if rental_in.start_date >= rental_in.end_date:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Rental start_date must be strictly before end_date.",
        )

    # Use SQLite BEGIN IMMEDIATE for transaction isolation when possible
    bind = db.get_bind()
    is_sqlite = bind and bind.dialect.name == "sqlite"

    try:
        if is_sqlite and not db.in_transaction():
            db.execute(text("BEGIN IMMEDIATE"))

        car = db.query(Car).filter(Car.id == car_id).first()
        if not car:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Car with ID {car_id} does not exist.",
            )

        if not car.available:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Car {car.make} {car.model} is not currently operationally eligible for rent.",
            )

        conflict = has_conflicting_rental(db, car_id, rental_in.start_date, rental_in.end_date)
        if conflict:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Rental conflict: The vehicle is already booked from "
                    f"{conflict.start_date.isoformat()} to {conflict.end_date.isoformat()}."
                ),
            )

        # Calculate duration and total cost
        duration_days = (rental_in.end_date - rental_in.start_date).days
        total_cost = round(duration_days * car.daily_rate, 2)

        rental = Rental(
            car_id=car_id,
            user_name=rental_in.user_name.strip(),
            start_date=rental_in.start_date,
            end_date=rental_in.end_date,
            status="ACTIVE",
            total_cost=total_cost,
        )
        db.add(rental)
        db.commit()
        db.refresh(rental)
        return rental
    except HTTPException:
        db.rollback()
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred while processing the rental.",
        )


def get_rentals(
    db: Session, skip: int = 0, limit: int = 100, user_name: Optional[str] = None
) -> List[Rental]:
    query = db.query(Rental).order_by(Rental.rental_date.desc())
    if user_name:
        query = query.filter(Rental.user_name.ilike(f"%{user_name}%"))
    return query.offset(skip).limit(limit).all()


def get_rental_by_id(db: Session, rental_id: int) -> Optional[Rental]:
    return db.query(Rental).filter(Rental.id == rental_id).first()


def cancel_rental(db: Session, rental_id: int) -> bool:
    """
    Cancels an active rental.
    Updates status to 'CANCELLED', freeing the dates for future bookings.
    Returns True if found and cancelled, raises 404 if not found.
    """
    rental = db.query(Rental).filter(Rental.id == rental_id).first()
    if not rental:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rental with ID {rental_id} was not found.",
        )

    rental.status = "CANCELLED"
    db.commit()
    return True
