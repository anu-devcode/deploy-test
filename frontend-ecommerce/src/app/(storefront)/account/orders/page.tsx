'use client';

import { useState, useEffect } from 'react';
import { api, Order } from '@/lib/api';
import Link from 'next/link';
import { Package, ChevronRight, Calendar, MapPin, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OrderHistoryPage() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const data = await api.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
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

    if (orders.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Package className="w-10 h-10 text-slate-400" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 mb-2">No orders yet</h2>
                <p className="text-slate-500 font-bold mb-8">You haven't placed any orders with us yet.</p>
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-slate-900">Your Orders</h1>
                <p className="text-slate-500 font-bold mt-2">Track and manage your recent purchases.</p>
            </div>

            <div className="grid gap-4">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/account/orders/${order.id}`}
                        className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all flex flex-col md:flex-row items-center justify-between gap-6"
                    >
                        <div className="flex items-center gap-6 w-full md:w-auto">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors">
                                📦
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{order.orderNumber || 'Processing...'}</h3>
                                <div className="flex flex-wrap items-center gap-4 mt-1 text-sm font-bold text-slate-400">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4" />
                                        {order.items.length} Items
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                        order.status === 'CANCELLED' ? 'bg-rose-100 text-rose-700' :
                                            'bg-indigo-50 text-indigo-700'
                                    }`}>
                                    {order.status}
                                </span>
                                <p className="font-black text-slate-900">ETB {order.total.toLocaleString()}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
