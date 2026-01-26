'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Calendar,
    User,
    Tag,
    ArrowRight,
    Search,
    ChevronRight,
    PlayCircle,
    TrendingUp,
    Bookmark
} from 'lucide-react';

export default function BlogPage() {
    const posts = [
        {
            title: "Ethiopia's Sesame Export: 2026 Season Outlook",
            excerpt: "Analyzing moisture levels and international demand for Humera sesame in the upcoming export cycle.",
            category: "Market Report",
            author: "Abenezer K.",
            date: "Jan 24, 2026",
            image: "/sesame.png",
            timeToRead: "8 min read"
        },
        {
            title: "Bridging the Gap: How We Empower Local Farmers",
            excerpt: "Our new community processing initiative is already showing 15% increase in farmer yields.",
            category: "Community",
            author: "Tsega T.",
            date: "Jan 18, 2026",
            image: "/harvest-hero.png",
            timeToRead: "12 min read"
        },
        {
            title: "5 Things International Buyers Look for in Pulse Grading",
            excerpt: "A deep dive into grading standards and moisture control for high-grade lentils and haricot beans.",
            category: "Trade secrets",
            author: "Sarah J.",
            date: "Jan 12, 2026",
            image: "/lentils.png",
            timeToRead: "15 min read"
        }
    ];

    const categories = ["All Posts", "Market Analysis", "Farming Tech", "Global Logistics", "Trade News", "Community"];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 bg-slate-50 border-b border-slate-100 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 skew-x-[-15deg] translate-x-32"></div>

                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs uppercase tracking-widest mb-8">
                                <TrendingUp className="w-4 h-4" />
                                Insights & Analysis
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                                The <span className="text-emerald-600 italic">Harvest</span> <br />
                                Ledger
                            </h1>
                            <p className="text-xl text-slate-600 font-medium max-w-xl mb-12 leading-relaxed">
                                Expert perspectives on Ethiopian agriculture, global trade dynamics, and the future of regional commerce.
                            </p>
                            <div className="max-w-md mx-auto lg:mx-0">
                                <div className="relative group">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                                    <input
                                        type="text"
                                        placeholder="Search the ledger..."
                                        className="w-full bg-white border border-slate-200 rounded-[1.5rem] py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold transition-all shadow-xl shadow-slate-900/5 text-slate-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Post Card */}
                        <div className="relative group lg:block hidden">
                            <div className="absolute -inset-4 bg-emerald-100 rounded-[3rem] blur-2xl opacity-50 transition-all duration-500 group-hover:scale-105"></div>
                            <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100">
                                <div className="aspect-[16/10] relative">
                                    <Image src="/wheat.png" alt="Featured Post" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
                                    <div className="absolute top-8 left-8">
                                        <span className="px-4 py-2 rounded-xl bg-white/90 backdrop-blur-md shadow-lg text-[10px] font-black uppercase tracking-widest text-emerald-700">Featured Article</span>
                                    </div>
                                </div>
                                <div className="p-10">
                                    <div className="flex items-center gap-4 mb-4 text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">
                                        <span>Logistics</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>15 min read</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-emerald-600 transition-colors">Digitalizing the Silk Road: The Future of East African Ports</h3>
                                    <Link href="#" className="inline-flex items-center gap-2 text-slate-900 font-black hover:gap-4 transition-all">
                                        Read Full Report
                                        <ArrowRight className="w-5 h-5 text-emerald-600" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories & Listing */}
            <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="flex overflow-x-auto gap-3 pb-12 no-scrollbar border-b border-slate-100 mb-20">
                    {categories.map((cat, i) => (
                        <button key={i} className={`whitespace-nowrap px-8 py-3 rounded-2xl font-black text-sm transition-all ${i === 0 ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    {posts.map((post, i) => (
                        <article key={i} className="group flex flex-col h-full">
                            <div className="relative aspect-[16/11] rounded-[2.5rem] overflow-hidden bg-slate-50 mb-8 border border-slate-100 shadow-sm transition-all group-hover:shadow-2xl group-hover:shadow-emerald-500/10 group-hover:-translate-y-2">
                                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute bottom-6 right-6">
                                    <button className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 transition-all">
                                        <Bookmark className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{post.category}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{post.date}</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight flex-1">
                                    {post.title}
                                </h3>
                                <p className="text-slate-600 font-medium line-clamp-2 mb-8">{post.excerpt}</p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black uppercase">
                                            {post.author.charAt(0)}
                                        </div>
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{post.author}</span>
                                    </div>
                                    <Link href="#" className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-emerald-600 transition-all rotate-[-45deg] group-hover:rotate-0">
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <button className="px-12 py-5 border-2 border-slate-100 rounded-2xl font-black text-slate-900 hover:border-emerald-500 hover:text-emerald-600 transition-all group italic">
                        Load More Articles
                        <span className="inline-block transition-transform group-hover:translate-x-1">...</span>
                    </button>
                </div>
            </section>

            {/* Newsletter Minimal */}
            <section className="py-32 bg-emerald-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
                </div>
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
                    <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tighter uppercase italic">Stay in the Loop</h2>
                    <p className="text-xl text-emerald-100/60 max-w-xl mx-auto mb-12 font-medium">Weekly market analysis and trade opportunities delivered straight to your portal.</p>
                    <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-4">
                        <input
                            type="email"
                            placeholder="Your professional email"
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-emerald-100/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold transition-all"
                        />
                        <button className="px-10 py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/20">
                            Join Newsroom
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
