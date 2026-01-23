'use client';

import Link from "next/link";
import { Button, Card, CardBody, CardHeader, Table, TBody, TD, TH, THead } from "@/components";
import { useCart } from "@/context";
import { useTenant } from "@/context/TenantContext";

export default function TenantCartPage() {
  const { tenant } = useTenant();
  const { items, subtotal, itemCount, removeFromCart, clearCart } = useCart();

  if (!itemCount) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
        <div className="mb-4 text-5xl">🛒</div>
        <h1 className="text-lg font-semibold text-slate-900">Your cart is empty</h1>
        <p className="mt-1 text-sm text-slate-500">
          Add products from the storefront to see them here.
        </p>
        <Link
          href={`/${tenant.slug}/shop`}
          className="mt-6 rounded-full bg-[color:var(--tenant-primary,#10b981)] px-5 py-2 text-sm font-medium text-white hover:brightness-110"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
              <p className="text-sm text-slate-600 mt-1">
                {itemCount} item{itemCount > 1 ? "s" : ""} in your cart
              </p>
            </div>
            {itemCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearCart} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                Clear all
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody className="p-0">
          <div className="divide-y divide-slate-100">
            {items.map((item, idx) => (
              <div
                key={item.productId}
                className="p-6 hover:bg-slate-50/50 transition-colors animate-in fade-in slide-in-from-left"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-3xl">
                      {item.product.imageToken ?? '📦'}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-slate-500 mb-3">
                          {item.product.category}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">Qty:</span>
                            <span className="font-semibold text-slate-900">{item.quantity}</span>
                          </div>
                          <span className="text-sm text-slate-400">×</span>
                          <span className="text-sm font-medium text-slate-700">
                            ETB {Number(item.product.price).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 mb-2">
                          ETB {Number(item.lineTotal).toLocaleString()}
                        </p>
                        <button
                          className="text-xs text-rose-500 hover:text-rose-700 font-medium hover:underline transition-colors"
                          onClick={() => removeFromCart(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Order Summary */}
      <div className="space-y-6">
        <Card className="sticky top-24">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
            <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <dl className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <dt className="text-slate-600">Subtotal ({itemCount} items)</dt>
                <dd className="font-semibold text-slate-900">
                  ETB {Number(subtotal).toLocaleString()}
                </dd>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <dt>Shipping</dt>
                <dd>Calculated at checkout</dd>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <dt>Tax</dt>
                <dd>Included</dd>
              </div>
            </dl>

            <div className="border-t-2 border-slate-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-2xl font-bold text-[color:var(--tenant-primary,#10b981)]">
                  ETB {Number(subtotal).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-semibold">Demo Mode:</span> This is a frontend-only demo. No real checkout or payments are executed.
              </p>
            </div>

            <Button 
              className="w-full py-4 text-base font-bold shadow-lg shadow-[color:var(--tenant-primary,#10b981)]/20 hover:shadow-xl" 
              disabled
            >
              Proceed to Checkout
            </Button>

            <Link
              href={`/${tenant.slug}/shop`}
              className="block text-center text-sm text-slate-600 hover:text-[color:var(--tenant-primary,#10b981)] transition-colors"
            >
              ← Continue Shopping
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

