'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, Product, Category } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductFilters } from '@/components/products/ProductFilters';

function ProductListingContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Fetch data when URL params change
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch categories once or if needed
                const cats = await api.getCategories();
                setCategories(cats);

                // Build query params
                const params: any = {
                    page: Number(searchParams.get('page')) || 1,
                    limit: 12,
                    categoryId: searchParams.get('categoryId'),
                    minPrice: searchParams.get('minPrice'),
                    maxPrice: searchParams.get('maxPrice'),
                    search: searchParams.get('search'),
                    sortBy: searchParams.get('sortBy') || 'createdAt',
                    sortOrder: searchParams.get('sortOrder') || 'desc',
                };

                const { products: fetchedProducts, pagination } = await api.getStorefrontProducts(params);
                setProducts(fetchedProducts);
                setTotal(pagination.total);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-slate-50 py-12 md:py-20 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Breadcrumbs & Title */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">
                        <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-slate-900">Shop All</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] uppercase mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Featured Collection
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
                                Premium Products
                            </h1>
                        </div>

                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Sort By</span>
                            <select
                                className="border-none bg-slate-50 rounded-xl px-4 py-2 font-bold text-slate-700 focus:ring-0 text-sm cursor-pointer"
                                value={searchParams.get('sortBy') || 'createdAt'}
                                onChange={(e) => {
                                    // Logic for sorting can be added here
                                }}
                            >
                                <option value="createdAt">Newest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="name">Alphabetical</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                    {/* Filters */}
                    <div className="lg:col-span-1">
                        <ProductFilters categories={categories} />
                    </div>

                    {/* Product Grid */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-[450px] bg-slate-100 rounded-3xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                                <span className="text-6xl block mb-6">🔍</span>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">No products found</h3>
                                <p className="text-slate-500 font-medium font-bold">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}

                        {/* Pagination controls would go here */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <ProductListingContent />
        </Suspense>
    );
}
