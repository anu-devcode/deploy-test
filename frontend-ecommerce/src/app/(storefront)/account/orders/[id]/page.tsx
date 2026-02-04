'use client';

import { useState, useEffect, use } from 'react';
import { api, Order } from '@/lib/api';
import { Loader2, ArrowLeft, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import OrderTracker from '@/components/orders/OrderTracker';
import { notFound } from 'next/navigation';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const data = await api.getOrder(id);
            setOrder(data);
        } catch (error) {
            console.error('Failed to fetch order:', error);
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!order) {
        return notFound();
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link href="/account/orders" className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 mb-2 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Orders
                    </Link>
                    <h1 className="text-3xl font-black text-slate-900">{order.orderNumber}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-bold text-slate-500">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm font-bold text-slate-500">
                            {order.items.length} Items
                        </span>
                    </div>
                </div>

                <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors text-sm"
                >
                    <HelpCircle className="w-4 h-4" />
                    Support
                </Link>
            </div>

            {/* Tracker */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <OrderTracker order={order} />
            </div>

            {/* Order Layout Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Items Ordered</h3>
                        <div className="space-y-6">
                            {order.items.map((item: any, idx) => (
                                <div key={idx} className="flex items-center gap-4 group">
                                    <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl border border-slate-100 group-hover:border-emerald-200 transition-colors">
                                        {item.product?.imageToken || '📦'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-slate-900 text-lg leading-tight mb-1">{item.product?.name || item.name}</p>
                                        <p className="text-sm font-bold text-slate-400">Qty: {item.quantity} × ETB {item.price}</p>
                                    </div>
                                    <p className="font-black text-slate-900">ETB {((item.price || 0) * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Summary */}
                <div className="space-y-6">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Order Summary</h3>

                        <div className="space-y-3 pb-6 border-b border-slate-200">
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Subtotal</span>
                                <span>ETB {(Number(order.total) || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-slate-500">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="font-black text-slate-900">Total</span>
                            <span className="text-xl font-black text-slate-900">ETB {Number(order.total).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Shipping To</h3>
                        <div>
                            <p className="font-black text-slate-900">{order.shippingAddress || 'No address'}</p>
                            <p className="text-sm font-bold text-slate-500">{order.shippingCity}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
