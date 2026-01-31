'use client';

import { useAuth } from '@/context/AuthContext';
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Settings,
    LogOut,
    ChevronRight,
    UserCircle,
    Wallet,
    CreditCard,
    Heart
} from 'lucide-react';

interface ProfileSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export function ProfileSidebar({ activeTab, onTabChange }: ProfileSidebarProps) {
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'wishlist', label: 'Wishlist', icon: Heart },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'billing', label: 'Payments and Billing', icon: CreditCard },
        { id: 'wallet', label: 'Wallet and Points', icon: Wallet },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden sticky top-24 flex flex-col h-[calc(100vh-120px)]">
            {/* User Profile Summary */}
            <div className="p-6 bg-slate-50 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-lg shadow-emerald-500/20 overflow-hidden">
                        <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center text-emerald-600 font-black text-2xl overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                user?.email?.charAt(0).toUpperCase() || <UserCircle className="w-8 h-8" />
                            )}
                        </div>
                    </div>
                    <div className="overflow-hidden">
                        <h2 className="font-black text-slate-900 truncate">
                            {user?.name || 'My Account'}
                        </h2>
                        <p className="text-sm text-slate-500 font-bold truncate">{user?.email}</p>
                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100/50 border border-emerald-100">
                            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wide">
                                {user?.role || 'Member'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation - Scrollable area */}
            <nav className="p-4 space-y-1 flex-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}`} />
                                <span className="font-bold">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4 text-slate-500" />}
                        </button>
                    );
                })}
            </nav>

            {/* Logout - Always at bottom */}
            <div className="p-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-rose-500 font-bold hover:bg-rose-50 transition-colors group"
                >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}
