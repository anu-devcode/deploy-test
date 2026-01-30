'use client';

import React, { useState, useEffect } from 'react';
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
    CreditCard,
    Shield,
    Tag
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Customer } from '@/lib/api';

export default function CustomersPage() {
    const { user: currentUser } = useAuth();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);

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
                                <React.Fragment key={customer.id}>
                                    <tr
                                        onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                                        className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 uppercase">
                                                    {customer.firstName?.charAt(0) || customer.email.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900">{customer.firstName} {customer.lastName}</p>
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
                                                    {customer._count?.orders || 0} Orders
                                                </div>
                                                <p className="text-[10px] text-slate-400">Joined {new Date(customer.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900">ETB 0</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className={`p-2 rounded-lg transition-all ${expandedCustomer === customer.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}>
                                                <ChevronRight className={`w-4 h-4 transition-transform ${expandedCustomer === customer.id ? 'rotate-90' : ''}`} />
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedCustomer === customer.id && (
                                        <tr className="bg-slate-50/30">
                                            <td colSpan={5} className="px-6 py-4 border-t border-slate-100">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                                                    <div>
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Contact Information</h4>
                                                        <div className="space-y-2 text-sm text-slate-600">
                                                            <p><span className="font-medium text-slate-900">Phone:</span> {customer.phone || 'N/A'}</p>
                                                            <p><span className="font-medium text-slate-900">Address:</span> {customer.address}, {customer.city}, {customer.country}</p>
                                                        </div>
                                                    </div>
                                                    {currentUser?.role === 'ADMIN' && (
                                                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Shield className="w-4 h-4 text-indigo-600" />
                                                                <h4 className="text-xs font-bold text-slate-900 uppercase">Admin Intel</h4>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Internal Notes</p>
                                                                    <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">
                                                                        "{customer.adminNotes || 'No internal notes added yet.'}"
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-indigo-700">Flags & Status</p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {customer.flags && customer.flags.length > 0 ? customer.flags.map(flag => (
                                                                            <span key={flag} className="flex items-center gap-1 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-[10px] font-bold border border-indigo-100">
                                                                                <Tag className="w-3 h-3" /> {flag}
                                                                            </span>
                                                                        )) : (
                                                                            <span className="text-xs text-slate-400 italic">No flags assigned</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
