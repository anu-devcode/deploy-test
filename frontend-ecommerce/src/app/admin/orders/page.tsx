'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
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
    Download,
    ShoppingBag,
    Trash2,
    X,
    User,
    CreditCard,
    AlertCircle,
    Package,
    ArrowLeft
} from 'lucide-react';
import { Badge } from '@/components';
import { Order, OrderStatus } from '@/types';

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
            const combinedOrders = (data as any[]).length > 0 ? (data as any as Order[]) : [];
            setOrders(combinedOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
        try {
            setLoading(true);
            await api.updateOrderStatus(orderId, status);
            const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o);
            setOrders(updatedOrders);
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status } as any);
            }
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDispatchOrder = async (orderId: string) => {
        try {
            setLoading(true);
            await api.createDelivery({ orderId });
            alert('Order dispatched successfully. Check Deliveries for details.');
            fetchOrders(); // Refresh to show new status
        } catch (error) {
            console.error('Failed to dispatch order:', error);
            alert('Dispatch failed');
        } finally {
            setLoading(false);
        }
    };

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
        { label: 'Pending', value: orders.filter(o => o.status === 'pending' || o.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Fulfilled', value: orders.filter(o => o.status === 'fulfilled' || o.status === 'DELIVERED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    const getStatusStyles = (status: string) => {
        const s = status.toUpperCase();
        switch (s) {
            case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'PENDING_VERIFICATION': return 'bg-purple-50 text-purple-600 border-purple-100';
            case 'PAID': case 'CONFIRMED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'PROCESSING': case 'PACKED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'FULFILLED': case 'DELIVERED': return 'bg-slate-50 text-slate-400 border-slate-100';
            case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getStatusIcon = (status: string) => {
        const s = status.toUpperCase();
        switch (s) {
            case 'PENDING': return <Clock className="w-3 h-3" />;
            case 'PENDING_VERIFICATION': return <AlertCircle className="w-3 h-3" />;
            case 'PAID': case 'CONFIRMED': return <CheckCircle2 className="w-3 h-3" />;
            case 'PROCESSING': case 'PACKED': return <Package className="w-3 h-3" />;
            case 'SHIPPED': return <Truck className="w-3 h-3" />;
            case 'FULFILLED': case 'DELIVERED': return <CheckCircle2 className="w-3 h-3" />;
            case 'CANCELLED': return <XCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Order Management</h1>
                    <p className="text-sm text-slate-500">Lifecycle oversight for customer transactions and logistical status.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    <Download className="w-4 h-4" />
                    Export Orders
                </button>
            </div>

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
                    {(['ALL', 'pending', 'fulfilled', 'cancelled'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === tab
                                ? 'bg-white text-emerald-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1).toLowerCase()}
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
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Payment</th>
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
                            ) : filteredOrders.map((order) => {
                                const total = (order as any).total || order.lines.reduce((acc, line) => acc + (line.unitPrice * line.quantity), 0);
                                return (
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
                                            ETB {total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{(order as any).paymentMethod || 'N/A'}</p>
                                                {(() => {
                                                    const pStatus = (order as any).payments?.[0]?.status || 'PENDING';
                                                    return (
                                                        <span className={`text-[8px] font-bold uppercase tracking-widest ${pStatus === 'COMPLETED' ? 'text-emerald-500' : pStatus === 'FAILED' ? 'text-rose-500' : 'text-purple-500'
                                                            }`}>
                                                            {pStatus}
                                                        </span>
                                                    )
                                                })()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusStyles(order.status)}`}>
                                                {getStatusIcon(order.status)} {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(order.status === 'CONFIRMED' || order.status === 'PROCESSING') && (
                                                    <button
                                                        onClick={() => handleDispatchOrder(order.id)}
                                                        className="p-2 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-all"
                                                        title="Dispatch Order"
                                                    >
                                                        <Truck className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
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
                                )
                            })}
                        </tbody>
                    </table>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Status Card */}
                                <div className="p-6 rounded-2xl bg-slate-50 space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400 uppercase font-black text-[10px] tracking-widest">
                                        <Clock className="w-3.5 h-3.5" /> Logical Status
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <span className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full text-xs font-black uppercase border ${getStatusStyles(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                        <p className="text-xs text-center text-slate-400">Last updated: {new Date((selectedOrder as any).updatedAt || selectedOrder.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Summary Card */}
                                <div className="p-6 rounded-2xl bg-emerald-600 text-white space-y-2">
                                    <div className="flex items-center gap-2 text-emerald-100 uppercase font-black text-[10px] tracking-widest">
                                        <CreditCard className="w-3.5 h-3.5" /> Total Payable
                                    </div>
                                    <p className="text-3xl font-black">ETB {((selectedOrder as any).total || selectedOrder.lines.reduce((acc: number, line: any) => acc + (line.unitPrice * line.quantity), 0)).toLocaleString()}</p>
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

                            {/* Manual Payment Verification */}
                            {(() => {
                                const relevantPayment = (selectedOrder as any).payments?.find((p: any) =>
                                    p.status === 'PROCESSING' || p.status === 'PENDING'
                                ) || (selectedOrder as any).payments?.[0];

                                if (!relevantPayment && !(selectedOrder.status === 'PENDING_VERIFICATION')) return null;

                                return (
                                    <div className="p-8 rounded-[2rem] bg-purple-50 border border-purple-100 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 rounded-xl bg-purple-600 text-white">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">Manual Payment Verification</p>
                                                    <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest">
                                                        {relevantPayment?.status || 'Awaiting Admin Signature'}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-purple-200 text-purple-800 border-none font-black text-[9px] uppercase">Review Required</Badge>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Receipt</p>
                                                <div className="aspect-[4/5] bg-white rounded-2xl border-2 border-dashed border-purple-200 flex items-center justify-center overflow-hidden group cursor-zoom-in">
                                                    {relevantPayment?.receiptUrl ? (
                                                        <img src={relevantPayment.receiptUrl} alt="Receipt" className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <Package className="w-10 h-10 text-purple-200 mx-auto mb-2" />
                                                            <p className="text-[10px] font-bold text-purple-300 uppercase">NO RECEIPTS UPLOADED</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="p-5 bg-white rounded-2xl border border-purple-100">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verification Ledger</p>
                                                    <textarea
                                                        placeholder="Add verification notes (e.g. Reference confirmed...)"
                                                        className="w-full h-24 bg-slate-50 border-none rounded-xl p-3 text-xs font-bold text-slate-900 focus:ring-1 focus:ring-purple-500 transition-all resize-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-3">
                                                    <button
                                                        onClick={async () => {
                                                            const note = (document.querySelector('textarea') as HTMLTextAreaElement).value;
                                                            setLoading(true);
                                                            try {
                                                                const paymentId = relevantPayment?.id || (selectedOrder as any).paymentId || selectedOrder.id;
                                                                await api.verifyPayment(paymentId, true, note);
                                                                fetchOrders();
                                                                setSelectedOrder(null);
                                                            } catch (e) {
                                                                alert('Verification failed');
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }}
                                                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" /> Approve & Confirm Order
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            const note = (document.querySelector('textarea') as HTMLTextAreaElement).value;
                                                            if (!note) return alert('Please provide a reason for rejection');
                                                            setLoading(true);
                                                            try {
                                                                const paymentId = relevantPayment?.id || (selectedOrder as any).paymentId || selectedOrder.id;
                                                                await api.verifyPayment(paymentId, false, note);
                                                                fetchOrders();
                                                                setSelectedOrder(null);
                                                            } catch (e) {
                                                                alert('Rejection failed');
                                                            } finally {
                                                                setLoading(false);
                                                            }
                                                        }}
                                                        className="w-full py-4 bg-white border border-rose-200 text-rose-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject Payment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Action Control */}
                            <div className="pt-6 border-t border-slate-100 flex gap-4">
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
