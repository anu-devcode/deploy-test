'use client';

import { useState, useEffect } from 'react';
import api, { Promotion } from '@/lib/api';
import { Ticket, ArrowRight, X } from 'lucide-react';

export function PromotionBanner() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            const data = await api.getPromotions();
            setPromotions(data.filter(p => p.isActive));
        };
        fetchPromos();
    }, []);

    useEffect(() => {
        if (promotions.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [promotions]);

    if (!isVisible || promotions.length === 0) return null;

    const promo = promotions[currentIndex];

    return (
        <div className="bg-indigo-600 text-white py-3 relative overflow-hidden animate-in fade-in slide-in-from-top duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_right,_rgba(255,255,255,0.1)_0%,_transparent_60%)]"></div>
            <div className="container mx-auto px-6 relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                        <Ticket className="w-5 h-5 text-indigo-100" />
                    </div>
                    <div>
                        <span className="text-xs font-black uppercase tracking-widest text-indigo-200 block">Flash Offer</span>
                        <p className="text-sm font-bold">
                            {promo.name}: {promo.type === 'PERCENTAGE' ? `${promo.value}% OFF` : `${promo.value} ETB OFF`}
                            {promo.code && <span className="ml-2 px-2 py-0.5 bg-white text-indigo-600 rounded text-[10px] font-black uppercase">{promo.code}</span>}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:text-indigo-200 transition-colors">
                        Shop Now <ArrowRight className="w-4 h-4" />
                    </button>
                    <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
