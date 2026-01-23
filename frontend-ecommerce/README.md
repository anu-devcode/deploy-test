## Brolf Multi‑Tenant Frontend (Demo)

This `frontend-ecommerce` app is a **frontend-only multi-tenant eCommerce UI** built with:

- Next.js App Router
- TypeScript
- Tailwind CSS (v4, utility-first)

There is **no backend, no database, and no API integration** – all data and state live in the browser.

### Tenant routing model

Tenants are identified by slug and routed using the App Router:

- `/[tenant]/shop` – public storefront product grid
- `/[tenant]/product/[id]` – product detail view
- `/[tenant]/cart` – tenant-scoped cart and order summary
- `/[tenant]/dashboard` – tenant dashboard (products, inventory, orders, warehouses)

Super admin UI:

- `/super-admin` – tenant list + status toggle (UI only)
- `/super-admin/[slug]` – tenant detail (config + mock KPIs)

Sample tenants and their themes are defined in `src/lib/mock-data.ts`.

### Frontend state strategy

All state is managed on the client using React and `localStorage`:

- **Mock data** lives in `src/lib/mock-data.ts` (tenants, products, inventory, orders).
- **Tenant context** (`TenantProvider` in `src/context/TenantContext.tsx`) is mounted per-tenant layout:
  - Exposes `tenant` (id, slug, name, theme, industry).
  - Applies CSS variables for tenant theme (`--tenant-primary`, `--tenant-secondary`).
- **Cart state** is stored in `localStorage` per tenant:
  - Implemented in `src/context/CartContext.tsx`.
  - Storage key: `cart:<tenantId>`.
  - Provides `items`, `subtotal`, `itemCount`, `addToCart`, `removeFromCart`, `clearCart`.
- **Super admin tenant status** is also `localStorage`-backed (`super-admin:tenant-status`).

There are **no calls to remote APIs** in the multi-tenant flows; everything reads from the mock data file and writes to `localStorage`.

### Extending the UI

You can extend this demo along three main axes:

- **More tenants / verticals**:
  - Add new tenants to `src/lib/mock-data.ts`.
  - Provide a `theme` (primary color, logo text) and industry.
  - The router automatically supports them at `/<slug>/shop`, `/<slug>/dashboard`, etc.

- **Richer dashboard modules**:
  - Extend the dashboard page at `src/app/[tenant]/dashboard/page.tsx`.
  - Reuse UI primitives from `src/components/ui` (`Card`, `Table`, `Badge`, `Modal`, `Button`).
  - Add new sections (e.g. customer insights, fulfillment SLA).

- **Backend integration (future)**:
  - Replace mock-read helpers in `src/lib/mock-data.ts` with real API calls.
  - Keep the same TypeScript models in `src/types` so UI doesn’t change.
  - Swap `localStorage` cart implementation for API-backed endpoints if needed.

### Running locally

```bash
cd frontend-ecommerce
npm install
npm run dev
```

Then open `http://localhost:3000` and pick a tenant from the landing page.

