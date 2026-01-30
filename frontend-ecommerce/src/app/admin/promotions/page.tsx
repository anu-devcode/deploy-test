'use client';

import { useState, useEffect } from 'react';
import api, { Promotion, PromotionType, PromotionTarget, PromoBusinessType } from '@/lib/api';
import {
    Ticket,
    Plus,
    Search,
    Filter,
    Calendar,
    Tag,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Users,
    ShoppingCart,
    Package,
    LayoutGrid,
    Info
} from 'lucide-react';

export default function PromotionsPage() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<Promotion>>({
        name: '',
        description: '',
        code: '',
        type: 'PERCENTAGE',
        target: 'CART',
        targetIds: [],
        value: 0,
        minAmount: 0,
        businessType: 'BOTH',
        isActive: true
    });

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const data = await api.getPromotions();
            setPromotions(data);
        } catch (error) {
            console.error('Failed to fetch promotions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app we'd call api.createPromotion
        const newPromo: Promotion = {
            ...formData as Promotion,
            id: Math.random().toString(36).substr(2, 9),
            currentUsage: 0,
            createdAt: new Date().toISOString()
        };
        setPromotions([newPromo, ...promotions]);
        setShowForm(false);
        setFormData({ name: '', description: '', code: '', type: 'PERCENTAGE', target: 'CART', value: 0, minAmount: 0, businessType: 'BOTH', isActive: true });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Marketing & Promotions</h1>
                    <p className="text-sm text-slate-500">Create campaigns to drive sales across retail and bulk segments.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
                >
                    {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> New Campaign</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-indigo-100 shadow-xl p-8 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Campaign Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Summer Harvest Festival"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Promo Code (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. SUMMER24"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Discount Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as PromotionType })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                            >
                                <option value="PERCENTAGE">Percentage (%)</option>
                                <option value="FIXED_AMOUNT">Fixed Amount (ETB)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Discount Value</label>
                            <input
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Target Segment</label>
                            <select
                                value={formData.businessType}
                                onChange={(e) => setFormData({ ...formData, businessType: e.target.value as PromoBusinessType })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                            >
                                <option value="BOTH">All Customers</option>
                                <option value="RETAIL">Retail Only</option>
                                <option value="BULK">Bulk Only</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Applies To</label>
                            <select
                                value={formData.target}
                                onChange={(e) => setFormData({ ...formData, target: e.target.value as PromotionTarget })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none"
                            >
                                <option value="CART">Entire Cart</option>
                                <option value="PRODUCT">Specific Products</option>
                                <option value="CATEGORY">Specific Categories</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Min. Purchase (ETB)</label>
                            <input
                                type="number"
                                value={formData.minAmount}
                                onChange={(e) => setFormData({ ...formData, minAmount: Number(e.target.value) })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            />
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-sm font-bold transition-all"
                            >
                                Launch Campaign
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {promotions.map((promo) => (
                    <div key={promo.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                                <Ticket className="w-6 h-6" />
                            </div>
                            <div className="flex gap-2">
                                <button className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {promo.isActive ?
                                    <ToggleRight className="w-6 h-6 text-emerald-500 cursor-pointer" /> :
                                    <ToggleLeft className="w-6 h-6 text-slate-300 cursor-pointer" />
                                }
                            </div>
                        </div>

                        <h3 className="font-bold text-slate-900 mb-1">{promo.name}</h3>
                        <p className="text-xs text-slate-500 mb-4 h-8 overflow-hidden line-clamp-2">{promo.description}</p>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="px-3 py-1 bg-slate-100 rounded-lg font-mono text-xs font-bold text-slate-600">
                                {promo.code || 'Auto-applied'}
                            </div>
                            <span className="text-xs font-black text-indigo-600 uppercase tracking-tighter">
                                {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `${promo.value} ETB OFF`}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2">
                                <Users className="w-3 h-3" />
                                {promo.businessType}
                            </div>
                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-3 h-3" />
                                {promo.target}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Insight Card */}
            <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h2 className="text-3xl font-black mb-4 uppercase tracking-tight italic">Campaign <span className="text-indigo-400">Intelligence</span></h2>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Brolf's deterministic engine ensures audit safety. All discounts are calculated exactly the same on frontend and backend, preventing checkout discrepancies.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-2xl font-black text-indigo-400">{promotions.length}</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">Active</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                            <p className="text-2xl font-black text-emerald-400">2.4k</p>
                            <p className="text-[10px] uppercase tracking-widest text-slate-500">Redeemed</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
