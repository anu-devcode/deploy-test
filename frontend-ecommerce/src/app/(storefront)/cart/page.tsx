'use client';

import { useCart } from '@/context';
import { ShoppingCart, Trash2, ArrowRight, Minus, Plus, Package } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, subtotal, itemCount, removeFromCart, updateQuantity, loading } = useCart();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#022c22] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (itemCount === 0) {
        return (
            <div className="min-h-screen bg-[#022c22] flex flex-col items-center justify-center p-6 text-center">
                <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 animate-in fade-in zoom-in duration-700">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 mx-auto border border-emerald-500/20">
                        <ShoppingCart className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter italic">Your Cart is Empty</h1>
                    <p className="text-slate-400 mb-12 max-w-md font-medium leading-relaxed">
                        Looks like you haven't added any premium harvests yet. Start exploring our collection today!
                    </p>
                    <button
                        onClick={() => router.push('/#products')}
                        className="px-12 py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black shadow-2xl shadow-emerald-500/20 hover:scale-105 transition-all uppercase tracking-widest text-sm"
                    >
                        Explore Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#022c22] flex flex-col">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>

            <main className="flex-1 pt-32 pb-24 relative z-10">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter italic">
                                Your <span className="text-emerald-500">Harvest</span>
                            </h1>
                            <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">Review Items & Manage Quantities</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="px-6 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                                {itemCount} items
                            </span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* List Area */}
                        <div className="lg:col-span-8 space-y-6">
                            {items.map((item, idx) => (
                                <div
                                    key={item.productId}
                                    className="bg-white/5 backdrop-blur-3xl p-6 sm:p-8 rounded-[3rem] border border-white/10 hover:border-emerald-500/30 transition-all group animate-in fade-in slide-in-from-bottom-8 duration-700"
                                    style={{ animationDelay: `${idx * 100}ms` }}
                                >
                                    <div className="flex flex-col sm:flex-row items-center gap-8">
                                        {/* Product Icon/Image - Clickable */}
                                        <Link href={`/products/${item.product.slug || item.product.id}`} className="w-32 h-32 bg-emerald-500/5 rounded-[2rem] flex items-center justify-center text-5xl border border-white/5 hover:scale-105 transition-transform duration-500 overflow-hidden relative block group">
                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent"></div>
                                            <Package className="w-12 h-12 text-emerald-400/50" />
                                        </Link>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                                <div>
                                                    <Link href={`/products/${item.product.slug || item.product.id}`}>
                                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-1 group-hover:text-emerald-400 transition-colors">
                                                            {item.product.name}
                                                        </h3>
                                                    </Link>
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                        {typeof item.product.category === 'object' ? item.product.category?.name : (item.product.category || 'Category')}
                                                    </span>
                                                </div>
                                                <div className="text-2xl font-black text-white">
                                                    ETB {item.lineTotal.toLocaleString()}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1 gap-1">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-10 text-center font-black text-white text-sm">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-90"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="flex items-center gap-2 text-[10px] font-black text-rose-400/60 hover:text-rose-400 transition-colors uppercase tracking-widest px-4 py-3 rounded-2xl hover:bg-rose-500/5"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <div className="flex justify-center pt-8">
                                <button
                                    onClick={() => router.push('/#products')}
                                    className="text-[10px] font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.3em] flex items-center gap-3"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Continue Shopping
                                </button>
                            </div>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right duration-700">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                                <h3 className="text-xl font-black text-white mb-8 border-b border-white/5 pb-6 uppercase tracking-widest italic">Inventory Summary</h3>

                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500 italic">Subtotal</span>
                                        <span className="text-white">ETB {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
                                        <span className="text-slate-500 italic">Logistics</span>
                                        <span className="text-emerald-400">Free Shipping</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Payload</span>
                                            <span className="text-4xl font-black text-emerald-500">ETB {subtotal.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => router.push('/checkout')}
                                    className="w-full py-6 bg-emerald-500 text-slate-950 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-500/20 active:scale-95 group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                </button>

                                <div className="mt-8 flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Package className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-wider">
                                        Secure verification & seamless fulfillment sequence
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
