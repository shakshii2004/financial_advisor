# DB_SCHEMA.md

## Core Entities
- User
- Startup
- Expense
- Revenue
- FundingRequest
- InvestorInterest
- Report
- AuditLog

## Relationships
- User (Founder) 1—1 Startup
- User (Investor) M—M Startup (via InvestorInterest)
- Startup 1—M Expense
- Startup 1—M Revenue
- Startup 1—M FundingRequest
- FundingRequest 1—M InvestorInterest

## Key Fields (V1)
- User: id, name, email, password, role, email_verified_at, created_at, updated_at
- Startup: id, user_id, name, logo_url, description, industry, team_size, valuation, funding_stage, created_at, updated_at
- Expense: id, startup_id, title, amount, category, date, notes, created_at, updated_at
- Revenue: id, startup_id, source, amount, date, notes, created_at, updated_at
- FundingRequest: id, startup_id, amount_requested, pitch, equity_offered, stage, status, created_at, updated_at
- InvestorInterest: id, user_id, startup_id, funding_request_id, status, created_at, updated_at
- Report: id, user_id, type, file_url, created_at, updated_at
- AuditLog: id, user_id, action, target_type, target_id, details, created_at, updated_at

## Indexing & Constraints
- Unique: user.email
- Foreign keys: all *_id fields
- Proper indexing for analytics/reporting

## Update Policy
Update this file with every schema change or migration.

---

#### startups
- id: bigint, pk
- user_id: bigint, fk → users.id
- name: string
- industry: string
- stage: string
- website: string, nullable
- description: text, nullable
- created_at: timestamp
- updated_at: timestamp