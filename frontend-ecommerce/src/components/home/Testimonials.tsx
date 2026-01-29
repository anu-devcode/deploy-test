'use client';

import Image from 'next/image';
import { Quote, Star } from 'lucide-react';

export function Testimonials() {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Wholesale Buyer",
            content: "Excellent quality products! The lentils are fresh and perfectly packaged. As a restaurant owner, the consistency in quality has been a game-changer for our kitchen. Will definitely order again.",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Retail Customer",
            content: "Fast delivery and amazing customer service. The wheat quality exceeded my expectations! You can really taste the difference when it's fresh from the source. Highly recommended for anyone seeking quality.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
            rating: 5
        },
        {
            name: "Aisha Patel",
            role: "Import Agent",
            content: "Best online marketplace for agricultural products. Premium quality at competitive prices! Their transparency regarding the farming process and certifications gives us complete peace of mind.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
            rating: 5
        }
    ];

    return (
        <section className="relative py-16 lg:py-32 overflow-hidden bg-slate-50">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200/20 rounded-full blur-[120px] -mr-64 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-200/20 rounded-full blur-[120px] -ml-64 -mb-32"></div>

            <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-800 font-black text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-4 md:mb-6">
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                        TESTIMONIALS
                        <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
                        Voice of Our <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Global</span> Community
                    </h2>
                    <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed px-4">
                        Join thousands of satisfied customers who trust Addis Harvest for their premium agricultural needs. Quality excellence, verified by the world.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid lg:grid-cols-3 gap-6 md:gap-8 relative">
                    {/* Decorative central quote icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] select-none pointer-events-none hidden lg:block">
                        <Quote className="w-[400px] h-[400px]" />
                    </div>

                    {testimonials.map((t, i) => (
                        <div
                            key={t.name}
                            className={`group relative bg-white rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 shadow-2xl shadow-emerald-900/5 border border-slate-100 hover:border-emerald-200 transition-all duration-500 md:hover:-translate-y-4`}
                        >
                            {/* Card Glow Effect */}
                            <div className="absolute inset-x-10 -bottom-2 h-4 bg-emerald-600/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-8">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="relative mb-10">
                                <Quote className="absolute -top-4 -left-4 w-10 h-10 text-emerald-100 -z-10 group-hover:text-emerald-200 transition-colors duration-500" />
                                <p className="text-lg text-slate-700 leading-relaxed font-medium italic">
                                    "{t.content}"
                                </p>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-5 pt-8 border-t border-slate-50">
                                <div className="relative w-16 h-16 shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
                                    <div className="relative w-full h-full rounded-2xl overflow-hidden border-2 border-white shadow-lg">
                                        <Image
                                            src={t.avatar}
                                            alt={t.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="font-black text-slate-900 text-xl tracking-tight leading-tight">
                                        {t.name}
                                    </div>
                                    <div className="text-emerald-600 font-bold text-xs uppercase tracking-widest mt-1">
                                        {t.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Proof Bar */}
                <div className="mt-20 py-10 border-t border-slate-200 flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                    <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Global Retailers.</div>
                    <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Nature's Best.</div>
                    <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Eco-Cert.</div>
                    <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Farmers Union.</div>
                    <div className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Bulk Source.</div>
                </div>
            </div>
        </section>
    );
}
