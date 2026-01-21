import Link from 'next/link';
import { Product } from '@/lib/api';
import { AddToCartButton } from './AddToCartButton';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/products/${product.id}`} className="block h-full">
            <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="aspect-square bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 will-change-transform">🌾</div>

                    {/* Quick Action Overlay (Optional) */}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {product.name}
                    </h3>

                    {product.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-lg font-bold text-emerald-600">
                                ETB {Number(product.price).toLocaleString()}
                            </span>

                            <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 10
                                ? 'bg-green-100 text-green-700'
                                : product.stock > 0
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                            </span>
                        </div>

                        <AddToCartButton productId={product.id} />
                    </div>
                </div>
            </div>
        </Link>
    );
}
