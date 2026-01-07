@echo off
SETLOCAL EnableExtensions EnableDelayedExpansion

TITLE Multivac AI Launcher - May 31, 2026

echo ===================================================
echo      Multivac AI - System Initialization
echo      "The Last Question" - May 31, 2026
echo ===================================================

:: 1. Check for Python
set PYTHON_CMD=python

%PYTHON_CMD% --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] 'python' command not found or alias issue. Checking 'py'...
    py --version >nul 2>&1
    IF !ERRORLEVEL! EQU 0 (
        set PYTHON_CMD=py
        echo [INFO] Found Python Launcher 'py'. Using it.
    ) ELSE (
        echo [ERROR] Python is not installed or not in PATH.
        echo Please install Python 3.10 or 3.11 from python.org
        echo.
        echo CRITICAL: Python 3.12+ is NOT supported due to dependency issues.
        pause
        exit /b
    )
)

:: 2. Check/Create Virtual Environment
IF NOT EXIST "venv_core" (
    echo [INFO] Creating virtual environment 'venv_core'...
    %PYTHON_CMD% -m venv venv_core
    IF %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment.
        echo.
        echo TIP: Ensure you have Python 3.10 or 3.11 installed.
        pause
        exit /b
    )
)

:: 3. Activate Venv
echo [INFO] Activating virtual environment...
call venv_core\Scripts\activate.bat

:: 4. Upgrade Pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip --quiet

:: 5. Install Dependencies
echo [INFO] Installing requirements...
echo [INFO] This may take a few minutes on first run...
pip install -r requirements.txt --prefer-binary
IF %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to install requirements.
    echo.
    echo TROUBLESHOOTING:
    echo - Ensure you're using Python 3.10 or 3.11 (NOT 3.12+)
    echo - Try running: pip install --upgrade pip setuptools wheel
    echo - Check your internet connection
    echo - If numpy fails, install Visual C++ Build Tools from:
    echo   https://visualstudio.microsoft.com/visual-cpp-build-tools/
    echo.
    pause
    exit /b
)

:: 6. Install Playwright Browsers
echo [INFO] Checking Playwright browsers...
playwright install chromium --quiet
IF %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Playwright install failed. Web browsing might not work.
    echo [INFO] You can install it later with: playwright install chromium
)

:: 7. Check for .env
IF NOT EXIST ".env" (
    echo.
    echo [WARNING] .env file not found!
    echo.
    echo Please create a .env file with your GEMINI_API_KEY.
    echo You can copy .env.example to start:
    echo   copy .env.example .env
    echo.
    echo Then edit .env and add your API key from:
    echo   https://aistudio.google.com/app/apikey
    echo.
    pause
)

:: 8. Start Backend Server
echo.
echo ===================================================
echo [INFO] Starting Multivac Core...
echo [INFO] If successful, you will see "Multivac System Online"
echo ===================================================
echo.
python backend/server.py

pause
