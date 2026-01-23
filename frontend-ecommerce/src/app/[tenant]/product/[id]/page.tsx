'use client';

import { useState, useEffect } from 'react';
import { notFound } from "next/navigation";
import { AddToCartButton, Badge, Card, CardBody } from "@/components";
import { seedProducts } from "@/lib/mock-data";
import type { Product } from "@/types";

type Props = {
  params: Promise<{ tenant: string; id: string }> | { tenant: string; id: string };
};

export default function TenantProductDetailPage({ params }: Props) {
  const [productId, setProductId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params instanceof Promise) {
      params.then((resolved) => setProductId(resolved.id));
    } else {
      setProductId(params.id);
    }
  }, [params]);

  const product: Product | undefined = productId 
    ? seedProducts.find((p) => p.id === productId)
    : undefined;

  if (!product) {
    notFound();
  }

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 99));
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1));

  return (
    <div className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Product Image */}
        <Card className="overflow-hidden border-2 border-slate-100">
          <CardBody className="p-0">
            <div className="aspect-square bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden group">
              <div className="text-9xl transform group-hover:scale-110 transition-transform duration-500">
                {product?.imageToken ?? "📦"}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </CardBody>
        </Card>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge tone="neutral" className="mb-3">{product?.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
              {product?.name}
            </h1>
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-bold text-[color:var(--tenant-primary,#10b981)]">
                ETB {Number(product?.price ?? 0).toLocaleString()}
              </p>
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            <p className="text-base leading-relaxed text-slate-700">
              {product?.description}
            </p>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-slate-50 to-white p-6 border border-slate-100">
            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">SKU</dt>
              <dd className="font-mono text-sm text-slate-900 font-medium">
                {product?.sku}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Category</dt>
              <dd className="text-sm text-slate-900 font-medium">
                {product?.category}
              </dd>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold text-slate-700"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setQuantity(Math.max(1, Math.min(99, val)));
                  }}
                  className="w-20 h-12 text-center text-lg font-bold text-slate-900 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[color:var(--tenant-primary,#10b981)] focus:border-transparent"
                />
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= 99}
                  className="w-12 h-12 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center font-bold text-slate-700"
                >
                  +
                </button>
              </div>
            </div>

            <AddToCartButton productId={productId} quantity={quantity} variant="large" />
          </div>
        </div>
      </div>
    </div>
  );
}

