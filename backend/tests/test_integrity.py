from datetime import date, datetime, timezone
import pytest
from sqlalchemy.exc import IntegrityError
from app.models import Car, Rental


def test_sqlite_foreign_key_enforcement(db_session):
    """
    Directly verify that SQLite enforces foreign keys (PRAGMA foreign_keys = ON).
    Attempting to create a Rental referencing nonexistent car_id=999999 MUST raise IntegrityError.
    """
    orphan_rental = Rental(
        car_id=999999,
        user_name="Orphan Rental",
        start_date=date(2026, 11, 1),
        end_date=date(2026, 11, 5),
        rental_date=datetime.now(timezone.utc),
        status="ACTIVE",
    )
    db_session.add(orphan_rental)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()


def test_database_rollback_on_failure(db_session):
    """
    Ensure that a failed write rolls back completely without leaving partial data.
    """
    initial_car_count = db_session.query(Car).count()

    # Attempt to insert an invalid car that violates check constraint (negative daily rate)
    invalid_car = Car(
        make="Ferrari",
        model="F8",
        year=2024,
        daily_rate=-100.0,
        available=True,
    )
    db_session.add(invalid_car)
    with pytest.raises(IntegrityError):
        db_session.commit()
    db_session.rollback()

    assert db_session.query(Car).count() == initial_car_count


def test_health_check_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database"] == "connected"
