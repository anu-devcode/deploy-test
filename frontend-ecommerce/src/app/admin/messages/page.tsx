'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    MessageSquare,
    Send,
    CheckCircle2,
    Clock,
    User,
    Search,
    Filter,
    MoreVertical,
    ChevronRight,
    AlertCircle,
    Inbox as InboxIcon,
    Star
} from 'lucide-react';

export default function AdminMessagesPage() {
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
            const data = await api.getAdminMessages();
            setThreads(data);
        } catch (error) {
            console.error('Failed to fetch admin messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim()) return;

        setSending(true);
        try {
            await api.adminReplyToMessage(activeThread.id, reply);
            setReply('');
            const updatedThread = await api.getMessageThread(activeThread.id);
            setActiveThread(updatedThread);
            fetchThreads();
        } catch (error) {
            console.error('Failed to reply', error);
        } finally {
            setSending(false);
        }
    };

    const updateStatus = async (status: string) => {
        try {
            await api.updateMessageStatus(activeThread.id, status);
            setActiveThread({ ...activeThread, status });
            fetchThreads();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] lg:flex-row gap-0 bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm m-4">
            {/* Thread List Sidebar */}
            <div className="w-full lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/50">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-3">
                        <InboxIcon className="w-5 h-5 text-emerald-600" />
                        Customer Inbox
                    </h1>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {threads.length === 0 ? (
                        <div className="p-12 text-center opacity-40">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">No active inquiries</p>
                        </div>
                    ) : (
                        threads.map((thread) => (
                            <button
                                key={thread.id}
                                onClick={() => setActiveThread(thread)}
                                className={`w-full p-6 text-left border-b border-slate-50 transition-all hover:bg-white flex gap-4 ${activeThread?.id === thread.id ? 'bg-white border-r-4 border-r-slate-900' : ''}`}
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="text-sm font-black text-slate-900 truncate">
                                            {thread.customer?.firstName} {thread.customer?.lastName}
                                        </h4>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(thread.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-500 truncate mb-2">{thread.subject || 'Support Request'}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${thread.status === 'OPEN' ? 'bg-amber-100 text-amber-700' :
                                            thread.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                            {thread.status}
                                        </span>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col bg-white">
                {!activeThread ? (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-30">
                        <MessageSquare className="w-16 h-16 text-slate-300 mb-6" />
                        <h3 className="text-lg font-black text-slate-400 uppercase tracking-widest italic">Pick an inquiry</h3>
                    </div>
                ) : (
                    <>
                        {/* Detail Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{activeThread.customer?.firstName} {activeThread.customer?.lastName}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{activeThread.customer?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <select
                                    value={activeThread.status}
                                    onChange={(e) => updateStatus(e.target.value)}
                                    className="text-xs font-black uppercase tracking-widest px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                                >
                                    <option value="OPEN">Open</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="CLOSED">Closed</option>
                                </select>
                                <button className="p-2 text-slate-400 hover:text-slate-900">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Message Transcript */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 bg-slate-50/20">
                            {/* Topic summary */}
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm max-w-4xl mx-auto mb-12">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Subject</h2>
                                <h3 className="text-lg font-black text-slate-900 italic uppercase tracking-tighter">{activeThread.subject || 'Support Request'}</h3>
                            </div>

                            <div className="max-w-4xl mx-auto space-y-8 pb-10">
                                {/* Original Message */}
                                <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-xs font-black text-slate-900 uppercase">Customer</span>
                                            <span className="text-[10px] font-bold text-slate-400">{new Date(activeThread.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="p-6 bg-slate-100/50 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed ring-1 ring-slate-100">
                                            {activeThread.content}
                                        </div>
                                    </div>
                                </div>

                                {/* Replies */}
                                {activeThread.replies?.map((msg: any) => (
                                    <div key={msg.id} className={`flex gap-4 ${msg.senderRole === 'ADMIN' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.senderRole === 'ADMIN' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'
                                            }`}>
                                            {msg.senderRole === 'ADMIN' ? <Star className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`flex-1 ${msg.senderRole === 'ADMIN' ? 'flex flex-col items-end' : ''}`}>
                                            <div className="mb-2 flex items-center gap-3">
                                                <span className="text-xs font-black text-slate-900 uppercase">
                                                    {msg.senderRole === 'ADMIN' ? 'Agent (You)' : 'Customer'}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400">{new Date(msg.createdAt).toLocaleString()}</span>
                                            </div>
                                            <div className={`p-6 rounded-2xl text-sm leading-relaxed max-w-[80%] ${msg.senderRole === 'ADMIN'
                                                ? 'bg-slate-900 text-white rounded-tr-none'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Reply Bar */}
                        <div className="p-6 border-t border-slate-100 bg-white">
                            <form onSubmit={handleReply} className="flex gap-4 items-end">
                                <div className="flex-1 relative">
                                    <textarea
                                        value={reply}
                                        onChange={(e) => setReply(e.target.value)}
                                        placeholder="Type your response here..."
                                        className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-900/5 focus:border-slate-900 min-h-[80px] resize-none"
                                    />
                                    <div className="absolute right-4 bottom-4 flex gap-2">
                                        <button
                                            type="button"
                                            className="px-3 py-1.5 text-[10px] font-black bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all uppercase tracking-widest"
                                        >
                                            Templates
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending || !reply.trim()}
                                    className="px-8 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-900/10 hover:bg-black transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    <div className="flex items-center gap-3">
                                        {sending ? 'Sending...' : 'Respond'}
                                        <Send className="w-4 h-4" />
                                    </div>
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
