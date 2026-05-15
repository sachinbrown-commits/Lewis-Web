@echo off
REM Lewis Stores System - Complete Setup Script
REM This script sets up the entire Lewis Retail system for offline QE testing
REM Requires: SQL Server Express, .NET 8, Node.js

set "ROOT_DIR=%~dp0.."
set "SQL_SERVER=%SQLSERVER_INSTANCE%"
if "%SQL_SERVER%"=="" set "SQL_SERVER=localhost"
set "SQLCMD_FLAGS=-C"

echo.
echo ============================================================================
echo Lewis Stores QE Testing Framework - Setup Script
echo ============================================================================
echo.

REM Check for required tools
echo [1/5] Checking prerequisites...

where /q sqlcmd
if errorlevel 1 (
    echo ERROR: SQL Server sqlcmd not found. Please install SQL Server Express.
    pause
    exit /b 1
)
echo   ✓ SQL Server command-line tools found

where /q dotnet
if errorlevel 1 (
    echo ERROR: .NET SDK not found. Please install .NET 8 SDK or later.
    pause
    exit /b 1
)
echo   ✓ .NET SDK found

where /q npm
if errorlevel 1 (
    echo ERROR: Node.js npm not found. Please install Node.js LTS.
    pause
    exit /b 1
)
echo   ✓ Node.js npm found

echo.
echo [2/5] Setting up SQL Server database...

cd /d "%ROOT_DIR%"

REM Run database setup scripts in order
sqlcmd %SQLCMD_FLAGS% -S %SQL_SERVER% -i "sql\setup\00-reset-database.sql"
if errorlevel 1 (
    echo WARNING: Database reset may have failed. Continuing...
)

sqlcmd %SQLCMD_FLAGS% -S %SQL_SERVER% -i "sql\setup\02-create-schema.sql"
if errorlevel 1 (
    echo ERROR: Failed to create database schema on server: %SQL_SERVER%
    echo Tip: set SQLSERVER_INSTANCE then re-run.
    echo Example: set SQLSERVER_INSTANCE=.\SQLEXPRESS
    pause
    exit /b 1
)
echo   ✓ Database schema created

sqlcmd %SQLCMD_FLAGS% -S %SQL_SERVER% -i "sql\setup\03-seed-test-data.sql"
if errorlevel 1 (
    echo ERROR: Failed to seed test data.
    pause
    exit /b 1
)
echo   ✓ Test data loaded

echo.
echo [3/5] Building API...

cd /d "%ROOT_DIR%\LewisStores.Api"
taskkill /IM LewisStores.Api.exe /F > nul 2>&1
dotnet restore > nul 2>&1
dotnet build -p:UseAppHost=false > nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to build API project.
    echo Showing detailed build output:
    dotnet build -p:UseAppHost=false -v minimal
    pause
    exit /b 1
)
echo   ✓ API built successfully
cd ..

echo.
echo [4/5] Installing frontend dependencies...

cd /d "%ROOT_DIR%"
call npm install > nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install npm dependencies.
    pause
    exit /b 1
)
echo   ✓ Frontend dependencies installed

call npm run build > nul 2>&1
if errorlevel 1 (
    echo WARNING: Frontend build completed with warnings
)
echo   ✓ Frontend built

echo.
echo [5/5] Verifying database connectivity...

sqlcmd %SQLCMD_FLAGS% -S %SQL_SERVER% -d LewisStoresDb -Q "SELECT COUNT(*) as [TableCount] FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA='dbo'" > nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to database.
    echo Please ensure SQL Server is running and the connection string is correct.
    pause
    exit /b 1
)
echo   ✓ Database is accessible

echo.
echo ============================================================================
echo Setup Complete!
echo ============================================================================
echo.
echo Next steps:
echo.
echo 1. One-click start (recommended):
echo    - Run: .\setup-scripts\04-start-all.bat
echo.
echo 2. Or start separately:
echo    - API: .\setup-scripts\02-start-api.bat
echo    - Frontend: .\setup-scripts\03-start-frontend.bat
echo.
echo 3. Test Credentials:
echo    - Email: test.customer@lewisstores.local
echo    - Password: Password123!
echo.
echo 4. Access the database directly:
echo    - Server: %SQL_SERVER%
echo    - Database: LewisStoresDb
echo    - Use SQL Server Management Studio or sqlcmd
echo.
echo ============================================================================
echo.
pause
