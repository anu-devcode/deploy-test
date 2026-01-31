'use client';

import { Product, Tenant } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';

interface ProductsSectionProps {
    filteredProducts: Product[];
    allProducts: Product[];
    tenants: Tenant[];
    setSearchQuery: (query: string) => void;
    setSelectedCategory: (category: string | null) => void;
    setSelectedIndustry: (industry: string | null) => void;
    formatPrice: (price: number) => string;
}

export function ProductsSection({
    filteredProducts,
    allProducts,
    tenants,
    setSearchQuery,
    setSelectedCategory,
    setSelectedIndustry,
    formatPrice
}: ProductsSectionProps) {

    return (
        <section id="products" className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 md:py-20 lg:py-28">
            <div className="text-center mb-10 md:mb-16">
                <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs md:text-sm mb-4 md:mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    FEATURED COLLECTION
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4">
                    Premium Products
                </h2>
                <p className="text-base md:text-xl text-slate-600 font-medium max-w-2xl mx-auto px-4">
                    Showing <span className="font-black text-emerald-600">{filteredProducts.length}</span> of <span className="font-black">{allProducts.length}</span> handpicked products
                </p>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="rounded-2xl md:rounded-3xl border-2 border-dashed border-emerald-300 bg-gradient-to-br from-emerald-50 to-white p-10 md:p-20 text-center">
                    <div className="text-6xl md:text-8xl mb-6 animate-bounce">🔍</div>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-3">No products found</h3>
                    <p className="text-base md:text-lg text-slate-600 mb-8 font-medium">
                        Try adjusting your search or filter criteria.
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory(null);
                            setSelectedIndustry(null);
                        }}
                        className="w-full md:w-auto px-8 py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold text-lg shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
                    >
                        Clear All Filters
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                    ))}
                </div>
            )}
        </section>
    );
}
