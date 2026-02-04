'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Plus, Mail, Send, Calendar, Clock, AlertCircle, CheckCircle, Loader2, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function MarketingPage() {
    const router = useRouter();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState<string | null>(null);

    useEffect(() => {
        loadCampaigns();
    }, []);

    const loadCampaigns = async () => {
        try {
            const data = await api.getCampaigns();
            setCampaigns(data);
        } catch (error) {
            console.error('Failed to load campaigns:', error);
            toast.error('Failed to load campaigns');
        } finally {
            setLoading(false);
        }
    };

    const handleDuplicate = (campaign: any, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Store campaign data in sessionStorage for duplication
        const duplicateData = {
            name: `${campaign.name} (Copy)`,
            subject: campaign.subject,
            content: campaign.content,
            type: campaign.type,
        };
        sessionStorage.setItem('duplicate_campaign', JSON.stringify(duplicateData));
        router.push('/admin/marketing/create');
    };

    const handleSend = async (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!confirm('Are you sure you want to send this campaign to all subscribed users?')) return;

        setSendingId(id);
        try {
            await api.sendCampaign(id);
            toast.success('Campaign queued for sending');
            loadCampaigns();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to send campaign');
        } finally {
            setSendingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-slate-100 text-slate-600';
            case 'SCHEDULED': return 'bg-amber-100 text-amber-600';
            case 'SENDING': return 'bg-blue-100 text-blue-600';
            case 'SENT': return 'bg-emerald-100 text-emerald-600';
            case 'FAILED': return 'bg-rose-100 text-rose-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Email Campaigns</h1>
                    <p className="text-slate-500 mt-1">Manage newsletters and promotional emails.</p>
                </div>
                <Link
                    href="/admin/marketing/create"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Create Campaign
                </Link>
            </div>

            <div className="grid gap-4">
                {campaigns.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No campaigns yet</h3>
                        <p className="text-slate-500 mt-1 mb-6">Create your first email campaign to reach your customers.</p>
                        <Link
                            href="/admin/marketing/create"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Create Now
                        </Link>
                    </div>
                ) : (
                    campaigns.map((campaign) => (
                        <div key={campaign.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group hover:border-emerald-500/20 transition-all">
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(campaign.status)}`}>
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-slate-900 truncate">{campaign.name}</h3>
                                    <p className="text-sm text-slate-500 mt-0.5 truncate">{campaign.subject}</p>
                                    <div className="flex flex-wrap items-center gap-3 mt-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getStatusColor(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(campaign.createdAt).toLocaleDateString()}
                                        </span>
                                        {campaign.status === 'SENT' && (
                                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 hidden sm:flex">
                                                <CheckCircle className="w-3 h-3" />
                                                Sent to {campaign.sentCount} recipients
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                                {campaign.status === 'DRAFT' && (
                                    <button
                                        onClick={(e) => handleSend(campaign.id, e)}
                                        disabled={sendingId === campaign.id}
                                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-colors disabled:opacity-50 text-sm"
                                    >
                                        {sendingId === campaign.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        Send Now
                                    </button>
                                )}
                                <button
                                    onClick={(e) => handleDuplicate(campaign, e)}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition-colors text-sm"
                                    title="Duplicate Campaign"
                                >
                                    <Copy className="w-4 h-4" />
                                    Duplicate
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
