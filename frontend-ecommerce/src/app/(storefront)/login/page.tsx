'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { ShieldCheck, Cpu, Globe } from 'lucide-react';

function LoginContent() {
    const router = useRouter();
    const { login } = useAuth();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (data: any) => {
        setError(null);
        setLoading(true);

        try {
            const user = await login(data.email, data.password, 'STOREFRONT');

            if (user?.role === 'ADMIN' || user?.role === 'STAFF') {
                router.push('/admin');
            } else {
                router.push('/profile');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Check your details.');
        } finally {
            setLoading(false);
        }
    };

    const brandContent = (
        <div className="mt-16 space-y-10 animate-[fade-in_1s_ease-out]">
            <div className="space-y-4">
                <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tighter italic uppercase">
                    Welcome <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Back</span>
                </h1>
                <p className="text-lg text-emerald-100/40 leading-loose font-medium max-w-sm">
                    Your store for direct products.
                </p>
            </div>

            <div className="pt-8 space-y-4">
                {[
                    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Secure Login', desc: 'Your data is safe.' },
                    { icon: <Cpu className="w-5 h-5" />, title: 'Personalized', desc: 'Smart product selection.' },
                    { icon: <Globe className="w-5 h-5" />, title: 'Live Tracking', desc: 'Track orders instantly.' }
                ].map((feature, i) => (
                    <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all group group cursor-default">
                        <div className="text-emerald-400 p-3 bg-emerald-500/10 rounded-xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                        <div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-[0.2em] mb-1">{feature.title}</h4>
                            <p className="text-[10px] text-emerald-100/30 font-bold uppercase tracking-widest leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <AuthLayout
            title="Login"
            subtitle="Login to your account."
            brandSideContent={brandContent}
        >
            <LoginForm
                onSubmit={handleLogin}
                loading={loading}
                error={error}
                success={registered ? "Account created. Please login." : null}
            />
        </AuthLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020c0b] flex items-center justify-center">
                <div className="w-16 h-16 border-[6px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
