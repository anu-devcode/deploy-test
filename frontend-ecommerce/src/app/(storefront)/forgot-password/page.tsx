'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Mail, CheckCircle, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';

function ForgotPasswordContent() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await api.requestPasswordReset(email);
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const brandContent = (
        <div className="mt-16 space-y-10 animate-[fade-in_1s_ease-out]">
            <div className="space-y-4">
                <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter italic uppercase">
                    Account <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Recovery</span>
                </h1>
                <p className="text-lg text-emerald-100/40 leading-loose font-medium max-w-sm">
                    Don't worry, we'll help you get back in.
                </p>
            </div>
        </div>
    );

    if (success) {
        return (
            <AuthLayout
                title="Check Your Email"
                subtitle="We've sent recovery instructions."
                brandSideContent={brandContent}
            >
                <div className="space-y-8 animate-[fade-in_0.5s_ease-out] text-center">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <Mail className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-500">Email Sent!</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                            We've sent a password reset link to <strong className="text-slate-500">{email}</strong>.
                            Please check your inbox and spam folder.
                        </p>
                    </div>

                    <div className="pt-4 space-y-4">
                        <Link
                            href="/login"
                            className="block w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors"
                        >
                            Back to Login
                        </Link>

                        <button
                            onClick={() => { setSuccess(false); setEmail(''); }}
                            className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-widest"
                        >
                            Try another email
                        </button>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to reset password."
            brandSideContent={brandContent}
        >
            <div className="space-y-8 animate-[fade-in_0.5s_ease-out]">
                {error && (
                    <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest leading-relaxed flex items-center gap-3">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <AuthInput
                        label="Email Address"
                        icon={Mail}
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || !email}
                        className="group relative w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-4">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
                            {!loading && <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]" />
                    </button>
                </form>

                <div className="text-center pt-4">
                    <Link href="/login" className="inline-flex items-center gap-2 text-[11px] font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </AuthLayout>
    );
}

export default function ForgotPasswordPage() {
    return <ForgotPasswordContent />;
}
