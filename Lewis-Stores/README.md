# Lewis Stores QE Testing Platform

**A comprehensive e-commerce platform designed for NQF Level 5 Quality Engineering capstone projects.**

## 🎯 Project Overview

Lewis Stores is a **full-stack, offline-capable testing platform** specifically built for Quality Engineering students to learn and practice:

- **Web UI Testing** (Cypress) - Test the React frontend
- **API Testing** (Postman/Newman) - Test the REST API endpoints  
- **Database Testing** (SQL) - Validate data integrity and consistency
- **End-to-End Testing** - Test complete workflows across all three layers

All three layers run locally on your machine, making it perfect for capstone projects requiring offline testing and local development.

---

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 3000) ← Cypress UI Tests
│  (Vite Build)   │
└────────┬────────┘
         │ HTTP/API Calls
         ▼
┌─────────────────┐
│  .NET 8 REST    │ (Port 5000) ← Postman/Newman API Tests
│  API Server     │
└────────┬────────┘
         │ Entity Framework
         ▼
┌─────────────────┐
│  SQL Server     │ ← SQL Validation Queries
│  Database       │
└─────────────────┘
```

---

## ✅ Quick Start (5 Minutes)

### Prerequisites
- Windows 10/11
- [SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-editions/express)
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js LTS](https://nodejs.org/)

### Automated Setup
```powershell
# Run from project root
.\setup-scripts\01-setup-complete-system.bat

# One-click start API + frontend in separate windows
.\setup-scripts\04-start-all.bat
```

### Manual Setup
```powershell
# Terminal 1: Start API (Port 5000)
cd LewisStores.Api
dotnet run

# Terminal 2: Start Frontend (Port 3000)  
npm run dev
```

**Access Points**:
- Frontend: http://localhost:3000
- API Docs: http://localhost:5000/docs
- Database: `.\SQLEXPRESS` / `LewisStoresDb`

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [SETUP-GUIDE.md](./SETUP-GUIDE.md) | Complete setup and configuration guide for students |
| [API-DOCUMENTATION.md](./API-DOCUMENTATION.md) | Endpoint reference with curl examples for API testing |
| [sql/validation/](./sql/validation/) | 20 SQL validation queries for database layer testing |

---

## 🔐 Test Credentials

```
Email: test.customer@lewisstores.local
Password: Password123!
```

Additional test accounts available in [SETUP-GUIDE.md](./SETUP-GUIDE.md#test-credentials)

---

## 📂 Project Structure

```
Lewis-Stores/
├── SETUP-GUIDE.md              ← START HERE for students
├── API-DOCUMENTATION.md        ← API endpoint reference
├── src/                        # React frontend source
├── LewisStores.Api/            # .NET API project
├── sql/                        # Database scripts
│   ├── setup/                  # Database creation & seed data
│   └── validation/             # Integrity validation queries
└── setup-scripts/              # Automated setup helpers
```

---

## 🧪 Testing the Three Layers

### Layer 1: Web UI Testing
```bash
# Navigate to products
http://localhost:3000

# Login with test credentials
# Add products to cart
# Place an order
# Check order history
```

### Layer 2: API Testing
```bash
# Get all products
curl http://localhost:5000/api/Products

# Login and get token
curl -X POST http://localhost:5000/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.customer@lewisstores.local","password":"Password123!"}'

# See complete endpoint list in API-DOCUMENTATION.md
```

### Layer 3: Database Testing
```powershell
# Run validation queries
sqlcmd -S .\SQLEXPRESS -d LewisStoresDb -i "sql\validation\01-data-integrity-queries.sql"

# Or use SQL Server Management Studio to execute queries
```

---

## 🎯 Key Features

✅ **Offline Testing** - Everything runs locally  
✅ **Complete Data** - 12 products, 7 users, 5 orders pre-seeded  
✅ **Authentication** - JWT-based API auth with test accounts  
✅ **Full Workflows** - Login → Browse → Cart → Order → Return  
✅ **Intentional Defects** - QA feature flags for testing detection  
✅ **Audit Logging** - Track all user actions for compliance testing  
✅ **Multiple Personas** - Customer, support agent, admin roles  
✅ **Database Validation** - 20 SQL queries for layer 3 testing  

---

## 🚀 For QE Students

This system provides everything needed for a comprehensive capstone project:

1. **Functional Testing** - Test each feature in isolation
2. **Integration Testing** - Test workflows across UI, API, and Database
3. **Data Validation** - Verify database consistency and integrity
4. **Defect Detection** - Find the intentional bugs introduced by QA flags
5. **Reporting** - Generate test reports and evidence
6. **JIRA Integration** - Log defects with full context

### Suggested Test Coverage (100 Tests Total)
- 40 Cypress UI tests (Web layer)
- 40 Postman API tests (API layer)
- 20 SQL validation tests (Database layer)

---

## 📖 Getting Help

1. **Setup Issues** - See [SETUP-GUIDE.md](./SETUP-GUIDE.md#troubleshooting)
2. **API Questions** - See [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
3. **Database Help** - See [sql/validation/01-data-integrity-queries.sql](./sql/validation/01-data-integrity-queries.sql)
4. **API Swagger** - http://localhost:5000/docs

---

## 🔧 Configuration

### Connection String
```
Server=.\SQLEXPRESS
Database=LewisStoresDb
Authentication=Windows
```

Configured in: [appsettings.json](./LewisStores.Api/appsettings.json)

### API Port
Default: `5000`  
Can be changed in [Program.cs](./LewisStores.Api/Program.cs)

### Frontend Port
Default: `3000`  
Can be changed in [vite.config.js](./vite.config.js)

---

## 📋 Development Commands

```powershell
# Frontend
npm install       # Install dependencies
npm run dev       # Start dev server (port 3000)
npm run build     # Build for production
npm run lint      # Run ESLint

