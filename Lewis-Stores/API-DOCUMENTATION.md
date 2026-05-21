# Lewis Stores REST API - Complete Endpoint Documentation

## Overview

This document provides complete documentation for the Lewis Stores REST API, designed for Quality Engineering capstone projects. The API is built with .NET 8 and ASP.NET Core, featuring JWT authentication, comprehensive error handling, and audit logging.

**Base URL**: `http://localhost:5000`  
**Swagger UI**: `http://localhost:5000/docs`  
**API Version**: v1.0

---

## Authentication

Most endpoints require JWT Bearer token authentication.

### Getting a Token

**Endpoint**: `POST /api/Auth/login`

```bash
curl -X POST http://localhost:5000/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.customer@lewisstores.local",
    "password": "Password123!"
  }'
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-001",
    "email": "test.customer@lewisstores.local",
    "role": "Customer",
    "fullName": "Test Customer One",
    "phone": "555-0001",
    "address": "123 Main St, City, State 12345"
  }
}
```

### Using the Token

Add the token to the `Authorization` header:

```bash
curl -X GET http://localhost:5000/api/Auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

---

## Authentication Endpoints

### POST /api/Auth/login
Login with email and password to get JWT token.

**Request**:
```json
{
  "email": "test.customer@lewisstores.local",
  "password": "Password123!"
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Error Response** (400/401):
```json
{
  "message": "Invalid credentials."
}
```

**Test Cases**:
- T-API-AUTH-001: Valid credentials return token
- T-API-AUTH-002: Invalid email rejected
- T-API-AUTH-003: Invalid password rejected
- T-API-AUTH-004: Case sensitivity behavior

---

### POST /api/Auth/register
Register new customer account.

**Request**:
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePassword123!",
  "phone": "555-1234",
  "address": "123 Main Street"
}
```

**Success Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

**Error Responses**:
- 400: Missing required fields
- 409: Email already exists

**Test Cases**:
- T-API-AUTH-005: Valid registration creates account
- T-API-AUTH-006: Duplicate email rejected
- T-API-AUTH-007: Invalid email format rejected

---

### GET /api/Auth/me
Get authenticated user profile.

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Success Response** (200):
```json
{
  "id": "user-001",
  "email": "test.customer@lewisstores.local",
  "fullName": "Test Customer One",
  "phone": "555-0001",
  "address": "123 Main St",
  "role": "Customer"
}
```

**Error Response** (401):
```json
{
  "message": "Unauthorized"
}
```

---

### PUT /api/Auth/me
Update authenticated user profile.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "fullName": "Test Customer Updated",
  "phone": "555-0002",
  "address": "456 Oak Avenue"
}
```

**Response** (200): Updated user object

---

## Product Endpoints

### GET /api/Products
Get all products in catalog.

**Query Parameters**:
- `category` (optional): Filter by category name
- `skip` (optional, default: 0): Number of items to skip
- `take` (optional, default: 100): Number of items to return

**Example**:
```bash
curl http://localhost:5000/api/Products?category=Furniture&take=10
```

**Response** (200):
```json
[
  {
    "id": "luca-modular",
    "title": "Luca Modular Sofa",
    "description": "Textured ivory upholstery with brushed oak legs.",
    "price": 24999.00,
    "oldPrice": 27999.00,
    "tag": "Limited Edition",
    "rating": 4.8,
    "category": "Furniture",
    "image": "https://...",
    "sku": "LEW-FUR-0001",
    "stockQuantity": 12,
    "isActive": true
  }
]
```

**Test Cases**:
- T-API-PROD-001: Get all products returns 12 items
- T-API-PROD-002: Filter by category works
- T-API-PROD-003: Pagination with skip/take works
- T-API-PROD-004: Check for duplicate products (QA defect flag)

### POST /api/Products
Create a new product with its initial stock quantity.

