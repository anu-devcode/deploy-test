'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import AuthInput from './AuthInput';
import SocialAuth from './SocialAuth';

interface RegisterFormProps {
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
    error: string | null;
}

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password: string) => password.length >= 8;

export default function RegisterForm({ onSubmit, loading, error }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });
    const [touched, setTouched] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        confirmPassword: false
    });

    const validation = useMemo(() => ({
        firstName: touched.firstName && !formData.firstName.trim() ? 'First name is required' : null,
        lastName: touched.lastName && !formData.lastName.trim() ? 'Last name is required' : null,
        email: touched.email && !isValidEmail(formData.email) ? 'Please enter a valid email address' : null,
        password: touched.password && !isValidPassword(formData.password) ? 'Password must be at least 8 characters' : null,
        confirmPassword: touched.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : null
    }), [formData, touched]);

    const isFormValid =
        formData.firstName.trim() &&
        formData.lastName.trim() &&
        isValidEmail(formData.email) &&
        isValidPassword(formData.password) &&
        formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            confirmPassword: true
        });
        if (!isFormValid) return;
        await onSubmit(formData);
    };

    const handleBlur = (field: keyof typeof touched) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const renderError = (message: string | null) => message && (
        <div className="flex items-center gap-2 px-4 text-red-400 text-[10px] font-bold uppercase tracking-wide">
            <AlertCircle className="w-3 h-3" />
            {message}
        </div>
    );

    return (
        <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">
            {error && (
                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest leading-relaxed">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <AuthInput
                            label="First Name"
                            icon={User}
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            onBlur={() => handleBlur('firstName')}
                            hasError={!!validation.firstName}
                            required
                        />
                        {renderError(validation.firstName)}
                    </div>
                    <div className="space-y-1">
                        <AuthInput
                            label="Last Name"
                            icon={User}
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            onBlur={() => handleBlur('lastName')}
                            hasError={!!validation.lastName}
                            required
                        />
                        {renderError(validation.lastName)}
                    </div>
                </div>

                <div className="space-y-1">
                    <AuthInput
                        label="Email"
                        icon={Mail}
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        onBlur={() => handleBlur('email')}
                        hasError={!!validation.email}
                        required
                    />
                    {renderError(validation.email)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <AuthInput
                            label="Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            onBlur={() => handleBlur('password')}
                            hasError={!!validation.password}
                            required
                        />
                        {renderError(validation.password)}
                    </div>
                    <div className="space-y-1">
                        <AuthInput
                            label="Confirm Password"
                            icon={Lock}
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            onBlur={() => handleBlur('confirmPassword')}
                            hasError={!!validation.confirmPassword}
                            required
                        />
                        {renderError(validation.confirmPassword)}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading || !isFormValid}
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
