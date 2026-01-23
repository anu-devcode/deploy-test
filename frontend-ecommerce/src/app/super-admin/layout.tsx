import type { ReactNode } from "react";
import Link from "next/link";

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm font-semibold text-slate-50">
            Brolf Super Admin
          </Link>
          <nav className="flex items-center gap-4 text-xs text-slate-300">
            <Link href="/super-admin" className="hover:text-white">
              Tenants
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

