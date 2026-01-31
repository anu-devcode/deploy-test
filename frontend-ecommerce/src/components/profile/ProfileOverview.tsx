'use client';

import { Order } from '@/lib/api';
import { Package, TrendingUp, Clock, ChevronRight, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface ProfileOverviewProps {
    orders: Order[];
    loading: boolean;
    onViewAllOrders: () => void;
}

export function ProfileOverview({ orders, loading, onViewAllOrders }: ProfileOverviewProps) {
    const recentOrder = orders[0];
    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-all">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Orders</p>
                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {loading ? '...' : orders.length}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-lg shadow-emerald-500/20">
                        <Package className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Spent</p>
                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {loading ? '...' : `ETB ${totalSpent.toLocaleString()}`}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg shadow-blue-500/20">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-all">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Loyalty Points</p>
                        <h3 className="text-3xl font-black text-slate-900 group-hover:text-amber-500 transition-colors">
                            {loading ? '...' : Math.floor(totalSpent / 100)}
                        </h3>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-lg shadow-amber-500/20">
                        <Clock className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Recent Order */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Recent Order</h3>
                        <p className="text-sm font-bold text-slate-400 mt-1">Status of your latest purchase</p>
                    </div>
                    <button
                        onClick={onViewAllOrders}
                        className="text-sm font-black text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
                    >
                        View All
                        <ChevronRight className="w-4 h4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 text-center font-bold text-slate-400">Loading order details...</div>
                ) : !recentOrder ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <ShoppingBag className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500 font-bold">No orders yet</p>
                        <Link href="/products" className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h4 className="text-2xl font-black text-slate-900">{recentOrder.orderNumber}</h4>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wide ${recentOrder.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                                            recentOrder.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {recentOrder.status}
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-slate-400 mt-1">
                                    Placed on {new Date(recentOrder.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Amount</p>
                                <p className="text-2xl font-black text-emerald-600">ETB {recentOrder.total.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Recent Items Preview (First 2) */}
                        <div className="space-y-4">
                            {recentOrder.items.slice(0, 2).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-xl shadow-sm">
                                        {item.product?.imageToken || '📦'}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900">{item.product?.name || item.name}</p>
                                        <p className="text-xs font-bold text-slate-400">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                            {recentOrder.items.length > 2 && (
                                <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-widest pt-2">
                                    + {recentOrder.items.length - 2} more items
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
