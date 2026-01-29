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
                        className="object-cover opacity-100 blur-[1px] animate-[slow-pan_40s_linear_infinite_alternate]"
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
                {isLoaded && [...Array(20)].map((_, i) => (
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
                <div className="space-y-8 md:space-y-16">

                    {/* The Royal Seal (Branding Identity) */}
                    <div className="flex flex-col items-center gap-4 md:gap-8 animate-[fade-in-down_1.2s_ease-out]">
                        <div className="relative group cursor-pointer scale-75 md:scale-100">
                            {/* Recursive Orbiting Rings */}
                            <div className="absolute -inset-24 border border-emerald-500/5 rounded-full animate-[spin-slow_25s_linear_infinite]"></div>
                            <div className="absolute -inset-16 border border-emerald-400/10 rounded-full animate-[spin-reverse_15s_linear_infinite]"></div>
                            <div className="absolute -inset-12 border-2 border-dashed border-white/5 rounded-full animate-[spin-slow_40s_linear_infinite]"></div>

                            {/* Core Glow */}
                            <div className="absolute -inset-14 bg-emerald-500/20 rounded-full blur-[60px] group-hover:bg-emerald-500/30 transition-all duration-1000"></div>

                            {/* Main Emblem Box */}

                        </div>

                        <div className="inline-flex items-center mt-30 gap-3 md:gap-6 px-4 md:px-8 py-2 md:py-3 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl group hover:border-emerald-500/30 transition-colors duration-500">
                            <span className="text-[9px] md:text-[11px] font-black text-emerald-400 tracking-[0.4em] md:tracking-[0.6em] uppercase">Est. 2004</span>
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[9px] md:text-[11px] font-black text-white/80 tracking-[0.3em] md:tracking-[0.4em] uppercase group-hover:text-white transition-colors">Tsega Trading Group</span>
                        </div>
                    </div>

                    {/* The Typography Masterpiece (Elite Status) */}
                    <div className="space-y-2 md:space-y-4">
                        <h1 className="flex flex-col items-center select-none perspective-1000">
                            <div className="relative">
                                {/* Ghost Shadow Layer - Enhanced for Depth */}
                                <span className="text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[22rem] font-black tracking-[-0.08em] text-white leading-none opacity-[0.02] absolute -top-8 md:-top-16 left-1/2 -translate-x-1/2 blur-2xl md:blur-3xl pointer-events-none whitespace-nowrap">
                                    አዲስ
                                </span>
                                {/* Main Display Layer */}
                                <span
                                    className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[18rem] font-black tracking-[-0.06em] text-white leading-none drop-shadow-[0_40px_80px_rgba(0,0,0,0.9)] relative z-10 block whitespace-nowrap"
                                    style={{
                                        transform: typeof window !== 'undefined' && window.innerWidth > 768 ? `translate3d(${mousePos.x * 0.1}px, ${mousePos.y * 0.1}px, 0) rotateX(${mousePos.y * -0.05}deg) rotateY(${mousePos.x * 0.05}deg)` : 'none',
                                        transition: 'transform 0.1s ease-out'
                                    }}
                                >
                                    አዲስ
                                </span>
                            </div>

                            <div className="relative z-20 group -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-24">
                                <span className="text-4xl sm:text-6xl md:text-[8rem] lg:text-[11rem] font-black italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#d9f99d] to-[#10b981] animate-[gradient-shift_10s_linear_infinite] tracking-tight block overflow-visible py-4 md:py-6 drop-shadow-[0_0_30px_rgba(16,185,129,0.4)] relative">
                                    Harvest
                                    {/* Sweeping Highlight */}
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-[100%] animate-[sweep_4s_ease-in-out_infinite] mix-blend-overlay"></span>
                                </span>
                                {/* Decorative underline - More refined */}
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-[4px] bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 blur-[1px]"></div>
                            </div>
                        </h1>

                        <p className="text-base sm:text-lg lg:text-3xl text-emerald-50/60 font-medium max-w-4xl mx-auto leading-relaxed animate-[fade-in-up_1.2s_ease-out_0.5s_both] px-4">
                            Engineering the <span className="text-white font-black italic border-b-2 border-emerald-500/30">Next Frontiers</span> of
                            <span className="text-white font-black mx-1 md:mx-3 relative inline-block group px-2 text-emerald-50">
                                <span className="relative z-10 transition-colors group-hover:text-emerald-400">Elite Global Export</span>
                                <span className="absolute bottom-1 left-0 w-full h-2 md:h-4 bg-emerald-500/10 -skew-x-12 transform scale-x-110 group-hover:bg-emerald-500/20 transition-all duration-700"></span>
                            </span>
                            Legacy standards, direct from the source.
                        </p>
                    </div>

                    {/* CTA Section */}
                    <div className="relative z-30 pt-4 md:pt-8 animate-[fade-in-up_1.2s_ease-out_0.9s_both]">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">

                            {/* Join Us */}
                            <Link
                                href="/register"
                                className="group relative w-full sm:w-auto px-10 md:px-12 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.2rem] bg-white text-slate-950 font-black text-base md:text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all duration-500 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <UserPlus className="w-5 h-5 md:w-6 md:h-6" />
                                    Join Us
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-200 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
                            </Link>

                            {/* Work With Us */}
                            <Link
                                href="/partners"
                                className="group w-full sm:w-auto px-10 md:px-12 py-4 md:py-6 rounded-[1.5rem] md:rounded-[2.2rem] border border-white/20 text-white font-black text-base md:text-lg backdrop-blur-xl hover:border-emerald-500/40 hover:bg-white/5 transition-all duration-500 flex items-center justify-center gap-3"
                            >
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-emerald-400 group-hover:scale-110 transition-transform" />
                                Work With Us
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                            </Link>

                        </div>

                        <p className="mt-10 md:mt-20 text-[10px] md:text-sm text-emerald-100/60 font-medium">
                            Farmers • Exporters • Innovators • Global Partners
                        </p>
                    </div>

                    {/* Performance Quadrant (Stats) */}

                </div>
            </div>
            {/* Join / Work With Us */}



            {/* Cinematic Scroll indicator */}
            {/* <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4 group cursor-pointer"
                onClick={() => document.getElementById('impact')?.scrollIntoView({ behavior: 'smooth' })}>
                <div className="text-[9px] font-black uppercase tracking-[1em] text-emerald-500/60 group-hover:text-emerald-400 transition-colors mb-2">Explore Excellence</div>
                <div className="relative w-8 h-12 rounded-full border-2 border-white/10 flex items-start justify-center p-2 group-hover:border-emerald-500/50 transition-colors">
                    <div className="w-1 h-3 bg-emerald-500 rounded-full animate-[scroll-indicator_2s_infinite]"></div>
                </div>
            </div> */}

            {/* The Signature Liquid Wave Divider (Consistent with About Page - Bolder) */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-slate-50 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTTAsOTZMMzAsMTEyQzYwLDEyOCwxMjAsMTYwLDE4MCwxNjBDMjQwLDE2MCwzMDAsMTI4LDM2MCwxMTJDNDIwLDk2LDQ4MCw5Niw1NDAsMTI4QzYwMCwxNjAsNjYwLDE5Miw3MjAsMTkyQzc4MCwxOTIsODQwLDE2MCw5MDAsMTM4LjdDOTYwLDExNywxMDIwLDEwNywxMDgwLDExMkMxMTQwLDExNywxMjAwLDEzOSwxMjYwLDE2MEMxMzIwLDE4MSwxMzgwLDE5MiwxNDEwLDE5N0wxNDQwLDIwMkwxNDQwLDMyMEwxNDEwLDMyMEMxMzgwLDMyMCwxMzIwLDMyMCwxMjYwLDMyMEMxMjAwLDMyMCwxMTQwLDMyMCwxMDgwLDMyMEMxMDIwLDMyMCw5NjAsMzIwLDkwMCwzMjBDODQwLDMyMCw3ODAsMzIwLDcyMCwzMjBDNjYwLDMyMCw2MDAsMzIwLDU0MCwzMjBDNDgwLDMyMCw0MjAsMzIwLDM2MCwzMjBDMzAwLDMyMCwyNDAsMzIwLDE4MCwzMjBDMTIwLDMyMCw2MCwzMjAsMzAsMzIwTDAsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-repeat-x z-20" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-slate-50/20 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTTAsOTZMMzAsMTEyQzYwLDEyOCwxMjAsMTYwLDE4MCwxNjBDMjQwLDE2MCwzMDAsMTI4LDM2MCwxMTJDNDIwLDk2LDQ4MCw5Niw1NDAsMTI4QzYwMCwxNjAsNjYwLDE5Miw3MjAsMTkyQzc4MCwxOTIsODQwLDE2MCw5MDAsMTM4LjdDOTYwLDExNywxMDIwLDEwNywxMDgwLDExMkMxMTQwLDExNywxMjAwLDEzOSwxMjYwLDE2MEMxMzIwLDE4MSwxMzgwLDE5MiwxNDEwLDE5N0wxNDQwLDIwMkwxNDQwLDMyMEwxNDEwLDMyMEMxMzgwLDMyMCwxMzIwLDMyMCwxMjYwLDMyMEMxMjAwLDMyMCwxMTQwLDMyMCwxMDgwLDMyMEMxMDIwLDMyMCw5NjAsMzIwLDkwMCwzMjBDODQwLDMyMCw3ODAsMzIwLDcyMCwzMjBDNjYwLDMyMCw2MDAsMzIwLDU0MCwzMjBDNDgwLDMyMCw0MjAsMzIwLDM2MCwzMjBDMzAwLDMyMCwyNDAsMzIwLDE4MCwzMjBDMTIwLDMyMCw2MCwzMjAsMzAsMzIwTDAsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-repeat-x z-10 translate-y-4 opacity-30" />


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
                @keyframes wave-move {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(-25%); }
                    100% { transform: translateX(0); }
                }
                .animate-wave {
                    animation: wave-move 20s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}


