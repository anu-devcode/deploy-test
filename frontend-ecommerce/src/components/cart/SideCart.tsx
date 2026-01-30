'use client';

import { useCart } from '@/context';
// Tenant context removed - using root routes for Adis Harvest ecommerce
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function SideCart() {
    const { items, subtotal, itemCount, isOpen, toggleCart, updateQuantity, removeFromCart } = useCart();
    const router = useRouter();

    if (!isOpen) return null;

    const handleCheckout = () => {
        toggleCart();
        router.push('/checkout');
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden">
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={toggleCart}
            />

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md transform transition-transform animate-in slide-in-from-right duration-500 ease-out bg-white shadow-2xl flex flex-col">
                    {/* Header */}
                    <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-none">Your Cart</h2>
                                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                                    {itemCount} items selected
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleCart}
                            className="p-2 rounded-xl hover:bg-slate-200/50 text-slate-400 hover:text-slate-900 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <ShoppingBag className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Your cart is empty</h3>
                                <p className="text-sm text-slate-500 mt-2 max-w-[200px]">
                                    Looks like you haven't added anything to your cart yet.
                                </p>
                                <button
                                    onClick={toggleCart}
                                    className="mt-8 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:scale-105 transition-all"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div
                                    key={item.productId}
                                    className="group relative flex gap-4 p-4 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all"
                                >
                                    <div className="w-20 h-20 rounded-xl bg-slate-100 flex-shrink-0 flex items-center justify-center text-3xl overflow-hidden relative">
                                        {item.product.imageToken ?? '📦'}
                                    </div>

                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-black text-slate-900 truncate pr-4 uppercase tracking-tight">
                                                    {item.product.name}
                                                </h4>
                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="text-slate-300 hover:text-rose-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                                                {typeof item.product.category === 'string' ? item.product.category : item.product.category?.name}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-black text-slate-900">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="text-sm font-black text-emerald-600">
                                                ETB {Number(item.lineTotal).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="px-6 py-8 border-t border-slate-100 bg-slate-50/50 space-y-4">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center justify-between text-slate-500">
                                    <span className="text-xs font-bold uppercase tracking-widest">Subtotal</span>
                                    <span className="text-sm font-bold">ETB {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-slate-900">
                                    <span className="text-lg font-black uppercase">Grand Total</span>
                                    <span className="text-2xl font-black text-emerald-600">ETB {subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-5 px-6 rounded-2xl bg-slate-900 text-white font-black hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                            >
                                Continue to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <Link
                                href="/cart"
                                onClick={toggleCart}
                                className="w-full py-4 text-center block text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
                            >
                                View Detailed Cart
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

