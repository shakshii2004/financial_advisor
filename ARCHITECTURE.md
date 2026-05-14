# ARCHITECTURE.md

## Overview
Defines the high-level and detailed architecture for FounderFlow. All architectural decisions, diagrams, and justifications must be recorded here.

## Directory Structure
- backend/ (Laravel API)
- frontend/ (React + Vite + TypeScript)

## Backend
- Laravel 12 API
- Service-based architecture
- Thin controllers, business logic in services
- Repositories for DB access
- Policies/Gates for RBAC
- Sanctum for authentication (httpOnly cookies)
- PostgreSQL as primary DB
- Redis for cache/queues
- Dockerized for local dev
- Public storage for file uploads (local, extensible to S3)

## Frontend
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Zustand for state management
- Axios for API
- React Router DOM for routing
- Feature/module-based folder structure
- Reusable dashboard layouts/components
- Dark/light mode support
- Initial dependencies installed and structure ready

## DevOps
- Docker Compose for local dev
- Environment variable management
- No CI/CD in V1, but architecture is CI/CD-ready

## Security
- Email verification required
- RBAC enforced via policies/gates
- Rate limiting on sensitive/public APIs
- Audit logs for admin actions

## Extensibility
- Architecture must support future notifications, payments, advanced analytics, and real-time features without major refactoring.

## Update Policy
Update this file with every major architectural change or decision.