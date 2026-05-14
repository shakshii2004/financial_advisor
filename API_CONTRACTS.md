# API_CONTRACTS.md

## API Envelope
All API responses must follow:
{
  "success": true,
  "message": "Request successful",
  "data": {}
}

## Core Endpoints (V1)
- POST   /api/register
- POST   /api/login
- POST   /api/logout
- POST   /api/email/verify
- POST   /api/email/resend
- GET    /api/user
- GET    /api/startup
- POST   /api/startup
- PUT    /api/startup
- POST   /api/expenses
- GET    /api/expenses
- PUT    /api/expenses/{id}
- DELETE /api/expenses/{id}
- POST   /api/revenues
- GET    /api/revenues
- PUT    /api/revenues/{id}
- DELETE /api/revenues/{id}
- POST   /api/funding-requests
- GET    /api/funding-requests
- PUT    /api/funding-requests/{id}
- GET    /api/investor/dashboard
- GET    /api/admin/users
- POST   /api/admin/ban-user
- GET    /api/reports
- POST   /api/reports/export

## Update Policy
Update this file with every new or changed API contract.

---

#### Startup CRUD

- **GET /api/startups** — List all startups for authenticated founder
- **GET /api/startups/{id}** — Get a single startup (founder only)
- **POST /api/startups** — Create a new startup
- **PUT /api/startups/{id}** — Update a startup
- **DELETE /api/startups/{id}** — Delete a startup

**Request/Response Envelope:**
- All responses: `{ success: boolean, data: ... }`
- All endpoints require `auth:sanctum` (httpOnly cookie)
- RBAC: Only founders can access their own startups

---

#### Example Response
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Acme Inc.",
      "industry": "Fintech",
      "stage": "Seed",
      "website": "https://acme.com",
      "description": "A fintech startup.",
      "created_at": "2026-05-12T10:00:00Z",
      "updated_at": "2026-05-12T10:00:00Z"
    }
  ]
}