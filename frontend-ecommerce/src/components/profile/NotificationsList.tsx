'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Bell,
    ShoppingBag,
    Star,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Package,
    Shield,
    User,
    Truck,
    Heart,
    CreditCard,
    Info
} from 'lucide-react';
import { useNotifications } from '@/context';

export function NotificationsList() {
    const { refreshCount } = useNotifications();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await api.getNotifications();
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
            refreshCount();
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER_STATUS': return <ShoppingBag className="w-5 h-5 text-emerald-500" />;
            case 'PAYMENT_RECEIVED': return <CreditCard className="w-5 h-5 text-blue-500" />;
            case 'STOCK_ALERT': return <Package className="w-5 h-5 text-rose-500" />;
            case 'PROMOTION': return <Star className="w-5 h-5 text-amber-500" />;
            case 'SYSTEM': return <Info className="w-5 h-5 text-slate-500" />;
            case 'ACCOUNT': return <User className="w-5 h-5 text-indigo-500" />;
            case 'SECURITY': return <Shield className="w-5 h-5 text-red-500" />;
            case 'DELIVERY': return <Truck className="w-5 h-5 text-orange-500" />;
            case 'ENGAGEMENT': return <Heart className="w-5 h-5 text-pink-500" />;
            default: return <Bell className="w-5 h-5 text-slate-400" />;
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            refreshCount();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
    );

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="space-y-4">
            {notifications.length > 0 && unreadCount > 0 && (
                <div className="flex justify-end mb-2">
                    <button
                        onClick={markAllAsRead}
                        className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100"
                    >
                        <CheckCircle2 className="w-3 h-3" />
                        Mark all as read
                    </button>
                </div>
            )}
            {notifications.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                        <Bell className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">No notifications</h3>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">We'll alert you when something happens</p>
                </div>
            ) : (
                notifications.map((n) => (
                    <div
                        key={n.id}
                        onClick={() => !n.isRead && markAsRead(n.id)}
                        className={`group relative bg-white rounded-3xl p-6 border transition-all cursor-pointer ${!n.isRead ? 'border-emerald-100 shadow-sm shadow-emerald-500/5' : 'border-slate-100 hover:border-slate-200 opacity-80'
                            }`}
                    >
                        <div className="flex gap-6">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${!n.isRead ? 'bg-emerald-50' : 'bg-slate-50'
                                }`}>
                                {getIcon(n.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        {n.type?.replace('_', ' ')}
                                        {!n.isRead && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />}
                                    </span>
                                    <span className="text-[10px] text-slate-300 font-bold uppercase transition-colors group-hover:text-slate-400">
                                        {new Date(n.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className={`font-black uppercase tracking-tight truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                                    {n.title}
                                </h4>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    {n.message}
                                </p>
                            </div>
                        </div>

                        {!n.isRead && (
                            <div className="absolute top-6 right-6 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
