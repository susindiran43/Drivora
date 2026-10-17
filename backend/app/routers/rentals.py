from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import RentalResponse
import app.crud as crud

router = APIRouter(prefix="/rentals", tags=["Rentals"])


@router.get(
    "/",
    response_model=List[RentalResponse],
    summary="List all rentals",
)
def list_rentals(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    user_name: Optional[str] = Query(None, description="Filter by customer name"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all rentals with car details, ordered by most recent booking first.
    """
    return crud.get_rentals(db=db, skip=skip, limit=limit, user_name=user_name)


@router.get(
    "/{rental_id}",
    response_model=RentalResponse,
    summary="Retrieve a rental by ID",
)
def get_rental(rental_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information about a specific rental.
    """
    rental = crud.get_rental_by_id(db=db, rental_id=rental_id)
    if not rental:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rental with ID {rental_id} was not found.",
        )
    return rental


@router.delete(
    "/{rental_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Cancel an active rental",
)
def cancel_rental(rental_id: int, db: Session = Depends(get_db)):
    """
    Cancel an active rental.
    Releases the reserved dates, allowing subsequent bookings for those dates.
    Returns HTTP 204 on success, or HTTP 404 if the rental does not exist.
    """
    crud.cancel_rental(db=db, rental_id=rental_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
