````md
# FounderFlow — Full Project Build Prompt

## Project Overview
Build a production-grade SaaS platform named **FounderFlow**.

FounderFlow is a startup financing and financial management platform that helps startup founders:
- Track expenses and revenue
- Calculate burn rate and runway
- Create funding requests
- Connect with investors
- View financial analytics through dashboards

The architecture must follow a **separate frontend-backend setup**:
- Frontend → React + TypeScript
- Backend → Laravel API

The system should be scalable, cleanly structured, and built using industry-standard architecture.

---

# Monorepo / Project Structure Requirement

The frontend and backend must be kept in completely separate directories.

Example structure:

```txt
founderflow/
├── frontend/   → React + Vite + TypeScript
└── backend/    → Laravel API
````

Rules:

* Do NOT mix frontend and backend code.
* Frontend should consume backend APIs via Axios.
* Backend should act only as REST API server.
* Keep independent package management for both apps.
* Maintain separate environment variables:

  * frontend/.env
  * backend/.env
* Frontend and backend must be independently deployable.
* Configure proper CORS in Laravel backend for frontend origin.
* Docker setup should support both services separately.

---

# Tech Stack

## Frontend

* React.js
* Vite
* TypeScript
* Tailwind CSS
* React Router DOM
* Axios
* Zustand (preferred) or Context API
* Recharts or Chart.js

## Backend

* Laravel 12
* PHP 8.x
* PostgreSQL (preferred) or MySQL
* Laravel Sanctum Authentication
* Redis
* Laravel Queues
* Eloquent ORM
* Docker support

---

# Core Features

## Authentication System

Implement:

* Register
* Login
* Logout
* Forgot password
* Reset password
* Role-based access control

Roles:

* Founder
* Investor
* Admin

Use:

* Laravel Sanctum
* Protected routes
* Middleware
* Policies/Gates

Frontend must store auth state securely.

---

# Founder Features

## Startup Profile Management

Founders can:

* Create startup profile
* Add startup logo
* Add startup description
* Add industry/category
* Add team size
* Add valuation
* Add funding stage
* Edit startup profile

---

## Expense Management

Founders can:

* Add expenses
* Edit expenses
* Delete expenses
* Categorize expenses
* Add recurring expenses
* Filter by date/category

Expense fields:

* Title
* Amount
* Category
* Date
* Notes

---

## Revenue Management

Founders can:

* Add revenue entries
* Track monthly revenue
* Edit/delete revenue entries
* View revenue history

Revenue fields:

* Source
* Amount
* Date
* Notes

---

# Financial Analytics

Implement dashboard analytics:

## Metrics

### Burn Rate

\text{Burn Rate} = \text{Monthly Expenses} - \text{Monthly Revenue}

### Runway

\text{Runway} = \frac{\text{Current Balance}}{\text{Burn Rate}}

### Growth Rate

\text{Growth Rate} = \left(\frac{\text{Current Revenue} - \text{Previous Revenue}}{\text{Previous Revenue}}\right) \times 100

Use charts and visualizations.

Dashboard should include:

* Revenue chart
* Expense chart
* Cash flow overview
* Burn rate widget
* Runway widget
* Growth trend

Use:

* Recharts or Chart.js

---

# Funding Request System

Founders can:

* Create funding requests
* Set required amount
* Add pitch details
* Set equity offered
* Set startup stage

Funding request statuses:

* Pending
* Reviewed
* Accepted
* Rejected

---

# Investor Features

## Investor Dashboard

Investors can:

* Browse startups
* Search startups
* Filter startups
* View startup analytics
* View funding requests
* Show investment interest

Implement:

* Investor interest system
* Startup discovery
* Funding pipeline

---

# Admin Panel

Admin can:

* Manage users
* Ban/suspend users
* Manage reports
* Monitor platform activity
* View analytics
* Moderate funding requests

---

# Notifications System

Implement notifications for:

* Funding request updates
* Investor interest
* System alerts
* Important financial updates

Use:

* Laravel Notifications
* Queues
* Redis

---

# Reports System

Generate:

* Financial reports
* Revenue reports
* Expense reports
* Funding reports

Export formats:

* PDF
* CSV

Use queues for heavy report generation.

---

# Frontend Requirements

## Frontend Architecture

Follow clean scalable folder structure:

```txt
frontend/src/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── services/
 ├── hooks/
 ├── store/
 ├── routes/
 ├── utils/
 ├── types/
 ├── lib/
 └── assets/
