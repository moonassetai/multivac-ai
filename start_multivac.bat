@echo off
SETLOCAL EnableExtensions EnableDelayedExpansion

TITLE Multivac AI Launcher

echo ===================================================
echo      Multivac AI - System Initialization
echo ===================================================

:: 1. Check for Python
python --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10 or 3.11 from python.org
    pause
    exit /b
)

:: 2. Check/Create Virtual Environment
IF NOT EXIST "venv" (
    echo [INFO] Creating virtual environment 'venv'...
    python -m venv venv
    IF %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b
    )
)

:: 3. Activate Venv
call venv\Scripts\activate.bat

:: 4. Upgrade Pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

:: 5. Install Dependencies
echo [INFO] Installing requirements...
pip install -r requirements.txt
IF %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install requirements.
    pause
    exit /b
)

:: 6. Install Playwright Browsers
echo [INFO] Checking Playwright browsers...
playwright install chromium
IF %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Playwright install failed. Browsing might not work.
)

:: 7. Check for .env
IF NOT EXIST ".env" (
    echo [WARNING] .env file not found!
    echo Please create a .env file with your GEMINI_API_KEY.
    echo You can copy .env.example to start.
    pause
)

:: 8. Start Backend Server
echo [INFO] Starting Multivac Core...
echo [INFO] If successful, you will see "Multivac System Online"
python backend/server.py

pause
