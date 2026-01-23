'use client';

import { Badge, Card, CardBody, CardHeader, Table, TBody, TD, TH, THead } from "@/components";
import { seedInventory, seedOrders, seedProducts, seedWarehouses } from "@/lib/mock-data";
import { useTenant } from "@/context/TenantContext";

export default function TenantDashboardPage() {
  const { tenant } = useTenant();

  const products = seedProducts.filter((p) => p.tenantId === tenant.id);
  const orders = seedOrders.filter((o) => o.tenantId === tenant.id);
  const inventory = seedInventory.filter((i) => i.tenantId === tenant.id);
  const warehouses = seedWarehouses.filter((w) => w.tenantId === tenant.id);

  const totalInventory = inventory.reduce((sum, i) => sum + i.onHand, 0);
  const openOrders = orders.filter((o) => o.status !== "fulfilled" && o.status !== "cancelled");

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Tenant dashboard</h1>
        <p className="text-sm text-slate-500">
          Operational overview for <span className="font-medium">{tenant.name}</span>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: products.length },
          { label: "Open orders", value: openOrders.length },
          { label: "Total inventory units", value: totalInventory },
          { label: "Warehouses", value: warehouses.length },
        ].map((item) => (
          <Card key={item.label} className="bg-white/90">
            <CardBody className="space-y-1">
              <p className="text-xs text-slate-500">{item.label}</p>
              <p className="text-xl font-semibold text-slate-900">{item.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)]">
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Product catalog</h2>
              <p className="text-xs text-slate-500">Mock product management table.</p>
            </div>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <tr>
                  <TH>Name</TH>
                  <TH>SKU</TH>
                  <TH>Category</TH>
                </tr>
              </THead>
              <TBody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <TD className="text-sm font-medium text-slate-900">{p.name}</TD>
                    <TD className="text-xs font-mono text-slate-500">{p.sku}</TD>
                    <TD className="text-xs text-slate-600">{p.category}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        {/* Orders list */}
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Recent orders</h2>
              <p className="text-xs text-slate-500">Frontend-only order list.</p>
            </div>
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
                    <TD className="text-xs font-mono text-slate-700">{o.orderNumber}</TD>
                    <TD className="text-xs text-slate-700">{o.customer.name}</TD>
                    <TD className="text-xs">
                      <Badge
                        tone={
                          o.status === "paid"
                            ? "success"
                            : o.status === "pending"
                            ? "warning"
                            : o.status === "cancelled"
                            ? "danger"
                            : "neutral"
                        }
                      >
                        {o.status}
                      </Badge>
                    </TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>

      {/* Inventory + warehouse overview */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1.6fr)]">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-900">Warehouse overview</h2>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <tr>
                  <TH>Warehouse</TH>
                  <TH>Code</TH>
                </tr>
              </THead>
              <TBody>
                {warehouses.map((w) => (
                  <tr key={w.id}>
                    <TD className="text-xs text-slate-800">{w.name}</TD>
                    <TD className="text-xs font-mono text-slate-500">{w.code}</TD>
                  </tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-slate-900">Inventory stock</h2>
          </CardHeader>
          <CardBody>
            <Table>
              <THead>
                <tr>
                  <TH>Product</TH>
                  <TH>On hand</TH>
                  <TH>Reserved</TH>
                </tr>
              </THead>
              <TBody>
                {inventory.map((i) => {
                  const product = products.find((p) => p.id === i.productId);
                  return (
                    <tr key={i.id}>
                      <TD className="text-xs text-slate-800">
                        {product?.name ?? i.productId}
                      </TD>
                      <TD className="text-xs">{i.onHand}</TD>
                      <TD className="text-xs text-slate-500">{i.reserved}</TD>
                    </tr>
                  );
                })}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

