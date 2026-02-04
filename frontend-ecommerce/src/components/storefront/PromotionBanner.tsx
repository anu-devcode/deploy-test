'use client';

import { useState, useEffect } from 'react';
import { Promotion } from '@/lib/api';
import { Ticket, ArrowRight, X } from 'lucide-react';
import { usePromotions } from '@/context';

export function PromotionBanner() {
    const { promotions, isBannerVisible, setIsBannerVisible } = usePromotions();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (promotions.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % promotions.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [promotions]);

    if (!isBannerVisible || promotions.length === 0) return null;

    const promo = promotions[currentIndex];

    return (
        <div className="bg-indigo-600 text-white relative overflow-hidden animate-in fade-in slide-in-from-top duration-700 z-[60] border-b border-white/10">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,_transparent_0%,_rgba(255,255,255,0.05)_50%,_transparent_100%)] animate-shimmer"></div>

            <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 flex items-center justify-between py-1 md:py-2">
                <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                    <div className="p-1 bg-white/10 rounded backdrop-blur-sm shrink-0">
                        <Ticket className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-indigo-100" />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <p className="text-[10px] md:text-xs font-black truncate tracking-tight">
                            <span className="opacity-70 font-medium mr-1 hidden xs:inline">Save:</span>
                            {promo.name}
                            <span className="ml-2 text-indigo-200 font-black">{promo.type === 'PERCENTAGE' ? `${promo.value}%` : `${promo.value} ETB`} OFF</span>
                        </p>
                        {promo.code && (
                            <div className="hidden sm:flex items-center gap-1.5 bg-white/90 text-indigo-900 px-2 py-0.5 rounded text-[8px] md:text-[9px] font-black uppercase">
                                {promo.code}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 ml-3 shrink-0">
                    <button className="hidden sm:block text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:text-indigo-200 transition-colors">
                        Shop
                    </button>
                    <button
                        onClick={() => setIsBannerVisible(false)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-3 h-3 md:w-4 md:h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
