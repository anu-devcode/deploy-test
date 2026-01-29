'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Sparkles, Globe } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useEffect } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'CUSTOMER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await api.register(formData.email, formData.password, formData.role);
            router.push('/login?registered=true');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        setLoading(true);
        console.log('Redirecting to Google Register...');
        setTimeout(() => {
            setError('Google registration requires OAuth configuration.');
            setLoading(false);
        }, 1000);
    };

    const handleTelegramRegister = (user: any) => {
        setLoading(true);
        console.log('Telegram User for Register:', user);
        setTimeout(() => {
            setError('Telegram registration requires BOT_TOKEN configuration.');
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        const handleAuth = (e: any) => handleTelegramRegister(e.detail);
        window.addEventListener('telegram-auth', handleAuth);
        return () => window.removeEventListener('telegram-auth', handleAuth);
    }, []);

    return (
        <div className="min-h-screen bg-[#010908] py-20 flex items-center justify-center relative overflow-hidden">
            {/* Background elements to match Hero aesthetic */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/harvest-hero.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-20 blur-sm"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#010908] via-transparent to-[#010908]/90" />
            </div>

            {/* Floating particles background effect */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {mounted && [...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-emerald-500/10 rounded-full blur-xl animate-pulse"
                        style={{
                            width: `${Math.random() * 200 + 100}px`,
                            height: `${Math.random() * 200 + 100}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 10}s`,
                            animationDuration: `${Math.random() * 10 + 10}s`
                        }}
                    ></div>
                ))}
            </div>

            <div className="relative z-20 w-full max-w-5xl grid lg:grid-cols-2 bg-white/[0.02] backdrop-blur-2xl rounded-[3rem] border border-white/10 overflow-hidden shadow-3xl">

                {/* Brand Side */}
                <div className="p-12 hidden lg:flex flex-col justify-between bg-gradient-to-br from-emerald-950/40 to-transparent border-r border-white/5">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <div className="w-0 h-0 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-black text-5xl group-hover:scale-110 transition-transform">
                                አ
                            </div>
                            <span className="text-green-500 text-5xl font-semibold">ዲስ</span>
                            <span className="text-lime-400 text-5xl font-bold ml-1">Harvest</span>
                        </Link>

                        <div className="mt-16 space-y-8">
                            <h1 className="text-5xl font-black text-white leading-tight">
                                Join the <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Agricultural Revolution</span>
                            </h1>
                            <p className="text-xl text-emerald-100/60 leading-relaxed font-medium">
                                Create your account to start sourcing premium crops directly from the source.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {[
                            { icon: <ShieldCheck className="w-6 h-6" />, title: 'Verified Sources', desc: '100% traceable ethical farming.' },
                            { icon: <Zap className="w-6 h-6" />, title: 'Real-time Trading', desc: 'Direct market access without middlemen.' },
                            { icon: <Globe className="w-6 h-6" />, title: 'Global Logistics', desc: 'Seamless export to any corner of the world.' }
                        ].map((feature, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors">
                                <div className="text-emerald-400">{feature.icon}</div>
                                <div>
                                    <h4 className="text-white font-bold">{feature.title}</h4>
                                    <p className="text-sm text-emerald-100/50">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
                        <p className="text-emerald-100/60">Join thousands of partners worldwide.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium animate-[fade-in_0.3s_ease-out]">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-emerald-400/80 uppercase tracking-widest ml-4">First Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="John"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-emerald-400/80 uppercase tracking-widest ml-4">Last Name</label>
                                <div className="relative group">
                                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Doe"
                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-emerald-400/80 uppercase tracking-widest ml-4">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    placeholder="john@example.com"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-emerald-400/80 uppercase tracking-widest ml-4">Account Type</label>
                            <div className="relative group">
                                <Sparkles className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                                <select
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="CUSTOMER" className="bg-[#010908]">Buyer / Partner</option>
                                    <option value="FARMER" className="bg-[#010908]">Farmer / Producer</option>
                                    <option value="EXPORTER" className="bg-[#010908]">Exporter</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-emerald-400/80 uppercase tracking-widest ml-4">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-emerald-400/80 uppercase tracking-widest ml-4">Confirm Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] py-4 pl-14 pr-6 text-white placeholder:text-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-white/[0.05] transition-all"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full py-5 rounded-[1.5rem] bg-emerald-500 text-slate-950 font-black text-lg overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'Creating Account...' : 'Join The Movement'}
                                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
                        </button>
                    </form>

                    {/* Social Registration Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black text-emerald-100/20">
                            <span className="bg-[#0b1c19] px-4 rounded-full">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleGoogleRegister}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 text-white font-black text-sm hover:bg-white/[0.08] transition-all group active:scale-95 disabled:opacity-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12.48 10.92v3.28h7.84c-.24 1.84-.908 3.152-1.928 4.176-1.288 1.288-3.312 2.624-6.84 2.624-5.464 0-9.72-4.416-9.72-9.88s4.256-9.88 9.72-9.88c2.944 0 5.152 1.152 6.728 2.632l2.312-2.312C18.424 1.344 15.688 0 12.48 0 5.616 0 0 5.616 0 12.5s5.616 12.5 12.48 12.5c3.744 0 6.6-1.232 8.944-3.696 2.376-2.376 3.12-5.712 3.12-8.4 0-.808-.064-1.5760000000000001-.176-2.28h-11.888z" />
                            </svg>
                            Google
                        </button>

                        <div id="telegram-login-container" className="relative">
                            <button
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 py-4 rounded-[1.5rem] bg-white/[0.03] border border-white/10 text-white font-black text-sm hover:bg-white/[0.08] transition-all group active:scale-95 disabled:opacity-50"
                            >
                                <svg className="w-5 h-5 text-[#24A1DE]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M11.944 0C5.344 0 0 5.344 0 11.944c0 6.6 5.344 11.944 11.944 11.944 6.6 0 11.944-5.344 11.944-11.944C23.888 5.344 18.544 0 11.944 0zm5.66 8.356c-.184 1.936-1.12 7.424-1.604 9.99-.204 1.088-.6 1.452-.988 1.488-.844.076-1.484-.56-2.3-.924-1.284-.572-2.008-.928-3.256-1.748-1.44-.948-.508-1.472.312-2.324.216-.224 3.968-3.636 4.04-3.944.004-.04.012-.188-.064-.256s-.184-.044-.26-.028c-.108.024-1.844 1.172-5.204 3.444-.492.34-.94.508-1.34.496-.444-.012-1.296-.252-1.928-.456-.776-.252-1.396-.388-1.34-.82.028-.224.336-.452.928-.684 3.632-1.58 6.052-2.624 7.26-3.132 3.456-1.448 4.172-1.704 4.64-1.712.104-.004.336.02.484.144.124.104.16.244.168.344.008.08.008.232 0 .344z" />
                                </svg>
                                Telegram
                            </button>

                            <div className="absolute inset-0 opacity-0 pointer-events-none">
                                <Script
                                    src="https://telegram.org/js/telegram-widget.js?22"
                                    strategy="lazyOnload"
                                    data-telegram-login="YourBotName"
                                    data-size="large"
                                    data-onauth="onTelegramAuth(user)"
                                    data-request-access="write"
                                />
                                <script dangerouslySetInnerHTML={{
                                    __html: `
                                        function onTelegramAuth(user) {
                                            const event = new CustomEvent('telegram-auth', { detail: user });
                                            window.dispatchEvent(event);
                                        }
                                    `
                                }} />
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-emerald-100/40 font-medium">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-400 font-black hover:text-white transition-colors">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
