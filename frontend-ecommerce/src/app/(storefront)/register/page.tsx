'use client';

import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import RegisterForm from '@/components/auth/RegisterForm';
import { ShieldCheck, Zap, Globe } from 'lucide-react';

function RegisterContent() {
    const router = useRouter();
    const { register } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (data: any) => {
        setError(null);

        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(data.email, data.password, data.firstName, data.lastName, data.role);
            router.push('/profile');
        } catch (err: any) {
            setError(err.message || 'Sign up failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const brandContent = (
        <div className="mt-16 space-y-10 animate-[fade-in_1s_ease-out]">
            <div className="space-y-4">
                <h1 className="text-6xl font-black text-white leading-[1.1] tracking-tighter italic uppercase">
                    Join <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Us</span>
                </h1>
                <p className="text-lg text-emerald-100/40 leading-loose font-medium max-w-sm">
                    Direct to source products.
                </p>
            </div>

            <div className="pt-8 space-y-4">
                {[
                    { icon: <ShieldCheck className="w-5 h-5" />, title: 'Verified Source', desc: '100% traceable products.' },
                    { icon: <Zap className="w-5 h-5" />, title: 'Fast', desc: 'Direct delivery.' },
                    { icon: <Globe className="w-5 h-5" />, title: 'Global Delivery', desc: 'Fast shipping.' }
                ].map((feature, i) => (
                    <div key={i} className="flex gap-5 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/20 transition-all group cursor-default">
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
            title="Join Us"
            subtitle="Create an account to start."
            brandSideContent={brandContent}
        >
            <RegisterForm
                onSubmit={handleRegister}
                loading={loading}
                error={error}
            />
        </AuthLayout>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#020c0b] flex items-center justify-center">
                <div className="w-16 h-16 border-[6px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        }>
            <RegisterContent />
        </Suspense>
    );
}
