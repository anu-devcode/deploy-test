'use client';

import {
    LayoutDashboard,
    ShoppingBag,
    MessageSquare,
    Heart,
    MapPin,
    CreditCard,
    Wallet,
    Settings,
    ChevronRight,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MobileAccountHubProps {
    onTabChange: (tab: string, section?: string) => void;
}

export function MobileAccountHub({ onTabChange }: MobileAccountHubProps) {
    const { logout } = useAuth();

    const sections = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'inbox', label: 'Activity Center', icon: MessageSquare },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'billing', label: 'Payments and Billing', icon: CreditCard },
        { id: 'wallet', label: 'Wallet and Points', icon: Wallet },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            {/* List of Sections - Clean & Professional */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <nav className="divide-y divide-slate-50">
                    {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                            <button
                                key={section.id}
                                onClick={() => onTabChange(section.id)}
                                className="w-full flex items-center justify-between px-6 py-5 hover:bg-slate-50 transition-all group active:bg-slate-100"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-colors">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className="text-base font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                                        {section.label}
                                    </span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Action */}
            <button
                onClick={logout}
                className="mt-6 w-full flex items-center justify-center gap-3 p-5 bg-white rounded-3xl border border-rose-100 text-rose-500 font-black uppercase tracking-widest text-xs hover:bg-rose-50 active:scale-[0.98] transition-all shadow-sm shadow-rose-500/5 group"
            >
                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Sign Out
            </button>
        </div>
    );
}
