'use client';

import { useState, useEffect, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
    brandSideContent?: ReactNode;
}

export default function AuthLayout({ children, title, subtitle, brandSideContent }: AuthLayoutProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#020c0b] flex items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-lime-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-teal-500/10 rounded-full blur-[100px]" />

                <Image
                    src="/harvest-hero.png"
                    alt="Background"
                    fill
                    className="object-cover opacity-10 mix-blend-overlay"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020c0b] via-transparent to-[#020c0b]/80" />
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-10 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            {/* Main Container */}
            <div className="relative z-20 w-full max-w-6xl grid lg:grid-cols-2 bg-white/[0.01] backdrop-blur-[30px] rounded-[4rem] border border-white/10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] min-h-[700px]">

                {/* Brand / Info Side */}
                <div className="p-16 hidden lg:flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent z-0" />

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-4 group">
                            <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-tr from-emerald-400 to-lime-400 p-[2px]">
                                <div className="w-full h-full rounded-[1.15rem] bg-[#020c0b] flex items-center justify-center text-emerald-400 font-black text-3xl group-hover:scale-105 transition-transform">
                                    አ
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black text-white tracking-widest uppercase leading-none">Adis</span>
                                <span className="text-sm font-bold text-emerald-400 uppercase tracking-[0.3em]">Harvest</span>
                            </div>
                        </Link>

                        {brandSideContent}
                    </div>

                    <div className="relative z-10 flex items-center gap-6 text-emerald-100/20 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span>© {new Date().getFullYear()} ADIS HARVEST</span>
                        <div className="w-1 h-1 bg-emerald-500/20 rounded-full" />
                        <span>GLOBAL TRADING NODE</span>
                    </div>
                </div>

                {/* Form / Content Side */}
                <div className="p-10 lg:p-16 flex flex-col justify-center bg-white/[0.02] border-l border-white/5 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32" />

                    <div className="mb-10 relative z-10">
                        <h2 className="text-4xl font-black text-white mb-3 tracking-tight italic uppercase">{title}</h2>
                        <div className="h-1 w-12 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-full mb-4" />
                        <p className="text-emerald-100/40 font-bold uppercase tracking-widest text-[11px] leading-relaxed">{subtitle}</p>
                    </div>

                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>

            <style jsx global>{`
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
