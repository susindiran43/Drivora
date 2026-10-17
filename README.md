# DRIVORA — Premium Car Rental Platform

> **Brand Tagline:** *Drive. Rent. Explore.*  
> **Architecture:** FastAPI (Python) • SQLite & SQLAlchemy 2.0 • Alembic • React 18 + Vite • OpenAPI Python SDK

---

## 1. Executive Summary & Brand Identity

**Drivora** is a premier automotive mobility platform crafted for browsing high-end vehicles, checking real-time date availability, booking reservations with transactional collision safety, and releasing reservations via instantaneous cancellation.

### Brand Visual Character & Design System
- **Deep Forest Teal:** `#173D39` (Primary structural surfaces and luxury containers)
- **Dark Teal:** `#102E2B` (Dark theme foundation and rich backgrounds)
- **Muted Sage Teal:** `#68877C` (Secondary indicators and elegant metadata borders)
- **Champagne Gold:** `#D8AD7E` (Restrained luxury highlights, buttons, and badges)
- **Warm Sand Gold:** `#E8C49C` (Hover states and warm focal accents)
- **Soft Ivory:** `#F8F5EF` (Light theme canvas and card contrast)
- **White:** `#FFFFFF` (Pristine surfaces)
- **Slate Grey:** `#626B68` (Secondary body typography)

The original high-resolution Drivora logo emblem (`D` crest with stylized mountain road and luxury coupe silhouette) is preserved without distortion at `assets/drivora-logo.jpg` and `frontend/public/drivora-logo.jpg`.

---

## 2. Technical Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.13, FastAPI, Uvicorn, SQLAlchemy 2.0, Alembic, Pydantic v2 |
| **Database** | SQLite with enforced `PRAGMA foreign_keys = ON`, indexed interval constraints |
| **Backend Testing** | Pytest, FastAPI TestClient (`httpx`), concurrent thread pool simulation |
| **Frontend** | React 18, Vite, Vanilla CSS design tokens, Lucide Icons, Axios |
| **SDK** | OpenAPI Generator CLI 7.26.0 (Generated Python Client Package) |
| **Scripts** | Native Windows Batch (`setupdev.bat`, `runapplication.bat`) |

*Docker is completely prohibited and not required.*

---

## 3. Project Directory Structure

```
d:\1. My Acadamic\Projects\
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 596c4ab76fd6_initial_schema_cars_and_rentals_tables.py
│   │   └── env.py
│   ├── alembic.ini
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration and CORS origins
│   │   ├── database.py        # SQLite engine with PRAGMA foreign_keys=ON
│   │   ├── models.py          # SQLAlchemy Car & Rental models with CheckConstraints
│   │   ├── schemas.py         # Pydantic V2 schemas with interval validation
│   │   ├── crud.py            # Business logic, overlap prevention, cancellation
│   │   ├── main.py            # FastAPI application entrypoint
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── cars.py        # /cars endpoints
│   │       ├── rentals.py     # /rentals endpoints
│   │       └── health.py      # /health endpoint
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py        # Isolated test DB fixtures
│   │   ├── test_cars.py       # Car CRUD & filtering unit tests
│   │   ├── test_rentals.py    # Overlap intervals & cancellation unit tests
│   │   ├── test_integrity.py  # Foreign key enforcement & rollback tests
│   │   └── test_concurrency.py# Concurrent race condition safety tests
│   ├── load_seed.py           # Repeatable seed runner
│   ├── seed_data.sql          # Seed SQL script
│   └── requirements.txt
├── frontend/
│   ├── index.html             # Shell with Google Fonts (Kanit, Plus Jakarta Sans)
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   │   └── drivora-logo.jpg   # Brand logo
│   └── src/
│       ├── api/
│       │   └── client.js      # Centralized Axios client & services
│       ├── components/
│       │   ├── Navbar.jsx     # Navigation, logo, status indicator, theme toggle
│       │   ├── Footer.jsx     # Value propositions, concierge, copyright
│       │   └── ThemeToggle.jsx# Persistent Light/Dark toggle
│       ├── features/
│       │   ├── cars/
│       │   │   ├── CarCard.jsx
│       │   │   └── CarDetailsModal.jsx
│       │   ├── bookings/
│       │   │   ├── BookingFormModal.jsx
│       │   │   └── BookingSuccessModal.jsx
│       │   └── rentals/
│       │       ├── RentalCard.jsx
│       │       └── CancelConfirmModal.jsx
│       ├── pages/
│       │   ├── DiscoverPage.jsx # Hero, search & date filter, car listings
│       │   └── MyRentalsPage.jsx# Live bookings list & cancellation management
│       ├── styles/
│       │   ├── tokens.css     # Brand palette, typography, radii, shadows
│       │   └── global.css     # Buttons, inputs, modals, animations, grids
│       ├── App.jsx
│       └── main.jsx
├── car_rental_sdk/            # Generated Python SDK client
├── sdk_smoke_test.py          # SDK integration smoke test script
├── setupdev.bat               # Automated environment installation script
├── runapplication.bat         # Automated dual-server execution script
├── requirements.txt           # Root requirements
├── seed_data.sql              # Root seed file
├── alembic.ini                # Root Alembic configuration
└── README.md
```