**Request**:
```json
{
  "title": "Nova Accent Chair",
  "description": "Compact accent chair with boucle upholstery.",
  "price": 8999,
  "oldPrice": 9999,
  "tag": "New",
  "category": "Furniture",
  "image": "https://example.com/nova-chair.jpg",
  "stockQuantity": 8
}
```

**Success Response** (201):
```json
{
  "id": "prod-...",
  "title": "Nova Accent Chair",
  "description": "Compact accent chair with boucle upholstery.",
  "price": 8999,
  "oldPrice": 9999,
  "tag": "New",
  "rating": 0,
  "category": "Furniture",
  "image": "https://example.com/nova-chair.jpg",
  "sku": "LEW-FUR-1234",
  "stockQuantity": 8,
  "isActive": true
}
```

**Error Responses**:
- 400: Missing required fields, invalid price, or negative stock quantity

**Notes**:
- `id`, `sku`, and `isActive` are generated by the API.
- `rating` is optional on create and defaults to `0` when omitted.
- `stockQuantity` is stored on the product record and returned by GET requests.

### PATCH /api/Products/{id}/stock
Update the stock quantity for an existing product.

**Request**:
```json
{
  "stockQuantity": 15
}
```

**Success Response** (200):
```json
{
  "id": "prod-...",
  "title": "Nova Accent Chair",
  "description": "Compact accent chair with boucle upholstery.",
  "price": 8999,
  "oldPrice": 9999,
  "tag": "New",
  "rating": 0,
  "category": "Furniture",
  "image": "https://example.com/nova-chair.jpg",
  "sku": "LEW-FUR-1234",
  "stockQuantity": 15,
  "isActive": true
}
```

**Error Responses**:
- 400: Negative stock quantity
- 404: Product not found

---

### GET /api/Categories
Get all product categories.

**Response** (200):
```json
{
  "categories": [
    {
      "id": "cat-1",
      "name": "Furniture",
      "description": "Architectural sofas, dining, and lounge essentials",
      "to": "/products",
      "tone": "category-furniture"
    }
  ]
}
```

**Test Cases**:
- T-API-CAT-001: Returns all 6 categories
- T-API-CAT-002: Each category has required fields

---

## Order Endpoints

### GET /api/Orders
Get all orders for authenticated user.

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Response** (200):
```json
{
  "orders": [
    {
      "id": "ORD-001-20260512",
      "date": "May 12, 2026",
      "status": "Confirmed",
      "total": 32698.00,
      "items": "Luca Modular Sofa x1, Miren Coffee Table x1"
    }
  ]
}
```

**Test Cases**:
- T-API-ORD-001: Get user orders
- T-API-ORD-002: Verify order totals match items
- T-API-ORD-003: Check order status values

---

### POST /api/Orders
Create new order.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "items": [
    {
      "productId": "luca-modular",
      "quantity": 1,
      "price": 24999.00
    }
  ],
  "total": 24999.00,
  "shippingAddress": "123 Main St, City, State 12345"
}
```

**Response** (201):
```json
{
  "id": "ORD-NEW-001",
  "date": "May 13, 2026",
  "status": "Pending",
  "total": 24999.00,
  "items": "Luca Modular Sofa x1"
}
```

**Test Cases**:
- T-API-ORD-004: Create valid order
- T-API-ORD-005: Order total calculation correct
- T-API-ORD-006: Verify order persists in database
- T-API-ORD-007: Check for order total mismatch (QA defect)

---

## Payment Method Endpoints

### GET /api/PaymentMethods
Get user's saved payment methods.

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Response** (200):
```json
{
  "paymentMethods": [
    {
      "id": 1,
      "cardholderName": "Test Customer One",
      "last4": "1111",
      "brand": "Visa",
      "expiry": "12/26",
      "isDefault": true
    }
  ]
}
```

**Test Cases**:
- T-API-PAY-001: Get user payment methods
- T-API-PAY-002: Verify default payment method flag

---

### POST /api/PaymentMethods
Add new payment method.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "cardholderName": "Test Customer One",
  "last4": "2222",
  "brand": "Mastercard",
  "expiry": "08/27",
  "isDefault": false
}
```

