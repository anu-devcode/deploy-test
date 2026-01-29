'use client';

import { useEffect, useState } from 'react';
<<<<<<< HEAD
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
=======
import api, { Order, OrderStatus } from '@/lib/api';
import {
    Search,
    Filter,
    MoreVertical,
    Eye,
    Truck,
    XCircle,
    CheckCircle2,
    Download,
    ShoppingBag,
    Clock,
    AlertCircle,
    Trash2,
    X,
    Calendar,
    User,
    CreditCard,
    Package
} from 'lucide-react';
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ALL' | OrderStatus>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
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

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
        try {
<<<<<<< HEAD
            // Map lowercase statuses to uppercase if required by API, or cast to any
            await api.updateOrderStatus(orderId, status.toUpperCase() as any);
            fetchOrders();
=======
            setLoading(true);
            await api.updateOrderStatus(orderId, status);
            const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
            setOrders(updatedOrders);
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status });
            }
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
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
=======
    const handleDeleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to permanently delete this order record? This action cannot be undone.')) return;
        try {
            setLoading(true);
            await api.deleteOrder(orderId);
            setOrders(orders.filter(o => o.id !== orderId));
            if (selectedOrder?.id === orderId) setSelectedOrder(null);
        } catch (error) {
            console.error('Failed to delete order:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'ALL' || order.status === activeTab;
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending', value: orders.filter(o => o.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Delivered', value: orders.filter(o => o.status === 'DELIVERED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const getStatusStyle = (status: OrderStatus) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'CONFIRMED': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'SHIPPED': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
        }
    };

    return (
<<<<<<< HEAD
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Dispatch <span className="text-emerald-600 font-serif italic normal-case">Logistics</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor and manage global harvest shipments</p>
=======
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                    <p className="text-sm text-slate-500">Lifecycle oversight for customer transactions and logistical status.</p>
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    <Download className="w-4 h-4" />
                    Export Orders
                </button>
            </div>

<<<<<<< HEAD
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
=======
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by order ID or customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                    {(['ALL', 'PENDING', 'SHIPPED', 'DELIVERED'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Ref</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Info</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Grand Total</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Current Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && orders.length === 0 ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-6 h-16 bg-white">
                                            <div className="h-6 bg-slate-50 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <AlertCircle className="w-12 h-12 text-slate-200" />
                                            <div>
                                                <p className="text-lg font-bold text-slate-900">No matching orders</p>
                                                <p className="text-sm text-slate-500">Refine your filters or search criteria.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-slate-900">#{order.orderNumber}</p>
                                        <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">ID: {order.id}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm font-bold text-slate-900">{order.customer.name}</p>
                                        <p className="text-xs text-slate-500">{order.customer.email}</p>
                                    </td>
                                    <td className="px-6 py-5">
                                        <p className="text-sm text-slate-600 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    </td>
                                    <td className="px-6 py-5 font-bold text-slate-900">
                                        ETB {order.total.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            {order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                                                    className="p-2 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                                                    title="Ship Order"
                                                >
                                                    <Truck className="w-4 h-4" />
                                                </button>
                                            )}
                                            {order.status === 'SHIPPED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                                    className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all"
                                                    title="Complete Delivery"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteOrder(order.id)}
                                                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
                                                title="Delete Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
                </div>
            </div>

            {/* Order Detail Inspector Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-slate-50 text-emerald-600 font-black">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">#{selectedOrder.orderNumber}</h3>
                                    <p className="text-xs text-slate-500">Transaction details and status logs</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2.2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-8">
                                {/* Status Card */}
                                <div className="p-6 rounded-2xl bg-slate-50 space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400 uppercase font-black text-[10px] tracking-widest">
                                        <Clock className="w-3.5 h-3.5" /> Logical Status
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-black uppercase border ${getStatusStyle(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                        <p className="text-xs text-center text-slate-400">Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="p-6 rounded-2xl bg-emerald-600 text-white space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-100 uppercase font-black text-[10px] tracking-widest">
                                        <CreditCard className="w-3.5 h-3.5" /> Total Payable
                                    </div>
                                    <p className="text-3xl font-black">ETB {selectedOrder.total.toLocaleString()}</p>
                                    <p className="text-[10px] text-emerald-100 font-medium">Inclusive of all logistical taxes</p>
                                </div>
                            </div>

                            {/* Customer Profile */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4" /> Customer Profile
                                </h4>
                                <div className="p-5 border border-slate-100 rounded-2xl gap-2 flex flex-col">
                                    <p className="text-base font-bold text-slate-900">{selectedOrder.customer.name}</p>
                                    <p className="text-sm text-slate-500 font-medium">{selectedOrder.customer.email}</p>
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-50">
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">Standard Delivery</span>
                                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-bold">CBE Birr Payment</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Control */}
                            <div className="pt-6 border-t border-slate-100 flex gap-4">
                                {selectedOrder.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'SHIPPED')}
                                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Truck className="w-4 h-4" /> Proceed to Fulfillment
                                    </button>
                                )}
                                {selectedOrder.status !== 'CANCELLED' && selectedOrder.status !== 'DELIVERED' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedOrder.id, 'CANCELLED')}
                                        className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-sm font-bold transition-all"
                                    >
                                        Void Order
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteOrder(selectedOrder.id)}
                                    className="p-3.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-500 rounded-xl transition-all"
                                    title="Delete Order Permanently"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
