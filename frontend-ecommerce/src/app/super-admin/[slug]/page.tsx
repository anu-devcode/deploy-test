'use client';

import { notFound } from "next/navigation";
import { Badge, Card, CardBody, CardHeader, Table, TBody, TD, TH, THead } from "@/components";
import { tenants, seedProducts, seedOrders } from "@/lib/mock-data";

type Props = {
  params: { slug: string };
};

export default function SuperAdminTenantDetailPage({ params }: Props) {
  const tenant = tenants.find((t) => t.slug === params.slug);
  if (!tenant) notFound();

  const products = seedProducts.filter((p) => p.tenantId === tenant.id);
  const orders = seedOrders.filter((o) => o.tenantId === tenant.id);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">{tenant.name}</h1>
        <p className="text-xs text-slate-400">Tenant detail (frontend only).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border border-slate-800 bg-slate-900/40">
          <CardBody className="space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Slug</p>
            <p className="text-sm font-mono text-slate-200">{tenant.slug}</p>
          </CardBody>
        </Card>
        <Card className="border border-slate-800 bg-slate-900/40">
          <CardBody className="space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Industry</p>
            <p className="text-sm capitalize text-slate-200">{tenant.industry}</p>
          </CardBody>
        </Card>
        <Card className="border border-slate-800 bg-slate-900/40">
          <CardBody className="space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-400">Theme</p>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <span
                className="h-5 w-5 rounded-full"
                style={{ backgroundColor: tenant.theme.primaryColor }}
              />
              <span>{tenant.theme.primaryColor}</span>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <Card className="border border-slate-800 bg-slate-900/40">
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-50">Products</h2>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <tr>
                  <TH>Name</TH>
                  <TH>SKU</TH>
                </tr>
              </THead>
              <TBody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <TD className="text-xs text-slate-200">{p.name}</TD>
                    <TD className="text-[11px] font-mono text-slate-400">{p.sku}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        <Card className="border border-slate-800 bg-slate-900/40">
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-50">Orders</h2>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <tr>
                  <TH>Order</TH>
                  <TH>Customer</TH>
                  <TH>Status</TH>
                </tr>
              </THead>
              <TBody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <TD className="text-xs font-mono text-slate-300">{o.orderNumber}</TD>
                    <TD className="text-xs text-slate-200">{o.customer.name}</TD>
                    <TD className="text-xs">
                      <Badge tone="neutral">{o.status}</Badge>
                    </TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

