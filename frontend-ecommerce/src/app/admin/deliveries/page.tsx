'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Truck,
    Search,
    Filter,
    ChevronRight,
    MapPin,
    Phone,
    Clock,
    CheckCircle2,
    AlertCircle,
    Navigation,
    User,
    ArrowRight,
    Circle,
    MoreVertical
} from 'lucide-react';

interface Delivery {
    id: string;
    orderId: string;
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
    driverName?: string;
    driverPhone?: string;
    estimatedTime?: string;
    order: {
        orderNumber?: string;
        customer: {
            name: string;
        };
    };
    createdAt: string;
}

const FALLBACK_DELIVERIES: Delivery[] = [
    {
        id: 'd1',
        orderId: 'o1',
        status: 'IN_TRANSIT',
        driverName: 'Abbebe K.',
        driverPhone: '+251 911 223 344',
        estimatedTime: '14:30 PM',
        order: {
            orderNumber: 'ACME-10021',
            customer: { name: 'Selam T.' }
        },
        createdAt: new Date().toISOString()
    },
    {
        id: 'd2',
        orderId: 'o2',
        status: 'DELIVERED',
        driverName: 'Kebede M.',
        driverPhone: '+251 922 445 566',
        estimatedTime: 'Completed',
        order: {
            orderNumber: 'TSEGA-77201',
            customer: { name: 'Arsi Farm' }
        },
        createdAt: new Date().toISOString()
    },
    {
        id: 'd3',
        orderId: 'o3',
        status: 'PENDING',
        driverName: 'Unassigned',
        order: {
            orderNumber: 'LEGACY-54011',
            customer: { name: 'Global Coffee' }
        },
        createdAt: new Date().toISOString()
    }
];

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

    useEffect(() => {
        setTimeout(() => {
            setDeliveries(FALLBACK_DELIVERIES);
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Fleet <span className="text-emerald-600 font-serif italic normal-case">Telemetry</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time monitoring of global harvest distribution</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl text-emerald-600 font-bold text-xs uppercase tracking-widest">
                        <Navigation className="w-4 h-4" />
                        8 Units Active
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'In Transit', count: '5', color: 'emerald', icon: Truck },
                    { label: 'Pending Assignment', count: '2', color: 'amber', icon: Clock },
                    { label: 'Successful Dispatches', count: '142', color: 'slate', icon: CheckCircle2 },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-slate-900">{stat.count}</p>
                        </div>
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Deliveries Listing */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <Truck className="text-emerald-500 w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active <span className="text-emerald-600">Shipments</span></h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Logistics Ledger</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input type="text" placeholder="Trace Shipment..." className="bg-white border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-emerald-500/20 outline-none w-64 shadow-sm" />
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Fleet Data...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vessel/Order</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Consignee</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Officer in Charge</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Telemetry Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal ETA</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {deliveries.map((delivery) => (
                                    <tr key={delivery.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="px-10 py-8">
                                            <Link href={`/admin/orders/${delivery.orderId}`} className="flex items-center gap-3 group/link">
                                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover/link:bg-emerald-500 group-hover/link:text-white transition-all">
                                                    <Navigation className="w-5 h-5" />
                                                </div>
                                                <span className="font-black text-slate-900 group-hover/link:text-emerald-700 transition-colors uppercase tracking-tighter">
                                                    {delivery.order.orderNumber || delivery.orderId.slice(0, 8)}
                                                </span>
                                            </Link>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{delivery.order.customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 text-sm">{delivery.driverName || 'UNASSIGNED'}</span>
                                                {delivery.driverPhone && <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">{delivery.driverPhone}</span>}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${statusStyles[delivery.status]}`}>
                                                <Circle className="w-1.5 h-1.5 fill-current" />
                                                {delivery.status.replace('_', ' ')}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-2 font-black text-slate-900 text-xs">
                                                <Clock className="w-4 h-4 text-slate-300" />
                                                {delivery.estimatedTime || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm">
                                                    <Navigation className="w-4 h-4" />
                                                </button>
                                                <button className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-all">
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <MoreVertical className="w-5 h-5 text-slate-300 group-hover:hidden ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
