'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api, { Promotion } from '@/lib/api';

type PromotionContextType = {
    promotions: Promotion[];
    loading: boolean;
    isBannerVisible: boolean;
    setIsBannerVisible: (visible: boolean) => void;
};

const PromotionContext = createContext<PromotionContextType>({
    promotions: [],
    loading: true,
    isBannerVisible: true,
    setIsBannerVisible: () => { }
});

export function PromotionProvider({ children }: { children: ReactNode }) {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    useEffect(() => {
        const fetchPromos = async () => {
            try {
                const data = await api.getPromotions();
                const active = data.filter(p => p.isActive);
                setPromotions(active);
                setIsBannerVisible(active.length > 0);
            } catch (err) {
                console.error("Failed to fetch promotions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPromos();
    }, []);

    return (
        <PromotionContext.Provider value={{ promotions, loading, isBannerVisible, setIsBannerVisible }}>
            {children}
        </PromotionContext.Provider>
    );
}

export function usePromotions() {
    return useContext(PromotionContext);
}
