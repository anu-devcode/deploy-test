'use client';

import { Order } from '@/lib/api';
import { Package, TrendingUp, Clock, ChevronRight, ShoppingBag, Bell } from 'lucide-react';
import Link from 'next/link';
import { RecentActivity } from './RecentActivity';

interface ProfileOverviewProps {
    orders: Order[];
    loading: boolean;
    onViewAllOrders: () => void;
    onTabChange: (tab: string, section?: string) => void;
}

export function ProfileOverview({ orders, loading, onViewAllOrders, onTabChange }: ProfileOverviewProps) {
    const recentOrder = orders[0];
    const totalSpent = orders.reduce((acc, order) => acc + order.total, 0);

    return (
        <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 md:pb-0">
            {/* Stats Grid - Premium Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-slate-300 transition-all group overflow-hidden relative">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-emerald-50 transition-colors" />

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Orders</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {loading ? '...' : orders.length}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-slate-300 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-blue-50 transition-colors" />

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Spent</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {loading ? '...' : `ETB ${totalSpent.toLocaleString()}`}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-slate-300 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:bg-amber-50 transition-colors" />

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Loyalty Points</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                                {loading ? '...' : Math.floor(totalSpent / 100)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop: Two columns for Latest Order and Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Order Section */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="px-5 py-6 md:px-8 md:py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Latest Order</h3>
                            <p className="text-sm font-bold text-slate-400 mt-0.5">Summary of your most recent purchase</p>
                        </div>
                        <button
                            onClick={onViewAllOrders}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all group"
                        >
                            History
                            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex-1 p-10 flex flex-col items-center justify-center">
                            <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mb-4" />
                            <p className="font-bold text-slate-400 text-xs uppercase tracking-widest">Loading...</p>
                        </div>
                    ) : !recentOrder ? (
                        <div className="flex-1 p-10 text-center flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                <ShoppingBag className="w-8 h-8 text-slate-200" />
                            </div>
                            <p className="text-slate-900 font-black text-lg uppercase tracking-tight">No orders yet</p>
                            <Link href="/products" className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">
                                Storefront
                            </Link>
                        </div>
                    ) : (
                        <div className="p-8 space-y-8 flex-1">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference</span>
                                        <span className="px-3 py-1 bg-slate-900 text-white rounded-lg font-black text-[10px]">#{recentOrder.orderNumber}</span>
                                    </div>
                                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
                                        ETB {recentOrder.total.toLocaleString()}
                                    </h4>
                                </div>
                                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${recentOrder.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    recentOrder.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        'bg-amber-50 text-amber-700 border-amber-100'
                                    }`}>
                                    {recentOrder.status}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Items Sequence</h5>
                                <div className="flex flex-wrap gap-3">
                                    {recentOrder.items.slice(0, 3).map((item: any, idx: number) => (
                                        <div key={idx} className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-sm hover:scale-110 transition-transform cursor-help" title={item.product?.name || item.name}>
                                            {item.product?.imageToken || '📦'}
                                        </div>
                                    ))}
                                    {recentOrder.items.length > 3 && (
                                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 p-2 text-center leading-tight">
                                            +{recentOrder.items.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-50 flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-widest">
                                <span>Date</span>
                                <span>{new Date(recentOrder.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Activity Widget */}
                <RecentActivity onViewAll={(tab, section) => onTabChange(tab, section)} />
            </div>
        </div>
    );
}
