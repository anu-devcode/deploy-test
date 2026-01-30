'use client';

import { useState } from 'react';
import { api, Order } from '@/lib/api';
import { Search, Loader2, Package, MapPin, Calendar, CheckCircle2, Clock, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState<Order | null>(null);
    const [error, setError] = useState('');

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            const result = await api.trackOrder(orderNumber, email);
            setOrder(result);
        } catch (err) {
            setError('Order not found. Please check your details and try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-700';
            case 'CONFIRMED': return 'bg-blue-100 text-blue-700';
            case 'SHIPPED': return 'bg-purple-100 text-purple-700';
            case 'DELIVERED': return 'bg-emerald-100 text-emerald-700';
            case 'CANCELLED': return 'bg-rose-100 text-rose-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock className="w-5 h-5" />;
            case 'CONFIRMED': return <CheckCircle2 className="w-5 h-5" />;
            case 'SHIPPED': return <Truck className="w-5 h-5" />;
            case 'DELIVERED': return <Package className="w-5 h-5" />;
            case 'CANCELLED': return <XCircle className="w-5 h-5" />;
            default: return <Clock className="w-5 h-5" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Track Your Order</h1>
                    <p className="mt-2 text-slate-500 font-bold">Enter your order details to see the current status</p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                    <form onSubmit={handleTrack} className="grid sm:grid-cols-5 gap-4">
                        <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Order Number</label>
                            <input
                                type="text"
                                placeholder="ORD-..."
                                value={orderNumber}
                                onChange={(e) => setOrderNumber(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                required
                            />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                            <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 ml-1">Email Address</label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none font-bold text-slate-900 transition-all"
                                required
                            />
                        </div>
                        <div className="sm:col-span-1 flex items-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-[58px] rounded-xl bg-slate-900 text-white font-black hover:bg-black transition-all flex items-center justify-center disabled:opacity-70 shadow-lg shadow-slate-900/20"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 text-rose-600 font-bold text-center border border-rose-100 animate-in fade-in slide-in-from-top-4">
                        {error}
                    </div>
                )}

                {/* Order Details */}
                {order && (
                    <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {/* Order Header */}
                        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-wrap gap-4 items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{order.orderNumber}</h2>
                                <div className="flex items-center gap-2 mt-1 text-slate-500 text-sm font-bold">
                                    <Calendar className="w-4 h-4" />
                                    <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-black text-sm uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {order.status}
                            </div>
                        </div>

                        {/* Customer & Shipping */}
                        <div className="p-8 grid md:grid-cols-2 gap-8 border-b border-slate-100">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Customer Details</h3>
                                <div className="space-y-1 font-bold text-slate-700">
                                    <p>{order.isGuest ? order.guestName : order.customer?.name}</p>
                                    <p>{order.isGuest ? order.guestEmail : order.customer?.email}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Shipping Address</h3>
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                    <div className="space-y-1 font-bold text-slate-700">
                                        <p>{order.shippingAddress || 'No address provided'}</p>
                                        <p>{order.shippingCity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-8">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Order Items</h3>
                            <div className="space-y-6">
                                {order.items.map((item: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                                                {item.product?.imageToken || '📦'}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{item.product?.name || item.name}</p>
                                                <p className="text-sm font-bold text-slate-400">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-slate-900">ETB {((item.price || 0) * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Totals */}
                        <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                            <span className="font-bold uppercase tracking-widest text-slate-400">Total Amount</span>
                            <span className="text-2xl font-black">ETB {order.total.toLocaleString()}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
