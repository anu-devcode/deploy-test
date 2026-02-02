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
    const isBulk = mode === 'BULK'; // Derived state

    // Moved here to access 'isBulk'
    const [selectedColor, setSelectedColor] = useState('Midnight Black');
    const [selectedConfig, setSelectedConfig] = useState('Standard');

    // Derived state for price impact (Mocking logic)
    const currentPrice = product && isBulk ? product.bulk?.price : product?.retail?.price;
    const priceAdjustment = selectedConfig === 'Pro Bundle (+ETB 500)' ? 500 : selectedConfig === 'Enterprise (+ETB 1200)' ? 1200 : 0;
    const finalDisplayPrice = (currentPrice || 0) + priceAdjustment;

    const [quantity, setQuantity] = useState(1);
    const { addToCart, updateQuantity, items } = useCart();
    const cartItem = product ? items.find(item => item.productId === product.id) : null;
    const minOrder = isBulk ? (product?.bulk?.minOrder || 1) : (product?.retail?.minOrder || 1);
    const displayUnit = isBulk ? (product?.bulk?.unit || 'unit') : (product?.retail?.unit || 'unit');

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 mb-24 relative">
                    {/* Visual Section - Sticky on Desktop */}
                    <div className="lg:sticky lg:top-24 h-fit self-start transition-all duration-500">
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
                            <div className="grid grid-cols-1 gap-2">
                                {(product.warehouseStock || [
                                    { warehouse: { name: 'Addis Ababa Central', city: 'Addis Ababa' }, stock: 450 },
                                    { warehouse: { name: 'Nazreth Hub', city: 'Adama' }, stock: 120 },
                                    { warehouse: { name: 'Mekelle Storage', city: 'Mekelle' }, stock: 0 },
                                ]).map((wh: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 group hover:border-emerald-200 transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{wh.warehouse.name}</span>
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{wh.warehouse.city}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {wh.stock > 0 ? (
                                                <>
                                                    <span className="text-[10px] font-black text-slate-900">{wh.stock} <span className="text-[8px] text-slate-400">{displayUnit}s</span></span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Empty</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
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
                    <div className="flex flex-col pb-24 md:pb-0">
                        {/* Header & Badges */}
                        <div className="mb-10">
                            <div className="flex flex-wrap items-center gap-3 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px] uppercase tracking-wider border border-emerald-100 shadow-sm">
                                    {formatCategory(product.category)}
                                </span>
                                {isBulk && (
                                    <span className="px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 font-black text-[11px] uppercase tracking-widest flex items-center gap-2 border border-amber-200 shadow-sm animate-pulse">
                                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                                        Wholesale Mode Active
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight mb-8 text-balance">
                                {product.name}
                            </h1>

                            {/* Rating & Stock Status */}
                            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-slate-100">
                                <div className="flex items-center gap-2 group cursor-pointer">
                                    <div className="flex text-amber-400 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.round(product.avgRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-amber-500 transition-colors underline decoration-dotted underline-offset-4 ml-2">
                                        {product.reviewCount || 0} Verified Reviews
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100/50">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">In Stock & Ready</span>
                                </div>
                            </div>

                            {/* Pricing Hero */}
                            <div className="flex items-baseline gap-4 mb-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 pl-1">
                                        {isBulk ? 'Wholesale Price per Unit' : 'Retail Price'}
                                    </span>
                                    <span className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">
                                        <sup className="text-2xl text-slate-400 font-medium mr-1">ETB</sup>
                                        {Number(finalDisplayPrice).toLocaleString()}
                                    </span>
                                </div>
                                {isBulk && product.price > finalDisplayPrice && (
                                    <div className="flex flex-col items-start bg-emerald-600 px-4 py-3 rounded-2xl shadow-xl shadow-emerald-600/20 -mt-2 rotate-2 transform hover:rotate-0 transition-transform">
                                        <p className="text-[9px] font-black text-emerald-100 uppercase tracking-widest">You Save</p>
                                        <p className="text-2xl font-black text-white tracking-tight">ETB {(product.price - finalDisplayPrice).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm font-medium text-slate-400 mb-10 pl-1">
                                Price includes VAT. <span className="underline decoration-dotted cursor-help">Shipping calculated at checkout.</span>
                            </p>

                            {/* Description */}
                            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-12 max-w-2xl">
                                {product.description}
                            </p>

                            {/* MOCK VARIANTS (Simulating "Filtering") */}
                            <div className="space-y-8 mb-12">
                                {/* Color Variant */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Select Color</span>
                                    <div className="flex flex-wrap gap-3">
                                        {['Midnight Black', 'Emerald Green', 'Arctic White'].map((color, idx) => (
                                            <button key={idx} className="group relative w-12 h-12 rounded-full border border-slate-200 hover:scale-110 transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                                                <div className={`absolute inset-1 rounded-full ${idx === 0 ? 'bg-slate-900' : idx === 1 ? 'bg-emerald-600' : 'bg-slate-100'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Size/Option Variant */}
                                <div className="space-y-3">
                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Configuration</span>
                                    <div className="flex flex-wrap gap-3">
                                        {['Standard', 'Pro Bundle (+ETB 500)', 'Enterprise'].map((opt, idx) => (
                                            <button key={idx} className={`px-6 py-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${idx === 0 ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badges Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-12">
                                <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-100 text-center gap-3 transition-colors hover:bg-slate-100 hover:border-slate-200 group">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-emerald-500 group-hover:shadow-md transition-all">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Certeifed</span>
                                        <span className="text-[9px] text-slate-400 font-medium leading-tight">100% Authentic Product</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-100 text-center gap-3 transition-colors hover:bg-slate-100 hover:border-slate-200 group">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-blue-500 group-hover:shadow-md transition-all">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Global Ship</span>
                                        <span className="text-[9px] text-slate-400 font-medium leading-tight">Fast 2-Day Delivery</span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-slate-50 border border-slate-100 text-center gap-3 transition-colors hover:bg-slate-100 hover:border-slate-200 group">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-amber-500 group-hover:shadow-md transition-all">
                                        <Warehouse className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">Store Pickup</span>
                                        <span className="text-[9px] text-slate-400 font-medium leading-tight">Available in 3 Hubs</span>
                                    </div>
                                </div>
                            </div>

                            {/* Bulk Banner */}
                            {isBulk && (
                                <div className="mb-10 p-6 rounded-[2.5rem] bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-center gap-6 relative overflow-hidden group">
                                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-100/50 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-amber-500 shadow-xl shadow-amber-900/5 shrink-0 relative z-10">
                                        <Zap className="w-8 h-8 font-black" />
                                    </div>
                                    <div className="space-y-1 relative z-10">
                                        <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Wholesale Benefits Active</h4>
                                        <p className="text-xs font-bold text-amber-800/80 leading-relaxed uppercase tracking-widest">
                                            Minimum Order: {minOrder} {displayUnit}s • <span className="underline decoration-dotted cursor-pointer hover:text-amber-900">Download Tax Invoice</span>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Desktop Purchase Area */}
                            <div className="hidden lg:block pt-10 border-t border-slate-100 space-y-8">
                                <div className="flex items-center gap-6">
                                    {/* Integrated Quantity Control */}
                                    <div className="flex items-center justify-between px-8 py-5 bg-slate-900 rounded-[2rem] border border-slate-800 min-w-[240px] shadow-2xl shadow-slate-900/40 hover:shadow-slate-900/60 transition-all duration-300">
                                        <button
                                            onClick={() => cartItem ? updateQuantity(product.id, Math.max(minOrder, cartItem.quantity - minOrder)) : setQuantity(Math.max(minOrder, quantity - minOrder))}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 text-white shadow-none hover:bg-white/20 active:scale-90 transition-all group"
                                        >
                                            <Minus className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                                        </button>
                                        <div className="flex flex-col items-center px-4">
                                            <span className="text-3xl font-black text-white tracking-tight">
                                                {cartItem ? cartItem.quantity : quantity}
                                            </span>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.3em]">{displayUnit}s</span>
                                        </div>
                                        <button
                                            onClick={() => cartItem ? updateQuantity(product.id, cartItem.quantity + minOrder) : setQuantity(quantity + minOrder)}
                                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 text-white shadow-none hover:bg-white/20 active:scale-90 transition-all group"
                                        >
                                            <Plus className="w-5 h-5 group-hover:text-emerald-400 transition-colors" />
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    {cartItem ? (
                                        <Link
                                            href="/cart"
                                            className="flex-1 flex items-center justify-center gap-4 px-10 py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] hover:bg-emerald-500 transition-all shadow-2xl shadow-emerald-600/30 hover:-translate-y-1 active:scale-95 group"
                                        >
                                            <ShoppingBag className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                            Go to Checkout
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(product.id, quantity)}
                                            className={`flex-1 flex items-center justify-center gap-4 px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.25em] transition-all shadow-2xl hover:-translate-y-1 active:scale-95 group ${isBulk ? 'bg-amber-500 text-slate-950 shadow-amber-500/30 hover:bg-amber-400' : 'bg-slate-900 text-white shadow-slate-900/30 hover:bg-black'}`}
                                        >
                                            <Zap className="w-6 h-6 group-hover:fill-current transition-colors" />
                                            Reserve {isBulk ? 'Wholesale' : 'Order'}
                                        </button>
                                    )}
                                </div>
                                <p className="text-center text-[10px] text-slate-400 font-medium">
                                    Secure checkout powered by Stripe. 30-day money-back guarantee.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Sticky Action Bar */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 pb-8 bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] z-40 animate-in slide-in-from-bottom-full duration-500">
                    <div className="flex items-center gap-4 max-w-lg mx-auto">
                        <div className="flex items-center bg-slate-100 rounded-2xl p-1">
                            <button
                                onClick={() => cartItem ? updateQuantity(product.id, Math.max(minOrder, cartItem.quantity - minOrder)) : setQuantity(Math.max(minOrder, quantity - minOrder))}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm active:scale-90 transition-transform"
                            >
                                <Minus className="w-4 h-4 text-slate-900" />
                            </button>
                            <span className="w-12 text-center font-black text-slate-900 text-sm">
                                {cartItem ? cartItem.quantity : quantity}
                            </span>
                            <button
                                onClick={() => cartItem ? updateQuantity(product.id, cartItem.quantity + minOrder) : setQuantity(quantity + minOrder)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white shadow-sm active:scale-90 transition-transform"
                            >
                                <Plus className="w-4 h-4 text-slate-900" />
                            </button>
                        </div>

                        {cartItem ? (
                            <Link href="/cart" className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
                                Checkout
                                <ShoppingBag className="w-4 h-4" />
                            </Link>
                        ) : (
                            <button
                                onClick={() => addToCart(product.id, quantity)}
                                className={`flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all ${isBulk ? 'bg-amber-500 text-slate-950 shadow-amber-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'}`}
                            >
                                {isBulk ? 'Rsrv Bulk' : 'Add to Cart'}
                                <Zap className="w-4 h-4" />
                            </button>
                        )}
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
