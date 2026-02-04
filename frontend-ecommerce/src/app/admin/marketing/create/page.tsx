'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { ArrowLeft, Send, Save, Loader2, Calendar, Layout, Type as TypeIcon, Sparkles, Copy, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const TEMPLATES = [
    {
        id: 'promo',
        name: 'Flash Sale',
        description: 'High-impact layout for discounts.',
        icon: Sparkles,
        content: `
<div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); padding: 40px; text-align: center;">
        <span style="display: inline-block; padding: 10px 20px; background-color: #fef2f2; color: #ef4444; border-radius: 99px; font-weight: 900; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px;">Limited Time Offer</span>
        <h1 style="font-size: 32px; font-weight: 900; color: #0f172a; margin-bottom: 16px;">Flash Sale: Save big this weekend!</h1>
        <p style="font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 32px;">Hi {{name}}, get ready for our biggest harvest sale yet. We are offering exclusive discounts on select seasonal products.</p>
        <div style="margin-bottom: 40px;">
            <a href="{{shopUrl}}" style="display: inline-block; padding: 18px 40px; background-color: #10b981; color: white; text-decoration: none; border-radius: 16px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);">Shop the Sale</a>
        </div>
        <p style="font-size: 12px; color: #94a3b8;">Don't want to receive these emails? <a href="{{unsubscribeUrl}}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a></p>
    </div>
</div>`
    },
    {
        id: 'newsletter',
        name: 'Newsletter',
        description: 'Perfect for weekly updates.',
        icon: TypeIcon,
        content: `
<div style="font-family: Arial, sans-serif; color: #334155; line-height: 1.6;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 style="font-size: 24px; font-weight: 900; color: #0f172a;">Weekly Harvest Update 🌾</h2>
        <p>Dear {{name}},</p>
        <p>It's been a busy week at Adis Harvest! Here's what's been happening in the fields and in our store:</p>
        <div style="background-color: #f1f5f9; padding: 24px; border-radius: 16px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #0f172a;">Local Farmer Spotlight</h3>
            <p style="margin-bottom: 0;">Meet the people behind your favorite products. We're proud to support sustainable agriculture and local communities.</p>
        </div>
        <p>Be sure to check out our <a href="{{shopUrl}}" style="color: #10b981; font-weight: 700;">Latest Products</a> section for this week's fresh arrivals.</p>
        <hr style="border: none; border-top: 1px dotted #cbd5e1; margin: 32px 0;">
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">Adis Harvest - Quality Agricultural Products</p>
    </div>
</div>`
    },
    {
        id: 'announcement',
        name: 'Launch',
        description: 'Big news or new product.',
        icon: Save,
        content: `
<div style="font-family: Arial, sans-serif; text-align: center; color: #0f172a; padding: 60px 20px;">
    <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 40px; font-weight: 900; margin-bottom: 24px; letter-spacing: -1px;">Something new is coming.</h1>
        <p style="font-size: 18px; color: #64748b; line-height: 1.6; margin-bottom: 40px;">Hi {{name}}, we've been working on something special. It's time to elevate your kitchen with our latest premium selection.</p>
        <div style="background-color: #10b981; color: white; font-weight: 900; padding: 12px; border-radius: 12px; display: inline-block; margin-bottom: 40px;">Coming Soon: March 2024</div>
        <p style="font-size: 16px;">Stay tuned for more updates!</p>
    </div>
</div>`
    }
];

export default function CreateCampaignPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [isDuplicate, setIsDuplicate] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        content: '',
        type: 'PROMOTIONAL',
        scheduledAt: ''
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dup = sessionStorage.getItem('duplicate_campaign');
            if (dup) {
                const data = JSON.parse(dup);
                setFormData({
                    ...data,
                    name: `${data.name}`,
                    scheduledAt: ''
                });
                setIsDuplicate(true);
                sessionStorage.removeItem('duplicate_campaign');
                toast.success('Campaign details duplicated!');
            }
        }
    }, []);

    const applyTemplate = (content: string) => {
        if (formData.content && !confirm('Are you sure? This will replace your current email content.')) return;
        setFormData({ ...formData, content });
        toast.success('Template applied!');
    };

    const insertVariable = (variable: string) => {
        const textarea = document.getElementById('content') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = formData.content;
        const newText = text.substring(0, start) + variable + text.substring(end);

        setFormData({ ...formData, content: newText });

        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + variable.length, start + variable.length);
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.createCampaign({
                ...formData,
                scheduledAt: formData.scheduledAt || undefined
            });
            toast.success('Campaign created successfully');
            router.push('/admin/marketing');
        } catch (error: any) {
            console.error('Failed to create campaign:', error);
            toast.error(error.response?.data?.message || 'Failed to create campaign');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/marketing"
                    className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-900">
                        {isDuplicate ? 'Duplicate Campaign' : 'Create Campaign'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isDuplicate ? 'Modify your duplicated campaign.' : 'Design and schedule your email campaign.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Campaign Details */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Layout className="w-4 h-4 text-emerald-500" />
                                Campaign Details
                            </h3>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internal Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Summer Sale 2024"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 50% Off Everything!"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <TypeIcon className="w-4 h-4 text-emerald-500" />
                                Email Content
                            </h3>

                            {/* Template Selector */}
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => applyTemplate(t.content)}
                                        className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-emerald-500/50 hover:bg-emerald-50 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <t.icon className="w-3 h-3 text-emerald-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-900">{t.name}</span>
                                        </div>
                                        <p className="text-[9px] text-slate-500 line-clamp-1 font-medium">{t.description}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center justify-between ml-1 mb-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HTML Content</label>
                                    <div className="flex gap-2">
                                        {['{{name}}', '{{shopUrl}}', '{{unsubscribeUrl}}'].map(v => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => insertVariable(v)}
                                                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[9px] font-black font-mono transition-colors"
                                            >
                                                {v}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    id="content"
                                    rows={15}
                                    placeholder="<h1>Hello!</h1><p>Write your email content here...</p>"
                                    value={formData.content}
                                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 px-1">Supports standard HTML using Handlebars variables like {'{{name}}'}.</p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Settings */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-500" />
                                Schedule & Type
                            </h3>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Campaign Type</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all appearance-none"
                                >
                                    <option value="PROMOTIONAL">Marketing / Promo</option>
                                    <option value="NEWSLETTER">Newsletter</option>
                                    <option value="PRODUCT_UPDATE">Product Update</option>
                                    <option value="ANNOUNCEMENT">Announcement</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Schedule Send (Optional)</label>
                                <input
                                    type="datetime-local"
                                    value={formData.scheduledAt}
                                    onChange={e => setFormData({ ...formData, scheduledAt: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                                <p className="text-[10px] text-slate-400 px-1">Leave blank to save as Draft.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Create Campaign
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
