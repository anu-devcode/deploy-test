'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Bell,
    CheckCheck,
    Trash2,
    AlertCircle,
    Package,
    Truck,
    CreditCard,
    User,
    ShieldAlert,
    Info,
    ChevronRight,
    Clock,
    Filter,
    Search
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await api.getAdminNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            await api.markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error('Failed to mark all read', error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'ORDER_STATUS': return <Package className="w-5 h-5 text-indigo-600" />;
            case 'PAYMENT_RECEIVED':
            case 'FINANCE': return <CreditCard className="w-5 h-5 text-emerald-600" />;
            case 'STOCK_ALERT':
            case 'INVENTORY': return <AlertCircle className="w-5 h-5 text-amber-600" />;
            case 'DELIVERY':
            case 'LOGISTICS': return <Truck className="w-5 h-5 text-blue-600" />;
            case 'ACCOUNT': return <User className="w-5 h-5 text-indigo-500" />;
            case 'SECURITY': return <ShieldAlert className="w-5 h-5 text-rose-600" />;
            case 'MODERATION': return <AlertCircle className="w-5 h-5 text-purple-600" />;
            default: return <Info className="w-5 h-5 text-slate-600" />;
        }
    };

    const getTypeBg = (type: string) => {
        switch (type) {
            case 'ORDER_STATUS': return 'bg-indigo-50';
            case 'FINANCE': return 'bg-emerald-50';
            case 'INVENTORY': return 'bg-amber-50';
            case 'LOGISTICS': return 'bg-blue-50';
            case 'SECURITY': return 'bg-rose-50';
            case 'MODERATION': return 'bg-purple-50';
            default: return 'bg-slate-50';
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === 'ALL' || n.type === filter;
        const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Notification Center</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5" />
                        Command Log & System Alerts
                    </p>
                </div>

                <button
                    onClick={markAllRead}
                    className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all shadow-sm active:scale-95"
                >
                    <CheckCheck className="w-4 h-4" />
                    Mark all as read
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search alerts by title or content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                    />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl border border-slate-100 w-full md:w-auto overflow-x-auto whitespace-nowrap">
                    {['ALL', 'ORDER_STATUS', 'INVENTORY', 'FINANCE', 'LOGISTICS', 'SECURITY'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === type ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {type.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="bg-white py-24 rounded-[3rem] border border-slate-200 border-dashed text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <Bell className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">No notifications found</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">{searchQuery ? 'Try adjusting your search' : 'Your alert queue is clear'}</p>
                    </div>
                ) : (
                    filteredNotifications.map((n) => (
                        <div
                            key={n.id}
                            className={`group relative bg-white p-6 md:p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-1 ${n.isRead ? 'border-slate-100' : 'border-indigo-100 ring-1 ring-indigo-50'}`}
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white shadow-sm ${getTypeBg(n.type)}`}>
                                    {getTypeIcon(n.type)}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <h3 className={`text-lg font-black tracking-tight ${n.isRead ? 'text-slate-700' : 'text-slate-900'}`}>{n.title}</h3>
                                        {!n.isRead && (
                                            <span className="px-2 py-0.5 bg-indigo-500 text-[8px] font-black text-white rounded-full uppercase tracking-widest animate-pulse">New</span>
                                        )}
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${getTypeBg(n.type)} ${getTypeIcon(n.type).props.className.replace('w-5 h-5', '')}`}>
                                            {n.type.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed mb-4 ${n.isRead ? 'text-slate-500 font-medium' : 'text-slate-600 font-bold'}`}>
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-6">
                                        <span className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            {new Date(n.createdAt).toLocaleString()}
                                        </span>

                                        {n.link && (
                                            <Link
                                                href={n.link}
                                                className="group/link flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                                            >
                                                Action Node
                                                <ChevronRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-2 md:flex-col md:opacity-0 md:group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                                    {!n.isRead && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex-1 md:flex-none flex items-center justify-center"
                                            title="Mark as Read"
                                        >
                                            <CheckCheck className="w-4 h-4" />
                                            <span className="md:hidden ml-2 text-xs font-bold">Mark Read</span>
                                        </button>
                                    )}
                                    <button
                                        className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm flex-1 md:flex-none flex items-center justify-center"
                                        title="Dismiss"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="md:hidden ml-2 text-xs font-bold">Dismiss</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
