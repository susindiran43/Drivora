"""
DRIVORA SDK Smoke Test
Tests the generated Python SDK client against the running FastAPI backend.
"""
import sys
import openapi_client
from openapi_client.api.health_api import HealthApi
from openapi_client.api.cars_api import CarsApi
from openapi_client.api.rentals_api import RentalsApi
from openapi_client.configuration import Configuration
from openapi_client.api_client import ApiClient


def run_sdk_smoke_test(base_url: str = "http://127.0.0.1:8000"):
    print(f"=== DRIVORA SDK SMOKE TEST ===")
    print(f"Connecting SDK client to backend: {base_url}")

    config = Configuration(host=base_url)

    with ApiClient(config) as api_client:
        # 1. Test Health API
        health_api = HealthApi(api_client)
        health = health_api.health_check_health_get()
        print(f" [PASS] HealthApi.health_check_health_get(): status={health.status}, db={health.database}")
        assert health.status == "ok", f"Expected 'ok', got {health.status}"

        # 2. Test CarsApi: list cars
        cars_api = CarsApi(api_client)
        cars = cars_api.list_available_cars_cars_get()
        print(f" [PASS] CarsApi.list_available_cars_cars_get(): received {len(cars)} available vehicles")
        assert len(cars) > 0, "Expected at least one car in fleet"

        # 3. Test CarsApi: get specific car
        first_car = cars[0]
        car_detail = cars_api.get_car_cars_car_id_get(car_id=first_car.id)
        print(f" [PASS] CarsApi.get_car_cars_car_id_get(id={first_car.id}): {car_detail.make} {car_detail.model} (${car_detail.daily_rate}/day)")
        assert car_detail.id == first_car.id

        # 4. Test RentalsApi: list rentals
        rentals_api = RentalsApi(api_client)
        rentals = rentals_api.list_rentals_rentals_get()
        print(f" [PASS] RentalsApi.list_rentals_rentals_get(): query succeeded (found {len(rentals)} records)")

    print("========================================")
    print(" ALL SDK SMOKE TESTS PASSED SUCCESSFULLY!")
    print("========================================")
    return True


if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8000"
    success = run_sdk_smoke_test(url)
    if not success:
        sys.exit(1)