# API
cd LewisStores.Api
dotnet restore    # Restore packages
dotnet build      # Build project
dotnet run        # Run API (port 5000)
dotnet test       # Run unit tests (if available)

# Database
sqlcmd -S .\SQLEXPRESS -i "sql/setup/00-reset-database.sql"
```

---

## 🔄 Database Reset

To reset the database to clean state with fresh seed data:

```powershell
.\setup-scripts\01-setup-complete-system.bat
```

Or manually:
```powershell
sqlcmd -S .\SQLEXPRESS -i "sql\setup\00-reset-database.sql"
sqlcmd -S .\SQLEXPRESS -i "sql\setup\02-create-schema.sql"
sqlcmd -S .\SQLEXPRESS -i "sql\setup\03-seed-test-data.sql"
```

---

## 📊 Test Data Included

- **Products**: 12 items across 6 categories (Furniture, Electronics, etc.)
- **Users**: 7 test accounts (5 customers, 1 support agent, 1 admin)
- **Orders**: 5 sample orders with different statuses
- **Payment Methods**: 5 saved cards for payment testing
- **Support Cases**: 3 open/assigned cases for support workflow testing
- **Defect Reports**: 2 sample reports for mission testing
- **Returns**: 2 return requests in different statuses

All data is realistic and suitable for comprehensive testing scenarios.

---

## 🎓 Learning Path for QE Students

1. **Week 1**: Explore the system
   - Set up locally
   - Login and browse products
   - Review API endpoints
   - Run database validation queries

2. **Week 2-3**: Create automation tests
   - Write Cypress tests for UI workflows
   - Create Postman collections for API endpoints
   - Document test cases with IDs

3. **Week 4-5**: Execute and report
   - Run full test suites
   - Find the intentional defects
   - Create JIRA defect reports
   - Calculate coverage metrics

4. **Week 6-8**: Document and present
   - Create RTM (Requirements Traceability Matrix)
   - Generate test reports
   - Record demo video
   - Present findings

---

## ✨ Intentional QA Defects

The system includes intentional defects enabled via QA Feature Flags for training purposes:

1. **product_duplicate_in_list** - One product may appear twice
2. **order_total_mismatch** - Order total may not match items
3. **auth_email_case_sensitive** - Email check may be case-sensitive
4. **returns_refund_delay** - Refunds stay pending longer than expected
5. **support_assignment_conflict** - Concurrent assignment updates conflict

Toggle via: `GET/PUT /api/Qa/flags`

---

## 📝 Requirements Traceability

This platform covers the complete Business Requirements Document (BRD):

✅ FR-001: User Authentication & Session Management  
✅ FR-002: Order Management  
✅ FR-003: Payment Processing  
✅ FR-004: Shipment & Delivery Tracking  
✅ FR-005: Returns & Refunds  
✅ FR-006: Dashboard & Account Management  
✅ FR-007: Data Consistency & Cross-Layer Validation  

See [SETUP-GUIDE.md](./SETUP-GUIDE.md) for detailed requirements coverage.

---

## 🛠️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + Vite | 19.2 + 8.0 |
| API | .NET ASP.NET Core | 8.0 |
| Database | SQL Server | Express 2022 |
| Authentication | JWT Bearer | Standard |
| Testing Tools | Cypress, Postman, SQLCMD | Latest |

---

## 📞 Support for Instructors

Monitor student progress:
```sql
-- Check completed missions
SELECT * FROM MissionProgresses WHERE Status = 'Completed'

-- View defect reports submitted  
SELECT * FROM DefectReports WHERE Status = 'Submitted'

-- Review audit logs
SELECT TOP 100 * FROM AuditLogs ORDER BY TimestampUtc DESC
```

---

## 📄 License

This project is for educational purposes as part of the NQF Level 5 Quality Engineering capstone program.

---

**Ready to start?** → [SETUP-GUIDE.md](./SETUP-GUIDE.md)  
**Need API reference?** → [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)  
**Want SQL queries?** → [sql/validation/01-data-integrity-queries.sql](./sql/validation/01-data-integrity-queries.sql)
	https://localhost:5001/docs

## Deployment

This repository includes a Render blueprint at [render.yaml](render.yaml) for API-only deployment.

### API on Render (recommended)

1. Push this repo to GitHub.
2. In Render, click New + and choose Blueprint.
3. Select this repository.
4. Render will create:
	- lewis-stores-api (dotnet web service)

### API on Render (manual)

Create one service:

1. API service (Web Service)
	- Root directory: LewisStores.Api
	- Runtime: .NET
	- Build command: dotnet restore && dotnet publish -c Release -o out
	- Start command: dotnet out/LewisStores.Api.dll
	- Environment variables:
	  - ASPNETCORE_ENVIRONMENT=Production
	  - CONNECTION_STRINGS__DEFAULT_CONNECTION=Data Source=/var/data/lewis.db
	- Persistent Disk:
	  - Mount path: /var/data
	  - Size: 1 GB

### Frontend on Vercel

1. Import this repo into Vercel.
2. Framework preset: Vite.
3. Build command: npm run build.
4. Output directory: dist.
5. Set environment variable:
	- VITE_API_BASE_URL=https://<your-render-api>.onrender.com

## Production Notes

- The API now binds automatically to Render's PORT environment variable.
- SQLite should be stored on a mounted disk path (/var/data) so data survives redeploys.
- SQLite inside the API is fine for smaller workloads, but it is not ideal for high concurrency or multi-instance scaling.
- Swagger/OpenAPI UI is available at /docs and the JSON at /docs/v1/openapi.json.
