# DRIVORA — Premium Car Rental Platform

> **Brand Tagline:** *Drive. Rent. Explore.*  
> **Architecture:** FastAPI (Python) • SQLite & SQLAlchemy 2.0 • Alembic • React 18 + Vite • OpenAPI Python SDK  
> **Repository:** [https://github.com/susindiran43/Drivora](https://github.com/susindiran43/Drivora)

### Recruiter & Technical Reviewer Quick Links
- 🚀 **One-Click Setup:** [`setupdev.bat`](#7-prerequisites--installation)
- ⚡ **Dual-Server Launch:** [`runapplication.bat`](#8-running-the-application)
- 🧪 **Unit & Concurrency Tests (41/41 Passed):** [Section 11](#11-backend-unit-testing)
- 🔌 **OpenAPI Python SDK & Smoke Test:** [Section 12](#12-openapi-python-sdk-generation--smoke-test)
- 📐 **Domain Collision Logic & Half-Open Intervals:** [Section 5](#5-critical-business-logic--domain-rules)
- 📋 **Recruitment Challenge Compliance Checklist:** [Section 15](#15-requirements-compliance-checklist)

---

## 1. Project Overview & Brand Identity

**Drivora** is a full-stack, enterprise-grade automotive mobility platform designed for browsing prestigious luxury and performance vehicles, checking date-range availability in real time, creating rental agreements with strict transaction-level collision safety, and managing reservations via instant cancellation.

### Strict Brand Identity & Color Tokens
Drivora adheres to a bespoke, luxury automotive palette derived from the original brand emblem:
- **Deep Forest Teal (`#173D39`):** Primary structural surfaces, headers, and container elements.
- **Dark Teal (`#102E2B`):** Dark theme background and deep contrast surfaces.
- **Muted Sage Teal (`#68877C`):** Secondary text, subtle borders, and metadata accents.
- **Champagne Gold (`#D8AD7E`):** Focal highlights, active pills, badges, and primary call-to-actions.
- **Warm Sand Gold (`#E8C49C`):** Hover states and glowing accents.
- **Soft Ivory (`#F8F5EF`):** Light theme background canvas and high-contrast card base.
- **White (`#FFFFFF`):** Elevated cards and pristine surfaces.
- **Slate Grey (`#626B68`):** Body typography and secondary labels.

The original high-resolution Drivora logo emblem (`D` monogram with stylized mountain road and luxury coupe silhouette) is preserved without distortion at `assets/drivora-logo.jpg` and `frontend/public/drivora-logo.jpg`.

---

## 2. Key Features

### Implemented Core Features
- **Fleet Showcase & Discovery:** Browse luxury vehicles categorized by *Electric*, *Grand Tourer*, *Sports*, *Luxury Sedan*, and *Executive SUV*.
- **Interactive Multi-Parameter Filtering:** Filter fleet inventory by make, model, search keywords, daily rate range slider, and vehicle category pills.
- **Date Range Availability Check:** Real-time date interval search that filters out any vehicle with conflicting active reservations.
- **Vehicle Detail Modal & Dynamic Quote Calculator:** Inspect vehicle specifications, engine details, and booked calendar schedule with an instant rental duration and estimated cost calculator.
- **Reservation Agreement Form:** Collects customer name and rental dates with live validation, prevents invalid dates (`start >= end`), and rejects concurrent collision attempts.
- **Booking Confirmation Modal:** Displays confirmed reservation records with actual database Rental ID, confirmed dates, vehicle details, and total cost.
- **My Reservations Management:** View all bookings with status badges (`ACTIVE` vs. `CANCELLED`), search by guest name or rental ID, and inspect creation timestamps.
- **Non-Destructive Cancellation:** Confirmation dialog invoking `DELETE /rentals/{rental_id}` to transition status to `CANCELLED`, returning `HTTP 204 No Content` and immediately releasing the dates for subsequent bookings.
- **Dual Theme Support:** Fully responsive Light and Dark themes with persistent user preference storage in `localStorage`.
- **Keyboard & Screen Accessibility:** Custom `useModalDismiss` hook providing `Escape` key dismissal and background body scroll locking on all dialogs.
- **Type-Safe Python SDK:** Client SDK auto-generated directly from the live OpenAPI 3.1 specification, verified with an integration smoke test.

### Optional & Future Enhancements
- **User Authentication & Profiles:** The recruitment challenge does not require a customer authentication system; bookings are managed globally or filtered by guest name.
- **Multi-Node Database:** SQLite is utilized as specified in the challenge requirements. For distributed multi-node production deployment, PostgreSQL with native range types (`tsrange` and `EXCLUDE USING gist`) can be swapped in seamlessly via the `DATABASE_URL` environment variable.

---

## 3. Technology Stack

| Layer | Technologies & Libraries |
|---|---|
| **Backend Framework** | Python 3.13, FastAPI 0.143, Uvicorn 0.54 |
| **ORM & Database** | SQLAlchemy 2.1, SQLite 3 (with enforced `PRAGMA foreign_keys = ON`), Alembic 1.20 |
| **Data Validation** | Pydantic v2 (strict date validators, half-open interval checks, `ConfigDict`) |
| **Backend Testing** | Pytest 9.1, FastAPI TestClient (`httpx`), multi-threaded concurrency pool |
| **Frontend Framework** | React 18.3, Vite 5.4, Axios 1.7, Lucide Icons (`lucide-react`) |
| **Frontend Styling** | Vanilla CSS with centralized CSS custom properties (Tokens), CSS Grid, Flexbox |
| **SDK Generation** | OpenAPI Generator CLI 7.26.0 (Generated Python Client Package) |
| **Automation** | Windows Batch Scripts (`setupdev.bat`, `runapplication.bat`) |

*Docker is prohibited and not required.*

---

## 4. Project Directory Structure

```
Drivora/
├── backend/
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 596c4ab76fd6_initial_schema_cars_and_rentals_tables.py
│   │   └── env.py              # Configured with Base.metadata & render_as_batch=True
│   ├── alembic.ini             # Backend Alembic configuration
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py          # Environment settings & dynamic CORS origins
│   │   ├── database.py        # SQLite engine with PRAGMA foreign_keys=ON pragma
│   │   ├── models.py          # SQLAlchemy Car & Rental models with CheckConstraints & indexes
│   │   ├── schemas.py         # Pydantic v2 validation schemas
│   │   ├── crud.py            # Overlap checking, transaction lock, cancellation
│   │   ├── main.py            # FastAPI entrypoint, exception handlers, static routes
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── health.py      # GET /health
│   │       ├── cars.py        # /cars endpoints
│   │       └── rentals.py     # /rentals endpoints
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py        # Isolated test DB fixtures
│   │   ├── test_cars.py       # Car CRUD & filtering unit tests
│   │   ├── test_rentals.py    # Overlap intervals & cancellation unit tests
│   │   ├── test_integrity.py  # Foreign key enforcement & rollback tests
│   │   └── test_concurrency.py# Concurrent race condition safety tests
│   ├── load_seed.py           # Repeatable seed runner
│   ├── seed_data.sql          # Seed SQL script
│   └── requirements.txt       # Backend dependencies
├── frontend/
│   ├── index.html             # Shell with Google Fonts (Kanit, Plus Jakarta Sans) & logo favicon
│   ├── package.json           # React 18, Vite, Axios, Lucide-react
│   ├── vite.config.js         # Vite configuration with backend API proxy
│   ├── public/
│   │   └── drivora-logo.jpg   # Brand logo emblem
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
│       ├── hooks/
│       │   └── useModalDismiss.js # Reusable Escape key & scroll-lock accessibility hook
│       ├── pages/
│       │   ├── DiscoverPage.jsx # Hero, search & date filter, car listings
│       │   └── MyRentalsPage.jsx# Live bookings list & cancellation management
│       ├── styles/
│       │   ├── tokens.css     # Brand palette, typography, radii, shadows
│       │   └── global.css     # Buttons, inputs, modals, animations, grids
│       ├── App.jsx
│       └── main.jsx
├── assets/
│   └── drivora-logo.jpg       # Brand logo archive
├── car_rental_sdk/            # Generated Python SDK client package
├── sdk_smoke_test.py          # SDK integration smoke test script
├── setupdev.bat               # Automated environment installation script
├── runapplication.bat         # Automated dual-server execution script
├── requirements.txt           # Root requirements
├── seed_data.sql              # Root seed file
├── alembic.ini                # Root Alembic configuration
├── .gitignore                 # Clean repository ignore file
└── README.md                  # Master documentation
```

---

## 5. Critical Business Logic & Domain Rules

### A. Rental Interval Convention
Rental bookings use **half-open date intervals**:
- **Start Date:** Inclusive (vehicle pickup date)
- **End Date:** Exclusive (vehicle drop-off date)
- **Duration Formula:** `duration_days = (end_date - start_date).days`
- **Validation:** `start_date < end_date` is strictly enforced. Same-day bookings (`start == end`) and inverted ranges (`start > end`) are rejected with `HTTP 422 Unprocessable Content`.

### B. Overlap Condition & Collision Matrix
Two rentals on the same vehicle overlap if and only if:
$$\text{existing.start\_date} < \text{requested.end\_date} \quad \text{AND} \quad \text{existing.end\_date} > \text{requested.start\_date}$$

#### Collision Scenarios (Assuming an Active Reservation from Oct 20 to Oct 25):
| Requested Range | Result | HTTP Code | Domain Rationale |
|---|---|---|---|
| **Oct 22 to Oct 24** | **REJECT** | `409 Conflict` | Nested strictly inside active booking |
| **Oct 23 to Oct 27** | **REJECT** | `409 Conflict` | Partial overlap with end of active booking |
| **Oct 18 to Oct 22** | **REJECT** | `409 Conflict` | Partial overlap with start of active booking |
| **Oct 20 to Oct 25** | **REJECT** | `409 Conflict` | Identical interval match |
| **Oct 19 to Oct 26** | **REJECT** | `409 Conflict` | Enclosing interval superset |
| **Oct 25 to Oct 28** | **ACCEPT** | `201 Created`  | Adjacent: requested start matches existing end date |
| **Oct 18 to Oct 20** | **ACCEPT** | `201 Created`  | Adjacent: requested end matches existing start date |
| **Oct 10 to Oct 15** | **ACCEPT** | `201 Created`  | Disjoint earlier booking |
| **Oct 28 to Oct 31** | **ACCEPT** | `201 Created`  | Disjoint later booking |

### C. Operational Eligibility vs. Date Availability
- `cars.available`: Represents **operational status** (e.g., active in fleet vs. in maintenance/service). Cars with `available=False` cannot be booked and are filtered out of public rental queries.
- **Date-specific availability**: Computed dynamically across existing `ACTIVE` bookings in the database.

### D. Cancellation & Date Release Model
- When an active rental is cancelled via `DELETE /rentals/{rental_id}`, the system updates its status to `CANCELLED` and returns `HTTP 204 No Content`.
- The overlap query strictly checks `Rental.status == 'ACTIVE'`. As a result, cancelling a booking immediately releases those dates, permitting subsequent bookings for the previously reserved timeframe while preserving financial and audit history.

### E. Concurrency & Transaction Safety
- SQLite transaction isolation uses `BEGIN IMMEDIATE` transaction locking to serialize availability validation and insertion, preventing race conditions where simultaneous requests attempt to book the same vehicle for overlapping dates.
- Verified with multi-threaded concurrency unit test (`test_concurrency.py`).

---

## 6. Environment Variables

The application functions out-of-the-box with zero configuration, but supports the following environment overrides:

| Variable | Default Value | Description |
|---|---|---|
| `DATABASE_URL` | `sqlite:///./drivora.db` | SQLAlchemy database connection string |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,*` | Comma-separated list of allowed CORS origins |
| `VITE_API_BASE_URL` | `http://127.0.0.1:8000` | Backend API base URL consumed by Axios frontend |

---

## 7. Prerequisites & Installation

### Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** & **npm 9+** (tested on Node v22.13.0)
- **Java 17+** (Required only if re-generating the client SDK via OpenAPI Generator CLI)

### Automated Setup on Windows (Recommended)
Run the automated batch script from the repository root:
```cmd
setupdev.bat
```
This script will:
1. Verify Python, Node.js, and npm installations.
2. Create the `.venv` virtual environment if not present.
3. Install all backend dependencies from `requirements.txt`.
4. Install the generated `car_rental_sdk` in editable mode.
5. Apply Alembic migrations to generate `drivora.db`.
6. Load repeatable vehicle seed data (`backend/load_seed.py`).
7. Install frontend dependencies in `frontend/`.

### Manual Setup
```cmd
:: 1. Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

:: 2. Upgrade pip and install backend dependencies
python -m pip install --upgrade pip
pip install -r requirements.txt

:: 3. Run database migrations
alembic upgrade head

:: 4. Seed database fleet
python backend/load_seed.py

:: 5. Install generated SDK in editable mode
pip install -r car_rental_sdk/requirements.txt
pip install -e ./car_rental_sdk

:: 6. Install frontend packages
cd frontend
npm install
cd ..
```

---

## 8. Running the Application

### Automated Dual-Server Launch (Windows)
Run:
```cmd
runapplication.bat
```
This starts both services in separate, labeled command prompt windows:
1. **FastAPI Backend:** `http://127.0.0.1:8000` (auto-reload enabled)
2. **React Vite Frontend:** `http://localhost:5173`

### Manual Server Launch

**Terminal 1 — Backend:**
```cmd
.\.venv\Scripts\activate
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```cmd
cd frontend
npm run dev
```

### Application URLs
| Service | URL |
|---|---|
| **Frontend Web Application** | [http://localhost:5173](http://localhost:5173) |
| **Backend API Root** | [http://localhost:8000](http://localhost:8000) |
| **Interactive Swagger UI** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **OpenAPI 3.1 Specification** | [http://localhost:8000/openapi.json](http://localhost:8000/openapi.json) |
| **Health Check Endpoint** | [http://localhost:8000/health](http://localhost:8000/health) |

---

## 9. API Endpoints Specification

| Method | Endpoint | Status Codes | Description |
|---|---|---|---|
| `POST` | `/cars/` | `201`, `422` | Create a new car (`make`, `model`, `year`, `daily_rate`, `category`, `image_url`) |
| `GET` | `/cars/` | `200` | List operationally available cars (supports `make`, `min_price`, `max_price`, `search`, `start_date`, `end_date`) |
| `GET` | `/cars/{car_id}` | `200`, `404` | Retrieve vehicle details by ID |
| `POST` | `/cars/{car_id}/rent` | `201`, `400`, `404`, `409`, `422` | Create rental for interval `[start_date, end_date)`. Prevents collision |
| `GET` | `/cars/{car_id}/rentals`| `200`, `404` | List active booked intervals for vehicle's schedule display |
| `GET` | `/rentals/` | `200` | List all rental agreements with vehicle relations (supports `user_name` filter) |
| `GET` | `/rentals/{rental_id}` | `200`, `404` | Retrieve a single rental record by ID |
| `DELETE`| `/rentals/{rental_id}` | `204`, `404` | Cancel rental and immediately release reserved dates |
| `GET` | `/health` | `200` | Health check verifying database connection |
| `GET` | `/logo` | `200`, `404` | Serves original brand logo image asset |

Interactive Swagger documentation is available at: **`http://localhost:8000/docs`**

---

## 10. Database Migrations & Seeding

### Migrations (Alembic)
The database schema is strictly managed via Alembic migrations. The initial migration `596c4ab76fd6_initial_schema_cars_and_rentals_tables.py` establishes the `cars` and `rentals` tables with foreign keys, check constraints, and compound indexes:
```cmd
alembic upgrade head
```

### Fleet Seeding
The fleet is seeded with 12 vehicles spanning multiple luxury segments (*Electric*, *Grand Tourer*, *Sports*, *Luxury Sedan*, *Executive SUV*, and one car in scheduled service to test operational availability). Seeding uses idempotent `INSERT OR IGNORE` with fixed primary keys:
```cmd
python backend/load_seed.py
```

---

## 11. Backend Unit Testing

An isolated test suite runs with an independent SQLite database (`test_drivora.db`) with `PRAGMA foreign_keys = ON` enforced.

Execute the test suite:
```cmd
.\.venv\Scripts\pytest.exe backend/tests -v
```

### Verified Test Suite Results (41/41 Passed)
```
platform win32 -- Python 3.13.0, pytest-9.1.1
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

======================= 41 passed in 0.87s =======================
```

---

## 12. OpenAPI Python SDK Generation & Smoke Test

The client SDK was generated directly from the live OpenAPI specification using the official OpenAPI Generator CLI:
```cmd
npx @openapitools/openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o car_rental_sdk
```

### SDK Integration Smoke Test
Verify client-server communication using the live smoke-test script:
```cmd
.\.venv\Scripts\python.exe sdk_smoke_test.py http://127.0.0.1:8000
```

### Verified Smoke Test Output
```
=== DRIVORA SDK SMOKE TEST ===
Connecting SDK client to backend: http://127.0.0.1:8000
 [PASS] HealthApi.health_check_health_get(): status=ok, db=connected
 [PASS] CarsApi.list_available_cars_cars_get(): received 11 available vehicles
 [PASS] CarsApi.get_car_cars_car_id_get(id=1): Porsche Taycan Turbo S ($380.0/day)
 [PASS] RentalsApi.list_rentals_rentals_get(): query succeeded
========================================
 ALL SDK SMOKE TESTS PASSED SUCCESSFULLY!
========================================
```

### Python SDK Usage Example
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

## 13. Frontend Production Build

Verify the production build of the React application:
```cmd
cd frontend
npm run build
```
- **Build Output:** `dist/index.html` (1.33 kB), `dist/assets/index.css` (9.27 kB), `dist/assets/index.js` (257 kB).
- **Result:** Built cleanly in 16.96s with zero errors.

---

## 14. Troubleshooting & FAQ

1. **Port 8000 or 5173 is Already in Use:**
   - To free port 8000 on Windows PowerShell:
     ```powershell
     Get-Process -Name python, uvicorn -ErrorAction SilentlyContinue | Stop-Process -Force
     ```
   - If port 5173 is occupied, Vite will automatically select port 5174.

2. **Database Locked / Write Contention:**
   - The SQLite database engine is configured with a 30-second connection timeout (`timeout: 30`) and uses `BEGIN IMMEDIATE` to serialize write locks safely.

3. **Re-seeding the Fleet:**
   - `backend/load_seed.py` uses `INSERT OR IGNORE` with fixed primary keys, so running it multiple times is idempotent and will never create duplicate vehicles.

4. **Regenerating the Python SDK:**
   - If endpoints are added or modified, start the backend on port 8000 and run:
     ```cmd
     npx @openapitools/openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o car_rental_sdk
     ```

---

## 15. Requirements Compliance Checklist

- [x] **Brand Identity & Assets:** Original Drivora logo emblem preserved without distortion; strict brand color palette adhered to.
- [x] **Light & Dark Theme:** Dynamic toggle with CSS variables and `localStorage` persistence.
- [x] **All 5 Required Endpoints:** `POST /cars/`, `GET /cars/`, `GET /cars/{id}`, `POST /cars/{id}/rent`, `DELETE /rentals/{id}` + supporting `/rentals/`, `/rentals/{id}`, and `/health`.
- [x] **Critical Hidden Logic:** Half-open interval convention $[start, end)$, mathematical collision detection, date ordering validation, operational eligibility separation.
- [x] **Concurrency & Integrity:** SQLite `PRAGMA foreign_keys = ON`, `BEGIN IMMEDIATE` write locks, rollback on failure.
- [x] **Alembic Migrations:** Clean schema migrations with batch alteration support; no bypass via `create_all()`.
- [x] **Pytest Test Suite:** 41 comprehensive tests (including parameterized overlap matrix and multi-threaded concurrency).
- [x] **Generated Python SDK:** Built using OpenAPI Generator CLI and verified with a live smoke test.
- [x] **Frontend Architecture:** Modular React 18 + Vite, custom CSS tokens, accessible modals with keyboard dismissal.
- [x] **Windows Scripts:** `setupdev.bat` and `runapplication.bat` created and verified.
- [x] **No Docker:** Pure native Python, npm, and SQLite.
