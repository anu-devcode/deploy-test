'use client';

import { useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Sparkles, ShieldCheck } from 'lucide-react';
import AuthInput from './AuthInput';
import SocialAuth from './SocialAuth';

interface RegisterFormProps {
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
    error: string | null;
}

export default function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
            {error && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest leading-relaxed">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                        label="First Name"
                        icon={User}
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                    <AuthInput
                        label="Last Name"
                        icon={User}
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        required
                    />
                </div>

                <AuthInput
                    label="Email"
                    icon={Mail}
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                />

                <div className="space-y-3 px-4">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Select Role</label>
                    <div className="relative group">
                        <Sparkles className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/20 group-focus-within:text-emerald-400 transition-colors" />
                        <select
                            className="w-full bg-white/[0.04] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-sm font-medium appearance-none focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:bg-white/[0.06] transition-all"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="CUSTOMER" className="bg-[#020c0b]">Customer</option>
                            <option value="FARMER" className="bg-[#020c0b]">Farmer</option>
                            <option value="EXPORTER" className="bg-[#020c0b]">Exporter</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                        label="Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <AuthInput
                        label="Confirm Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full py-6 mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-950 font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                        {loading ? 'Processing...' : 'Sign Up'}
                        {!loading && <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]" />
                </button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/5"></div>
                </div>
                <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-emerald-100/10">
                    <span className="bg-[#020c0b] px-4">OR SIGN UP WITH</span>
                </div>
            </div>

            <SocialAuth
                loading={loading}
                onGoogleClick={() => { }}
                onTelegramAuth={() => { }}
            />

            <p className="mt-10 text-center text-emerald-100/20 text-[11px] font-bold uppercase tracking-[0.1em]">
                Have an account?{' '}
                <Link href="/login" className="text-emerald-400 font-black hover:text-white transition-colors underline underline-offset-4 decoration-emerald-500/30">
                    Sign In
                </Link>
            </p>
        </div>
    );
}
