'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSocket } from '@/context/SocketContext';
import api from '@/lib/api';
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Users,
    DollarSign,
    ArrowRight,
    Search,
    Bell,
    Settings,
    LayoutDashboard,
    Package,
    Truck,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Zap,
    AlertTriangle,
    Clock,
    UserPlus,
    Activity,
    CreditCard,
    ArrowUpRight,
    Layers,
    ShoppingCart,
    Filter,
    BarChart3,
    PieChart,
    ArrowDownRight,
    Target,
    MousePointer2,
    XCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    LineChart,
    Line,
    ReferenceLine
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [salesHistory, setSalesHistory] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [cartMetrics, setCartMetrics] = useState<any>(null);
    const [period, setPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('DAILY');
    const [loading, setLoading] = useState(true);

    const { subscribe, socket } = useSocket();

    useEffect(() => {
        fetchData(true);

        if (!socket) return;

        // Subscribe to real-time events that should trigger a refresh
        const unsubNewOrder = subscribe('new_order', () => {
            console.log('New order received, refreshing dashboard...');
            fetchData();
        });

        const unsubInventory = subscribe('inventory_updated', () => {
            console.log('Inventory updated, refreshing dashboard...');
            fetchData();
        });

        return () => {
            unsubNewOrder();
            unsubInventory();
        };
    }, [period, socket, subscribe]);

    const fetchData = async (isInitial = false) => {
        try {
            if (isInitial) setLoading(true);
            const [statsData, salesData, alertsData, topProductsData, cartData] = await Promise.all([
                api.getDashboardStats(),
                api.getSalesHistory(period),
                api.getOperationalAlerts(),
                api.getTopSellingProducts(),
                api.getCartMetrics()
            ]);
            setStats(statsData);
            setSalesHistory(salesData);
            setAlerts(alertsData);
            setTopProducts(topProductsData);
            setCartMetrics(cartData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!stats) return (
        <div className="h-screen flex items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-500 animate-pulse uppercase tracking-widest">Initialising Dash...</p>
            </div>
        </div>
    );

    const kpiCards = [
        { label: 'Total Revenue', value: `ETB ${(stats.totalRevenue / 1000).toFixed(1)}k`, growth: `+${stats.revenueGrowth}%`, trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Orders', value: stats.activeOrders, growth: `+${stats.orderGrowth}%`, trend: 'up', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'New Customers', value: stats.newRegistrations, growth: `+${stats.customerGrowth}%`, trend: 'up', icon: UserPlus, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Avg Order Value', value: `ETB ${stats.avgOrderValue.toLocaleString()}`, growth: `+${stats.aovGrowth}%`, trend: 'up', icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Command Center Header */}
            <div className="flex flex-wrap items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Command Center</h1>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Operational Status: <span className="text-emerald-600 uppercase">ALIVE // {stats.siteStatus}</span></p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-1.5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                    {(['DAILY', 'WEEKLY', 'MONTHLY'] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${period === p
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Logical Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiCards.map((card, i) => (
                    <div key={i} className="group bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${card.bg} rounded-bl-[100px] opacity-20 -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500`}></div>
                        <div className="flex items-start justify-between relative z-10">
                            <div className={`p-4 rounded-2xl ${card.bg}`}>
                                <card.icon className={`w-6 h-6 ${card.color}`} />
                            </div>
                            <div className={`flex items-center gap-1.5 text-[11px] font-black tracking-tighter ${card.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {card.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                {card.growth}
                            </div>
                        </div>
                        <div className="mt-8 relative z-10">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{card.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Velocity Hub */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Sales Velocity</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Volume Correlation Trends</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl">
                                <Activity className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>

                        <div className="h-[350px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={salesHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.05} />
                                            <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis
                                        dataKey="date"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fontSize: 10, fontWeight: 800, fill: '#94a3b8' }}
                                        dy={10}
                                        tickFormatter={(val) => period === 'DAILY' ? val.split('-').slice(2).join('/') : val}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        labelStyle={{ fontWeight: 900, marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                                    />
                                    <Area type="monotone" dataKey="sales" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                    <Area type="monotone" dataKey="prevSales" stroke="#94a3b8" strokeWidth={2} strokeDasharray="8 8" fillOpacity={1} fill="url(#colorPrev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Top Products Module */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Top Velocity Assets</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Primary Performance Units</p>
                                </div>
                                <Layers className="w-5 h-5 text-slate-300" />
                            </div>
                            <div className="space-y-5">
                                {topProducts.map((product, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                                {i + 1}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900">{product.name}</h4>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{product.sales} Sales // {product.status}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-emerald-600">ETB {(product.revenue / 1000).toFixed(1)}k</p>
                                            <div className="w-24 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(product.sales / 500) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Cart Abandonment Pulse */}
                        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Cart Pulse</h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Leakage & Recovery Logs</p>
                                </div>
                                <ShoppingCart className="w-5 h-5 text-slate-300" />
                            </div>

                            <div className="flex flex-col items-center justify-center py-6">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * (100 - (stats.abandonmentRate || 0))) / 100} className="text-rose-500" strokeLinecap="round" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <p className="text-3xl font-black text-slate-900">{stats.abandonmentRate}%</p>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-tighter">Abandonment</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full mt-10">
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Recovered</p>
                                        <p className="text-lg font-black text-emerald-600">{cartMetrics?.recoveredCarts || 0}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Lost Value</p>
                                        <p className="text-lg font-black text-rose-600">ETB {(cartMetrics?.lostRevenue / 1000).toFixed(1)}k</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Intelligent Feed & HUB */}
                <div className="space-y-8">
                    {/* Operational Intelligence */}
                    <div className="bg-slate-900 text-white p-8 rounded-[40px] shadow-2xl shadow-slate-900/40 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        <h3 className="text-lg font-black mb-8 flex items-center gap-3">
                            <Zap className="w-5 h-5 text-emerald-400" /> Intelligence Feed
                        </h3>

                        <div className="space-y-6">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="group cursor-pointer relative pl-6 border-l-2 border-slate-800 hover:border-emerald-500 transition-colors py-1">
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full transition-all group-hover:scale-150 ${alert.type === 'CRITICAL' ? 'bg-rose-500 ring-4 ring-rose-500/20' : alert.type === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                                    <h4 className="text-xs font-black group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{alert.title}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold mt-1">{alert.time}</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full mt-10 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2">
                            View Logistics Log <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                    {/* Quick Access HUB */}
                    <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
                            <Settings className="w-5 h-5 text-slate-300" /> Direct Hub
                        </h3>

                        <div className="space-y-3">
                            {[
                                { label: 'New Product Log', href: '/admin/products', icon: Package, color: 'emerald' },
                                { label: 'Transaction Audit', href: '/admin/orders', icon: CreditCard, color: 'blue' },
                                { label: 'Logistics Control', href: '/admin/deliveries', icon: Truck, color: 'indigo' },
                                { label: 'System Preferences', href: '/admin/settings', icon: Settings, color: 'slate' },
                            ].map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.href}
                                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-${link.color}-50 flex items-center justify-center text-${link.color}-600 group-hover:scale-110 transition-transform`}>
                                            <link.icon className="w-5 h-5" />
                                        </div>
                                        <span className="text-sm font-bold text-slate-700">{link.label}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Performance Summary Card */}
                    <div className="bg-emerald-600 p-8 rounded-[40px] text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative z-10">
                            <BarChart3 className="w-10 h-10 mb-6 opacity-40" />
                            <h4 className="text-3xl font-black mb-2 tracking-tight">{(stats.conversionRate || 0).toFixed(1)}%</h4>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Live Conversion Pulse</p>
                            <p className="text-[10px] font-medium mt-4 text-emerald-50/60 leading-relaxed">System performance is currently performing 12% above quarterly benchmark.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
