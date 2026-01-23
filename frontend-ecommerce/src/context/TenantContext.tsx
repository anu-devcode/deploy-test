"use client";

import React, { createContext, useContext, useMemo } from "react";
import { getTenantBySlug } from "@/lib/mock-data";
import type { Tenant } from "@/types";

type TenantContextValue = {
  tenant: Tenant;
};

const TenantContext = createContext<TenantContextValue | null>(null);

export function TenantProvider({
  tenantSlug,
  children,
}: {
  tenantSlug: string;
  children: React.ReactNode;
}) {
  const tenant = useMemo(() => {
    const t = getTenantBySlug(tenantSlug);
    if (!t) {
      // Keep this frontend-only: fail fast if a route points to an unknown tenant.
      throw new Error(`Unknown tenant slug: ${tenantSlug}`);
    }
    return t;
  }, [tenantSlug]);

  return (
    <TenantContext.Provider value={{ tenant }}>
      {/* CSS variables for per-tenant theme (used by UI components) */}
      <div
        style={
          {
            "--tenant-primary": tenant.theme.primaryColor,
            "--tenant-secondary": tenant.theme.secondaryColor ?? tenant.theme.primaryColor,
          } as React.CSSProperties
        }
        className="min-h-screen bg-slate-50 text-slate-900"
      >
        {children}
      </div>
    </TenantContext.Provider>
  );
}

export function useTenant(): TenantContextValue {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error("useTenant must be used within TenantProvider");
  return ctx;
}

