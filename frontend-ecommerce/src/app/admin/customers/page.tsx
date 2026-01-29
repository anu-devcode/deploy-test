'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Users,
    Search,
    Filter,
    Download,
    MoreVertical,
    Mail,
    ShoppingBag,
    Calendar,
    ChevronRight,
    ArrowUpRight,
    UserPlus,
    CreditCard
} from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await api.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { label: 'Total Customers', value: '1,284', change: '+12%', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Active This Month', value: '842', change: '+5%', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg. Lifetime Value', value: 'ETB 4.2k', change: '+18%', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Customer Relationship</h1>
                    <p className="text-sm text-slate-500">Manage your audience and track their purchase behavior.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
                        <UserPlus className="w-4 h-4" /> Add Customer
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                                    <ArrowUpRight className="w-2.5 h-2.5" /> {stat.change}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email or ID..."
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all">
                    <Filter className="w-4 h-4" /> Filters
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">History</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/10"></td>
                                    </tr>
                                ))
                            ) : customers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {customer.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{customer.name}</p>
                                                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                                    <Mail className="w-3 h-3" /> {customer.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                                                <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                                                {customer.orders} Orders
                                            </div>
                                            <p className="text-[10px] text-slate-400">Joined {new Date(customer.joiningDate).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-900">ETB {customer.totalSpent.toLocaleString()}</p>
                                        <div className="w-20 h-1 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${Math.min((customer.totalSpent / 50000) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${customer.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                                            <ChevronRight className="w-4 h-4" />
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
