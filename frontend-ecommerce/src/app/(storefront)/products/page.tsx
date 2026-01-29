'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">Shop</h1>
                    <div className="flex items-center">
                        <span className="text-gray-500 mr-2">Sort by:</span>
                        <select
                            className="border-none bg-transparent font-medium text-gray-700 focus:ring-0"
                            value={searchParams.get('sortBy') || 'createdAt'}
                            onChange={(e) => {
                                // Simple sort change logic could go here
                            }}
                        >
                            <option value="createdAt">Newest</option>
                            <option value="price">Price</option>
                            <option value="name">Name</option>
                        </select>
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <span className="text-4xl block mb-4">🔍</span>
                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))} */}
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
