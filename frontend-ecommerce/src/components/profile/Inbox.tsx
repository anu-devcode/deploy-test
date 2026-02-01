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
    CheckCircle2
} from 'lucide-react';
import { useNotifications } from '@/context';

export function Inbox() {
    const { refreshCount } = useNotifications();
    const [threads, setThreads] = useState<any[]>([]);
    const [activeThread, setActiveThread] = useState<any>(null);
    const [reply, setReply] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            const data = await api.getMessages();
            setThreads(data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    const selectThread = async (thread: any) => {
        setActiveThread(thread);
        if (thread.id && !thread.isNew) {
            try {
                await api.markMessageAsRead(thread.id);
                refreshCount();
                // Update local state to show as read
                setThreads(prev => prev.map(t => t.id === thread.id ? { ...t, unreadCount: 0 } : t));
            } catch (e) {
                console.error('Failed to mark thread as read', e);
            }
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setSending(true);
        try {
            await api.sendMessage({
                content: reply,
                parentId: activeThread?.id
            });
            setReply('');
            if (activeThread) {
                const updatedThread = await api.getMessageThread(activeThread.id);
                setActiveThread(updatedThread);
            }
            fetchThreads();
        } catch (error) {
            console.error('Failed to send message', error);
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
            {/* Thread List */}
            <div className={`flex-1 lg:w-1/3 space-y-4 ${activeThread ? 'hidden lg:block' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3 italic">
                        <InboxIcon className="w-5 h-5 text-emerald-500" />
                        Messages
                    </h3>
                    <button
                        onClick={() => setActiveThread({ isNew: true })}
                        className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>
                </div>

                {threads.length === 0 && !activeThread?.isNew ? (
                    <div className="bg-white rounded-3xl p-8 border border-dashed border-slate-200 text-center">
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest leading-relaxed">
                            Your inbox is currently empty.<br />Need help? Click the message icon.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {threads.map((thread) => (
                            <button
                                key={thread.id}
                                onClick={() => setActiveThread(thread)}
                                className={`w-full text-left p-5 rounded-3xl border transition-all ${activeThread?.id === thread.id
                                    ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                                    : 'bg-white border-slate-100 hover:border-emerald-100 group'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${thread.status === 'RESOLVED' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-500/10 text-emerald-600'
                                        }`}>
                                        {thread.status}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                                        {new Date(thread.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="font-black text-slate-900 uppercase tracking-tight truncate">
                                    {thread.subject || 'Support Request'}
                                </h4>
                                <p className="text-xs text-slate-500 truncate mt-1">
                                    {thread.content}
                                </p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className={`flex-[2] bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col ${!activeThread ? 'hidden lg:flex items-center justify-center p-12' : 'flex'}`}>
                {!activeThread ? (
                    <div className="text-center opacity-40">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-10 h-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Select a message</h3>
                        <p className="text-sm">Pick a thread from the list to view the conversation</p>
                    </div>
                ) : (
                    <>
                        {/* Thread Header */}
                        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setActiveThread(null)}
                                    className="lg:hidden p-2 text-slate-400"
                                >
                                    <ChevronRight className="w-6 h-6 rotate-180" />
                                </button>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">
                                        {activeThread.isNew ? 'New Message' : (activeThread.subject || 'Support Request')}
                                    </h3>
                                    {!activeThread.isNew && (
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            Thread ID: #{activeThread.id?.split('-')[0]}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {activeThread.status === 'RESOLVED' && (
                                <div className="flex items-center gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Resolved
                                </div>
                            )}
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/30">
                            {!activeThread.isNew && (
                                <div className="flex flex-col gap-8">
                                    {/* Original Message */}
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xs font-black uppercase text-slate-900">You</span>
                                                <span className="text-[10px] font-bold text-slate-400">{new Date(activeThread.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className="p-6 bg-white rounded-[2rem] rounded-tl-none border border-slate-100 text-sm text-slate-600 shadow-sm max-w-2xl">
                                                {activeThread.content}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Replies */}
                                    {activeThread.replies?.map((msg: any) => (
                                        <div key={msg.id} className={`flex gap-4 ${msg.senderRole === 'ADMIN' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.senderRole === 'ADMIN' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'
                                                }`}>
                                                {msg.senderRole === 'ADMIN' ? <AlertCircle className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                            </div>
                                            <div className={`space-y-2 ${msg.senderRole === 'ADMIN' ? 'flex flex-col items-end' : ''}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-black uppercase text-slate-900">
                                                        {msg.senderRole === 'ADMIN' ? 'Support Agent' : 'You'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className={`p-6 rounded-[2rem] border text-sm shadow-sm max-w-2xl ${msg.senderRole === 'ADMIN'
                                                    ? 'bg-emerald-600 text-white border-emerald-500 rounded-tr-none'
                                                    : 'bg-white text-slate-600 border-slate-100 rounded-tl-none'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeThread.isNew && (
                                <div className="space-y-6">
                                    <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100">
                                        <h4 className="text-sm font-black text-emerald-900 uppercase tracking-tight mb-2">How can we help?</h4>
                                        <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                                            Send us your question, feedback, or report an issue. A member of our support sequence will respond shortly.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 block px-2">Subject (Optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Delivery Status, Bulk Pricing..."
                                            className="w-full p-5 rounded-2xl bg-white border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Reply Input */}
                        <form onSubmit={handleSend} className="p-6 md:p-8 bg-white border-t border-slate-100">
                            <div className="relative group">
                                <textarea
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    placeholder={activeThread.isNew ? "Enter your inquiry..." : "Type your reply..."}
                                    className="w-full p-6 pr-20 rounded-[2rem] bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all resize-none min-h-[100px]"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !reply.trim()}
                                    className="absolute bottom-4 right-4 p-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:grayscale active:scale-95"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