```

---

## Frontend UI Requirements

Design should be:

* Modern
* Clean
* SaaS-style
* Responsive
* Dashboard-focused

Implement:

* Sidebar layout
* Top navbar
* Responsive charts
* Mobile responsiveness
* Loading states
* Error states
* Skeleton loaders
* Toast notifications
* Protected routes

Use Tailwind CSS properly.

Avoid poor UI spacing.

---

# Backend Requirements

## Backend Architecture

Follow service-based scalable architecture:

```txt
backend/app/
 ├── Http/
 │   ├── Controllers/
 │   ├── Requests/
 │   └── Middleware/
 ├── Models/
 ├── Services/
 ├── Repositories/
 ├── Jobs/
 ├── Notifications/
 ├── Policies/
 ├── Providers/
 └── Traits/
```

---

## API Standards

Use:

* RESTful APIs
* Proper status codes
* Validation
* Resource responses
* Pagination
* Error handling

Example APIs:

```txt
POST   /api/register
POST   /api/login
GET    /api/startups
POST   /api/expenses
POST   /api/revenues
POST   /api/funding-requests
GET    /api/investor/dashboard
```

---

# Database Design

Core entities:

* User
* Startup
* Expense
* Revenue
* FundingRequest
* InvestorInterest
* Notification
* Report

Use proper:

* Relationships
* Indexing
* Foreign keys
* Migrations
* Seeders

---

# Security Requirements

Implement:

* Password hashing
* Sanctum authentication
* API rate limiting
* Request validation
* Role-based authorization
* CORS configuration
* Secure API practices

---

# Redis & Queue Requirements

Use Redis for:

* Caching
* Queue management
* Background jobs

Queue jobs for:

* Notifications
* Email sending
* PDF report generation
* Heavy analytics processing

---

# Docker Support

Provide:

* Dockerfile
* docker-compose setup
* Separate services for:

  * frontend
  * backend
  * postgres
  * redis

---

# Deployment Requirements

Prepare project for deployment.

Frontend:

* Vercel or Netlify

Backend:

* AWS / DigitalOcean / VPS

Database:

* PostgreSQL managed instance

Use environment variables properly.

---

# Development Phases

## Phase 1

* Authentication
* Startup profiles
* Expense tracking
* Revenue tracking

## Phase 2

* Funding requests
* Investor dashboard

## Phase 3

* Redis caching
* Queues
* Reports

## Phase 4

* AI insights
* Advanced analytics
* Real-time features

---

# Code Quality Rules

Important:

* Use clean architecture
* Avoid messy components
* Avoid huge controllers
* Use reusable components
* Follow TypeScript best practices
* Use DTO/service pattern where needed
* Keep code scalable
* Keep naming consistent
* Write maintainable code

---

# UI Inspiration

Design inspiration should resemble:

* Stripe Dashboard
* Ramp
* Brex
* Linear
* Notion-style clean UI

---

# Final Deliverables

The final output should include:

## Frontend

* Fully working React app
* Responsive UI
* Authentication flow
* Dashboard pages
* API integration

## Backend

* Laravel REST API
* Sanctum authentication
* Role-based authorization
* Queue system
* Redis integration
* Proper architecture

## DevOps

* Docker setup
* Environment configs
* Deployment-ready structure

---

# Additional Notes

The goal of this project is to learn:

* Scalable backend development
* SaaS architecture
* Fintech domain modeling
* React frontend architecture
* Laravel API development
* Authentication systems
* Redis and queues
* Production-grade engineering

The implementation should prioritize:

* Scalability
* Clean architecture
* Real-world engineering practices
* Good UI/UX
* Proper backend structure
* Production readiness

```
```
