'use client';

import { useState } from 'react';
import { ProductCard } from "@/components";
import { seedProducts } from "@/lib/mock-data";
import { useTenant } from "@/context/TenantContext";
import type { Product } from "@/types";

export default function TenantShopPage() {
  const { tenant: tenantData } = useTenant();
  const [searchQuery, setSearchQuery] = useState('');
  
  const allProducts: Product[] = seedProducts.filter((p) => p.tenantId === tenantData.id);

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(allProducts.map((p) => p.category)));
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayProducts = selectedCategory
    ? filteredProducts.filter((p) => p.category === selectedCategory)
    : filteredProducts;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div 
        className="relative rounded-3xl overflow-hidden p-8 md:p-12 lg:p-16 text-white"
        style={{
          background: `linear-gradient(135deg, ${tenantData.theme.primaryColor} 0%, ${tenantData.theme.secondaryColor || tenantData.theme.primaryColor} 100%)`
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Welcome to {tenantData.name}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
            Discover premium products tailored for your needs. Quality you can trust, delivered with care.
          </p>
          <div className="flex flex-wrap gap-3">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-white text-[color:var(--tenant-primary)]'
                    : 'bg-white/20 backdrop-blur text-white hover:bg-white/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-11 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--tenant-primary,#10b981)] focus:border-transparent transition-all"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Products Grid */}
      {displayProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-gradient-to-br from-slate-50 to-white p-12 md:p-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500">
            {searchQuery || selectedCategory
              ? 'Try adjusting your search or filter criteria.'
              : 'No products available for this tenant yet.'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Showing <span className="font-semibold text-slate-900">{displayProducts.length}</span> product{displayProducts.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

