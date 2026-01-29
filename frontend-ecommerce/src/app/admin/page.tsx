'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import {
    TrendingUp,
    TrendingDown,
    Users,
    ShoppingBag,
    DollarSign,
    Activity,
    ExternalLink,
    ShieldCheck,
    Cpu,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    AlertTriangle,
    Bell,
    BarChart3
} from 'lucide-react';

type AnalyticsPeriod = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [alerts, setAlerts] = useState<any[]>([]);
    const [distribution, setDistribution] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState<AnalyticsPeriod>('DAILY');
    const [livePulse, setLivePulse] = useState(0);

    useEffect(() => {
        const loadInitial = async () => {
            try {
                const [s, h, d, a] = await Promise.all([
                    api.getDashboardStats(),
                    api.getSalesHistory(period),
                    api.getRevenueDistribution(),
                    api.getOperationalAlerts()
                ]);
                setStats(s);
                setHistory(h);
                setDistribution(d);
                setAlerts(a);
            } catch (error) {
                console.error('Initial Load Error:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitial();

        const interval = setInterval(() => {
            setLivePulse(prev => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!loading) {
            const updateHistory = async () => {
                try {
                    const h = await api.getSalesHistory(period);
                    setHistory(h);
                } catch (error) {
                    console.error('History Update Error:', error);
                }
            };
            updateHistory();
        }
    }, [period]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [s, h, d, a] = await Promise.all([
                api.getDashboardStats(),
                api.getSalesHistory(period),
                api.getRevenueDistribution(),
                api.getOperationalAlerts()
            ]);
            setStats(s);
            setHistory(h);
            setDistribution(d);
            setAlerts(a);
        } catch (error) {
            console.error('Refresh Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const liveStats = useMemo(() => {
        if (!stats) return null;
        return {
            ...stats,
            activeSessions: stats.activeSessions + (Math.floor(Math.random() * 5) - 2)
        };
    }, [stats, livePulse]);

    if (loading && !stats) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        </div>
    );

    const quickActions = [
        { label: 'Add Product', icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600', href: '/admin/products' },
        { label: 'Staff Roles', icon: ShieldCheck, color: 'bg-indigo-50 text-indigo-700', href: '/admin/staff' },
        { label: 'System Logs', icon: Cpu, color: 'bg-slate-50 text-slate-600', href: '/admin/settings' },
        { label: 'Reviews', icon: Search, color: 'bg-amber-50 text-amber-700', href: '/admin/reviews' },
    ];

    // Chart path calculation for Sales Volume (Order Count)
    const getSalesPath = (data: any[], key: string) => {
        if (!data.length) return '';
        const step = 700 / (data.length - 1);
        const max = period === 'MONTHLY' ? 1000 : period === 'WEEKLY' ? 200 : 100;
        return `M ${data.map((h, i) => `${i * step},${200 - (h[key] / max) * 200}`).join(' L ')}`;
    };

    // Chart path for Revenue (monetary) - scaled smaller for trend widgets
    const getRevenuePath = (data: any[], key: string, width: number, height: number) => {
        if (!data.length) return '';
        const step = width / (data.length - 1);
        const max = period === 'MONTHLY' ? 2500000 : period === 'WEEKLY' ? 700000 : 250000;
        return `M ${data.map((h, i) => `${i * step},${height - (h[key] / max) * height}`).join(' L ')}`;
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Insight Center</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                        <p className="text-sm font-semibold text-slate-500">Aggregated Operational & Financial Vectors</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg"><Activity className="w-4 h-4 text-indigo-500" /></div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Sync</p>
                            <p className="text-sm font-bold text-slate-700">{liveStats.activeSessions} <span className="text-[10px] text-slate-400 font-medium">nodes</span></p>
                        </div>
                    </div>
                    <button onClick={fetchData} className="p-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl shadow-sm transition-all active:scale-95 group">
                        <Zap className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
                    </button>
                </div>
            </div>

            {/* Core KPI Grid - Consolidated Totals */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Gross Revenue"
                    value={`ETB ${(liveStats.totalRevenue / 1000).toFixed(1)}K`}
                    growth={liveStats.revenueGrowth}
                    icon={DollarSign}
                    color="indigo"
                    sparkData={[40, 60, 45, 75, 55, 90, 85]}
                />
                <KPICard
                    title="Total Sales Velocity"
                    value={liveStats.activeOrders}
                    growth={liveStats.orderGrowth}
                    icon={ShoppingBag}
                    color="emerald"
                    sparkData={[30, 40, 35, 55, 45, 65, 60]}
                />
                <KPICard
                    title="Total Consolidated Reach"
                    value={liveStats.totalCustomers}
                    growth={liveStats.customerGrowth}
                    icon={Users}
                    color="amber"
                    sparkData={[20, 30, 40, 35, 50, 45, 70]}
                />
                <KPICard
                    title="Total Yield / Unit"
                    value={`ETB ${liveStats.avgOrderValue}`}
                    growth={liveStats.aovGrowth}
                    icon={TrendingUp}
                    color="rose"
                    sparkData={[60, 50, 70, 45, 55, 40, 50]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Visual Sales Graph (Order Volume) */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-emerald-500" />
                                    <h3 className="text-xl font-bold text-slate-900">Sales Volume Analysis</h3>
                                </div>
                                <p className="text-sm text-slate-500 font-medium">Order Velocity Distribution:
                                    <span className="text-emerald-600 font-bold ml-1">{period} Analytics</span>
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                {(['DAILY', 'WEEKLY', 'MONTHLY'] as AnalyticsPeriod[]).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriod(p)}
                                        className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${period === p
                                                ? 'bg-white text-emerald-600 shadow-sm'
                                                : 'text-slate-400 hover:text-slate-600'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-64 w-full relative group">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200">
                                <defs>
                                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {/* Grid Lines */}
                                {[0, 50, 100, 150, 200].map(y => (
                                    <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#f8fafc" strokeWidth="1" />
                                ))}

                                {/* Previous Sales Volume (Ghost Line) */}
                                <path
                                    d={getSalesPath(history, 'prevOrders')}
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="2"
                                    strokeDasharray="5 5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Area for main line */}
                                <path
                                    d={`${getSalesPath(history, 'orders')} L 700,200 L 0,200 Z`}
                                    fill="url(#salesGradient)"
                                />

                                {/* Current Sales Volume (Main Line) */}
                                <path
                                    d={getSalesPath(history, 'orders')}
                                    fill="none"
                                    stroke="#10b981"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="drop-shadow-[0_8px_8px_rgba(16,185,129,0.2)]"
                                />

                                {/* Unit Points */}
                                {history.map((h, i) => (
                                    <g key={i} className="group/point">
                                        <circle
                                            cx={i * (700 / (history.length - 1))}
                                            cy={200 - (h.orders / (period === 'MONTHLY' ? 1000 : period === 'WEEKLY' ? 200 : 100)) * 200}
                                            r="4"
                                            fill="#fff"
                                            stroke="#10b981"
                                            strokeWidth="2"
                                            className="transition-all"
                                        />
                                    </g>
                                ))}
                            </svg>

                            <div className="flex justify-between mt-6 px-2">
                                {history.map((h, i) => (
                                    <span key={i} className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {h.date.length > 5 ? h.date.split('-').slice(2).join('/') : h.date}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Access HUB - Fully Functional Links */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, idx) => (
                            <Link
                                key={idx}
                                href={action.href}
                                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95 text-left space-y-3 group block"
                            >
                                <div className={`p-2.5 rounded-xl w-fit ${action.color} group-hover:scale-110 transition-transform`}>
                                    <action.icon className="w-5 h-5" />
                                </div>
                                <p className="text-xs font-black text-slate-800 uppercase tracking-wider">{action.label}</p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar: Intelligence & Revenue Trend */}
                <div className="space-y-8">
                    {/* Revenue Trend Tracking (Secondary Implementation) */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-indigo-500" />
                                Revenue Flux
                            </h3>
                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">FY 2026</span>
                        </div>
                        <div className="h-20 w-full relative">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 240 60">
                                <path
                                    d={getRevenuePath(history, 'sales', 240, 60)}
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d={getRevenuePath(history, 'prevSales', 240, 60)}
                                    fill="none"
                                    stroke="#e2e8f0"
                                    strokeWidth="1"
                                    strokeDasharray="2 2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Gross Growth</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-sm font-black text-slate-900">+{liveStats.revenueGrowth}%</span>
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                </div>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Net Yield</p>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <span className="text-sm font-black text-slate-900">ETB 24K</span>
                                    <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Operational Alerts Feed */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-indigo-500" />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Alert Feed</h3>
                            </div>
                            <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full">{alerts.length} NEW</span>
                        </div>
                        <div className="space-y-4">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="flex gap-4 p-3.5 bg-slate-50/50 hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                                    <div className={`p-2.5 rounded-xl h-fit ${alert.type === 'CRITICAL' ? 'bg-rose-50 text-rose-600' :
                                            alert.type === 'WARNING' ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                        {alert.icon === 'Box' && <ShoppingBag className="w-4 h-4" />}
                                        {alert.icon === 'AlertTriangle' && <AlertTriangle className="w-4 h-4" />}
                                        {alert.icon === 'UserPlus' && <Users className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-800 leading-snug">{alert.title}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400">
                                            <Activity className="w-3 h-3" />
                                            {alert.time}
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                        <div className="relative z-10 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-black text-indigo-300 uppercase tracking-widest text-xs">Environment Vectors</h3>
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">Uptime Optimization</span>
                                        <span className="text-xs font-black text-emerald-400">{liveStats.serverUptime}</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="w-[99.9%] h-full bg-emerald-400 rounded-full" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Load</p>
                                        <p className="text-sm font-black">12.4%</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-indigo-300 uppercase mb-1">Latency</p>
                                        <p className="text-sm font-black">24ms</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, growth, icon: Icon, color, sparkData }: any) {
    return (
        <div className="group bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
            <div className={`relative z-10 p-3 rounded-2xl w-fit ${color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                    color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                }`}>
                <Icon className="w-5 h-5" />
            </div>

            <div className="mt-4 relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
                <div className="flex items-end justify-between mt-1">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h2>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black ${growth >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(growth)}%
                    </div>
                </div>
            </div>
        </div>
    );
}
