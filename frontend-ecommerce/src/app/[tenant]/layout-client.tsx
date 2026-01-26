'use client';

import type { ReactNode } from "react";
import { TenantProvider } from "@/context/TenantContext";
import { CartProvider } from "@/context";

type Props = {
  children: ReactNode;
  tenantSlug: string;
};

function TenantShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function TenantLayoutClient({ children, tenantSlug }: Props) {
  return (
    <TenantProvider tenantSlug={tenantSlug}>
      <CartProvider>
        <TenantShell>{children}</TenantShell>
      </CartProvider>
    </TenantProvider>
  );
}
