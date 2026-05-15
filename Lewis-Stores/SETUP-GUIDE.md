# Lewis Stores QE Testing System - Complete Setup Guide

## Overview

This is the **Lewis Retail Group Commerce Platform** - a comprehensive test application designed specifically for Quality Engineering (QE) capstone projects at NQF Level 5. The system consists of three synchronized layers:

- **Web UI** (React + Vite) - Customer-facing e-commerce interface
- **REST API** (.NET 8 + ASP.NET Core) - Backend services and business logic
- **SQL Server Database** - Data persistence and validation layer

This system is configured for **offline testing** with all components running locally on your machine, making it perfect for students to learn and practice QA automation, API testing, and database validation.

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Web Browser (Client)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
           HTTP/CORS Requests
                   │
    ┌──────────────▼──────────────┐
    │   React Frontend (Port 3000) │
    │  - Cypress UI Test Target   │
    │  - Component Tests          │
    └──────────────┬──────────────┘
                   │
         /api/* proxy to backend
                   │
    ┌──────────────▼──────────────┐
    │   .NET 8 REST API (Port 5000)│
    │  - Postman/Newman Testing   │
    │  - Business Logic Layer      │
    │  - Authentication/JWT        │
    └──────────────┬──────────────┘
                   │
         Entity Framework Core
                   │
    ┌──────────────▼──────────────┐
    │  SQL Server Express (Local)  │
    │  - LewisStoresDb Database    │
    │  - SQL Validation Queries    │
    │  - Data Integrity Checks     │
    └──────────────────────────────┘
```

---

## Prerequisites

Before starting, ensure you have the following installed on your Windows machine:

### 1. SQL Server Express (Required)
- **Download**: [SQL Server Express 2022](https://www.microsoft.com/en-us/sql-server/sql-server-editions/express)
- **Installation Options**:
  - Choose "Express" Edition
  - Named instance: `SQLEXPRESS` (default)
  - Authentication: Windows Authentication recommended
- **Verification**:
  ```bash
  sqlcmd -C -S localhost -Q "SELECT @@VERSION"
  ```

### 2. .NET 8 SDK (Required)
- **Download**: [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Verification**:
  ```bash
  dotnet --version
  ```

### 3. Node.js & npm (Required)
- **Download**: [Node.js LTS](https://nodejs.org/)
- **Verification**:
  ```bash
  node --version
  npm --version
  ```

### 4. Git (Optional but Recommended)
- **Download**: [Git for Windows](https://git-scm.com/download/win)

### 5. SQL Server Management Studio (Optional but Recommended)
- For database exploration and direct SQL execution
- **Download**: [SSMS](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)

---

## Quick Start (5 Minutes)

### Option 1: Automated Setup (Recommended for Students)

1. **Open PowerShell as Administrator**
   - Right-click PowerShell → "Run as administrator"
   - Navigate to the project root: `cd C:\Users\YourName\Desktop\Lewis-Web\Lewis-Stores`

2. **Run the setup script**:
   ```powershell
   .\setup-scripts\01-setup-complete-system.bat
   ```
   
   This script will automatically:
   - Check for required tools
   - Create the SQL Server database
   - Load test data
   - Build the API
   - Build the frontend
   - Verify database connectivity

3. **Start both servers** (one click):

  ```powershell
  .\setup-scripts\04-start-all.bat
  ```

  This opens two terminal windows:
  - API server (http://localhost:5000)
  - Frontend server (http://localhost:3000)

  If preferred, you can still start separately with:
  - `.\setup-scripts\02-start-api.bat`
  - `.\setup-scripts\03-start-frontend.bat`

4. **Open browser**:
   - Frontend: http://localhost:3000
   - API Docs: http://localhost:5000/docs

### Option 2: Manual Setup (For Understanding Each Layer)

#### Step 1: Setup Database

```powershell
cd sql/setup
sqlcmd -C -S localhost -i 00-reset-database.sql
sqlcmd -C -S localhost -i 02-create-schema.sql
sqlcmd -C -S localhost -i 03-seed-test-data.sql
cd ../..
```

#### Step 2: Build and Run API

```powershell
cd LewisStores.Api
dotnet restore
dotnet run
# API runs on http://localhost:5000
```

#### Step 3: Build and Run Frontend

In a new terminal:

```powershell
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

---

## Test Credentials

Use these credentials to log in to the system:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| test.customer@lewisstores.local | Password123! | Customer | Standard user testing |
| sarah.johnson@lewisstores.local | Password123! | Customer | Order & payment testing |
| michael.chen@lewisstores.local | Password123! | Customer | Return & refund testing |
| emily.wilson@lewisstores.local | Password123! | Customer | Credit application testing |
| james.brown@lewisstores.local | Password123! | Customer | Support case testing |
| support.agent@lewisstores.local | Password123! | SupportAgent | Support workflow testing |
| admin@lewisstores.local | Password123! | Admin | Admin functionality testing |

---

## System Features for Testing

### Layer 1: Web UI Testing (Cypress)

The React frontend provides:
- ✅ User authentication (login/register)
- ✅ Product catalog browsing
- ✅ Shopping cart management
- ✅ Order placement and tracking
- ✅ Payment method management
- ✅ Return and refund requests
- ✅ Customer support case creation
- ✅ User dashboard with order history
- ✅ Credit application workflow

**UI Test Path**: `Lewis-Stores/` (root)

### Layer 2: API Testing (Postman/Newman)

The REST API provides endpoints for:
- ✅ Authentication (POST /api/Auth/login, /register)
- ✅ Product catalog (GET /api/Products, /Categories)
- ✅ Orders (GET/POST /api/Orders)
- ✅ Payments (GET/POST /api/PaymentMethods)
- ✅ Returns (GET/POST /api/Returns)
- ✅ Support cases (GET/POST /api/SupportCases)
- ✅ QA controls (GET/PUT /api/Qa/flags)
- ✅ Training missions (GET/POST /api/Training/missions)

**API Docs**: http://localhost:5000/docs (Swagger UI)

### Layer 3: Database Validation (SQL)

Database scripts for data validation:
- ✅ Schema validation (20 T-DB-INT tests)
- ✅ Referential integrity checks
- ✅ Data consistency verification
- ✅ Order total calculations
- ✅ Inventory consistency checks
- ✅ Audit log verification

**SQL Scripts**: `sql/validation/01-data-integrity-queries.sql`

---

## Database Configuration

### Connection Details

```
Server: localhost
Database: LewisStoresDb
Authentication: Windows Authentication
Encrypt: false (for development)

If you use a named instance, set this before running scripts:
```powershell
set SQLSERVER_INSTANCE=.\SQLEXPRESS
```
```

### Connection String (for reference)

```
Server=localhost;Database=LewisStoresDb;Trusted_Connection=true;Encrypt=false;
```

### Database Reset (For Fresh Test Runs)

To reset database to clean state with fresh seed data:

```powershell
sqlcmd -C -S localhost -i "sql\setup\00-reset-database.sql"
sqlcmd -C -S localhost -i "sql\setup\02-create-schema.sql"
sqlcmd -C -S localhost -i "sql\setup\03-seed-test-data.sql"
```

Or simply run the automated setup script again.

---

## Project Structure

```
Lewis-Stores/
├── .env                                    # Environment variables
├── .env.development                        # Development settings
├── package.json                            # Frontend dependencies
├── vite.config.js                          # Frontend build config
├── src/                                    # React source code
│   ├── App.jsx                             # Main app component
│   ├── components/                         # React components
│   ├── pages/                              # Page components
│   ├── context/                            # ShopContext (state management)
│   ├── lib/api.js                          # API client
│   └── data/mockData.js                    # Frontend mock data
│
├── LewisStores.Api/                        # .NET API Project
│   ├── Program.cs                          # Application startup
│   ├── appsettings.json                    # Connection strings
│   ├── appsettings.Development.json        # Dev overrides
│   ├── LewisStores.Api.csproj              # Project file
│   ├── Controllers/                        # API endpoints
│   │   ├── AuthController.cs               # Authentication
│   │   ├── ProductsController.cs           # Products
│   │   ├── OrdersController.cs             # Orders
│   │   ├── PaymentMethodsController.cs     # Payments
│   │   ├── ReturnsController.cs            # Returns
│   │   ├── SupportCasesController.cs       # Support
│   │   └── QaController.cs                 # QA features
│   ├── Models/AppModels.cs                 # Data models
│   └── Data/AppDbContext.cs                # EF Core context
│
├── sql/                                    # Database scripts
│   ├── setup/
│   │   ├── 00-reset-database.sql           # Database reset
│   │   ├── 01-create-database.sql          # Database creation
│   │   ├── 02-create-schema.sql            # Table schemas
│   │   └── 03-seed-test-data.sql           # Test data
│   └── validation/
│       └── 01-data-integrity-queries.sql   # Validation queries
│
└── setup-scripts/                          # Student setup helpers
    ├── 01-setup-complete-system.bat        # Full setup
    ├── 02-start-api.bat                    # Start API
    └── 03-start-frontend.bat                # Start frontend
```

---

## Testing the System (Verification)

### 1. Verify API is Running

```bash
curl -X GET http://localhost:5000/api/Products
```

Expected: JSON array of products

### 2. Verify Frontend is Running

```bash
curl -X GET http://localhost:3000
```

Expected: HTML with React app

### 3. Verify Database Connection

```powershell
sqlcmd -C -S localhost -d LewisStoresDb -Q "SELECT COUNT(*) as Products FROM Products"
```

Expected: `Products: 12` (number of seed products)

### 4. Test Authentication

```bash
curl -X POST http://localhost:5000/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.customer@lewisstores.local","password":"Password123!"}'
```

Expected: JSON response with JWT token

### 5. Verify UI Layer

Open http://localhost:3000 and:
- Login with test credentials
- View product catalog
- Add item to cart
- Navigate through pages

---

## Intentional QA Defects (For Training)

The system includes intentional defects enabled via QA Feature Flags for testing:

1. **product_duplicate_in_list** - One product may appear twice in catalog
2. **order_total_mismatch** - Order total may not match line items
3. **auth_email_case_sensitive** - Email registration may be case-sensitive
4. **returns_refund_delay** - Refunds stay pending longer than expected
5. **support_assignment_conflict** - Concurrent assignment updates may conflict

These can be toggled via: `GET/PUT /api/Qa/flags` endpoint

---

## Troubleshooting

### Issue: "Cannot connect to SQL Server"

**Solution**:
```powershell
# Verify SQL Server is running
net start mssqlserver
# Or for named instance
net start mssql$SQLEXPRESS
```

### Issue: "Port 5000 already in use"

**Solution**:
```powershell
# Change API port in Program.cs, or kill the existing process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue: "npm ERR! ERR! 404"

**Solution**:
```powershell
npm cache clean --force
npm install
```

### Issue: "dotnet command not found"

**Solution**:
- Reinstall .NET 8 SDK
- Restart your terminal/PowerShell
- Verify: `dotnet --version`

### Issue: Database transaction errors

**Solution**:
```powershell
# Reset database completely
sqlcmd -C -S localhost -i "sql\setup\00-reset-database.sql"
sqlcmd -C -S localhost -i "sql\setup\02-create-schema.sql"
sqlcmd -C -S localhost -i "sql\setup\03-seed-test-data.sql"
```

---

## QE Testing Checklist

Use this checklist to verify all three layers are working:

- [ ] **Database Layer**
  - [ ] Database exists: `LewisStoresDb`
  - [ ] Tables created successfully
  - [ ] Seed data loaded (12 products, 7 users, 5 orders)
  - [ ] Can run validation queries from `sql/validation/`

- [ ] **API Layer**
  - [ ] API runs on port 5000
  - [ ] Swagger docs accessible at `/docs`
  - [ ] Can login via POST `/api/Auth/login`
  - [ ] Can retrieve products via GET `/api/Products`
  - [ ] Database transactions work correctly

- [ ] **Frontend Layer**
  - [ ] Frontend runs on port 3000
  - [ ] Can login with test credentials
  - [ ] Can view products from API
  - [ ] Can create orders
  - [ ] Can view order history
  - [ ] Can manage payment methods

- [ ] **End-to-End Sync**
  - [ ] UI displays data from API
  - [ ] API serves data from Database
  - [ ] Database contains correct test data
  - [ ] All three layers respond correctly

---

## Next Steps for QE Students

1. **Explore the API**:
   - Open http://localhost:5000/docs
   - Try each endpoint with test data
   - Document the API contract

2. **Automate UI Tests**:
   - Create Cypress test suite in `cypress/e2e/`
   - Test user workflows (login, order, return)
   - Verify UI matches API data

3. **Create API Tests**:
   - Build Postman collections
   - Test each endpoint
   - Verify response contracts

4. **Validate Database**:
   - Run SQL validation queries
   - Verify data integrity
   - Check referential constraints

5. **Document Findings**:
   - Log defects found
   - Create test reports
   - Map tests to requirements

---

## Support & Documentation

- **API Reference**: http://localhost:5000/docs
- **Database Schema**: `sql/setup/02-create-schema.sql`
- **Test Data**: `sql/setup/03-seed-test-data.sql`
- **Validation Queries**: `sql/validation/01-data-integrity-queries.sql`

---

## For Instructors

- Monitor student progress via audit logs: `SELECT * FROM AuditLogs`
- Check mission completions: `SELECT * FROM MissionProgresses`
- Review defect reports: `SELECT * FROM DefectReports`
- Verify QA flags: `SELECT * FROM QaFeatureFlags`

---

**Version**: 1.0  
**Last Updated**: May 12, 2026  
**Target**: NQF Level 5 Quality Engineering Students
