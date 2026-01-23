import type { ReactNode } from "react";
import { TenantLayoutClient } from "./layout-client";

type Props = {
  children: ReactNode;
  params: Promise<{ tenant: string }> | { tenant: string };
};

export default async function TenantLayout({ children, params }: Props) {
  const resolvedParams = params instanceof Promise ? await params : params;
  
  return <TenantLayoutClient tenantSlug={resolvedParams.tenant}>{children}</TenantLayoutClient>;
}
