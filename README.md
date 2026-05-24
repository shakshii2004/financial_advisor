# 🚀 FounderFlow

<div align="left">

[![Live Demo](https://img.shields.io/badge/Demo-Live%20App-0066CC?style=for-the-badge&logo=vercel&logoColor=white)](https://founderflow-cyan.vercel.app)
[![API Status](https://img.shields.io/badge/API-Active-059669?style=for-the-badge&logo=laravel&logoColor=white)](https://founderflow.onrender.com)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20Laravel-neutral-900?style=for-the-badge)](https://github.com/Akhand0ps/fin)

</div>

### A production-grade SaaS platform for startup financial management and investor relations.

FounderFlow provides startup founders with a complete toolkit to manage their finances, track burn rate and runway, and engage with investors through a structured deal pipeline. Investors use the platform to discover startups, express interest, and track their funding pipeline in real time.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [System Workflow](#system-workflow)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Investor Pipeline](#investor-pipeline)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

---

## Overview

FounderFlow is built on a decoupled monorepo architecture. The frontend and backend are independently deployable services that communicate exclusively over a REST API. There is no server-side rendering; all UI logic lives in the React client.

The platform supports three distinct user roles — Founder, Investor, and Admin — each with separate dashboards, protected routes, and server-side authorization policies.

---

## Architecture

### High-Level System Architecture

```
                        +-----------------------+
                        |      Client Browser   |
                        +-----------+-----------+
                                    |
                                    | HTTPS
                                    v
                        +-----------+-----------+
                        |   Vercel CDN (React)  |
                        |   founderflow-cyan    |
                        |     .vercel.app       |
                        +-----------+-----------+
                                    |
                                    | REST API  (Axios + Sanctum)
                                    v
                        +-----------+-----------+
                        |   Render.com (Laravel)|
                        |  founderflow.onrender |
                        |         .com          |
                        +-----------+-----------+
                                    |
                    +---------------+---------------+
                    |                               |
                    v                               v
        +-----------+-----------+     +-------------+----------+
        |  PostgreSQL (Neon)    |     |   File Storage         |
        |  Primary Database     |     |   (Public Disk / S3)   |
        +-----------------------+     +------------------------+
```

### Frontend Architecture

```
src/
  lib/
    api.ts              Axios instance, base URL, interceptors
  store/
    authStore.ts        Zustand — persisted auth state (user, token, role)
  routes/
    AppRoutes.tsx       React Router — public, protected, and role-gated routes
  layouts/
    DashboardLayout.tsx Sidebar + Navbar shell for authenticated users
  pages/               Route-level page components (one per view)
  components/          Shared, reusable UI primitives (Button, Card, Modal, etc.)
  services/            One file per API domain (authService, transactionService, etc.)
  hooks/               Custom React hooks
```

### Backend Architecture

```
app/
  Http/
    Controllers/        Thin controllers — validate input, delegate to services
    Middleware/         Auth, role checks, rate limiting
  Models/               Eloquent models with relationships defined
  Services/             Business logic layer (AuthService, etc.)
  Policies/             Laravel Gates/Policies for RBAC
routes/
  api.php               All API endpoints, grouped by middleware
database/
  migrations/           Versioned schema changes
  seeders/              Development seed data
```

---

## System Workflow

### Authentication Flow

```
User submits credentials
        |
        v
POST /api/auth/login
        |
        v
AuthController validates credentials
        |
        +--- Fail ---> 401 Unauthorized
        |
        v
Sanctum issues API token
        |
        v
Token stored in Zustand (persisted to localStorage)
        |
        v
Axios attaches token to every subsequent request
  via Authorization: Bearer <token> header
        |
        v
Server middleware (auth:sanctum) validates on each request
```

### Founder Financial Workflow

```
Founder logs in
        |
        v
FounderDashboard fetches:
  - analytics/summary  (burn rate, runway, MRR)
  - transactions       (recent activity)
  - startups           (linked startup profile)
        |
        v
Founder records an Expense or Revenue
  -> Modal form opens (no page navigation)
  -> Zod validates input client-side
  -> POST /api/transactions
  -> TanStack Query invalidates cache
  -> Dashboard metrics recalculate automatically
        |
        v
Founder views Analytics page
  -> Revenue vs Expense bar chart (Recharts)
  -> Monthly breakdown table
  -> CSV export available
```

### Investor Pipeline Workflow

```
Investor browses Discovery page
  GET /api/investments/discovery
        |
        v
Investor clicks "Express Interest" on a startup
  POST /api/investments/interest
  { startup_id, message }
        |
        v
Record created in investor_interests table
  status = "interested"
        |
        v
Founder sees new card on Investor Interests page
  GET /api/investments/startup-interests
        |
        v
Founder manages the deal pipeline:

  [Initial Interest]
       |
       |-- "Move to Discovery"
       v
  [Discovery]          <- Intro calls, deck sharing
       |
       |-- "Schedule Funding Call"
       v
  [Funding Call]       <- Term sheet discussions
       |
       |-- "Close Deal"
       v
  [Closed]             <- Investment confirmed

  At any stage:
       |-- "Decline Interest" -> [Declined]

Each stage change:
  POST /api/investments/update-status
  { interest_id, status }
  -> Server verifies caller owns the startup
  -> Status saved to DB
  -> Frontend cache invalidated
  -> UI badge and action buttons update reactively
```

---

## Tech Stack

### Frontend

| Package | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool and dev server |
| Tailwind CSS | 4.x | Utility-first styling |
| Framer Motion | 11.x | Page and component animations |
| TanStack Query | 5.x | Server state, caching, background refetch |
| Zustand | 5.x | Client auth state (persisted) |
| React Hook Form | 7.x | Form state management |
| Zod | 3.x | Schema-based form validation |
| Axios | 1.x | HTTP client |
| Recharts | 2.x | Data visualization |
| Sonner | 1.x | Toast notification system |
| Lucide React | 0.x | Icon library |

### Backend

| Package | Version | Purpose |
|---|---|---|
| Laravel | 12.x | API framework |
| PHP | 8.2+ | Runtime |
| Laravel Sanctum | 4.x | Token-based API authentication |
| Eloquent ORM | — | Database abstraction |
| PostgreSQL | 16 | Primary relational database |

### Infrastructure

| Service | Role |
|---|---|
| Vercel | Frontend hosting with CDN |
| Render | Backend API hosting |
| Neon | Managed serverless PostgreSQL |
| GitHub | Version control and CI trigger |

---

## Project Structure

```
fin/
├── README.md
├── docker-compose.yml
├── ARCHITECTURE.md
├── DECISIONS.md
│
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   ├── vercel.json
│   ├── nginx.conf
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── components/
│       │   ├── Button.tsx
│       │   ├── Card.tsx
│       │   ├── Modal.tsx
│       │   ├── Input.tsx
│       │   ├── FormInput.tsx
│       │   ├── Skeleton.tsx
│       │   ├── Navbar.tsx
│       │   ├── Sidebar.tsx
│       │   ├── DashboardShell.tsx
│       │   └── ProtectedRoute.tsx
│       ├── pages/
│       │   ├── LandingPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── FounderDashboard.tsx
│       │   ├── InvestorDashboard.tsx
│       │   ├── AdminDashboard.tsx
│       │   ├── ExpensesPage.tsx
│       │   ├── RevenuePage.tsx
│       │   ├── AnalyticsPage.tsx
│       │   ├── StartupsPage.tsx
│       │   ├── FounderInterestPage.tsx
│       │   ├── InvestorDiscoveryPage.tsx
│       │   ├── InvestorFundingPage.tsx
│       │   ├── SettingsPage.tsx
│       │   └── HelpCenterPage.tsx
│       ├── layouts/
│       │   └── DashboardLayout.tsx
│       ├── services/
│       │   ├── authService.ts
│       │   ├── transactionService.ts
│       │   ├── startupService.ts
│       │   └── analyticsService.ts
│       ├── store/
│       │   └── authStore.ts
│       ├── routes/
│       │   └── AppRoutes.tsx
│       ├── hooks/
│       └── lib/
│           ├── api.ts
│           └── utils.ts
│
└── backend/
    ├── artisan
    ├── composer.json
    ├── routes/
    │   └── api.php
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/
    │   │       ├── AuthController.php
    │   │       ├── StartupController.php
    │   │       ├── TransactionController.php
    │   │       ├── InvestmentController.php
    │   │       ├── AnalyticsController.php
    │   │       ├── SettingsController.php
    │   │       ├── MediaController.php
    │   │       └── SearchController.php
    │   ├── Models/
    │   │   ├── User.php
    │   │   ├── Startup.php
    │   │   ├── Transaction.php
    │   │   ├── Investment.php
    │   │   ├── InvestorInterest.php
    │   │   └── FundingRequest.php
    │   └── Services/
    │       └── AuthService.php
    └── database/
        └── migrations/
```

---

## Database Schema

```
users
  id              bigint PK
  name            varchar
  email           varchar UNIQUE
  password        varchar (hashed)
  role            varchar          -- 'founder' | 'investor' | 'admin'
  email_verified_at  timestamp
  created_at, updated_at

startups
  id              bigint PK
  user_id         bigint FK -> users.id
  name            varchar
  description     text
  industry        varchar
  funding_stage   varchar
  team_size       integer
  valuation       decimal
  currency        varchar          -- 'USD' | 'INR'
  logo_url        varchar
  created_at, updated_at

transactions
  id              bigint PK
  startup_id      bigint FK -> startups.id
  type            varchar          -- 'expense' | 'revenue'
  category        varchar
  amount          decimal
  currency        varchar
  date            date
  description     text
  created_at, updated_at

funding_requests
  id              bigint PK
  startup_id      bigint FK -> startups.id
  target_amount   decimal
  equity_offered  decimal
  stage           varchar
  status          varchar          -- 'pending' | 'active' | 'closed'
  pitch           text
  created_at, updated_at

investor_interests
  id              bigint PK
  user_id         bigint FK -> users.id   -- the investor
  startup_id      bigint FK -> startups.id
  funding_request_id  bigint FK -> funding_requests.id (nullable)
  status          varchar          -- 'interested' | 'discovery' | 'funding' | 'closed' | 'declined'
  message         text
  created_at, updated_at

investments
  id              bigint PK
  startup_id      bigint FK -> startups.id
  investor_id     bigint FK -> users.id
  amount          decimal
  equity_percentage decimal
  status          varchar
  created_at, updated_at
```

---

## API Reference

All endpoints require `Authorization: Bearer <token>` unless marked as public.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive token |
| POST | `/api/auth/logout` | Required | Revoke current token |
| GET | `/api/auth/me` | Required | Get authenticated user |
| POST | `/api/auth/email/verify/send` | Required | Send verification email |
| GET | `/api/auth/email/verify/{id}/{hash}` | Required | Verify email address |

### Startups

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/startups` | Founder | List all startups owned by user |
| POST | `/api/startups` | Founder | Create a new startup |
| GET | `/api/startups/{id}` | Founder | Get a single startup |
| PUT | `/api/startups/{id}` | Founder | Update startup details |
| DELETE | `/api/startups/{id}` | Founder | Delete a startup |

### Transactions

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/transactions` | Founder | List transactions (filter: `?type=expense\|revenue`) |
| POST | `/api/transactions` | Founder | Create an expense or revenue entry |
| GET | `/api/transactions/{id}` | Founder | Get a single transaction |
| PUT | `/api/transactions/{id}` | Founder | Update a transaction |
| DELETE | `/api/transactions/{id}` | Founder | Delete a transaction |

### Analytics

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/analytics/summary` | Founder | Burn rate, runway, MRR, revenue totals |
| GET | `/api/analytics/investor/summary` | Investor | Portfolio summary statistics |
| GET | `/api/analytics/chart` | Founder | Monthly revenue/expense chart data |

### Investments

| Method | Endpoint | Role | Description |
|---|---|---|---|
| GET | `/api/investments/discovery` | Investor | Browse all startups for investment |
| POST | `/api/investments/interest` | Investor | Express interest in a startup |
| GET | `/api/investments/interests` | Investor | Get investor's own interest pipeline |
| GET | `/api/investments/startup-interests` | Founder | Get all interests in founder's startups |
| POST | `/api/investments/update-status` | Founder | Advance or decline a deal stage |
| GET | `/api/investments/investors` | Founder | List confirmed investors for a startup |
| GET | `/api/investments/portfolio` | Investor | List invested startups |
| POST | `/api/investments/add` | Admin/Founder | Manually link an investor to a startup |

### Settings & Media

| Method | Endpoint | Role | Description |
|---|---|---|---|
| PUT | `/api/settings/profile` | Any | Update name/email |
| PUT | `/api/settings/password` | Any | Change password |
| POST | `/api/media/logo` | Founder | Upload startup logo |
| GET | `/api/search` | Any | Global search across startups and analytics |

### Request / Response Format

All responses follow a consistent envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... }
}
```

Error responses:

```json
{
  "message": "Descriptive error message.",
  "errors": {
    "field_name": ["Validation error detail."]
  }
}
```

---

## Authentication & Authorization

FounderFlow uses Laravel Sanctum for stateless token authentication.

1. On login, the server creates a personal access token and returns it in the response body.
2. The React client stores this token in Zustand (persisted to `localStorage`).
3. The Axios instance attaches the token to every request via the `Authorization: Bearer` header.
4. Protected routes in React (`ProtectedRoute.tsx`) check the Zustand store; unauthenticated users are redirected to `/login`.
5. Role-gated routes further restrict access by checking `user.role` against the expected role.
6. On the server, every protected route group uses the `auth:sanctum` middleware. Controller methods additionally verify `user.role` for resource-level authorization.

---

## Investor Pipeline

The `investor_interests` table tracks the state of each investor-startup relationship. Only the startup's founder can advance or decline a deal. The pipeline stages are:

```
interested  ->  discovery  ->  funding  ->  closed
                                  |
                               declined  (from any stage)
```

| Status | Label in UI | Description |
|---|---|---|
| `interested` | Initial Interest | Investor expressed interest |
| `discovery` | In Discovery | Intro calls and deck sharing underway |
| `funding` | Funding Call | Active term sheet discussion |
| `closed` | Closed | Investment confirmed |
| `declined` | Declined | Founder passed on this investor |

---

## Local Development

### Prerequisites

- Node.js 18 or higher
- PHP 8.2 or higher
- Composer 2.x
- A PostgreSQL database (local or Neon free tier)

### 1. Clone

```bash
git clone https://github.com/Akhand0ps/fin.git
cd fin
```

### 2. Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials, then:

```bash
php artisan migrate
php artisan serve
# API available at http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Update `vite.config.ts` proxy target to `http://localhost:8000`, then:

```bash
npm run dev
# App available at http://localhost:5173
```

### 4. Docker (Alternative)

```bash
docker-compose up --build
```

This starts the frontend, backend, and a local PostgreSQL container.

---

## Deployment

### Frontend — Vercel

1. Connect the GitHub repository to a Vercel project.
2. Set the root directory to `frontend`.
3. Build command: `npm run build`
4. Output directory: `dist`
5. The `vercel.json` in `/frontend` handles SPA routing rewrites automatically.

### Backend — Render

1. Create a new Render Web Service pointing to the `backend/` directory.
2. Build command: `composer install --no-dev && php artisan config:cache && php artisan route:cache`
3. Start command: `php artisan serve --host=0.0.0.0 --port=$PORT`
4. Add all environment variables from `.env` in the Render dashboard.

### Database — Neon

1. Create a project on Neon (neon.tech).
2. Copy the connection string into `DB_URL` in your backend `.env`.
3. Run `php artisan migrate` once to initialize the schema on the production database.

---

## Environment Variables

### Backend (`backend/.env`)

```env
APP_NAME=FounderFlow
APP_ENV=production
APP_KEY=
APP_URL=https://founderflow.onrender.com

DB_CONNECTION=pgsql
DB_URL=postgresql://user:password@host/database?sslmode=require

SANCTUM_STATEFUL_DOMAINS=founderflow-cyan.vercel.app
SESSION_DOMAIN=.founderflow-cyan.vercel.app

FRONTEND_URL=https://founderflow-cyan.vercel.app

QUEUE_CONNECTION=sync
CACHE_DRIVER=file
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=https://founderflow.onrender.com
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes using conventional commits: `git commit -m "feat: add investor close deal button"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request against `main`.

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use case |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `refactor:` | Code restructure without feature change |
| `style:` | UI/CSS changes only |
| `chore:` | Dependency updates, config changes |
| `docs:` | Documentation only |

---

## License

This project is for educational and portfolio purposes. All rights reserved.

---

## Author

Akhand — [github.com/Akhand0ps](https://github.com/Akhand0ps)
