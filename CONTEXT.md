# CONTEXT.md

## Project Name
FounderFlow

## Purpose
Persistent engineering context and high-level summary for the FounderFlow SaaS platform. This file is the canonical source for project vision, scope, and guiding principles.

## High-Level Overview
FounderFlow is a production-grade SaaS platform for startup founders and investors to manage finances, track expenses/revenue, calculate burn/runway, request funding, connect with investors, and view analytics. The system is designed for scalability, maintainability, and clean architecture.

## Core Principles
- Strict separation of frontend (React + Vite + TypeScript) and backend (Laravel 12 API)
- Service-based backend architecture
- Modular, reusable frontend architecture
- Production-readiness and extensibility
- Maintainable, developer-friendly codebase

## Current V1 Scope
- Authentication & RBAC
- Startup profile management
- Expense management
- Revenue tracking
- Financial analytics dashboard
- Funding request system
- Investor dashboard
- Admin moderation basics
- Report generation system
- File uploads
- Proper REST APIs
- PostgreSQL integration
- Dockerized local development
- Redis basic integration

## Out of Scope (V1)
- Notifications (in-app/email)
- CI/CD pipelines
- Real-time features
- Payment integration
- Advanced analytics/AI

## Engineering Memory System
This file, along with PROJECT_STATE.md, DECISIONS.md, ARCHITECTURE.md, TASKS.md, API_CONTRACTS.md, DB_SCHEMA.md, and AI_RULES.md, must be updated as the project evolves.

#### Current State (2026-05-12)
- Backend: Startup CRUD fully scaffolded (repository, service, controller, requests, resource, routes)
- RBAC: Founder-only access enforced
- API: Shared envelope, resource responses
- DB: Migrations run, Neon Postgres connected
- Next: Backend unit tests, error handling, frontend scaffolding