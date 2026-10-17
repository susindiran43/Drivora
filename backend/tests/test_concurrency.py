import concurrent.futures
from app.models import Car


def test_concurrent_conflicting_rental_requests(client, db_session):
    """
    Test concurrent requests attempting to book the exact same car
    for overlapping dates simultaneously.
    Exactly one request must succeed (201), and the second must be rejected (409).
    """
    car = Car(
        make="Aston Martin",
        model="Valkyrie",
        year=2024,
        daily_rate=1200.0,
        available=True,
    )
    db_session.add(car)
    db_session.commit()
    db_session.refresh(car)

    results = []

    def book_car(name: str):
        payload = {
            "user_name": name,
            "start_date": "2026-12-10",
            "end_date": "2026-12-15",
        }
        res = client.post(f"/cars/{car.id}/rent", json=payload)
        return res.status_code

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        futures = [
            executor.submit(book_car, "Customer Alpha"),
            executor.submit(book_car, "Customer Beta"),
        ]
        for f in concurrent.futures.as_completed(futures):
            results.append(f.result())

    # One must succeed with 201, the other must conflict with 409
    assert 201 in results, f"Expected one 201 success in results: {results}"
    assert 409 in results, f"Expected one 409 conflict in results: {results}"
    assert len(results) == 2
