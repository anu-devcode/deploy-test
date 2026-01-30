---
description: Backend development guidelines for Adis Harvest ecommerce - DO NOT modify _tenants module
---

# Backend Development Guidelines - Adis Harvest Ecommerce

## ⚠️ IMPORTANT: Do NOT modify files in `_tenants` folder

The `_tenants` folder contains **future multi-tenant ERP functionality** that is currently disabled.

### About TenantId in Current Code

The backend uses `tenantId` for data isolation. For Adis Harvest single-tenant development:

1. **Use a hardcoded default tenant ID** when creating/querying data
2. **The TenantMiddleware** extracts tenant from headers - set `x-tenant-id` header in frontend
3. **Do not create new tenant management endpoints**

### Default Tenant ID

Use this ID for all Adis Harvest development:
```
tenantId: "adis-harvest-default"
```

### Active Modules (WORK ON THESE)

| Module | Path | Purpose |
|--------|------|---------|
| `products` | `/products` | Product CRUD |
| `orders` | `/orders` | Order management |
| `cart` | `/cart` | Shopping cart |
| `customers` | `/customers` | Customer management |
| `payments` | `/payments` | Payment processing |
| `categories` | `/categories` | Product categories |
| `storefront` | `/storefront` | Public store API |
| `promotions` | `/promotions` | Discounts & offers |
| `analytics` | `/analytics` | Dashboard stats |
| `auth` | `/auth` | Authentication |

### Disabled Modules (DO NOT USE)

- `_tenants` - Reserved for multi-tenant ERP expansion

### Rules for Developers

1. **Never** import from or modify `_tenants` folder
2. Use the default tenant ID for all new records
3. The frontend sends tenant ID via `x-tenant-id` header
4. If adding new modules, do NOT add tenant management features

### API Pattern

All active endpoints accept tenant from header:
```typescript
// Middleware extracts: req.headers['x-tenant-id']
// Use @TenantId() decorator to access in controllers
```
