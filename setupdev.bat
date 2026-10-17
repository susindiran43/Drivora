@echo off
setlocal enabledelayedexpansion

echo =====================================================================
echo  DRIVORA - Development Environment Setup
echo  Drive. Rent. Explore.
echo =====================================================================
echo.

:: 1. Check Python availability
echo [1/6] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ and add it to your PATH.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do echo   Found %%i

:: 2. Check Node & npm availability
echo.
echo [2/6] Checking Node.js and npm...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    echo Please install Node.js 18+ and add it to your PATH.
    pause
    exit /b 1
)
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not in PATH.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do echo   Found Node %%i
for /f "tokens=*" %%i in ('npm --version') do echo   Found npm %%i

:: 3. Create and configure Python Virtual Environment
echo.
echo [3/6] Setting up Python virtual environment (.venv)...
if not exist ".venv" (
    echo   Creating .venv virtual environment...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
) else (
    echo   Existing .venv detected.
)

:: Activate virtual environment
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip >nul 2>&1

:: 4. Install backend dependencies & SDK
echo.
echo [4/6] Installing backend dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install backend requirements.
    pause
    exit /b 1
)

if exist "car_rental_sdk" (
    echo   Installing generated SDK client into environment...
    pip install -r car_rental_sdk\requirements.txt >nul 2>&1
    pip install -e .\car_rental_sdk >nul 2>&1
)

:: 5. Apply Database Migrations & Load Seed Fleet
echo.
echo [5/6] Applying Alembic database migrations and seeding fleet...
alembic upgrade head
if %errorlevel% neq 0 (
    echo [ERROR] Alembic migrations failed.
    pause
    exit /b 1
)

python backend\load_seed.py
if %errorlevel% neq 0 (
    echo [WARNING] Seed loader encountered an issue, checking existing fleet...
)

:: 6. Install Frontend dependencies
echo.
echo [6/6] Installing frontend npm packages...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install in frontend failed.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo =====================================================================
echo  [SUCCESS] Drivora setup completed successfully!
echo  To start both backend and frontend servers, run:
echo    runapplication.bat
echo =====================================================================
echo.
exit /b 0
