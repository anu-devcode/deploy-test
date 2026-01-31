'use client';

import { Order } from '@/lib/api';
import { Package, Search, Calendar, MapPin, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface OrderHistoryProps {
    orders: Order[];
    loading: boolean;
}

export function OrderHistory({ orders, loading }: OrderHistoryProps) {
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

    const toggleOrder = (orderId: string) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="space-y-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-32 bg-slate-100 rounded-3xl" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    <Package className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900">No Orders Found</h3>
                <p className="text-slate-500 font-bold mt-2 max-w-sm mx-auto">
                    You haven't placed any orders yet. Discover our fresh produce today!
                </p>
                <Link href="/products" className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Order History</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold focus:border-emerald-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:border-slate-200"
                    >
                        {/* Order Header */}
                        <div
                            onClick={() => toggleOrder(order.id)}
                            className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm">
                                        #{order.orderNumber.split('-').pop()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-slate-900">{order.orderNumber}</h3>
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wide ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Package className="w-3 h-3" />
                                                {order.items.length} items
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total</p>
                                        <p className="text-lg font-black text-emerald-600">ETB {order.total.toLocaleString()}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        {expandedOrder === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedOrder === order.id && (
                            <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                <div className="pt-6 border-t border-slate-100 grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Items Ordered</h4>
                                        <div className="space-y-3">
                                            {order.items.map((item: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-lg">
                                                            {item.product?.imageToken || '📦'}
                                                        </div>
                                                        <span className="font-bold text-slate-700">{item.quantity}x {item.product?.name || item.name}</span>
                                                    </div>
                                                    <span className="font-bold text-slate-900">ETB {((item.price || 0) * item.quantity).toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Shipping Address</h4>
                                            <div className="flex items-start gap-2 text-sm font-bold text-slate-600 bg-slate-50 p-3 rounded-xl">
                                                <MapPin className="w-4 h-4 mt-0.5 text-slate-400" />
                                                <p>{order.shippingAddress || 'No address provided'}, {order.shippingCity}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {order.trackingToken && (
                                                <Link
                                                    href={`/track-order?orderNumber=${order.orderNumber}&email=${order.guestEmail || order.customer?.email}`}
                                                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-center text-sm font-black hover:bg-black transition-all flex items-center justify-center gap-2"
                                                >
                                                    Track Shipment
                                                    <ExternalLink className="w-3 h-3" />
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
