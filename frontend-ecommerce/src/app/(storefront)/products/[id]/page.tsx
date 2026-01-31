'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { api, Product } from '@/lib/api';
import { AddToCartButton } from '@/components/products/AddToCartButton';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductReviews } from '@/components/products/ProductReviews';

import { ChevronRight, ShieldCheck, Leaf, Truck, ShoppingBag, Plus, Minus, Star, Zap, Warehouse, Info, AlertCircle } from 'lucide-react';
import { useCart, useBusiness } from '@/context';

export default function ProductDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { mode } = useBusiness();
    const [quantity, setQuantity] = useState(1);

    const { addToCart, items, updateQuantity } = useCart();
    const cartItem = (items || []).find(i => i.productId === product?.id);

    // Context-aware logic
    const isBulk = mode === 'BULK' && product?.bulk?.enabled;
    const displayPrice = (isBulk ? product?.bulk?.price : (product?.retail?.price || product?.price)) || 0;
    const displayUnit = isBulk ? (product?.bulk?.unit || 'Bulk') : (product?.retail?.unit || 'ea');
    const minOrder = isBulk ? (product?.bulk?.minOrder || 1) : (product?.retail?.minOrder || 1);

    useEffect(() => {
        if (product && !cartItem) setQuantity(minOrder);
    }, [isBulk, product?.id]);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const data = await api.getProduct(params.id);
                setProduct(data);
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
                <div className="w-8 h-8 border-2 border-slate-100 border-t-emerald-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <span className="text-6xl mb-6 grayscale opacity-20">🔍</span>
                <h1 className="text-xl font-bold text-slate-900 mb-2">Product Not Found</h1>
                <p className="text-slate-500 mb-8 font-medium">The item you're looking for might have been moved or is no longer available.</p>
                <Link href="/products" className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl">
                    Explore Shop
                </Link>
            </div>
        );
    }

    const formatCategory = (cat: any) => typeof cat === 'object' ? cat.name : cat;

    return (
        <div className="min-h-screen bg-white py-12 md:py-24 animate-in fade-in duration-1000">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 mb-12 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
                    <ChevronRight className="w-3 h-3 text-slate-200" />
                    <Link href="/products" className="hover:text-emerald-600 transition-colors">Shop</Link>
                    <ChevronRight className="w-3 h-3 text-slate-200" />
                    <span className="text-slate-900 line-clamp-1">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-24">
                    {/* Visual Section */}
                    <div>
                        <ProductGallery images={product.images || []} productName={product.name} />

                        {/* Inventory Breakdown - Premium Feature */}
                        <div className="mt-12 space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                    <Warehouse className="w-3.5 h-3.5" />
                                    Regional Availability
                                </h4>
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Live Stock</span>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                {(product.warehouseStock || [
                                    { warehouse: { name: 'Addis Ababa Central', city: 'Addis Ababa' }, stock: 450 },
                                    { warehouse: { name: 'Nazreth Hub', city: 'Adama' }, stock: 120 },
                                    { warehouse: { name: 'Mekelle Storage', city: 'Mekelle' }, stock: 0 },
                                ]).map((wh: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{wh.warehouse.name}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{wh.warehouse.city}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {wh.stock > 0 ? (
                                                <>
                                                    <span className="text-xs font-black text-slate-900">{wh.stock} <span className="text-[8px] text-slate-400">{displayUnit}s</span></span>
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Out of Stock</span>
                                                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="flex items-start gap-2 text-[9px] font-medium text-slate-400 px-2 leading-relaxed italic">
                                <Info className="w-3 h-3 shrink-0 mt-0.5" />
                                Inventory is updated every 15 minutes. For immediate bulk reservation, please contact our logistics desk.
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-wider inline-block border border-emerald-100">
                                    {formatCategory(product.category)}
                                </span>
                                {isBulk && (
                                    <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-1.5">
                                        <Zap className="w-3 h-3" />
                                        Wholesale Business Mode
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-none mb-6">
                                {product.name}
                            </h1>

                            <div className="flex items-center gap-6 mb-10">
                                <div className="flex items-center gap-1">
                                    <div className="flex text-amber-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.avgRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{product.reviewCount || 0} reviews</span>
                                </div>
                                <div className="w-px h-4 bg-slate-100" />
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">Secure Stock Ready</span>
                                </div>
                            </div>

                            {isBulk && (
                                <div className="mb-10 p-6 rounded-[2rem] bg-amber-50 border border-amber-100 flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 shrink-0">
                                        <Zap className="w-8 h-8 font-black" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Bulk Purchase Benefits</h4>
                                        <p className="text-xs font-bold text-amber-800 leading-relaxed uppercase tracking-widest opacity-80">
                                            Minimum Order: {minOrder} {displayUnit}s • Priority Logistics • Tax Invoice Ready
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-baseline gap-4 mb-10">
                                <div className="flex flex-col">
                                    {isBulk && <span className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Business Price</span>}
                                    <span className="text-5xl font-black text-slate-900 tracking-tighter">
                                        ETB {Number(displayPrice).toLocaleString()}
                                        <span className="text-lg font-bold text-slate-400 ml-2 uppercase tracking-tight italic">/ {displayUnit}</span>
                                    </span>
                                </div>
                                {isBulk && product.price > displayPrice && (
                                    <div className="text-center px-4 py-2 bg-emerald-500 rounded-2xl border-2 border-white shadow-xl shadow-emerald-500/20 translate-y-[-10px]">
                                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Saving</p>
                                        <p className="text-xl font-black text-white">ETB {(product.price - displayPrice).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 border-l-4 border-slate-100 pl-6 italic">
                                {product.description}
                            </p>

                            {/* Purchase Area */}
                            <div className="pt-10 border-t border-slate-100 space-y-8">
                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                                    {/* Integrated Quantity Control */}
                                    <div className="flex items-center justify-between px-8 py-5 bg-slate-900 rounded-3xl border border-slate-800 min-w-[200px] shadow-2xl shadow-slate-900/40">
                                        <button
                                            onClick={() => cartItem ? updateQuantity(product.id, Math.max(minOrder, cartItem.quantity - minOrder)) : setQuantity(Math.max(minOrder, quantity - minOrder))}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 text-white shadow-sm hover:bg-emerald-600 transition-all group"
                                        >
                                            <Minus className="w-5 h-5 group-active:scale-90" />
                                        </button>
                                        <div className="flex flex-col items-center">
                                            <span className="text-2xl font-black text-white">
                                                {cartItem ? cartItem.quantity : quantity}
                                            </span>
                                            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">{displayUnit}s</span>
                                        </div>
                                        <button
                                            onClick={() => cartItem ? updateQuantity(product.id, cartItem.quantity + minOrder) : setQuantity(quantity + minOrder)}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-800 text-white shadow-sm hover:bg-emerald-600 transition-all group"
                                        >
                                            <Plus className="w-5 h-5 group-active:scale-90" />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    {cartItem ? (
                                        <Link
                                            href="/cart"
                                            className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-emerald-600 text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-600/30 hover:-translate-y-1 active:scale-95"
                                        >
                                            <ShoppingBag className="w-6 h-6" />
                                            Go to Checkout
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(product.id, quantity)}
                                            className={`flex-1 flex items-center justify-center gap-4 px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl hover:-translate-y-1 active:scale-95 ${isBulk ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 hover:bg-amber-600' : 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-black'}`}
                                        >
                                            <Zap className="w-6 h-6" />
                                            Reserve {isBulk ? 'Wholesale' : 'Order'}
                                        </button>
                                    )}
                                </div>
                                <div className="flex items-center justify-center gap-10">
                                    <div className="flex flex-col items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-slate-200" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Insured</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Truck className="w-5 h-5 text-slate-200" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Global Export</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <Leaf className="w-5 h-5 text-slate-200" />
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ISO Certified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews productId={product.id} />

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-32 pt-24 border-t border-slate-100">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">You May Also Like</h2>
                                <p className="text-slate-500 font-medium">Specially curated selection for your business.</p>
                            </div>
                            <Link href="/products" className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 border-b-2 border-emerald-100 hover:border-emerald-600 transition-all">
                                View Full Collection
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p as any} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
