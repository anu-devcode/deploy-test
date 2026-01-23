'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Card, CardBody, CardHeader, Button } from "@/components";
import { tenants } from "@/lib/mock-data";
import { readJson, writeJson } from "@/lib/storage";
import type { Tenant } from "@/types";

type TenantStatus = {
  tenantId: string;
  active: boolean;
};

const STATUS_KEY = "super-admin:tenant-status";
const defaultStatuses: TenantStatus[] = tenants.map((t) => ({ tenantId: t.id, active: true }));

export default function SuperAdminTenantsPage() {
  const [statuses, setStatuses] = useState<TenantStatus[]>(defaultStatuses);

  useEffect(() => {
    const saved = readJson<TenantStatus[]>(STATUS_KEY, defaultStatuses);
    setStatuses(saved);
  }, []);

  const handleToggle = (tenantId: string) => {
    setStatuses((prev) => {
      const next = prev.map((s) =>
        s.tenantId === tenantId ? { ...s, active: !s.active } : s
      );
      writeJson(STATUS_KEY, next);
      return next;
    });
  };

  const isActive = (tenant: Tenant) =>
    statuses.find((s) => s.tenantId === tenant.id)?.active ?? true;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">Tenants</h1>
        <p className="text-xs text-slate-400">
          Frontend-only super admin view of configured tenants.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tenants.map((tenant) => {
          const active = isActive(tenant);
          return (
            <Card key={tenant.id} className="border border-slate-800 bg-slate-900/40">
              <CardHeader className="flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: tenant.theme.primaryColor }}
                  >
                    {tenant.theme.logoText[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-50">{tenant.name}</p>
                    <p className="text-[11px] text-slate-400">{tenant.slug}</p>
                  </div>
                </div>
                <Badge tone={active ? "success" : "danger"}>
                  {active ? "Active" : "Disabled (UI only)"}
                </Badge>
              </CardHeader>
              <CardBody className="space-y-3">
                <p className="text-xs text-slate-300">
                  Industry: <span className="capitalize">{tenant.industry}</span>
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Link
                    href={`/super-admin/${tenant.slug}`}
                    className="rounded-full border border-slate-700 px-3 py-1 font-medium text-slate-200 hover:bg-slate-800"
                  >
                    View detail
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="border border-slate-700 bg-slate-900/50 text-slate-100 hover:bg-slate-800"
                    onClick={() => handleToggle(tenant.id)}
                  >
                    Toggle status
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

