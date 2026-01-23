'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import { TenantProvider, useTenant } from "@/context/TenantContext";
import { CartProvider, useCart } from "@/context";

type Props = {
  children: ReactNode;
  tenantSlug: string;
};

function TenantShell({ children }: { children: ReactNode }) {
  const { tenant } = useTenant();
  const { itemCount } = useCart();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-slate-50 to-slate-100">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href={`/${tenant.slug}/shop`} className="flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
              style={{ backgroundColor: tenant.theme.primaryColor }}
            >
              {tenant.theme.logoText[0] ?? "T"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                {tenant.name}
              </span>
              <span className="text-xs text-slate-500 capitalize">
                {tenant.industry} commerce
              </span>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4 text-sm">
            <Link 
              href={`/${tenant.slug}/shop`} 
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium"
            >
              Storefront
            </Link>
            <Link
              href={`/${tenant.slug}/dashboard`}
              className="px-3 py-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors font-medium hidden sm:block"
            >
              Dashboard
            </Link>
            <Link
              href={`/${tenant.slug}/cart`}
              className="relative rounded-full bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-2 text-slate-700 hover:from-slate-200 hover:to-slate-100 transition-all shadow-sm hover:shadow-md"
            >
              <span className="mr-1">🛒</span>
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[color:var(--tenant-primary,#10b981)] text-[10px] font-bold text-white shadow-lg animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">{children}</div>
      </main>

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-slate-500">
          <span>Multi-tenant demo storefront</span>
          <span>{tenant.name}</span>
        </div>
      </footer>
    </div>
  );
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
