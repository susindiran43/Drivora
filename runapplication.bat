@echo off
setlocal enabledelayedexpansion

echo =====================================================================
echo  DRIVORA - Launching Application Servers
echo  Drive. Rent. Explore.
echo =====================================================================
echo.

:: 1. Verify Virtual Environment
if not exist ".venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment (.venv) not found.
    echo Please run setupdev.bat first to configure the environment.
    pause
    exit /b 1
)

:: 2. Verify Frontend node_modules
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend dependencies not found in frontend\node_modules.
    echo Please run setupdev.bat first.
    pause
    exit /b 1
)

:: 3. Run database migrations to ensure schema is up to date
call .venv\Scripts\activate.bat
echo [1/3] Ensuring database schema is up-to-date with Alembic...
alembic upgrade head
if %errorlevel% neq 0 (
    echo [ERROR] Database upgrade failed.
    pause
    exit /b 1
)

:: Ensure seed data is loaded if table is empty
python backend\load_seed.py >nul 2>&1

:: 4. Start Backend Server (FastAPI on port 8000)
echo [2/3] Starting Drivora FastAPI Backend on http://localhost:8000 ...
start "Drivora Backend API [Port 8000]" cmd /k "title Drivora Backend API && call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload"

:: 5. Start Frontend Server (Vite React on port 5173)
echo [3/3] Starting Drivora Frontend on http://localhost:5173 ...
start "Drivora Frontend [Port 5173]" cmd /k "title Drivora Frontend && cd frontend && npm run dev"

echo.
echo =====================================================================
echo  DRIVORA IS NOW RUNNING!
echo.
echo   Frontend Application:    http://localhost:5173
echo   Backend API:             http://localhost:8000
echo   Interactive Swagger UI:  http://localhost:8000/docs
echo   OpenAPI JSON Spec:       http://localhost:8000/openapi.json
echo   Health Status:           http://localhost:8000/health
echo.
echo  Keep both server terminal windows open while testing.
echo  To run tests in a separate terminal:
echo    .\.venv\Scripts\pytest.exe backend\tests -v
echo  To run the SDK smoke test:
echo    .\.venv\Scripts\python.exe sdk_smoke_test.py
echo =====================================================================
echo.
exit /b 0
