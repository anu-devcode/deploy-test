'use client';

import { Order } from '@/lib/api';
import { Package, Search, Calendar, MapPin, ChevronDown, ChevronUp, Download, CreditCard, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSocket } from '@/context';

interface OrderHistoryProps {
    orders: Order[];
    loading: boolean;
}

export function OrderHistory({ orders: initialOrders, loading }: OrderHistoryProps) {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const { socket, subscribe, emit } = useSocket();

    // Sync state when props change
    useEffect(() => {
        setOrders(initialOrders);
    }, [initialOrders]);

    const toggleOrder = (orderId: string) => {
        const isOpening = expandedOrder !== orderId;
        setExpandedOrder(isOpening ? orderId : null);

        // Join the specific order room for focused updates
        if (isOpening && socket) {
            emit('subscribe_order', { orderId });
        }
    };

    // Listen for real-time status updates
    useEffect(() => {
        if (!socket) return;

        const unsubscribe = subscribe('order_status_changed', (data: { orderId: string, status: string }) => {
            console.log('Real-time order update received:', data);
            setOrders(prevOrders =>
                prevOrders.map(o => o.id === data.orderId ? { ...o, status: data.status } : o)
            );
        });

        const unsubscribeGeneral = subscribe('order_updated', (data: { orderId: string, status: string }) => {
            setOrders(prevOrders =>
                prevOrders.map(o => o.id === data.orderId ? { ...o, status: data.status } : o)
            );
        });

        return () => {
            unsubscribe();
            unsubscribeGeneral();
        };
    }, [socket, subscribe]);

    const handleDownloadInvoice = (orderNumber: string) => {
        // Mock download logic
        console.log(`Downloading invoice for order ${orderNumber}`);
        alert(`Your invoice for order ${orderNumber} is being prepared for download.`);
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-slate-50 rounded-[2rem] border border-slate-100" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-8 md:p-20 text-center shadow-sm border border-slate-100 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <Package className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Orders Yet</h3>
                <p className="text-slate-400 font-bold mt-2 max-w-sm mx-auto">
                    Your shopping journey starts here. Explore our collection of premium fresh produce.
                </p>
                <Link href="/products" className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200">
                    Discover Products
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order History</h2>
                    <p className="text-sm font-bold text-slate-400">Track and manage your past purchases</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by order #"
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold focus:border-slate-900 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {orders.map((order) => {
                    const isExpanded = expandedOrder === order.id;
                    return (
                        <div
                            key={order.id}
                            className={`bg-white rounded-[1.5rem] md:rounded-[2rem] border transition-all overflow-hidden ${isExpanded ? 'border-slate-900 ring-1 ring-slate-900 shadow-xl shadow-slate-200' : 'border-slate-100 shadow-sm hover:border-slate-300'
                                }`}
                        >
                            {/* Order Header */}
                            <div
                                onClick={() => toggleOrder(order.id)}
                                className="p-5 md:p-8 cursor-pointer hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-200">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="font-black text-slate-900 text-lg tracking-tight">Order {order.orderNumber}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        'bg-amber-50 text-amber-700 border-amber-100'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                {/* Payment Status Badge */}
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border flex items-center gap-1.5 ${order.paymentStatus === 'PAID' ? 'bg-emerald-500 text-white border-emerald-400' :
                                                    'bg-slate-100 text-slate-500 border-slate-200'
                                                    }`}>
                                                    {order.paymentStatus === 'PAID' ? <CheckCircle2 className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                                    {order.paymentStatus || 'PENDING'}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-1.5 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="flex items-center gap-1.5">
                                                    {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-8 border-t md:border-t-0 pt-4 md:pt-0">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Grand Total</p>
                                            <p className="text-lg md:text-xl font-black text-slate-900">ETB {order.total.toLocaleString()}</p>
                                        </div>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isExpanded ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <div className="px-5 md:px-8 pb-8 animate-in slide-in-from-top-4 duration-300">
                                    <div className="pt-6 md:pt-8 border-t border-slate-100 grid md:grid-cols-2 gap-8 md:gap-12">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Order Summary</h4>
                                                <span className="text-[10px] font-bold text-slate-300">#{order.id.slice(-6).toUpperCase()}</span>
                                            </div>
                                            <div className="space-y-4">
                                                {order.items.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl grayscale hover:grayscale-0 transition-all">
                                                                {item.product?.imageToken || '📦'}
                                                            </div>
                                                            <div>
                                                                <p className="font-black text-slate-900 text-sm">{item.product?.name || item.name}</p>
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.quantity} × ETB {item.price.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                        <span className="font-black text-slate-900 text-sm">ETB {((item.price || 0) * item.quantity).toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subtotal</span>
                                                <span className="font-black text-slate-600">ETB {order.total.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Shipping Details</h4>
                                                <div className="p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] bg-slate-50 border border-slate-100 space-y-4">
                                                    <div className="flex items-start gap-4">
                                                        <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-slate-900">Delivery Address</p>
                                                            <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                                                {order.shippingAddress || 'No address provided'}
                                                                <br />
                                                                {order.shippingCity || 'Addis Ababa'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-4">
                                                {order.trackingToken && (
                                                    <Link
                                                        href={`/track-order?orderNumber=${order.orderNumber}&email=${order.guestEmail || order.customer?.email}`}
                                                        className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-center text-sm font-black hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                                    >
                                                        <Search className="w-4 h-4" />
                                                        Track Shipment
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={() => handleDownloadInvoice(order.orderNumber)}
                                                    className="flex-1 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-center text-sm font-black hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download Invoice
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
