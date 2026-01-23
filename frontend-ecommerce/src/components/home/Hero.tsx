'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Product, Tenant } from '@/types';
import { UserPlus, LogIn, ArrowRight, Globe, ShieldCheck, Zap, Star, MousePointer2, Sparkles, Award, TrendingUp } from 'lucide-react';

interface HeroProps {
    allProducts: Product[];
    tenants: Tenant[];
}

export function Hero({ allProducts, tenants }: HeroProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Parallax movement
            setMousePos({
                x: (clientX / innerWidth - 0.5) * 50,
                y: (clientY / innerHeight - 0.5) * 50,
            });

            // Spotlight position
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setSpotlightPos({
                    x: ((clientX - rect.left) / rect.width) * 100,
                    y: ((clientY - rect.top) / rect.height) * 100,
                });
            }
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#010908]"
        >
            {/* The Master Visual Foundation */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Layer 1: The Cinematic Background */}
                <Image
                    src="/harvest-hero.png"
                    alt="Harvest Base"
                    fill
                    className="object-cover  opacity-25 scale-110 blur-[2px] animate-[slow-pan_30s_linear_infinite_alternate]"
                    priority
                />

                {/* Layer 2: The Interactive Spotlight (The "Wow" Factor) */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background: `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(16,185,129,0.2) 0%, transparent 50%)`,
                        opacity: 0.8
                    }}
                />

                {/* Layer 3: Texture & Grain for Premium Feel */}
                <div className="absolute inset-0 z-20 opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>

                {/* Layer 4: Deep Atmosphere Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#010908] via-transparent to-[#010908]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#010908_95%)]" />
            </div>

            {/* Kinetic Floating Elements (Micro-interactions) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-emerald-400/20 rounded-full blur-[1px]"
                        style={{
                            width: `${Math.random() * 4 + 2}px`,
                            height: `${Math.random() * 4 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float-particle ${15 + Math.random() * 20}s linear infinite`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* The Content Engine */}
            <div className="relative z-30 max-w-[1400px] mx-auto px-6 text-center">
                <div className="space-y-20">

                    {/* The Royal Seal (Branding Identity) */}
                    <div className="flex flex-col items-center gap-8 animate-[fade-in-down_0.8s_ease-out]">
                        <div className="relative group cursor-pointer">
                            {/* Orbiting Ring */}
                            <div className="absolute -inset-16 border border-emerald-500/10 rounded-full animate-[spin-slow_15s_linear_infinite]"></div>
                            <div className="absolute -inset-16 border border-white/5 rounded-full animate-[spin-reverse_20s_linear_infinite]"></div>

                            {/* Main Box */}
                            <div className="absolute -inset-10 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                            <div className="relative w-36 h-36 rounded-[2.5rem] p-[3px] bg-gradient-to-br from-white/20 to-transparent backdrop-blur-3xl shadow-3xl transform group-hover:scale-110 transition-transform duration-700">
                                <div className="w-full h-full bg-gradient-to-br from-[#064e3b] to-[#022c22] rounded-[2.2rem] flex items-center justify-center text-white font-black text-7xl border border-white/10 relative overflow-hidden">
                                    <span className="relative z-10">አ</span>
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
                                </div>
                            </div>
                        </div>
                        <div className="inline-flex items-center gap-5 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-[10px] font-black text-emerald-400 tracking-[0.5em] uppercase">Est. 2010</span>
                            <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                            <span className="text-[10px] font-black text-white/60 tracking-[0.3em] uppercase">Addis Elite Trade Group</span>
                        </div>
                    </div>

                    {/* The Typography Masterpiece (Elite Status) */}
                    <div className="space-y-6">
                        <h1 className="flex flex-col items-center select-none">
                            <div className="relative">
                                {/* Ghost Shadow Layer */}
                                <span className="text-[12rem] lg:text-[18rem] font-black tracking-[-0.08em] text-white leading-none opacity-[0.03] absolute -top-12 left-1/2 -translate-x-1/2 blur-2xl">
                                    አዲስ
                                </span>
                                {/* Main Display Layer */}
                                <span className="text-[10rem] lg:text-[15rem] font-black tracking-[-0.05em] text-white leading-none drop-shadow-[0_30px_60px_rgba(0,0,0,0.9)] relative z-10 transition-transform duration-300 ease-out"
                                    style={{ transform: `translate(${mousePos.x * 0.15}px, ${mousePos.y * 0.15}px)` }}>
                                    አዲስ
                                </span>
                            </div>
                            <div className="relative z-20 group">
                                <span className="text-5xl lg:text-[9rem] font-black italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#d9f99d] to-[#10b981] animate-[gradient-shift_8s_linear_infinite] tracking-tight -mt-10 lg:-mt-20 block overflow-visible py-4 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                                    Harvest
                                </span>
                                {/* Decorative underline */}
                                <div className="absolute bottom-4 left-0 w-full h-[6px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000"></div>
                            </div>
                        </h1>
                        <p className="text-xl lg:text-4xl text-emerald-50/70 font-light max-w-5xl mx-auto leading-[1.4] animate-[fade-in-up_1s_ease-out_0.4s_both]">
                            Orchestrating the <span className="text-white font-black italic">Next Generation</span> of
                            <span className="text-white font-black mx-3 relative inline-block group">
                                <span className="relative z-10">Premium Export Logistics</span>
                                <span className="absolute bottom-1 left-0 w-full h-3 bg-emerald-500/20 -skew-x-12 transform scale-x-110"></span>
                            </span>
                            direct from Ethiopia.
                        </p>
                    </div>

                    {/* The Power-Grid Actions */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12 pt-12 animate-[fade-in-up_1s_ease-out_0.6s_both]">
                        <button
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-20 py-9 rounded-[3rem] bg-emerald-500 text-slate-950 font-black text-3xl shadow-[0_30px_100px_-20px_rgba(16,185,129,0.8)] overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:shadow-[0_45px_120px_-30px_rgba(16,185,129,0.9)] active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-5 uppercase tracking-tighter">
                                Enter The Exchange
                                <ArrowRight className="w-10 h-10 group-hover:translate-x-6 transition-transform duration-700 ease-in-out" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.2s_ease-out_infinite]"></div>
                        </button>

                        <div className="flex p-3 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-3xl hover:border-white/20 transition-all duration-500">
                            <Link
                                href="/login"
                                className="px-14 py-7 rounded-[3rem] text-white font-black text-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-5 group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500 shadow-inner">
                                    <LogIn className="w-6 h-6" />
                                </div>
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-14 py-7 rounded-[3rem] bg-white text-slate-950 font-black text-xl hover:bg-emerald-50 transition-all duration-500 shadow-2xl hover:scale-105 active:scale-95"
                            >
                                Join Elite Portal
                            </Link>
                        </div>
                    </div>

                    {/* Elite Stats (Glassmorphism Cards) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-20 pb-40 animate-[fade-in-up_1s_ease-out_0.8s_both]">
                        {[
                            { label: "Market Capacity", val: "2.4B ETB", icon: <TrendingUp className="w-5 h-5" />, color: "emerald" },
                            { label: "Verified Partners", val: "1,250+", icon: <Award className="w-5 h-5" />, color: "lime" },
                            { label: "Global Reach", val: "48 Nations", icon: <Globe className="w-5 h-5" />, color: "emerald" },
                            { label: "Logistics Grade", val: "Elite A++", icon: <Zap className="w-5 h-5" />, color: "amber" }
                        ].map((stat, i) => (
                            <div key={i} className="group relative overflow-hidden bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl hover:bg-white/10 transition-all duration-500 text-left">
                                <div className={`w-12 h-12 rounded-2xl mb-6 flex items-center justify-center text-${stat.color}-400 bg-${stat.color}-400/10 group-hover:scale-110 transition-transform duration-500`}>
                                    {stat.icon}
                                </div>
                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-2">{stat.label}</div>
                                <div className="text-2xl font-black text-white">{stat.val}</div>
                                {/* Progress Indicator */}
                                <div className="mt-4 h-[2px] w-0 group-hover:w-full bg-emerald-500/50 transition-all duration-1000"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* The Cinematic Scroll Control */}
            <div className="absolute bottom-40 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-6 group">
                <div className="relative w-px h-32 bg-white/5 overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-emerald-500 -translate-y-full animate-[scroll-bar_2.5s_infinite_ease-in-out]"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.8em] text-emerald-500 animate-pulse">Scroll to Catalog</span>
            </div>

            {/* The Signature Liquid Wave (Bottom Seal) */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-slate-50 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTTAsMzIwTDQ4LDI5OC43Qzk2LDI3NywxOTIsMjM1LDI4OCwyMjRDMzg0LDIxMyw0ODAsMjM1LDU3NiwyMTguN0M2NzIsMjAyLDc2OCwxNDksODY0LDE0NEM5NjAsMTM5LDEwNTYsMTgxLDExNTIsMTgxLjNDMTI0OCwxODIsMTM0NCwxMzksMTM5MiwxMTcuM0wxNDQwLDk2TDE0NDAsMzIwTDEzOTIsMzIwQzEzNDQsMzIwLDEyNDgsMzIwLDExNTIsMzIwQzEwNTYsMzIwLDk2LDMyMCw4NjQsMzIwQzc2OCwzMjAsNjcyLDMyMCw1NzYsMzIwQzQ4MCwzMjAsMzg0LDMyMCwyODgsMzIwQzE5MiwzMjAsOTYsMzIwLDQ4LDMyMEwwLDMyMFoiPjwvcGF0aD48L3N2Zz4=')] bg-repeat-x" />

            {/* Custom Animations CSS */}
            <style jsx>{`
                @keyframes slow-pan {
                    from { transform: scale(1.1) translateX(-2%); }
                    to { transform: scale(1.1) translateX(2%); }
                }
                @keyframes float-particle {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    20% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
                }
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    to { transform: rotate(-360deg); }
                }
                @keyframes shimmer {
                    from { transform: translateX(-200%); }
                    to { transform: translateX(200%); }
                }
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                    background-size: 200% 200%;
                }
                @keyframes scroll-bar {
                    0% { transform: translateY(-100%); }
                    40% { transform: translateY(100%); }
                    100% { transform: translateY(100%); }
                }
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(40px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}
