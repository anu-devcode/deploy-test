'use client';

export function Providers({ children }: { children: React.ReactNode }) {
  // Keep global providers light; tenant-scoped providers live inside each tenant layout.
  return <>{children}</>;
}