---

## 4. Critical Business Logic & Rules

### A. Rental Interval Convention
Rental bookings use **half-open date intervals**:
- **Start Date:** Inclusive (vehicle pickup date)
- **End Date:** Exclusive (vehicle drop-off date)
- **Duration Formula:** `duration_days = (end_date - start_date).days`
- **Validation:** `start_date < end_date` is strictly enforced. Same-day bookings (`start == end`) and inverted ranges (`start > end`) are rejected with `HTTP 422 Unprocessable Content`.

### B. Overlap Condition
Two rentals on the same vehicle overlap if and only if:
$$\text{existing.start\_date} < \text{requested.end\_date} \quad \text{AND} \quad \text{existing.end\_date} > \text{requested.start\_date}$$

#### Conflict Examples (Assuming Active Rental Oct 20 to Oct 25):
| Requested Range | Result | Reason |
|---|---|---|
| Oct 22 to Oct 24 | **REJECT (409)** | Nested strictly inside active booking |
| Oct 23 to Oct 27 | **REJECT (409)** | Overlaps end of active booking |
| Oct 18 to Oct 22 | **REJECT (409)** | Overlaps start of active booking |
| Oct 20 to Oct 25 | **REJECT (409)** | Identical interval match |
| Oct 19 to Oct 26 | **REJECT (409)** | Encloses active booking |
| Oct 25 to Oct 28 | **ACCEPT (201)** | Adjacent: requested start equals existing end |
| Oct 18 to Oct 20 | **ACCEPT (201)** | Adjacent: requested end equals existing start |
| Oct 10 to Oct 15 | **ACCEPT (201)** | Disjoint prior interval |
| Oct 28 to Oct 31 | **ACCEPT (201)** | Disjoint subsequent interval |

### C. Operational Eligibility vs Date Availability
- `cars.available`: Represents **operational status** (e.g., active in fleet vs in maintenance/service). Cars with `available=False` cannot be booked and are filtered out of public rental queries.
- **Date-specific availability**: Computed dynamically across existing `ACTIVE` bookings in the database.

### D. Cancellation & Date Release Model
- When an active rental is cancelled via `DELETE /rentals/{rental_id}`, the system updates its status to `CANCELLED` and returns `HTTP 204 No Content`.
- The overlap query strictly checks `Rental.status == 'ACTIVE'`. As a result, cancelling a booking immediately releases those dates, permitting subsequent bookings for the previously reserved timeframe.

### E. Concurrency & Transaction Safety
- SQLite transaction isolation uses `BEGIN IMMEDIATE` transaction locking to serialize availability validation and insertion, preventing race conditions where simultaneous requests attempt to book the same vehicle for overlapping dates.
- Verified with multi-threaded concurrency unit test (`test_concurrency.py`).

---

## 5. Prerequisites & Installation

### Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** & **npm 9+** (tested on Node v22.13.0)
- **Java 17+** (Required only if regenerating the SDK via OpenAPI Generator CLI)

### Automated Setup (Recommended)
Run the automated Windows setup script:
```cmd
setupdev.bat
```
This script will:
1. Verify Python and Node/npm installations.
2. Create `.venv` virtual environment if not present.
3. Install all backend dependencies from `requirements.txt`.
4. Install generated `car_rental_sdk` in editable mode.
5. Apply Alembic migrations to create `drivora.db`.
6. Load repeatable vehicle seed data (`backend/load_seed.py`).
7. Install frontend dependencies in `frontend/`.

