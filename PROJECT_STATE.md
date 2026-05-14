# PROJECT_STATE.md

## Current Phase
- Phase 1 & 2: Infrastructure and Core UI (Completed)
- Phase 3: Backend Integration and Real-time Data (Next)

## Key Decisions
- Backend: Laravel 12, PostgreSQL, Redis, Sanctum, service-based
- Frontend: React, Vite, TypeScript, Tailwind, Zustand, shadcn/ui
- Dockerized local development
- Public storage for startup logos (local, extensible to S3)
- Email verification required
- RBAC: Founder, Investor, Admin
- Directory structure: backend/ and frontend/ are directly under FIN

## In Progress
- Backend structure review and service-based scaffolding
- Frontend structure review and modular setup
- Docker Compose setup for backend, frontend, PostgreSQL, Redis

## Next Steps
- Configure Laravel Sanctum, CORS, httpOnly cookie auth
- Implement authentication, email verification, RBAC
- Setup shared API response and error handling
- Setup frontend routing/layout, Zustand store, Axios API client

## Engineering Memory
This file must be updated after every major milestone, decision, or change in project direction.