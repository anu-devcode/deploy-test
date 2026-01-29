'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    CreditCard,
    TrendingUp,
    ShieldCheck,
    ArrowUpRight,
    Search,
    Download,
    CheckCircle2,
    Clock,
    XCircle,
    DollarSign,
    AlertCircle,
    FileText,
    Circle,
    MoreHorizontal
} from 'lucide-react';

interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    createdAt: string;
    date?: string; // Support both naming conventions if necessary
}

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

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const data = await api.getPayments();
            setPayments(data as Payment[]);
        } catch (error) {
            console.error('Failed to fetch payments:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        return statusStyles[status] || 'bg-slate-50 text-slate-700 border-slate-100';
    };

    const stats = [
        { label: 'Total Revenue', value: 'ETB 158,400', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Total Transactions', value: payments.length, icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Secure Buffer', value: '99.9%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    ];

    const filteredPayments = payments.filter(p =>
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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

            {/* Quick Stats Grid */}
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
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-900">Recent Transactions</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-64"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order Ref</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && payments.length === 0 ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={7} className="px-6 py-4 h-16 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center text-slate-500">No matching payments recorded</td>
                                </tr>
                            ) : filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                        TRX-{payment.transactionId || payment.id.toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900">
                                        #{payment.orderId.toUpperCase()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-900">ETB {payment.amount.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                                                <span className="text-sm">{methodIcons[payment.method] || '💳'}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 font-medium">{payment.method.replace(/_/g, ' ')}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusStyle(payment.status)} uppercase tracking-wide`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">{new Date(payment.date || payment.createdAt).toLocaleDateString()}</p>
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
            </div>
        </div>
    );
}
