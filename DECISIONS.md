# DECISIONS.md

## Major Engineering Decisions

### 1. Tech Stack
- Backend: Laravel 12, PostgreSQL, Redis, Sanctum
- Frontend: React, Vite, TypeScript, Tailwind, Zustand, shadcn/ui

### 2. Directory Structure
- Use backend/ and frontend/ directly under FIN root

### 3. Docker Compose
- Use docker-compose.yml at FIN root to orchestrate backend, frontend, db, and redis for local dev

### 4. Authentication
- Sanctum with httpOnly cookies
- Email verification required before access
- RBAC: Founder, Investor, Admin

### 5. Storage
- Public local storage for startup logos (V1)
- Architecture supports S3/private storage in future

### 6. Report Generation
- PDF: barryvdh/laravel-dompdf
- CSV/Excel: maatwebsite/laravel-excel

### 7. Notifications
- Not implemented in V1, but architecture is extensible

### 8. API Envelope
- All APIs return: { success, message, data }

### 9. Rate Limiting
- Enabled for auth, sensitive, and public APIs

### 10. Audit Logs
- Admins can view audit logs; extensible for user activity history

### 11. File Uploads
- Only startup logos and report exports in V1

### 12. Project Memory
- Persistent context files must be updated with every major change

## Update Policy
Every new decision or change must be recorded here.