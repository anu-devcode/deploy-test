'use client';

import { useAuth } from '@/context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';

export function ProfileHeader() {
    const { user, logout } = useAuth();

    return (
        <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:justify-between gap-6 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-50 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 opacity-50" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full md:w-auto">
                <div className="h-20 w-20 md:h-24 md:w-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-500 p-0.5 shadow-xl shadow-emerald-500/20 shrink-0">
                    <div className="h-full w-full bg-white rounded-[22px] flex items-center justify-center text-emerald-600 font-black text-3xl md:text-4xl">
                        {user?.email?.charAt(0).toUpperCase() || <UserCircle className="w-10 h-10 md:w-12 md:h-12" />}
                    </div>
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">
                        Welcome back, {user?.email?.split('@')[0] || 'Member'}
                    </h1>
                    <p className="text-slate-500 font-medium text-sm md:text-base mb-3">
                        {user?.email}
                    </p>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/50 border border-emerald-100 text-emerald-700 font-black text-xs uppercase tracking-wider">
                        {user?.role || 'Customer'}
                    </div>
                </div>
            </div>

            <button
                onClick={logout}
                className="relative z-10 flex items-center gap-2 px-6 py-3 rounded-full bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 hover:text-rose-700 transition-all active:scale-95 border border-rose-100"
            >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
            </button>
        </div>
    );
}
