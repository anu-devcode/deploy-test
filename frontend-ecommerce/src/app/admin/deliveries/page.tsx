'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Truck,
    MapPin,
    Navigation,
    CheckCircle2,
    AlertCircle,
    MoreVertical,
    ExternalLink,
    Clock,
    User
} from 'lucide-react';

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            const data = await api.getDeliveries();
            setDeliveries(data);
        } catch (error) {
            console.error('Failed to fetch deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'IN_TRANSIT': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'FAILED': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const stats = [
        { label: 'Active Shipments', value: deliveries.filter(d => d.status === 'IN_TRANSIT').length, icon: Navigation, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Delivered Today', value: deliveries.filter(d => d.status === 'DELIVERED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg. Delivery Time', value: '1.2 Days', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Logistics & Deliveries</h1>
                    <p className="text-sm text-slate-500">Track and manage outgoing shipments and delivery partners.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95 shadow-lg shadow-slate-200">
                    <Truck className="w-4 h-4" />
                    Dispatch All
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

            {/* Deliveries Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking / Order</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Sync</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Truck className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-900">No active deliveries</p>
                                                <p className="text-sm text-slate-500">Shipped orders will appear here.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : deliveries.map((delivery) => (
                                <tr key={delivery.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{delivery.trackingNumber}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">Order: #{delivery.orderId}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center">
                                                <User className="w-3 h-3 text-slate-500" />
                                            </div>
                                            <p className="text-sm text-slate-900 font-medium">{delivery.provider}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(delivery.status)} uppercase tracking-wide`}>
                                            {delivery.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-slate-600">Few moments ago</p>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-all" title="View Map">
                                                <Navigation className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
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
