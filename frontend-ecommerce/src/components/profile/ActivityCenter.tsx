'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    MessageSquare,
    Send,
    Clock,
    User,
    ChevronRight,
    Inbox as InboxIcon,
    AlertCircle,
    CheckCircle2,
    Bell,
    Layers
} from 'lucide-react';
import { NotificationsList } from './NotificationsList';
import { Inbox } from './Inbox';

export function ActivityCenter({ initialSection = 'messages' }: { initialSection?: string }) {
    const [activeSection, setActiveSection] = useState(initialSection);

    useEffect(() => {
        if (initialSection) setActiveSection(initialSection);
    }, [initialSection]);

    return (
        <div className="space-y-8">
            {/* Header / Sub-tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic uppercase">Activity Center</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Communication & Alerts Sequence</p>
                    </div>
                </div>

                <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <button
                        onClick={() => setActiveSection('messages')}
                        className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'messages'
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Messages
                    </button>
                    <button
                        onClick={() => setActiveSection('notifications')}
                        className={`flex items-center gap-3 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'notifications'
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <Bell className="w-3.5 h-3.5" />
                        Notifications
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                {activeSection === 'messages' ? (
                    <Inbox />
                ) : (
                    <NotificationsList />
                )}
            </div>
        </div>
    );
}