### Manual Setup
```cmd
:: 1. Setup virtual environment
python -m venv .venv
.\.venv\Scripts\activate

:: 2. Install backend dependencies
pip install -r requirements.txt

:: 3. Run database migrations
alembic upgrade head

:: 4. Seed database fleet
python backend/load_seed.py

:: 5. Install frontend packages
cd frontend
npm install
cd ..
```

---

## 6. Running the Application

### Automated Dual-Server Launch
Run:
```cmd
runapplication.bat
```
This starts:
1. **FastAPI Backend:** `http://127.0.0.1:8000` (live reloader enabled)
2. **React Vite Frontend:** `http://localhost:5173`

### Manual Server Launch
In Terminal 1 (Backend):
```cmd
.\.venv\Scripts\activate
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

In Terminal 2 (Frontend):
```cmd
cd frontend
npm run dev
```

---

## 7. API Endpoints Specification

| Method | Endpoint | Status | Description |
|---|---|---|---|
| `POST` | `/cars/` | `201` | Create a car (`make`, `model`, `year`, `daily_rate`, `category`, `image_url`) |
| `GET` | `/cars/` | `200` | List operationally available cars (supports `make`, `min_price`, `max_price`, `search`, `start_date`, `end_date`) |
| `GET` | `/cars/{car_id}` | `200 / 404` | Retrieve vehicle details by ID |
| `POST` | `/cars/{car_id}/rent` | `201 / 400 / 404 / 409 / 422` | Book car for interval `[start_date, end_date)`. Prevents overlaps |
| `GET` | `/cars/{car_id}/rentals`| `200 / 404` | List active booked intervals for a vehicle's schedule display |
| `GET` | `/rentals/` | `200` | List all rental agreements with vehicle relations |
| `GET` | `/rentals/{rental_id}` | `200 / 404` | Retrieve a single rental record by ID |
| `DELETE`| `/rentals/{rental_id}` | `204 / 404` | Cancel rental and immediately release dates |
| `GET` | `/health` | `200` | Health check verifying database connection |
| `GET` | `/logo` | `200` | Serves original brand logo image asset |

Interactive Swagger documentation is available at: **`http://localhost:8000/docs`**  
OpenAPI 3.1 JSON schema: **`http://localhost:8000/openapi.json`**

---

## 8. Backend Test Suite

Run the full pytest suite:
```cmd
.\.venv\Scripts\pytest.exe backend/tests -v
```

### Verified Test Results
```
collected 41 items

backend/tests/test_cars.py::test_create_car_success PASSED               [  2%]
backend/tests/test_cars.py::test_get_car_by_id_success PASSED            [  4%]
backend/tests/test_cars.py::test_get_car_not_found PASSED                [  7%]
backend/tests/test_cars.py::test_create_car_invalid_data[invalid_payload0-8] PASSED [ 29%]
backend/tests/test_cars.py::test_empty_inventory PASSED                  [ 31%]
backend/tests/test_cars.py::test_populated_inventory_and_operational_availability PASSED [ 34%]
backend/tests/test_cars.py::test_car_filtering_and_search PASSED         [ 36%]
backend/tests/test_concurrency.py::test_concurrent_conflicting_rental_requests PASSED [ 39%]
backend/tests/test_integrity.py::test_sqlite_foreign_key_enforcement PASSED [ 41%]
backend/tests/test_integrity.py::test_database_rollback_on_failure PASSED [ 43%]
backend/tests/test_integrity.py::test_health_check_endpoint PASSED       [ 46%]
backend/tests/test_rentals.py::test_create_rental_success PASSED         [ 48%]
backend/tests/test_rentals.py::test_create_rental_missing_car PASSED     [ 51%]
backend/tests/test_rentals.py::test_create_rental_unavailable_car PASSED [ 53%]
backend/tests/test_rentals.py::test_create_rental_invalid_user_name[name0-2] PASSED [ 60%]
backend/tests/test_rentals.py::test_create_rental_invalid_date_range[range0-2] PASSED [ 68%]
backend/tests/test_rentals.py::test_overlapping_rentals_parametrized[case0-8] PASSED [ 90%]
backend/tests/test_rentals.py::test_cancel_rental_success PASSED         [ 92%]
backend/tests/test_rentals.py::test_cancel_nonexistent_rental PASSED     [ 95%]
backend/tests/test_rentals.py::test_rebooking_after_cancellation PASSED  [ 97%]
backend/tests/test_rentals.py::test_cancellation_does_not_affect_other_rentals PASSED [100%]

======================= 41 passed in 0.92s =======================
```

