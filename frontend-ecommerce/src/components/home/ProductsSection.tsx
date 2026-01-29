'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product, Tenant } from '@/types';
import { Heart, Eye, Link as LinkIcon, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context';

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
    const { addToCart } = useCart();

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
                    {filteredProducts.map((product) => {
                        const tenant = tenants.find(t => t.id === product.tenantId);

                        // Map product images
                        const productImages: { [key: string]: string } = {
                            'p_ag_001': '/lentils.png',
                            'p_ag_002': '/wheat.png',
                            'p_ag_003': '/sesame.png',
                        };

                        return (
                            <div
                                key={product.id}
                                className="group relative bg-white rounded-2xl md:rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:-translate-y-3 border border-slate-100"
                            >
                                {/* Product Image */}
                                <div className="relative h-64 md:h-80 overflow-hidden">
                                    {productImages[product.id] ? (
                                        <Image
                                            src={productImages[product.id]}
                                            alt={product.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div
                                            className="h-full flex items-center justify-center text-8xl md:text-9xl"
                                            style={{
                                                background: `linear-gradient(135deg, ${tenant?.theme.primaryColor}20 0%, ${tenant?.theme.secondaryColor || tenant?.theme.primaryColor}20 100%)`
                                            }}
                                        >
                                            <span className="group-hover:scale-110 transition-transform duration-500">
                                                {product.imageToken}
                                            </span>
                                        </div>
                                    )}

                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                    {/* Floating Badges */}
                                    <div className="absolute top-3 left-3 md:top-4 md:left-4 flex flex-col gap-1.5 md:gap-2">
                                        <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[10px] md:text-xs font-black text-emerald-700 uppercase shadow-lg">
                                            {tenant?.industry}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] md:text-xs font-black uppercase shadow-lg">
                                            Premium
                                        </span>
                                    </div>

                                    {/* Hover Actions */}
                                    <div className="absolute top-3 right-3 md:top-4 md:right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                        <button className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white text-emerald-950 transition-all hover:scale-110">
                                            <Heart className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                        <button className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-emerald-600 hover:text-white text-emerald-950 transition-all hover:scale-110">
                                            <Eye className="w-4 h-4 md:w-5 md:h-5" />
                                        </button>
                                    </div>

                                    {/* Quick Add Button */}
                                    <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 hidden md:block">
                                        <button
                                            onClick={() => addToCart(product.id, 1)}
                                            className="w-full px-4 py-3 rounded-lg md:rounded-xl bg-white text-emerald-950 font-black text-xs md:text-sm hover:bg-emerald-600 hover:text-white transition-all duration-300 shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            Quick Add
                                        </button>
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                                    {/* Category & Rating */}
                                    <div className="flex items-center justify-between">
                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-[10px] md:text-xs font-bold text-emerald-700 uppercase tracking-wide">
                                            {product.category}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-amber-400 text-xs md:text-sm">⭐</span>
                                            <span className="text-xs md:text-sm font-bold text-slate-700">4.9</span>
                                        </div>
                                    </div>

                                    {/* Product Name */}
                                    <h3 className="text-xl md:text-2xl font-black text-slate-900 line-clamp-1 md:line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight">
                                        {product.name}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed font-medium">
                                        {product.description}
                                    </p>

                                    {/* Tenant Info */}
                                    <div className="flex items-center gap-2 pt-1 md:pt-2">
                                        <div
                                            className="w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black text-white shadow-lg"
                                            style={{ backgroundColor: tenant?.theme.primaryColor }}
                                        >
                                            {tenant?.theme.logoText[0]}
                                        </div>
                                        <span className="text-[10px] md:text-xs font-bold text-slate-500">
                                            by {tenant?.name}
                                        </span>
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-slate-100 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-0.5">Price</p>
                                            <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                                                {formatPrice(product.price)}
                                            </p>
                                        </div>
                                        <Link
                                            href={`/${tenant?.slug}/product/${product.id}`}
                                            className="w-full sm:w-auto px-5 md:px-6 text-white py-3 rounded-lg md:rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 font-bold text-xs md:text-sm hover:shadow-xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            Details
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
