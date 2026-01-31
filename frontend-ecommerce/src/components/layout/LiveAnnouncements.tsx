'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/context';
import { Bell, X, Info, AlertTriangle, Sparkles } from 'lucide-react';

interface Announcement {
    id: string;
    message: string;
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'PROMO';
}

export function LiveAnnouncements() {
    const { subscribe, socket } = useSocket();
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!socket) return;

        const unsubscribe = subscribe('system_announcement', (data: Announcement) => {
            setAnnouncement(data);
            setIsVisible(true);

            // Auto-hide after 10 seconds if it's info or promo
            if (data.type === 'INFO' || data.type === 'PROMO') {
                setTimeout(() => setIsVisible(false), 10000);
            }
        });

        return () => unsubscribe();
    }, [socket, subscribe]);

    if (!isVisible || !announcement) return null;

    const bgColor = announcement.type === 'PROMO' ? 'bg-indigo-600' :
        announcement.type === 'WARNING' ? 'bg-amber-600' :
            announcement.type === 'SUCCESS' ? 'bg-emerald-600' : 'bg-slate-900';

    const Icon = announcement.type === 'PROMO' ? Sparkles :
        announcement.type === 'WARNING' ? AlertTriangle : Info;

    return (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-3rem)] max-w-lg animate-in fade-in slide-in-from-bottom-10 duration-700`}>
            <div className={`${bgColor} text-white p-5 rounded-[2rem] shadow-2xl flex items-center gap-4 relative overflow-hidden group`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000"></div>

                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md">
                    <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-black leading-tight tracking-tight">
                        {announcement.message}
                    </p>
                </div>

                <button
                    onClick={() => setIsVisible(false)}
                    className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center hover:bg-black/40 transition-colors shrink-0"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
