'use client';

import { useAuth } from '@/context/AuthContext';
import { UserCircle, LogOut } from 'lucide-react';

export function ProfileHeader() {
    const { user } = useAuth();

    return (
        <div className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-30" />

            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 relative z-10 w-full">
                <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-slate-900 border-2 border-white flex items-center justify-center text-white font-black text-2xl md:text-3xl shrink-0 shadow-lg shadow-slate-200 overflow-hidden">
                    {user?.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        user?.email?.charAt(0).toUpperCase() || <UserCircle className="w-8 h-8 md:w-10 md:h-10" />
                    )}
                </div>

                <div className="text-center md:text-left space-y-1">
                    <p className="text-[10px] md:text-xs font-black text-emerald-600 uppercase tracking-[0.2em] italic">Account Hub</p>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                        Welcome back, {user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Member'}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-[10px] uppercase">
                            {user?.role || 'Customer'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-[10px] uppercase">
                            Verified
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
