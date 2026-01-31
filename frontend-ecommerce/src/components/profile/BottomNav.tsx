'use client';

import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Wallet as WalletIcon,
    Settings,
    CreditCard,
    Heart
} from 'lucide-react';

interface BottomNavProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
    const tabs = [
        { id: 'overview', label: 'Home', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'settings', label: 'More', icon: Settings },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200 z-50 px-4 pb-safe-area-inset-bottom">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`flex flex-col items-center justify-center gap-1 group flex-1 ${isActive ? 'text-emerald-600' : 'text-slate-400'
                                }`}
                        >
                            <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 text-emerald-600' : 'group-hover:bg-slate-50'
                                }`}>
                                <Icon className="w-5 h-5" />
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'
                                }`}>
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
