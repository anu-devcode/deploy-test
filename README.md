# Adis Harvest Ecommerce

Agricultural products ecommerce platform for Adis Harvest.

## ⚠️ CRITICAL: Before Working on This Project

**Read these workflows first:**
- `/adis-harvest-development` - Frontend development guidelines
- `/adis-harvest-backend` - Backend development guidelines

## Architecture

| Folder | Purpose | Status |
|--------|---------|--------|
| `frontend-ecommerce/` | Next.js storefront | **Active** |
| `backend-ecommerce/` | NestJS API | **Active** |

## Disabled Modules (DO NOT MODIFY)

These are reserved for future multi-tenant ERP expansion:
- `frontend-ecommerce/src/app/(storefront)/_[tenant]/`
- `backend-ecommerce/src/_tenants/`

## Quick Start

```bash
# Frontend
cd frontend-ecommerce && npm run dev

# Backend
cd backend-ecommerce && npm run start:dev
```

## Routes

| Type | Example | Use For |
|------|---------|---------|
| ✅ Root | `/cart`, `/checkout` | Adis Harvest ecommerce |
| ❌ Tenant | `/acme-crops/cart` | Future ERP (disabled) |
