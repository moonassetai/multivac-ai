@echo off
SETLOCAL EnableExtensions EnableDelayedExpansion
TITLE Multivac AI Launcher - May 31, 2026

echo ===================================================
echo      Multivac AI - System Initialization
echo      "The Last Question" - May 31, 2026
echo ===================================================

:: 1. Try Conda First
echo [INFO] Checking for Conda...
call conda --version >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo [INFO] Conda detected. Using 'multivac-core' environment.
    
    :: Attempt to run server check if env exists
    call conda run -n multivac-core python --version >nul 2>&1
    IF !ERRORLEVEL! NEQ 0 (
        echo [INFO] 'multivac-core' environment not found. Creating...
        call conda create -y -n multivac-core python=3.11
    )

    echo [INFO] Verifying key dependencies...
    call conda run -n multivac-core pip install -r requirements.txt --prefer-binary >nul 2>&1
    
    echo.
    echo ===================================================
    echo [INFO] Starting Multivac Core...
    echo [INFO] If successful, you will see "Multivac System Online"
    echo ===================================================
    echo.
    call conda run -n multivac-core --no-capture-output python backend/server.py
    
    echo.
    echo [INFO] Server process ended.
    pause
    exit /b
)

:: 2. Fallback to Standard Python Checks
set PYTHON_CMD=python

%PYTHON_CMD% --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    echo [INFO] 'python' command not found. Checking 'py'...
    py --version >nul 2>&1
    IF !ERRORLEVEL! EQU 0 (
        set PYTHON_CMD=py
    ) ELSE (
        echo [ERROR] No Python found. Please install Miniconda or Python 3.11.
        pause
        exit /b
    )
)

:: Check for compatible version (Rough check)
%PYTHON_CMD% --version | findstr "3.10 3.11" >nul
IF %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Your Python version might be incompatible. 3.10/3.11 is recommended.
    echo [INFO] Attempting to continue anyway...
)

:: Setup Venv
IF NOT EXIST "venv_core" (
    echo [INFO] Creating virtual environment 'venv_core'...
    %PYTHON_CMD% -m venv venv_core
)

echo [INFO] Activating virtual environment...
call venv_core\Scripts\activate.bat

echo [INFO] Upgrading pip...
python -m pip install --upgrade pip --quiet

echo [INFO] Installing requirements...
pip install -r requirements.txt --prefer-binary

echo [INFO] Checking Playwright...
playwright install chromium --quiet

echo.
echo ===================================================
echo [INFO] Starting Multivac Core (Venv Mode)...
echo ===================================================
python backend/server.py

pause
