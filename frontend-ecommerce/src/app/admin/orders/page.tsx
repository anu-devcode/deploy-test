'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { seedOrders } from '@/lib/mock-data';
import {
    ShoppingCart,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Eye,
    Truck,
    CheckCircle2,
    Clock,
    XCircle,
    Calendar,
    Download
} from 'lucide-react';
import { Order, OrderStatus } from '@/types';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await api.getOrders();
            // Cast to central Order type and use seed orders as fallback
            const combinedOrders = (data as any[]).length > 0 ? (data as any as Order[]) : seedOrders;
            setOrders(combinedOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders(seedOrders);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, status: string) => {
        try {
            // Map lowercase statuses to uppercase if required by API, or cast to any
            await api.updateOrderStatus(orderId, status.toUpperCase() as any);
            fetchOrders();
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    const getStatusStyles = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'paid': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'fulfilled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case 'pending': return <Clock className="w-3 h-3" />;
            case 'paid': return <CheckCircle2 className="w-3 h-3" />;
            case 'fulfilled': return <Truck className="w-3 h-3" />;
            case 'cancelled': return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Dispatch <span className="text-emerald-600 font-serif italic normal-case">Logistics</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor and manage global harvest shipments</p>
                </div>

                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm active:scale-95">
                        <Download className="w-4 h-4" />
                        Export Manifest
                    </button>
                </div>
            </div>

            {/* Filter Search Bar */}
            <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-50 flex flex-wrap items-center gap-4">
                <div className="relative group flex-1 min-w-[300px]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by order number or customer..."
                        className="w-full bg-slate-50 border border-transparent rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-6 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">All Status</button>
                    <button className="px-6 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Pending</button>
                    <button className="px-6 py-3 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Fulfilled</button>
                    <button className="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Logs...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Ref</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Stamp</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consignee</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Volume</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valuation</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Logistics Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {orders.map((order) => {
                                    const total = order.lines.reduce((acc, line) => acc + (line.unitPrice * line.quantity), 0);
                                    return (
                                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-4 text-emerald-600">
                                                    <ShoppingCart className="w-4 h-4" />
                                                    <span className="font-black tracking-tighter uppercase text-slate-900 group-hover:text-emerald-700 transition-colors">
                                                        {order.orderNumber}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-300" />
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 text-sm tracking-tight">{order.customer.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{order.customer.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center text-sm font-black text-slate-900">
                                                {order.lines.length} <span className="text-[10px] text-slate-400">Items</span>
                                            </td>
                                            <td className="px-10 py-8 text-right font-black text-slate-900">
                                                ETB {total.toLocaleString()}
                                            </td>
                                            <td className="px-10 py-8 text-center whitespace-nowrap">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${getStatusStyles(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex items-center justify-end gap-3">
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                        className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-500 outline-none transition-all cursor-pointer"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="paid">Paid</option>
                                                        <option value="fulfilled">Fulfilled</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                    <button className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm h-10 w-10 flex items-center justify-center">
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Displaying <span className="text-slate-900">{orders.length}</span> Dispatch Logs
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 cursor-not-allowed transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1 px-4">
                            <span className="w-10 h-10 rounded-xl bg-emerald-500 text-[#022c22] flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">1</span>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
