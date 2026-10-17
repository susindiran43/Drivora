from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import CarCreate, CarResponse, RentalCreate, RentalResponse
import app.crud as crud

router = APIRouter(prefix="/cars", tags=["Cars"])


@router.post(
    "/",
    response_model=CarResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new car",
)
def create_car(car_in: CarCreate, db: Session = Depends(get_db)):
    """
    Create a new vehicle record in the Drivora fleet.
    """
    return crud.create_car(db=db, car_in=car_in)


@router.get(
    "/",
    response_model=List[CarResponse],
    summary="List operationally available cars",
)
def list_available_cars(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    make: Optional[str] = Query(None, description="Filter by make"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum daily rate"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum daily rate"),
    search: Optional[str] = Query(None, description="Search term for make, model, category"),
    start_date: Optional[date] = Query(None, description="Rental start date (inclusive)"),
    end_date: Optional[date] = Query(None, description="Rental end date (exclusive)"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all cars that are operationally available for rental.
    Optional filters allow narrowing down by search keywords, daily rate range, and specific rental dates.
    """
    return crud.get_available_cars(
        db=db,
        skip=skip,
        limit=limit,
        make=make,
        min_price=min_price,
        max_price=max_price,
        search=search,
        start_date=start_date,
        end_date=end_date,
    )


@router.get(
    "/{car_id}",
    response_model=CarResponse,
    summary="Retrieve a car by ID",
)
def get_car(car_id: int, db: Session = Depends(get_db)):
    """
    Fetch details for a single vehicle by ID.
    Returns 404 if the vehicle does not exist.
    """
    car = crud.get_car_by_id(db=db, car_id=car_id)
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Car with ID {car_id} not found.",
        )
    return car


@router.post(
    "/{car_id}/rent",
    response_model=RentalResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a rental booking for a car",
)
def rent_car(car_id: int, rental_in: RentalCreate, db: Session = Depends(get_db)):
    """
    Book a car for a half-open date interval [start_date, end_date).
    Validates:
    - Car exists (404)
    - Operational rental eligibility (400)
    - Date ordering start_date < end_date (422)
    - Overlapping active rentals (409)
    """
    return crud.create_rental(db=db, car_id=car_id, rental_in=rental_in)


@router.get(
    "/{car_id}/rentals",
    response_model=List[RentalResponse],
    summary="List active rentals for a car",
)
def get_car_rentals(car_id: int, db: Session = Depends(get_db)):
    """
    Inspect active reservations for this vehicle to power the calendar availability display.
    """
    car = crud.get_car_by_id(db=db, car_id=car_id)
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Car with ID {car_id} not found.",
        )
    return [r for r in car.rentals if r.status == "ACTIVE"]
