'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    Bell,
    MessageSquare,
    ChevronRight,
    Clock,
    ShoppingBag,
    Star,
    AlertCircle
} from 'lucide-react';

interface RecentActivityProps {
    onViewAll: (tab: string, section?: string) => void;
}

export function RecentActivity({ onViewAll }: RecentActivityProps) {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                // Fetch both notifications and messages for a combined view
                const [notifs, msgs] = await Promise.all([
                    api.getRecentNotifications().catch(() => []),
                    api.getMessages().catch(() => [])
                ]);

                const combined = [
                    ...notifs.map(n => ({ ...n, activityType: 'notification' })),
                    ...msgs.map(m => ({ ...m, activityType: 'message' }))
                ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);

                setActivities(combined);
            } catch (error) {
                console.error('Failed to fetch recent activity', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, []);

    const getIcon = (item: any) => {
        if (item.activityType === 'message') return <MessageSquare className="w-4 h-4 text-blue-500" />;
        switch (item.type) {
            case 'ORDER_STATUS': return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
            case 'PROMOTION': return <Star className="w-4 h-4 text-amber-500" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    return (
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-6 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase italic">Recent Activity</h3>
                </div>
                <button
                    onClick={() => onViewAll('inbox', 'messages')}
                    className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 transition-colors"
                >
                    View Inbox
                </button>
            </div>

            <div className="flex-1 p-6">
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex gap-4 animate-pulse">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-2 bg-slate-100 rounded w-1/4" />
                                    <div className="h-3 bg-slate-100 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : activities.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-40">
                        <Bell className="w-10 h-10 text-slate-300 mb-4" />
                        <p className="text-sm font-bold uppercase tracking-widest">No recent alerts</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activities.map((item, idx) => (
                            <div key={item.id || idx} className="flex gap-4 group cursor-pointer" onClick={() => onViewAll('inbox', item.activityType === 'message' ? 'messages' : 'notifications')}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all group-hover:scale-110 ${item.activityType === 'message' ? 'bg-blue-50' : 'bg-slate-50'
                                    }`}>
                                    {getIcon(item)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                            {item.activityType === 'message' ? 'Support Message' : item.type?.replace('_', ' ')}
                                        </p>
                                        <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm font-black text-slate-900 truncate group-hover:text-emerald-600 transition-colors">
                                        {item.activityType === 'message' ? (item.subject || 'Support Inquiry') : item.title}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {item.activityType === 'message' ? item.content : item.message}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => onViewAll('inbox', 'messages')}
                className="w-full py-4 bg-slate-50 border-t border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all"
            >
                Enter Communication sequence
            </button>
        </div >
    );
}
