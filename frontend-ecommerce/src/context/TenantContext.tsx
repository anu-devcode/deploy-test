"use client";

import React, { createContext, useContext, useMemo } from "react";
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
    // Default system tenant
    return {
      id: "t_ag_001",
      slug: "adis-harvest",
      name: "Adis Harvest",
      industry: "agriculture" as any,
      theme: { primaryColor: "#10b981", secondaryColor: "#14b8a6", logoText: "Adis" },
    };
  }, []);

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

