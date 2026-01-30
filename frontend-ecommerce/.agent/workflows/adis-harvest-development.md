---
description: Development guidelines for Adis Harvest ecommerce - use ROOT routes only
---

# Adis Harvest Ecommerce Development

## ⚠️ IMPORTANT: Do NOT modify files in `_[tenant]` folder

The `_[tenant]` folder contains **future multi-tenant ERP routes** that are currently disabled.

### Active Development Routes (USE THESE)


| Page | Route | File Location |
|------|-------|---------------|
| Home | `/` | `src/app/(storefront)/page.tsx` |
| Cart | `/cart` | `src/app/(storefront)/cart/page.tsx` |
| Checkout | `/checkout` | `src/app/(storefront)/checkout/page.tsx` |
| Products | `/products` | `src/app/(storefront)/products/page.tsx` |
| Product Detail | `/products/[id]` | `src/app/(storefront)/products/[id]/page.tsx` |
| About | `/about` | `src/app/(storefront)/about/page.tsx` |
| Contact | `/contact` | `src/app/(storefront)/contact/page.tsx` |
| Login | `/login` | `src/app/(storefront)/login/page.tsx` |
| Register | `/register` | `src/app/(storefront)/register/page.tsx` |
| Profile | `/profile` | `src/app/(storefront)/profile/page.tsx` |

### Disabled Routes (DO NOT USE)

The following folder is disabled and should **NOT** be modified:
- `src/app/(storefront)/_[tenant]/**` - Reserved for future multi-tenant ERP

### Why This Matters
- Adis Harvest is our **client** who needs a standalone ecommerce website
- The root routes (`/cart`, `/checkout`) are for their production site
- Tenant routes are for future Enterprise Grid multi-tenant expansion

### Rules for Agents & Developers
1. **Never** import from or modify files in `_[tenant]` folder
2. **Always** use root routes for navigation links (`/cart`, not `/${tenant}/cart`)
3. **Never** use `useTenant()` hook in active development components
4. If you need a new page, create it at the root level (e.g., `/orders`, `/wishlist`)
