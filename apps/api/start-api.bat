@echo off
echo.
echo ========================================
echo   Starting Themis API Server
echo ========================================
echo.

cd /d "%~dp0"

echo Building API...
call pnpm run build
if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo Starting server on http://localhost:4000
echo API Docs: http://localhost:4000/api/docs
echo.

node dist\main.js

pause
