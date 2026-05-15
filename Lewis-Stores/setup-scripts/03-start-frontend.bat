@echo off
REM Lewis Stores Frontend - Development Server Launcher
REM Starts the React frontend on http://localhost:3000

set "ROOT_DIR=%~dp0.."

echo.
echo ============================================================================
echo Lewis Stores Frontend - Starting Development Server
echo ============================================================================
echo.

cd /d "%ROOT_DIR%"

echo Frontend will be available at http://localhost:3000
echo API proxy will forward requests to http://localhost:5000/api
echo.
echo Make sure the API is running on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
