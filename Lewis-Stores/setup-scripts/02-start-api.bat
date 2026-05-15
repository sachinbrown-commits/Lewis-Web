@echo off
REM Lewis Stores API - Development Server Launcher
REM Starts the .NET 8 API on http://localhost:5000

set "ROOT_DIR=%~dp0.."

echo.
echo ============================================================================
echo Lewis Stores API - Starting Development Server
echo ============================================================================
echo.

cd /d "%ROOT_DIR%\LewisStores.Api"

echo Running API on http://localhost:5000
echo Swagger documentation available at http://localhost:5000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

dotnet run --configuration Debug

pause
