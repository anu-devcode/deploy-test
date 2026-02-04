'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CheckCircle, XCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Invalid or missing verification token.');
            return;
        }

        const verify = async () => {
            try {
                await api.verifyEmail(token);
                setStatus('success');
                setMessage('Your email has been successfully verified! You can now access all features.');
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. The link may have expired or is invalid.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(2,44,34,0.1)] text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-3xl bg-slate-900 flex items-center justify-center text-white shadow-xl rotate-3 transform transition-transform hover:rotate-0">
                        <span className="text-4xl font-black">አ</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">
                        <ShieldCheck className="w-3 h-3" />
                        Adis Harvest Security
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Email Verification</h1>
                </div>

                <div className="py-4">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center gap-4">
                            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                            <p className="text-slate-500 font-bold">Verifying your account...</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-500">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <p className="text-slate-900 font-bold text-lg leading-snug">{message}</p>
                            <Link
                                href="/login"
                                className="mt-4 w-full flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                            >
                                Login to Account
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center gap-4 animate-in zoom-in-50 duration-500">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mb-2">
                                <XCircle className="w-10 h-10" />
                            </div>
                            <p className="text-slate-900 font-bold text-lg leading-snug">{message}</p>
                            <Link
                                href="/login"
                                className="mt-4 w-full px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Adis Harvest &copy; {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
