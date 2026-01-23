'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Product, Tenant } from '@/types';
import { UserPlus, LogIn, ArrowRight, Globe, ShieldCheck, Zap, Star, MousePointer2, Sparkles, Award, TrendingUp, ChevronDown } from 'lucide-react';

interface HeroProps {
    allProducts: Product[];
    tenants: Tenant[];
}

export function Hero({ allProducts, tenants }: HeroProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsLoaded(true);
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
            className="relative min-h-[110vh] flex items-center justify-center overflow-hidden bg-[#010908]"
        >
            {/* The Master Visual Foundation */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Layer 1: The Cinematic Background */}
                <div className="absolute inset-0 scale-110">
                    <Image
                        src="/harvest-hero.png"
                        alt="Harvest Base"
                        fill
                        className="object-cover opacity-20 blur-[1px] animate-[slow-pan_40s_linear_infinite_alternate]"
                        priority
                    />
                </div>

                {/* Layer 2: Interactive Aura / Spotlight */}
                <div
                    className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-1000"
                    style={{
                        background: `radial-gradient(600px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(16,185,129,0.15) 0%, transparent 100%)`,
                        opacity: isLoaded ? 0.8 : 0
                    }}
                />

                {/* Layer 3: Abstract Geometric Grid (Master Grade Detail) */}
                <div className="absolute inset-0 z-10 opacity-[0.05] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16,185,129,0.3) 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                        transform: `translate(${mousePos.x * 0.05}px, ${mousePos.y * 0.05}px)`
                    }}>
                </div>

                {/* Layer 4: Deep Atmosphere Gradients */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#010908] via-transparent to-[#010908]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#010908_90%)]" />

                {/* Floating "Light Beams" */}
                <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent blur-sm rotate-12"></div>
                <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent blur-sm -rotate-12"></div>
            </div>

            {/* Kinetic Floating Elements (Micro-interactions) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-emerald-400/20 rounded-full blur-[2px]"
                        style={{
                            width: `${Math.random() * 3 + 2}px`,
                            height: `${Math.random() * 3 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `float-particle ${20 + Math.random() * 30}s linear infinite`,
                            animationDelay: `${Math.random() * 10}s`
                        }}
                    ></div>
                ))}
            </div>

            {/* The Content Engine */}
            <div className={`relative z-30 max-w-[1500px] mx-auto px-6 text-center transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="space-y-16">

                    {/* The Royal Seal (Branding Identity) */}
                    <div className="flex flex-col items-center gap-8 animate-[fade-in-down_1.2s_ease-out]">
                        <div className="relative group cursor-pointer">
                            {/* Recursive Orbiting Rings */}
                            <div className="absolute -inset-24 border border-emerald-500/5 rounded-full animate-[spin-slow_25s_linear_infinite]"></div>
                            <div className="absolute -inset-16 border border-emerald-400/10 rounded-full animate-[spin-reverse_15s_linear_infinite]"></div>
                            <div className="absolute -inset-12 border-2 border-dashed border-white/5 rounded-full animate-[spin-slow_40s_linear_infinite]"></div>

                            {/* Core Glow */}
                            <div className="absolute -inset-14 bg-emerald-500/20 rounded-full blur-[60px] group-hover:bg-emerald-500/30 transition-all duration-1000"></div>

                            {/* Main Emblem Box */}
                            <div className="relative w-40 h-40 rounded-[3rem] p-[2px] bg-gradient-to-br from-white/30 via-white/5 to-white/10 backdrop-blur-3xl shadow-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-1000">
                                <div className="w-full h-full bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#010908] rounded-[2.8rem] flex items-center justify-center text-white font-black text-8xl border border-white/10 relative overflow-hidden group">
                                    <span className="relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-110">አ</span>
                                    {/* Inner Light Sweep */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-emerald-400/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
                                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
                                </div>
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-6 px-8 py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl group hover:border-emerald-500/30 transition-colors duration-500">
                            <span className="text-[11px] font-black text-emerald-400 tracking-[0.6em] uppercase">Est. 2010</span>
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[11px] font-black text-white/80 tracking-[0.4em] uppercase group-hover:text-white transition-colors">Addis Elite Trade Group</span>
                        </div>
                    </div>

                    {/* The Typography Masterpiece (Elite Status) */}
                    <div className="space-y-4">
                        <h1 className="flex flex-col items-center select-none perspective-1000">
                            <div className="relative">
                                {/* Ghost Shadow Layer - Enhanced for Depth */}
                                <span className="text-[14rem] lg:text-[22rem] font-black tracking-[-0.08em] text-white leading-none opacity-[0.02] absolute -top-16 left-1/2 -translate-x-1/2 blur-3xl pointer-events-none">
                                    አዲስ
                                </span>
                                {/* Main Display Layer */}
                                <span
                                    className="text-[11rem] lg:text-[18rem] font-black tracking-[-0.06em] text-white leading-none drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative z-10 block"
                                    style={{
                                        transform: `translate3d(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px, 0) rotateX(${mousePos.y * -0.05}deg) rotateY(${mousePos.x * 0.05}deg)`,
                                        transition: 'transform 0.1s ease-out'
                                    }}
                                >
                                    አዲስ
                                </span>
                            </div>

                            <div className="relative z-20 group -mt-12 lg:-mt-24">
                                <span className="text-6xl lg:text-[11rem] font-black italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#d9f99d] to-[#10b981] animate-[gradient-shift_10s_linear_infinite] tracking-tight block overflow-visible py-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.4)] relative">
                                    Harvest
                                    {/* Sweeping Highlight */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] animate-[sweep_4s_ease-in-out_infinite] mix-blend-overlay"></span>
                                </span>
                                {/* Decorative underline - More refined */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[4px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 blur-[1px]"></div>
                            </div>
                        </h1>

                        <p className="text-xl lg:text-3xl text-emerald-50/60 font-medium max-w-4xl mx-auto leading-relaxed animate-[fade-in-up_1.2s_ease-out_0.5s_both]">
                            Engineering the <span className="text-white font-black italic border-b-2 border-emerald-500/30">Next Frontiers</span> of
                            <span className="text-white font-black mx-3 relative inline-block group px-2 text-emerald-50">
                                <span className="relative z-10 transition-colors group-hover:text-emerald-400">Elite Global Export</span>
                                <span className="absolute bottom-1 left-0 w-full h-4 bg-emerald-500/10 -skew-x-12 transform scale-x-110 group-hover:bg-emerald-500/20 transition-all duration-700"></span>
                            </span>
                            Legacy standards, direct from the source.
                        </p>
                    </div>

                    {/* High-Octane Action Hub */}
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-10 pt-8 animate-[fade-in-up_1.2s_ease-out_0.8s_both]">
                        <button
                            onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-20 py-8 rounded-[2.5rem] bg-emerald-500 text-slate-950 font-black text-2xl shadow-[0_20px_80px_-15px_rgba(16,185,129,0.6)] overflow-hidden transition-all duration-700 hover:scale-[1.05] hover:shadow-[0_40px_100px_-20px_rgba(16,185,129,0.8)] active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-4 uppercase tracking-tighter">
                                Enter The Gateway
                                <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]"></div>
                        </button>

                        <div className="flex p-2 rounded-[3rem] bg-white/[0.03] backdrop-blur-3xl border border-white/10 shadow-3xl hover:border-white/20 transition-all duration-500">
                            <Link
                                href="/login"
                                className="px-12 py-6 rounded-[2.5rem] text-white font-black text-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-500">
                                    <LogIn className="w-5 h-5" />
                                </div>
                                Access Portal
                            </Link>
                            <Link
                                href="/register"
                                className="px-12 py-6 rounded-[2.5rem] bg-white text-slate-950 font-black text-lg hover:bg-emerald-50 transition-all duration-500 shadow-xl hover:scale-105 active:scale-95"
                            >
                                Partner With Us
                            </Link>
                        </div>
                    </div>

                    {/* Performance Quadrant (Stats) */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 lg:gap-8 pt-12 animate-[fade-in-up_1.2s_ease-out_1s_both]">
                        {[
                            { label: "Market Volume", val: "$420M+", icon: <TrendingUp className="w-5 h-5" />, color: "emerald" },
                            { label: "Elite Growers", val: "2,840+", icon: <Award className="w-5 h-5" />, color: "green" },
                            { label: "Nations Served", val: "62 Plus", icon: <Globe className="w-5 h-5" />, color: "emerald" },
                            { label: "Quality Grade", val: "Supreme A+", icon: <Zap className="w-5 h-5" />, color: "amber" }
                        ].map((stat, i) => (
                            <div key={i} className="group relative overflow-hidden bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl hover:bg-white/[0.06] hover:border-emerald-500/30 transition-all duration-700 text-left">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.05] group-hover:opacity-[0.2] transition-opacity duration-700">
                                    {stat.icon}
                                </div>
                                <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center text-${stat.color}-400 bg-${stat.color}-400/10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-inner`}>
                                    {stat.icon}
                                </div>
                                <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-3">{stat.label}</div>
                                <div className="text-3xl font-black text-white tracking-tight">{stat.val}</div>
                                {/* Advanced Progress Bar */}
                                <div className="mt-6 h-[1px] w-full bg-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-lime-400 w-0 group-hover:w-full transition-all duration-1500 cubic-bezier(0.19, 1, 0.22, 1)"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cinematic Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 group cursor-pointer"
                onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="text-[9px] font-black uppercase tracking-[1em] text-emerald-500/60 group-hover:text-emerald-400 transition-colors mb-2">Explore Excellence</div>
                <div className="relative w-8 h-12 rounded-full border-2 border-white/10 flex items-start justify-center p-2 group-hover:border-emerald-500/50 transition-colors">
                    <div className="w-1 h-3 bg-emerald-500 rounded-full animate-[scroll-indicator_2s_infinite]"></div>
                </div>
            </div>

            {/* The Signature Liquid Wave (Bottom Seal) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-[#010908] pointer-events-none"
                style={{ maskImage: 'linear-gradient(to top, black, transparent)' }}></div>

            {/* Custom Animations CSS */}
            <style jsx>{`
                .perspective-1000 { perspective: 1000px; }
                
                @keyframes slow-pan {
                    from { transform: scale(1.1) translateX(-3%) translateY(-1%); }
                    to { transform: scale(1.1) translateX(3%) translateY(1%); }
                }
                @keyframes float-particle {
                    0% { transform: translateY(0) scale(1); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-120vh) translateX(50px) scale(0.2); opacity: 0; }
                }
                @keyframes spin-slow {
                    to { transform: rotate(360deg); }
                }
                @keyframes spin-reverse {
                    to { transform: rotate(-360deg); }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                    background-size: 200% 200%;
                }
                @keyframes sweep {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(100%); }
                    100% { transform: translateX(100%); }
                }
                @keyframes scroll-indicator {
                    0% { transform: translateY(0); opacity: 1; }
                    50% { transform: translateY(12px); opacity: 0.5; }
                    100% { transform: translateY(0); opacity: 1; }
                }
                @keyframes fade-in-down {
                    from { opacity: 0; transform: translateY(-30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </section>
    );
}