**Response** (201):
```json
{
  "id": 2,
  "cardholderName": "Test Customer One",
  "last4": "2222",
  "brand": "Mastercard",
  "expiry": "08/27",
  "isDefault": false
}
```

**Test Cases**:
- T-API-PAY-003: Add valid payment method
- T-API-PAY-004: Verify payment method persists
- T-API-PAY-005: CVV validation (if implemented)

---

### DELETE /api/PaymentMethods/{id}
Remove payment method.

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Response** (204): No content (success)

**Test Cases**:
- T-API-PAY-006: Delete existing payment method
- T-API-PAY-007: Cannot delete non-existent payment

---

## Return Request Endpoints

### GET /api/Returns
Get user's return requests.

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Response** (200):
```json
{
  "returns": [
    {
      "id": 1,
      "orderId": "ORD-003-20260510",
      "reason": "Item defective",
      "status": "Approved",
      "requestedAmount": 22999.00,
      "approvedAmount": 22999.00,
      "resolutionNotes": "Full refund issued to original payment method"
    }
  ]
}
```

---

### POST /api/Returns
Create return request.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "orderId": "ORD-001-20260512",
  "reason": "Product damaged",
  "requestedAmount": 32698.00
}
```

**Response** (201):
```json
{
  "id": 3,
  "orderId": "ORD-001-20260512",
  "status": "PendingReview",
  "requestedAmount": 32698.00,
  "approvedAmount": null
}
```

**Test Cases**:
- T-API-RET-001: Create return request
- T-API-RET-002: Verify return status workflow
- T-API-RET-003: Check refund delay behavior (QA defect)
- T-API-RET-004: Verify inventory restoration on return

---

### PUT /api/Returns/{id}/status
Update return request status.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "status": "Approved",
  "approvedAmount": 22999.00,
  "resolutionNotes": "Full refund processed"
}
```

**Response** (200): Updated return request object

---

## Support Case Endpoints

### GET /api/SupportCases
Get support cases.

**Headers**:
```
Authorization: Bearer <TOKEN>
```

**Query Parameters**:
- `status` (optional): Filter by status (Open, Assigned, Resolved)

**Response** (200):
```json
{
  "supportCases": [
    {
      "id": 1,
      "orderId": "ORD-001-20260512",
      "subject": "Delivery inquiry",
      "description": "When will my order be delivered?",
      "status": "Open",
      "priority": "High",
      "assignedToUserId": "agent-support-001"
    }
  ]
}
```

---

### POST /api/SupportCases
Create new support case.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "orderId": "ORD-001-20260512",
  "subject": "Delivery inquiry",
  "description": "When will my order be delivered?",
  "priority": "High"
}
```

**Response** (201):
```json
{
  "id": 4,
  "orderId": "ORD-001-20260512",
  "subject": "Delivery inquiry",
  "description": "When will my order be delivered?",
  "status": "Open",
  "priority": "High"
}
```

**Test Cases**:
- T-API-SUP-001: Create support case
- T-API-SUP-002: Verify case assigned to agent
- T-API-SUP-003: Check assignment conflict (QA defect)

---

### PUT /api/SupportCases/{id}/assign
Assign support case to agent.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "assignedToUserId": "agent-support-001"
}
```

**Response** (200): Updated support case object

---

