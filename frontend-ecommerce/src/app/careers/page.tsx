'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Briefcase,
    Globe,
    Zap,
    ArrowRight,
    Star,
    Users,
    Target,
    CheckCircle2,
    Search,
    MapPin,
    Clock
} from 'lucide-react';

export default function CareersPage() {
    const jobs = [
        { title: 'Global Logistics Manager', type: 'Full-time', location: 'Addis Ababa', category: 'Operations' },
        { title: 'Senior Agronomist', type: 'Full-time', location: 'Regional / Field', category: 'Agriculture' },
        { title: 'Export Trade Specialist', type: 'Full-time', location: 'Addis Ababa', category: 'Trade' },
        { title: 'Direct Sourcing Officer', type: 'Full-time', location: 'Hawassa / Jimma', category: 'Supply Chain' },
        { title: 'QA/QC Specialist (Grains)', type: 'Full-time', location: 'Central Warehouse', category: 'Quality' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative pt-32 pb-48 lg:pt-48 lg:pb-64 overflow-hidden bg-emerald-950">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/harvest-hero.png"
                        alt="Join our team"
                        fill
                        className="object-cover opacity-20 scale-110 blur-sm"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-950/80 to-transparent" />
                </div>

                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] tracking-[0.3em] uppercase mb-8">
                        <Star className="w-4 h-4 fill-emerald-500" />
                        Shape the Future of Trade
                    </div>
                    <h1 className="text-5xl lg:text-8xl font-black text-white mb-8 tracking-tighter leading-tight">
                        Cultivate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Potential</span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-emerald-100/60 max-w-2xl font-medium leading-relaxed mb-12">
                        Join Tsega Trading Group and help us build a more efficient, transparent, and sustainable agricultural supply chain for East Africa.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                        <Link
                            href="#open-roles"
                            className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-2xl"
                        >
                            View Open Roles
                        </Link>
                        <Link
                            href="/contact"
                            className="px-10 py-5 bg-emerald-900/50 backdrop-blur-md border border-white/10 text-white rounded-2xl font-black text-lg hover:bg-emerald-900 transition-all"
                        >
                            Culture & Values
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Join Us */}
            <section className="py-32 -mt-32 relative z-20">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: "Global Impact",
                                desc: "Work on projects that empower thousands of local farmers and connect them to international markets."
                            },
                            {
                                icon: <Users className="w-8 h-8" />,
                                title: "Elite Network",
                                desc: "Collaborate with industry experts, from veteran agronomists to innovative supply chain technologists."
                            },
                            {
                                icon: <Zap className="w-8 h-8" />,
                                title: "Hyper Growth",
                                desc: "We are scaling fast. Join a company where your contributions lead to direct, visible impact."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-slate-900/5 border border-slate-100 group hover:border-emerald-500 transition-all duration-500">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-slate-600 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-white">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <div>
                            <h2 className="text-4xl lg:text-6xl font-black text-slate-900 mb-8 uppercase tracking-tighter leading-none">Our Core <span className="text-emerald-600">DNA</span></h2>
                            <div className="space-y-8">
                                {[
                                    { label: "Radical Transparency", desc: "We believe in honest trade and clear communication across the entire supply chain." },
                                    { label: "Community Empowerment", desc: "Our success is directly tied to the prosperity of the farmers we partner with." },
                                    { label: "Uncompromising Quality", desc: "We only export the best of what Ethiopia has to offer." }
                                ].map((value, i) => (
                                    <div key={i} className="flex gap-6 items-start group">
                                        <div className="mt-1">
                                            <CheckCircle2 className="w-7 h-7 text-emerald-500 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">{value.label}</h4>
                                            <p className="text-slate-600 font-medium leading-relaxed">{value.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-[120px] opacity-10 rounded-full animate-pulse"></div>
                            <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-3xl border-8 border-slate-50">
                                <Image
                                    src="/about-hero.png"
                                    alt="Office Life"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Jobs list */}
            <section id="open-roles" className="py-32 bg-slate-50">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Open Opportunities</h2>
                            <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">Join the movement at Tsega Trading Group</p>
                        </div>
                        <div className="relative w-full md:w-80 group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-emerald-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search roles..."
                                className="w-full bg-white border border-slate-200 rounded-2xl py-5 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {jobs.map((job, i) => (
                            <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-3">
                                    <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest">{job.category}</span>
                                    <h3 className="text-2xl font-black text-slate-900 transition-colors group-hover:text-emerald-700">{job.title}</h3>
                                    <div className="flex flex-wrap gap-6 items-center">
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                            <MapPin className="w-4 h-4" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400 font-bold text-sm">
                                            <Clock className="w-4 h-4" />
                                            {job.type}
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href="/contact"
                                    className="px-8 py-5 rounded-2xl bg-slate-50 text-slate-900 font-black flex items-center justify-center gap-3 hover:bg-emerald-600 hover:text-white transition-all group/btn"
                                >
                                    Apply Now
                                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 p-12 rounded-[3rem] bg-emerald-600 text-white text-center relative overflow-hidden group">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_2s_infinite]"></div>
                        <h3 className="text-3xl font-black mb-4 italic">Can't find the right role?</h3>
                        <p className="text-emerald-50 font-medium mb-8 max-w-xl mx-auto">We are always looking for passionate talent. Send us an open application and let us know how you can help Tsega Trading Group grow.</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-3 px-10 py-5 bg-white text-emerald-700 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl"
                        >
                            Open Application
                        </Link>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}