---

## 9. OpenAPI Python SDK Generation & Smoke Test

The client SDK was generated directly from the live OpenAPI specification using the official OpenAPI Generator CLI:
```cmd
npx @openapitools/openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o car_rental_sdk
```

### SDK Integration Smoke Test
Execute the automated smoke test:
```cmd
.\.venv\Scripts\python.exe sdk_smoke_test.py http://127.0.0.1:8000
```

### Verified Smoke Test Output:
```
=== DRIVORA SDK SMOKE TEST ===
Connecting SDK client to backend: http://127.0.0.1:8000
 [PASS] HealthApi.health_check_health_get(): status=ok, db=connected
 [PASS] CarsApi.list_available_cars_cars_get(): received 11 available vehicles
 [PASS] CarsApi.get_car_cars_car_id_get(id=1): Porsche Taycan Turbo S ($380.0/day)
 [PASS] RentalsApi.list_rentals_rentals_get(): query succeeded (found records)
========================================
 ALL SDK SMOKE TESTS PASSED SUCCESSFULLY!
========================================
```

### Python SDK Usage Example:
```python
import openapi_client
from openapi_client.api.cars_api import CarsApi
from openapi_client.configuration import Configuration
from openapi_client.api_client import ApiClient

config = Configuration(host="http://127.0.0.1:8000")
with ApiClient(config) as client:
    api = CarsApi(client)
    available_fleet = api.list_available_cars_cars_get()
    for car in available_fleet:
        print(f"{car.year} {car.make} {car.model} — ${car.daily_rate}/day")
```

---

## 10. Frontend Production Build

The production bundle builds cleanly with Vite:
```cmd
cd frontend
npm run build
```
Build verification:
- `dist/index.html`: 1.33 kB
- `dist/assets/index.css`: 9.08 kB
- `dist/assets/index.js`: 257 kB
- Build time: 1.67s, **0 warnings, 0 errors**.

---

## 11. Troubleshooting & FAQ

1. **Port 8000 or 5173 Already in Use:**
   - If port 8000 is occupied, you can kill existing Python processes:
     `powershell -Command "Stop-Process -Name python, uvicorn -Force"`
   - If port 5173 is occupied, Vite will automatically prompt or select 5174.

2. **Database Locked / Contention:**
   - The SQLite database engine is configured with `timeout: 30` seconds and uses WAL mode / `BEGIN IMMEDIATE` to prevent concurrency lock issues.

3. **Re-seeding the Fleet:**
   - `backend/load_seed.py` uses `INSERT OR IGNORE` with fixed IDs, so re-running it is completely idempotent and will never create duplicate vehicles.

---

## 12. Summary Checklist Against Challenge Requirements

- [x] **Brand Assets:** Original logo preserved at `assets/drivora-logo.jpg` and `frontend/public/drivora-logo.jpg`.
- [x] **Brand Tokens:** Controlled color palette (Deep Forest Teal, Champagne Gold, Dark Teal, Soft Ivory, Slate Grey).
- [x] **Light/Dark Themes:** Centralized CSS variables with persistent functional theme toggle.
- [x] **All 5 Required Endpoints:** `POST /cars/`, `GET /cars/`, `GET /cars/{id}`, `POST /cars/{id}/rent`, `DELETE /rentals/{id}` + supporting endpoints.
- [x] **Hidden Business Logic:** Half-open date intervals, overlap collision detection, date ordering validation, operational availability distinction.
- [x] **Concurrency & Integrity:** SQLite `PRAGMA foreign_keys = ON`, transaction isolation, rollback on failure.
- [x] **Alembic Migrations:** Configured and upgraded without bypassing via `create_all()`.
- [x] **Pytest Test Suite:** 41 comprehensive tests (including parameterized overlap scenarios and concurrency).
- [x] **Generated Python SDK:** Built using `openapi-generator-cli` and verified with `sdk_smoke_test.py`.
- [x] **Frontend Architecture:** React 18 + Vite with Axios client, CarCard, CarDetailsModal, BookingFormModal, BookingSuccessModal, MyRentalsPage, CancelConfirmModal.
- [x] **Windows Scripts:** `setupdev.bat` and `runapplication.bat` created, tested, and working.
- [x] **No Docker:** Pure native Python, npm, and SQLite.
