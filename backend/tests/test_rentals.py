from datetime import date
import pytest
from app.models import Car, Rental


@pytest.fixture
def sample_car(db_session):
    car = Car(
        make="Porsche",
        model="911 GT3",
        year=2024,
        daily_rate=400.0,
        available=True,
    )
    db_session.add(car)
    db_session.commit()
    db_session.refresh(car)
    return car


@pytest.fixture
def unavailable_car(db_session):
    car = Car(
        make="Maserati",
        model="MC20",
        year=2024,
        daily_rate=500.0,
        available=False,  # Under maintenance
    )
    db_session.add(car)
    db_session.commit()
    db_session.refresh(car)
    return car


def test_create_rental_success(client, sample_car):
    payload = {
        "user_name": "Eleanor Vance",
        "start_date": "2026-11-01",
        "end_date": "2026-11-05",
    }
    response = client.post(f"/cars/{sample_car.id}/rent", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["car_id"] == sample_car.id
    assert data["user_name"] == "Eleanor Vance"
    assert data["start_date"] == "2026-11-01"
    assert data["end_date"] == "2026-11-05"
    assert data["status"] == "ACTIVE"
    # 4 days @ $400/day = $1600.0
    assert data["total_cost"] == 1600.0


def test_create_rental_missing_car(client):
    payload = {
        "user_name": "Eleanor Vance",
        "start_date": "2026-11-01",
        "end_date": "2026-11-05",
    }
    response = client.post("/cars/99999/rent", json=payload)
    assert response.status_code == 404
    assert "does not exist" in response.json()["detail"]


def test_create_rental_unavailable_car(client, unavailable_car):
    payload = {
        "user_name": "Eleanor Vance",
        "start_date": "2026-11-01",
        "end_date": "2026-11-05",
    }
    response = client.post(f"/cars/{unavailable_car.id}/rent", json=payload)
    assert response.status_code == 400
    assert "not currently operationally eligible" in response.json()["detail"]


@pytest.mark.parametrize(
    "invalid_name",
    ["", "   ", None],
)
def test_create_rental_invalid_user_name(client, sample_car, invalid_name):
    payload = {
        "user_name": invalid_name,
        "start_date": "2026-11-01",
        "end_date": "2026-11-05",
    }
    response = client.post(f"/cars/{sample_car.id}/rent", json=payload)
    assert response.status_code == 422


@pytest.mark.parametrize(
    "start, end",
    [
        ("2026-11-05", "2026-11-05"),  # Same day (zero duration)
        ("2026-11-06", "2026-11-05"),  # Inverted range
        ("2026-12-01", "2026-11-01"),  # End before start
    ],
)
def test_create_rental_invalid_date_range(client, sample_car, start, end):
    payload = {
        "user_name": "Eleanor Vance",
        "start_date": start,
        "end_date": end,
    }
    response = client.post(f"/cars/{sample_car.id}/rent", json=payload)
    assert response.status_code == 422


# Parametrized test for the critical overlapping interval business logic
# Existing rental interval: [2026-10-20, 2026-10-25)
@pytest.mark.parametrize(
    "req_start, req_end, expected_status, description",
    [
        ("2026-10-22", "2026-10-24", 409, "Nested strictly inside existing booking"),
        ("2026-10-23", "2026-10-27", 409, "Partial overlap with existing booking end"),
        ("2026-10-18", "2026-10-22", 409, "Partial overlap with existing booking start"),
        ("2026-10-20", "2026-10-25", 409, "Exact identical interval match"),
        ("2026-10-19", "2026-10-26", 409, "Enclosing interval superset"),
        ("2026-10-25", "2026-10-28", 201, "Adjacent booking start matches existing end date"),
        ("2026-10-18", "2026-10-20", 201, "Adjacent booking end matches existing start date"),
        ("2026-10-10", "2026-10-15", 201, "Completely disjoint earlier booking"),
        ("2026-10-28", "2026-10-31", 201, "Completely disjoint later booking"),
    ],
)
def test_overlapping_rentals_parametrized(
    client, sample_car, req_start, req_end, expected_status, description
):
    # Establish base booking: Oct 20 to Oct 25
    base_res = client.post(
        f"/cars/{sample_car.id}/rent",
        json={
            "user_name": "Initial Guest",
            "start_date": "2026-10-20",
            "end_date": "2026-10-25",
        },
    )
    assert base_res.status_code == 201

    # Attempt second booking
    res = client.post(
        f"/cars/{sample_car.id}/rent",
        json={
            "user_name": f"Second Guest ({description})",
            "start_date": req_start,
            "end_date": req_end,
        },
    )
    assert res.status_code == expected_status, f"Failed for case: {description}"
    if expected_status == 409:
        assert "Rental conflict" in res.json()["detail"]


def test_cancel_rental_success(client, sample_car):
    # Create rental
    create_res = client.post(
        f"/cars/{sample_car.id}/rent",
        json={
            "user_name": "Guest to Cancel",
            "start_date": "2026-10-20",
            "end_date": "2026-10-25",
        },
    )
    assert create_res.status_code == 201
    rental_id = create_res.json()["id"]

    # Delete / Cancel rental -> 204
    del_res = client.delete(f"/rentals/{rental_id}")
    assert del_res.status_code == 204

    # Verify status changed to CANCELLED
    get_res = client.get(f"/rentals/{rental_id}")
    assert get_res.status_code == 200
    assert get_res.json()["status"] == "CANCELLED"


def test_cancel_nonexistent_rental(client):
    response = client.delete("/rentals/999999")
    assert response.status_code == 404


def test_rebooking_after_cancellation(client, sample_car):
    # 1. Book Oct 20 to Oct 25
    book1 = client.post(
        f"/cars/{sample_car.id}/rent",
        json={
            "user_name": "First Guest",
            "start_date": "2026-10-20",
            "end_date": "2026-10-25",
        },
    )
    assert book1.status_code == 201
    rental1_id = book1.json()["id"]

    # 2. Conflicting booking fails
    conflict_attempt = client.post(
        f"/cars/{sample_car.id}/rent",
        json={
            "user_name": "Second Guest",
            "start_date": "2026-10-22",
            "end_date": "2026-10-24",
        },
    )
    assert conflict_attempt.status_code == 409

    # 3. Cancel first booking
    cancel_res = client.delete(f"/rentals/{rental1_id}")
    assert cancel_res.status_code == 204

    # 4. Now the previously conflicting booking succeeds
    retry_attempt = client.post(
        f"/cars/{sample_car.id}/rent",
        json={
            "user_name": "Second Guest",
            "start_date": "2026-10-22",
            "end_date": "2026-10-24",
        },
    )
    assert retry_attempt.status_code == 201
    assert retry_attempt.json()["status"] == "ACTIVE"


def test_cancellation_does_not_affect_other_rentals(client, sample_car):
    # Book interval 1: Oct 10 to Oct 15
    res1 = client.post(
        f"/cars/{sample_car.id}/rent",
        json={"user_name": "Guest 1", "start_date": "2026-10-10", "end_date": "2026-10-15"},
    )
    assert res1.status_code == 201
    id1 = res1.json()["id"]

    # Book interval 2: Oct 20 to Oct 25
    res2 = client.post(
        f"/cars/{sample_car.id}/rent",
        json={"user_name": "Guest 2", "start_date": "2026-10-20", "end_date": "2026-10-25"},
    )
    assert res2.status_code == 201
    id2 = res2.json()["id"]

    # Cancel interval 1
    del_res = client.delete(f"/rentals/{id1}")
    assert del_res.status_code == 204

    # Interval 2 must remain ACTIVE
    check2 = client.get(f"/rentals/{id2}")
    assert check2.status_code == 200
    assert check2.json()["status"] == "ACTIVE"