### PUT /api/SupportCases/{id}/status
Update support case status.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "status": "Resolved"
}
```

**Response** (200): Updated support case object

---

## QA Feature Endpoints

### GET /api/Qa/flags
Get all QA feature flags.

**Response** (200):
```json
{
  "flags": [
    {
      "key": "product_duplicate_in_list",
      "description": "Intentional defect: duplicate one product on catalog list responses.",
      "isEnabled": true
    }
  ]
}
```

**Test Cases**:
- T-API-QA-001: Retrieve all feature flags
- T-API-QA-002: Verify flag descriptions

---

### PUT /api/Qa/flags/{key}
Toggle QA feature flag.

**Headers**:
```
Content-Type: application/json
```

**Request**:
```json
{
  "isEnabled": false
}
```

**Response** (200):
```json
{
  "key": "product_duplicate_in_list",
  "isEnabled": false
}
```

**Test Cases**:
- T-API-QA-003: Enable/disable feature flags
- T-API-QA-004: Verify defects appear/disappear

---

### GET /api/Qa/audit
Get audit log entries.

**Query Parameters**:
- `take` (optional, default: 100): Number of records
- `eventType` (optional): Filter by event type

**Response** (200):
```json
{
  "auditEntries": [
    {
      "id": 1,
      "timestampUtc": "2026-05-12T10:00:00Z",
      "eventType": "auth.login.success",
      "userId": "user-001",
      "severity": "Info",
      "details": "{\"source\":\"api\"}"
    }
  ]
}
```

**Test Cases**:
- T-API-QA-005: Retrieve audit logs
- T-API-QA-006: Filter by event type
- T-API-QA-007: Verify audit completeness

---

## Credit Application Endpoints

### POST /api/Credit/apply
Submit credit application.

**Headers**:
```
Authorization: Bearer <TOKEN>
Content-Type: application/json
```

**Request**:
```json
{
  "idNumber": "ID-NEW-001",
  "employmentStatus": "Employed",
  "monthlyIncome": 5000.00,
  "monthlyExpenses": 2000.00
}
```

**Response** (201):
```json
{
  "id": 5,
  "userId": "user-new",
  "status": "Pending",
  "idNumber": "ID-NEW-001",
  "employmentStatus": "Employed",
  "monthlyIncome": 5000.00,
  "monthlyExpenses": 2000.00
}
```

**Test Cases**:
- T-API-CRED-001: Submit credit application
- T-API-CRED-002: Verify income/expense validation
- T-API-CRED-003: Check application status workflow

---

## Error Handling

All endpoints follow standard HTTP status codes:

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET/PUT request |
| 201 | Created | Successful POST (resource created) |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing/invalid authentication token |
| 409 | Conflict | Duplicate email on registration |
| 500 | Server Error | Unexpected server exception |

**Error Response Format**:
```json
{
  "message": "Descriptive error message",
  "details": "Additional context (if available)"
}
```

---

## Testing Checklist

Use this to verify all endpoints work correctly:

- [ ] **Authentication** (4 tests)
  - [ ] Login with valid credentials
  - [ ] Login with invalid credentials
  - [ ] Register new account
  - [ ] Get authenticated user profile

- [ ] **Products** (4 tests)
  - [ ] Get all products
  - [ ] Filter products by category
  - [ ] Pagination works
  - [ ] Check for duplicate products

- [ ] **Orders** (5 tests)
  - [ ] Get user orders
  - [ ] Create new order
  - [ ] Verify order totals
  - [ ] Check for total mismatch defect
  - [ ] Query orders from database

- [ ] **Payments** (3 tests)
  - [ ] Get saved payment methods
  - [ ] Add new payment method
  - [ ] Delete payment method

- [ ] **Returns** (4 tests)
  - [ ] Create return request
  - [ ] Update return status
  - [ ] Check refund delay
  - [ ] Verify inventory restoration

- [ ] **Support** (3 tests)
  - [ ] Create support case
  - [ ] Assign case to agent
  - [ ] Update case status

- [ ] **QA Controls** (3 tests)
  - [ ] Get feature flags
  - [ ] Toggle feature flag
  - [ ] Verify defect behavior

---

**For complete testing, see**: `sql/validation/01-data-integrity-queries.sql`
