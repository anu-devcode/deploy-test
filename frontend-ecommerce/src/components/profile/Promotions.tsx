'use client';

import { usePromotions } from '@/context';
import { Ticket, Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function Promotions() {
    const { promotions, loading } = usePromotions();
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="p-12 text-center">
                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Scanning for offers...</p>
            </div>
        );
    }

    if (promotions.length === 0) {
        return (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <Ticket className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No active promotions</h3>
                <p className="text-slate-500 font-medium">Check back later for exclusive harvest deals.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-end justify-between px-2">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Your Offers</h2>
                    <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-[10px]">Exclusive Discounts & Seasonal Campaigns</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {promotions.map((promo) => (
                    <div key={promo.id} className="group relative bg-white border border-slate-100 rounded-[2.5rem] p-8 hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden">
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -translate-y-12 translate-x-12 group-hover:bg-indigo-500/10 transition-colors"></div>

                        <div className="relative z-10 flex items-start justify-between mb-8">
                            <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 group-hover:scale-110 transition-transform">
                                <Ticket className="w-6 h-6" />
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                    {promo.type === 'PERCENTAGE' ? `${promo.value}% Off` : `ETB ${promo.value} Off`}
                                </span>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-2 mb-8">
                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{promo.name}</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed uppercase tracking-wider">{promo.description || 'Valid for a limited time on select items.'}</p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between gap-4">
                            {promo.code ? (
                                <button
                                    onClick={() => handleCopy(promo.code || '', promo.id)}
                                    className="flex-1 flex items-center justify-between px-6 py-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:border-indigo-500 transition-all group/code"
                                >
                                    <span className="text-sm font-black text-slate-900 font-mono tracking-widest">{promo.code}</span>
                                    {copiedId === promo.id ? (
                                        <Check className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-slate-300 group-hover/code:text-indigo-500" />
                                    )}
                                </button>
                            ) : (
                                <div className="flex-1 px-6 py-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Auto-Applied at Checkout</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-[2rem] bg-slate-100/50 border border-slate-200 border-dashed text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Refer a friend to unlock more rewards</p>
            </div>
        </div>
    );
}
