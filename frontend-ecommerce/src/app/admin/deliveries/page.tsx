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
    Clock,
    User,
    ArrowRight,
    Circle,
    Search
} from 'lucide-react';

interface Delivery {
    id: string;
    orderId: string;
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
    provider?: string;
    trackingNumber?: string;
    driverName?: string;
    driverPhone?: string;
    estimatedTime?: string;
    order?: {
        orderNumber?: string;
        customer: { name: string };
    };
    createdAt: string;
}

const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100',
    ASSIGNED: 'bg-blue-50 text-blue-600 border-blue-100',
    PICKED_UP: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    IN_TRANSIT: 'bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse',
    DELIVERED: 'bg-slate-50 text-slate-400 border-slate-100',
    FAILED: 'bg-rose-50 text-rose-600 border-rose-100',
};

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        try {
            setLoading(true);
            const data = await api.getDeliveries();
            setDeliveries(data as Delivery[]);
        } catch (error) {
            console.error('Failed to fetch deliveries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.updateDeliveryStatus(id, status);
            fetchDeliveries();
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        }
    };

    const handleAssignDriver = async (id: string, driverData: any) => {
        try {
            await api.updateDelivery(id, driverData);
            fetchDeliveries();
        } catch (error) {
            console.error('Failed to assign driver:', error);
            alert('Failed to assign driver');
        }
    };

    const getStatusStyle = (status: string) => {
        return statusStyles[status] || 'bg-slate-50 text-slate-700 border-slate-100';
    };

    const stats = [
        { label: 'Active Shipments', value: deliveries.filter(d => d.status === 'IN_TRANSIT').length, icon: Navigation, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Delivered Today', value: deliveries.filter(d => d.status === 'DELIVERED').length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Avg. Delivery Time', value: '1.2 Days', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-50' },
    ];

    const filteredDeliveries = deliveries.filter(d =>
        d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.driverName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-900">Live Telemetry</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Trace shipment..."
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
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tracking / Order</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Carrier/Officer</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ETA</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading && deliveries.length === 0 ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : filteredDeliveries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                                <Truck className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-900">No matching deliveries</p>
                                                <p className="text-sm text-slate-500">Shipped orders will appear here.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDeliveries.map((delivery) => (
                                <tr key={delivery.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{delivery.trackingNumber || `DEL-${delivery.id.slice(0, 5).toUpperCase()}`}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">Order: #{delivery.orderId.toUpperCase()}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <User className="w-3 h-3 text-slate-400" />
                                                <p className="text-sm text-slate-900 font-medium">{delivery.driverName || delivery.provider || 'Unassigned'}</p>
                                            </div>
                                            {delivery.driverPhone && <p className="text-[10px] text-emerald-600 font-bold ml-5">{delivery.driverPhone}</p>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusStyle(delivery.status)} uppercase tracking-wide`}>
                                            <Circle className="w-1.5 h-1.5 fill-current" />
                                            {delivery.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Clock className="w-3.5 h-3.5" />
                                            <p className="text-sm">{delivery.estimatedTime || '---'}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {delivery.status === 'PENDING' && (
                                                <button
                                                    onClick={() => {
                                                        const name = prompt('Driver Name:');
                                                        const phone = prompt('Driver Phone:');
                                                        if (name) handleAssignDriver(delivery.id, { driverName: name, driverPhone: phone, status: 'ASSIGNED' });
                                                    }}
                                                    className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all"
                                                >
                                                    Assign
                                                </button>
                                            )}
                                            {delivery.status !== 'DELIVERED' && delivery.status !== 'FAILED' && delivery.status !== 'PENDING' && (
                                                <select
                                                    className="bg-white border border-slate-200 rounded-lg py-1 px-2 text-[10px] font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                                                    value={delivery.status}
                                                    onChange={(e) => handleUpdateStatus(delivery.id, e.target.value)}
                                                >
                                                    <option value="ASSIGNED">Assigned</option>
                                                    <option value="PICKED_UP">Picked Up</option>
                                                    <option value="IN_TRANSIT">In Transit</option>
                                                    <option value="DELIVERED">Delivered</option>
                                                    <option value="FAILED">Failed</option>
                                                </select>
                                            )}
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
