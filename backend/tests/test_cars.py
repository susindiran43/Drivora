import pytest
from app.models import Car


def test_create_car_success(client):
    payload = {
        "make": "Porsche",
        "model": "Taycan Turbo S",
        "year": 2024,
        "daily_rate": 380.0,
        "available": True,
        "category": "Electric",
        "description": "Twin electric motors with 750 hp.",
    }
    response = client.post("/cars/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] > 0
    assert data["make"] == "Porsche"
    assert data["model"] == "Taycan Turbo S"
    assert data["year"] == 2024
    assert data["daily_rate"] == 380.0
    assert data["available"] is True


def test_get_car_by_id_success(client):
    payload = {
        "make": "Aston Martin",
        "model": "DB12",
        "year": 2024,
        "daily_rate": 520.0,
    }
    create_res = client.post("/cars/", json=payload)
    car_id = create_res.json()["id"]

    get_res = client.get(f"/cars/{car_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == car_id
    assert get_res.json()["make"] == "Aston Martin"


def test_get_car_not_found(client):
    response = client.get("/cars/999999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


@pytest.mark.parametrize(
    "invalid_payload",
    [
        {"make": "", "model": "Taycan", "year": 2024, "daily_rate": 380.0},
        {"make": "   ", "model": "Taycan", "year": 2024, "daily_rate": 380.0},
        {"make": "Porsche", "model": "", "year": 2024, "daily_rate": 380.0},
        {"make": "Porsche", "model": "Taycan", "year": 1800, "daily_rate": 380.0},
        {"make": "Porsche", "model": "Taycan", "year": 2200, "daily_rate": 380.0},
        {"make": "Porsche", "model": "Taycan", "year": 2024, "daily_rate": 0.0},
        {"make": "Porsche", "model": "Taycan", "year": 2024, "daily_rate": -50.0},
        {"model": "Taycan", "year": 2024, "daily_rate": 380.0},  # Missing make
        {"make": "Porsche", "year": 2024, "daily_rate": 380.0},  # Missing model
    ],
)
def test_create_car_invalid_data(client, invalid_payload):
    response = client.post("/cars/", json=invalid_payload)
    assert response.status_code == 422


def test_empty_inventory(client):
    response = client.get("/cars/")
    assert response.status_code == 200
    assert response.json() == []


def test_populated_inventory_and_operational_availability(client, db_session):
    # Car 1: operationally available
    car1 = Car(make="BMW", model="M8", year=2023, daily_rate=350.0, available=True)
    # Car 2: operationally unavailable (e.g. in maintenance)
    car2 = Car(make="Audi", model="RS e-tron GT", year=2024, daily_rate=340.0, available=False)
    db_session.add_all([car1, car2])
    db_session.commit()

    response = client.get("/cars/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["make"] == "BMW"
    assert data[0]["available"] is True


def test_car_filtering_and_search(client, db_session):
    car1 = Car(make="Ferrari", model="Roma", year=2023, daily_rate=650.0, available=True, category="Sports")
    car2 = Car(make="Bentley", model="Continental", year=2024, daily_rate=550.0, available=True, category="Grand Tourer")
    car3 = Car(make="Tesla", model="Model S Plaid", year=2024, daily_rate=250.0, available=True, category="Electric")
    db_session.add_all([car1, car2, car3])
    db_session.commit()

    # Filter by make
    res_make = client.get("/cars/?make=Ferrari")
    assert res_make.status_code == 200
    assert len(res_make.json()) == 1
    assert res_make.json()[0]["make"] == "Ferrari"

    # Filter by price range
    res_price = client.get("/cars/?min_price=300&max_price=600")
    assert res_price.status_code == 200
    assert len(res_price.json()) == 1
    assert res_price.json()[0]["model"] == "Continental"

    # Search keyword
    res_search = client.get("/cars/?search=Plaid")
    assert res_search.status_code == 200
    assert len(res_search.json()) == 1
    assert res_search.json()[0]["model"] == "Model S Plaid"
