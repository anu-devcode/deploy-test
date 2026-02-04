'use client';

import { useState } from 'react';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import {
    Shield,
    Lock,
    Mail,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Eye,
    EyeOff,
    RefreshCw,
    ShieldCheck
} from 'lucide-react';

export default function AdminLoginPage() {
    const { login, setTenant, setIsAdminAuthenticated, setAdminUser } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Auth States
    const [authState, setAuthState] = useState<'LOGIN' | 'FORCE_CHANGE'>('LOGIN');
    const [loggedInUser, setLoggedInUser] = useState<any>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Setup default tenant for admin
            setTenant('brolf-main');

            const userData = await login(email, password, 'ADMIN');

            if (userData.requiresPasswordChange) {
                setLoggedInUser(userData);
                setAuthState('FORCE_CHANGE');
            } else {
                // AuthContext.login already sets authenticated state if requiresPasswordChange is false
                router.push('/admin');
            }
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);
        try {
            await api.changePassword(newPassword);

            // Finalize authentication in context after successful change
            const finalizedUser = {
                ...loggedInUser,
                requiresPasswordChange: false
            };

            setIsAdminAuthenticated(true);
            setAdminUser(finalizedUser);
            // Sync to localStorage as well (AuthContext will pick it up on mount)
            localStorage.setItem('admin_user', JSON.stringify(finalizedUser));

            router.push('/admin');
        } catch (err: any) {
            setError(err.message || 'Failed to update password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Visual Background Elements */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-500/5 rounded-full blur-[120px] -mr-96 -mt-96" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] -ml-64 -mb-64" />

            <div className="w-full max-w-[480px] relative z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                {/* Brand Logo */}
                <div className="flex justify-center mb-10">
                    <div className="flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-all shadow-xl shadow-slate-900/10">
                            <Shield className="w-7 h-7 text-emerald-400" />
                        </div>
                        <div className="text-left">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Brolf<span className="text-emerald-500">Admin</span></h1>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Command Vector Portal</p>
                        </div>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-indigo-900/5 overflow-hidden">
                    {/* Header */}
                    <div className="bg-slate-900 p-8 pt-10 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-xl font-black text-white tracking-tight uppercase italic mb-2">
                                {authState === 'LOGIN' ? 'Identity Verification' : 'Security Escalation'}
                            </h2>
                            <p className="text-[10px] text-emerald-400 font-black tracking-[0.3em] uppercase">
                                {authState === 'LOGIN' ? 'Authorized Access Only' : 'Password Reset Required'}
                            </p>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-50" />
                    </div>

                    <div className="p-10">
                        {error && (
                            <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in shake duration-300">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">{error}</p>
                            </div>
                        )}

                        {authState === 'LOGIN' ? (
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> Command Email
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="admin@test.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Lock className="w-3 h-3" /> Access Cipher
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-[10px] font-black text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                                        >
                                            {showPassword ? 'Hide' : 'Reveal'}
                                        </button>
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1 hover:bg-black active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                                        <>Verify Authority <ChevronRight className="w-4 h-4" /></>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handlePasswordChange} className="space-y-6">
                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 mb-2">
                                    <p className="text-[10px] font-bold text-amber-700 leading-relaxed">
                                        Your account was issued with temporary credentials. You must define a new secure password before accessing the command center.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Access Cipher</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify New Cipher</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-6 bg-emerald-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/10 transition-all hover:-translate-y-1 hover:bg-emerald-600 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : (
                                        <>Commit Security Change <ShieldCheck className="w-5 h-5" /></>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-white">
                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-2">
                        <Lock className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secure 256-bit Node</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed px-4">
                        Access to this portal is logged. Unauthorized attempts are automatically reported to the security vector.
                    </p>
                </div>
            </div>
        </div>
    );
}
