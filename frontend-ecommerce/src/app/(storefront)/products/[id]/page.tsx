'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Product } from '@/lib/api';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductReviews } from '@/components/products/ProductReviews';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // Fetch product details
                const data = await api.getProduct(params.id);
                setProduct(data);

                // Fetch related products
                const related = await api.getProductSuggestions(params.id);
                setRelatedProducts(related);
            } catch (error) {
                console.error('Failed to load product:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProductData();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                <Link href="/products" className="text-emerald-600 hover:underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav className="flex mb-8 text-sm text-gray-500">
                    <Link href="/" className="hover:text-emerald-600">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/products" className="hover:text-emerald-600">Shop</Link>
                    <span className="mx-2">/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </nav>

                <div className="bg-white rounded-3xl shadow-sm p-8 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Gallery */}
                        <ProductGallery images={product.images || []} productName={product.name} />

                        {/* Details */}
                        <div>
                            <div className="mb-6">
                                {product.category && (
                                    <Link
                                        href={`/products?categoryId=${product.category.id}`}
                                        className="text-emerald-600 font-medium text-sm mb-2 inline-block hover:underline"
                                    >
                                        {product.category.name}
                                    </Link>
                                )}
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex text-yellow-400 text-sm">
                                        {'★'.repeat(Math.round(product.avgRating || 0))}
                                        {'☆'.repeat(5 - Math.round(product.avgRating || 0))}
                                    </div>
                                    <span className="text-gray-500 text-sm">
                                        {product.reviewCount || 0} Reviews
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-4 mb-6">
                                    <span className="text-3xl font-bold text-gray-900">
                                        ETB {Number(product.price).toLocaleString()}
                                    </span>
                                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                                        <span className="text-xl text-gray-400 line-through">
                                            ETB {Number(product.compareAtPrice).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="prose prose-emerald text-gray-600 mb-8">
                                <p>{product.description}</p>
                            </div>

                            <div className="border-t border-gray-100 pt-8 mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="font-medium text-gray-900">Availability</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                    </span>
                                </div>
                                <AddToCartButton productId={product.id} />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span>🚚</span>
                                    <span>Fast Delivery Available</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span>🔒</span>
                                    <span>Secure Payment</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mb-16">
                    <ProductReviews productId={product.id} />
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard
                                    key={p.id}
                                    product={{
                                        ...p,
                                        description: p.description || '',
                                        sku: p.sku || '',
                                        category: p.category?.name || 'Uncategorized',
                                        status: (p.status || 'unknown') as any
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
