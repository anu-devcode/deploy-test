'use client';

import Link from 'next/link';
import type { Product } from '@/types';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`./product/${product.id}`} className="block h-full group">
      <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100/50 flex flex-col h-full transform hover:-translate-y-2">
        {/* Image Section with Gradient Overlay */}
        <div className="aspect-square bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="text-7xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 relative z-10">
            {product.imageToken ?? '📦'}
          </div>
          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-[color:var(--tenant-primary,#10b981)] transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>

          {product.description && (
            <p className="text-sm text-slate-600 mt-2 line-clamp-2 flex-1 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mt-5 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-[color:var(--tenant-primary,#10b981)]">
                  ETB {Number(product.price).toLocaleString()}
                </span>
              </div>

              <span className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {product.category}
              </span>
            </div>

            <div onClick={(e) => e.preventDefault()}>
              <AddToCartButton productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
