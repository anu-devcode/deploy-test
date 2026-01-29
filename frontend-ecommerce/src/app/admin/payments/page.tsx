'use client';

import { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
    CreditCard,
    Search,
    Filter,
=======
import api from '@/lib/api';
import {
    CreditCard,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    Search,
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
    Download,
    CheckCircle2,
    Clock,
    XCircle,
<<<<<<< HEAD
    TrendingUp,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Circle,
    MoreVertical,
    FileText
} from 'lucide-react';

interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    createdAt: string;
}

const FALLBACK_PAYMENTS: Payment[] = [
    {
        id: 'pay1',
        orderId: 'o1',
        amount: 3560,
        method: 'TELEBIRR',
        status: 'COMPLETED',
        transactionId: 'TXN-990-112-AS8',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString()
    },
    {
        id: 'pay2',
        orderId: 'o2',
        amount: 26700,
        method: 'BANK_TRANSFER',
        status: 'PROCESSING',
        transactionId: 'TXN-445-667-KL2',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
        id: 'pay3',
        orderId: 'o3',
        amount: 1550,
        method: 'MPESA',
        status: 'FAILED',
        transactionId: 'TXN-001-229-ZM6',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    }
];

const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    PROCESSING: 'bg-blue-50 text-blue-600 border-blue-100',
    COMPLETED: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    FAILED: 'bg-rose-50 text-rose-600 border-rose-100',
    REFUNDED: 'bg-slate-50 text-slate-400 border-slate-100',
};

const methodIcons: Record<string, string> = {
    TELEBIRR: '📱',
    CBE: '🏦',
    MPESA: '📲',
    BANK_TRANSFER: '💳',
    CASH_ON_DELIVERY: '💵',
};
=======
    MoreHorizontal
} from 'lucide-react';
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546

export default function PaymentsPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
<<<<<<< HEAD
        setTimeout(() => {
            setPayments(FALLBACK_PAYMENTS);
            setLoading(false);
        }, 500);
=======
        fetchPayments();
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await api.getPayments();
            setPayments(data);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'FAILED': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const stats = [
        { label: 'Total Revenue', value: 'ETB 158,400', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Transactions', value: payments.length, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Secure Buffer', value: '99.9%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    return (
<<<<<<< HEAD
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Financial <span className="text-emerald-600 font-serif italic normal-case">Ledger</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Audit and reconcile global harvest transactions</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 font-bold text-xs uppercase tracking-widest">
                        <TrendingUp className="w-4 h-4" />
                        Revenue +14.2%
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Settled Valuations', value: 'ETB 142.5K', trend: '+ETB 12K', icon: DollarSign, color: 'emerald' },
                    { label: 'Pending Settlement', value: 'ETB 45.2K', trend: 'Audit Required', icon: Clock, color: 'amber' },
                    { label: 'Processing Ops', value: '18 Units', trend: 'Live Flow', icon: CreditCard, color: 'blue' },
                    { label: 'Disputed Claims', value: '0 Units', trend: 'Clean Sheet', icon: AlertCircle, color: 'rose' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 group hover:border-emerald-500/30 transition-all">
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-2 ${stat.color === 'rose' ? 'text-slate-400' : 'text-emerald-600'}`}>
                            {stat.trend}
                        </p>
                    </div>
                ))}
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <FileText className="text-emerald-500 w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Transaction <span className="text-emerald-600">Audit</span></h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Financial Log</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-slate-950/10">
                            <Download className="w-4 h-4" />
                            Download Ledger
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Syncing Central Bank Data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Transaction ID</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway/Channel</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Settlement Valuation</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Settlement Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="px-10 py-8">
                                            <span className="font-mono text-xs font-black text-slate-400 uppercase tracking-tighter group-hover:text-emerald-600 transition-colors">
                                                {payment.transactionId || payment.id.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="font-black text-slate-900 text-sm italic">
                                                #{payment.orderId.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{methodIcons[payment.method] || '💳'}</span>
                                                <span className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{payment.method.replace('_', ' ')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right font-black text-slate-900">
                                            ETB {payment.amount.toLocaleString()}
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex justify-center">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${statusStyles[payment.status]}`}>
                                                    <Circle className="w-1.5 h-1.5 fill-current" />
                                                    {payment.status}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-slate-900 text-xs">
                                                    {new Date(payment.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                                    {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
=======
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Finance & Payments</h1>
                    <p className="text-sm text-slate-500">Monitor transactions, revenue streams, and payout statuses.</p>
                </div>
                <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                    <Download className="w-4 h-4" />
                    Download Ledger
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

            {/* Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            className="bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/30 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={6} className="px-6 py-4 h-16 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : payments.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-500">No payments recorded</td>
                                </tr>
                            ) : payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        TRX-{payment.id.toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-900">ETB {payment.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center">
                                                <CreditCard className="w-3 h-3 text-slate-600" />
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium">{payment.method}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(payment.status)} uppercase tracking-wide`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{new Date(payment.date).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all">
                                            <ArrowUpRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
            </div>
        </div>
    );
}
