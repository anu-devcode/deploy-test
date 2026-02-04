'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import AuthInput from './AuthInput';
import SocialAuth from './SocialAuth';

interface LoginFormProps {
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
    error: string | null;
    success?: string | null;
}

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password: string) => password.length >= 8;

export default function LoginForm({ onSubmit, loading, error, success }: LoginFormProps) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [touched, setTouched] = useState({ email: false, password: false });

    const validation = useMemo(() => ({
        email: touched.email && !isValidEmail(formData.email) ? 'Please enter a valid email address' : null,
        password: touched.password && !isValidPassword(formData.password) ? 'Password must be at least 8 characters' : null
    }), [formData, touched]);

    const isFormValid = isValidEmail(formData.email) && isValidPassword(formData.password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        if (!isFormValid) return;
        await onSubmit(formData);
    };

    const handleBlur = (field: 'email' | 'password') => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    return (
        <div className="space-y-8 animate-[fade-in_0.5s_ease-out]">
            {success && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    {success}
                </div>
            )}

            {error && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest leading-relaxed">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                    <AuthInput
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => handleBlur('email')}
                        hasError={!!validation.email}
                    />
                    {validation.email && (
                        <div className="flex items-center gap-2 px-4 text-red-400 text-[10px] font-bold uppercase tracking-wide">
                            <AlertCircle className="w-3 h-3" />
                            {validation.email}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <AuthInput
                        label="Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        onBlur={() => handleBlur('password')}
                        hasError={!!validation.password}
                        rightElement={
                            <Link href="/forgot-password" className="text-[10px] font-black text-emerald-100/20 hover:text-emerald-400 uppercase tracking-widest transition-colors">
                                Forgot?
                            </Link>
                        }
                    />
                    {validation.password && (
                        <div className="flex items-center gap-2 px-4 text-red-400 text-[10px] font-bold uppercase tracking-wide">
                            <AlertCircle className="w-3 h-3" />
                            {validation.password}
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || !isFormValid}
                    className="group relative w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                        {loading ? 'Logging in...' : 'Login'}
                        {!loading && <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]" />
                </button>
            </form>

            <SocialAuth
                loading={loading}
                onGoogleClick={() => { }}
                onTelegramAuth={() => { }}
            />

            <p className="mt-10 text-center text-emerald-100/20 text-[11px] font-bold uppercase tracking-[0.1em]">
                New here?{' '}
                <Link href="/register" className="text-emerald-400 font-black hover:text-white transition-colors underline underline-offset-4 decoration-emerald-500/30">
                    Create Account
                </Link>
            </p>
        </div>
    );
}
