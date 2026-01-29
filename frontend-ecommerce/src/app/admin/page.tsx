'use client';

import { seedOrders, seedProducts } from '@/lib/mock-data';
import {
    Users,
    ShoppingCart,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Calendar,
    Circle,
    DollarSign
} from 'lucide-react';
import { useCart } from '@/context';

export default function AdminDashboard() {
    // Calculate Stats
    const totalRevenue = seedOrders.reduce((acc, order) => {
        const orderTotal = order.lines.reduce((lAcc, line) => lAcc + (line.unitPrice * line.quantity), 0);
        return acc + orderTotal;
    }, 0);

    const totalOrders = seedOrders.length;
    const totalProducts = seedProducts.length;
    const uniqueCustomers = new Set(seedOrders.map(o => o.customer.email)).size;

    const stats = [
        { label: 'Total Revenue', value: `ETB ${totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12.5%', isUp: true, color: 'emerald' },
        { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingCart, trend: '+3.2%', isUp: true, color: 'blue' },
        { label: 'Total Products', value: totalProducts.toString(), icon: Package, trend: 'Stable', isUp: true, color: 'purple' },
        { label: 'Active Customers', value: uniqueCustomers.toString(), icon: Users, trend: '+8.4%', isUp: true, color: 'orange' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Executive <span className="text-emerald-600 font-serif italic normal-case">Overview</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Global Harvest Operations & Performance Metrics</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 font-bold text-xs uppercase tracking-widest">
                        <Calendar className="w-4 h-4" />
                        Last 30 Days
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="group bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-slate-50 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>

                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-emerald-600' : 'text-rose-600'} uppercase tracking-widest`}>
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.trend}
                            </div>
                        </div>

                        <div className="mt-8 relative z-10">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</h3>
                            <p className="text-3xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Orders Table */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                    <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Recent <span className="text-emerald-600">Dispatches</span></h2>
                        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 underline decoration-2 underline-offset-4">View All Shipments</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Destination</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valuation</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {seedOrders.map((order) => {
                                    const total = order.lines.reduce((acc, line) => acc + (line.unitPrice * line.quantity), 0);
                                    return (
                                        <tr key={order.id} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-black text-slate-600">#</div>
                                                    <span className="font-black text-slate-900 uppercase tracking-tighter text-sm group-hover:text-emerald-600 transition-colors">{order.orderNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-900 text-sm">{order.customer.name}</span>
                                                    <span className="text-[10px] text-slate-400 font-medium lowercase tracking-wide">{order.customer.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${order.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        order.status === 'fulfilled' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    <Circle className={`w-1.5 h-1.5 fill-current`} />
                                                    {order.status}
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <span className="font-black text-slate-900">ETB {total.toLocaleString()}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Simplified Analytics Sidebar */}
                <div className="space-y-8">
                    <div className="bg-[#022c22] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                        <div className="relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                                <TrendingUp className="text-emerald-400 w-5 h-5" />
                                Growth Signal
                            </h3>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Order Target</span>
                                        <span className="text-lg font-black tracking-tighter">84%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[84%] shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest">Inventory Health</span>
                                        <span className="text-lg font-black tracking-tighter">92%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-400 w-[92%] shadow-[0_0_15px_rgba(96,165,250,0.5)]"></div>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full mt-12 py-5 bg-emerald-500 text-[#022c22] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                                Expand Analytics
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-50">
                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest mb-6">Top Harvesters</h3>
                        <div className="space-y-6">
                            {seedProducts.slice(0, 3).map((product, i) => (
                                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {product.imageToken}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-black text-sm text-slate-900 uppercase truncate max-w-[120px]">{product.name}</p>
                                        <p className="text-[10px] font-black text-emerald-600 tracking-widest uppercase">{product.category}</p>
                                    </div>
                                    <span className="text-xs font-black text-slate-400 uppercase">24 Sales</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
