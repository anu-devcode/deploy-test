'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Lock, CheckCircle, ArrowLeft, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import AuthInput from '@/components/auth/AuthInput';

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            setError('Invalid or missing reset token.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.resetPassword({ token, password });
            setSuccess(true);
            setTimeout(() => router.push('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to reset password. Token may be expired.');
        } finally {
            setLoading(false);
        }
    };

    const brandContent = (
        <div className="mt-16 space-y-10 animate-[fade-in_1s_ease-out]">
            <div className="space-y-4">
                <h1 className="text-5xl font-black text-white leading-[1.1] tracking-tighter italic uppercase">
                    Secure <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">New Password</span>
                </h1>
                <p className="text-lg text-emerald-100/40 leading-loose font-medium max-w-sm">
                    Create a strong password to protect your account.
                </p>
            </div>
        </div>
    );

    if (success) {
        return (
            <AuthLayout
                title="Password Reset!"
                subtitle="Your password has been updated."
                brandSideContent={brandContent}
            >
                <div className="space-y-8 animate-[fade-in_0.5s_ease-out] text-center">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">Success!</h3>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
                            Your password has been successfully reset. Redirecting you to login...
                        </p>
                    </div>

                    <div className="pt-4">
                        <Link
                            href="/login"
                            className="block w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors"
                        >
                            Login Now
                        </Link>
                    </div>
                </div>
            </AuthLayout>
        );
    }

    if (!token) {
        return (
            <AuthLayout
                title="Invalid Link"
                subtitle="Missing reset token."
                brandSideContent={brandContent}
            >
                <div className="space-y-8 text-center">
                    <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest leading-relaxed">
                        This password reset link is invalid or missing required information.
                    </div>
                    <Link
                        href="/forgot-password"
                        className="block w-full py-4 rounded-2xl bg-slate-900 text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-colors"
                    >
                        Request New Link
                    </Link>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Reset Password"
            subtitle="Enter your new password below."
            brandSideContent={brandContent}
        >
            <div className="space-y-8 animate-[fade-in_0.5s_ease-out]">
                {error && (
                    <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest leading-relaxed flex items-center gap-3">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AuthInput
                        label="New Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <AuthInput
                        label="Confirm Password"
                        icon={Lock}
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading || !password || !confirmPassword}
                        className="group relative w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black text-sm uppercase tracking-[0.2em] overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-4">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Reset Password'}
                            {!loading && <ShieldCheck className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]" />
                    </button>
                </form>
            </div>
        </AuthLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020c0b] flex items-center justify-center">
                <div className="w-16 h-16 border-[6px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    );
}
