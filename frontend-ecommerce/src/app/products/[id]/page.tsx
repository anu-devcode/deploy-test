'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api, { Product } from '@/lib/api';
import { Header, Footer } from '@/components';
import { AddToCartButton, ProductReviews } from '@/components/products';

export default function ProductDetailPage() {
    const { id } = useParams() as { id: string };
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            api.getProduct(id)
                .then(setProduct)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-12 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center">
                            <span className="text-9xl">🌾</span>
                        </div>

                        {/* Product Info */}
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-bold text-emerald-600">ETB {Number(product.price).toLocaleString()}</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {product.description || 'No description available for this product.'}
                            </p>

                            <div className="border-t border-b py-6 mb-8">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="block text-sm text-gray-500">SKU</span>
                                        <span className="font-mono text-gray-900">{product.sku || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <span className="block text-sm text-gray-500">Category</span>
                                        <span className="text-gray-900">Crop, Grain</span>
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-xs">
                                <AddToCartButton productId={product.id} />
                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    <ProductReviews productId={product.id} />

                </div>
            </main>

            <Footer />
        </div>
    );
}
