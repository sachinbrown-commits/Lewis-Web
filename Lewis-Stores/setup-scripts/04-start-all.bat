@echo off
REM Lewis Stores Full Stack - One-Click Launcher
REM Opens API and frontend in separate terminals

set "ROOT_DIR=%~dp0.."

echo.
echo ============================================================================
echo Lewis Stores Full Stack Launcher
echo ============================================================================
echo.
echo Starting API and Frontend in separate windows...
echo.

start "Lewis Stores API" cmd /k "cd /d ""%ROOT_DIR%\LewisStores.Api"" && dotnet run --configuration Debug"
start "Lewis Stores Frontend" cmd /k "cd /d ""%ROOT_DIR%"" && npm run dev"

echo API expected at: http://localhost:5000
echo Swagger docs at: http://localhost:5000/docs
echo Frontend expected at: http://localhost:3000
echo.
echo Close each terminal window to stop that service.
echo.
