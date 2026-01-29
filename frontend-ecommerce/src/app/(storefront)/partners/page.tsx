'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
    Users,
    Handshake,
    TrendingUp,
    Globe,
    ShieldCheck,
    Zap,
    ArrowRight,
    CheckCircle2,
    MessageSquare,
    Building2,
    Briefcase
} from 'lucide-react';

export default function PartnersPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        setTimeout(() => setFormStatus('success'), 1500);
    };

    return (
        <div className="min-h-screen bg-[#010908] text-white">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/about-hero.png" // Reusing since it's a suitable background
                        alt="Partnership Background"
                        fill
                        className="object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#010908] via-transparent to-[#010908]" />
                </div>

                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-[10px] tracking-[0.3em] uppercase mb-8 animate-fade-in">
                        <Handshake className="w-4 h-4" />
                        Strategic Partnerships
                    </div>
                    <h1 className="text-5xl lg:text-8xl font-black mb-8 tracking-tighter leading-tight">
                        Grow Your Business <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">With the Elite</span>
                    </h1>
                    <p className="text-xl lg:text-2xl text-emerald-100/60 max-w-3xl mx-auto font-medium leading-relaxed">
                        Join Tsega Trading Group's global network of farmers, exporters, and logistics partners. Together, we are redefining the agricultural supply chain.
                    </p>
                </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-24 relative">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Globe className="w-8 h-8" />,
                                title: "Global Market Access",
                                desc: "Connect with buyers in over 40 countries and leverage our existing global logistics infrastructure."
                            },
                            {
                                icon: <ShieldCheck className="w-8 h-8" />,
                                title: "Verified Trust",
                                desc: "Benefit from our ISO certifications and SGS inspections, ensuring your products meet international standards."
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8" />,
                                title: "Risk Mitigation",
                                desc: "Our secure payment terms and trade insurance protect your investments in every transaction."
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/[0.05] transition-all group">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">{item.title}</h3>
                                <p className="text-emerald-100/60 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="py-24 bg-white/[0.02]">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        {/* Info Side */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-4xl lg:text-5xl font-black mb-6 uppercase tracking-tighter">Who We Partner With</h2>
                                <p className="text-emerald-100/60 text-lg font-medium">We search for partners who share our commitment to excellence, sustainability, and ethical trading practices.</p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { label: "Producers & Farmers", desc: "Scale up your production with our direct-to-market technology." },
                                    { label: "Logistics Providers", desc: "Help us bridge the last mile across East Africa and beyond." },
                                    { label: "Bulk Retailers", desc: "Source premium crops reliably for your international chain." }
                                ].map((type, i) => (
                                    <div key={i} className="flex gap-6 items-start">
                                        <div className="mt-1">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold uppercase tracking-tight">{type.label}</h4>
                                            <p className="text-emerald-100/40 font-medium">{type.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 rounded-[2rem] bg-emerald-950/30 border border-emerald-500/20 flex items-center gap-6">
                                <Users className="w-12 h-12 text-emerald-400" />
                                <div>
                                    <h4 className="text-2xl font-black">5,000+</h4>
                                    <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Global Network Members</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Side */}
                        <div id="apply" className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-lime-400 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-[#0b1c19] border border-white/10 p-12 rounded-[2.8rem] shadow-2xl">
                                {formStatus === 'success' ? (
                                    <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/30">
                                            <CheckCircle2 className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-black mb-4">Application Received</h3>
                                        <p className="text-emerald-100/60 font-medium mb-8">Our partnership team will review your profile and contact you within 48 business hours.</p>
                                        <button
                                            onClick={() => setFormStatus('idle')}
                                            className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-black hover:bg-white/10 transition-all"
                                        >
                                            Submit Another
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-10">
                                            <h3 className="text-3xl font-black mb-2 lowercase tracking-tighter transition-all">apply for <span className="text-emerald-400 italic font-medium">partnership</span></h3>
                                            <p className="text-emerald-100/40 font-medium">Take the first step towards elite trade access.</p>
                                        </div>

                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/30 ml-4">Organization Name</label>
                                                    <div className="relative">
                                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/20" />
                                                        <input
                                                            required
                                                            type="text"
                                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.4rem] py-4 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                                                            placeholder="Company Ltd."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/30 ml-4">Business Type</label>
                                                    <div className="relative group">
                                                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/20 group-focus-within:text-emerald-400 transition-colors" />
                                                        <select className="w-full bg-white/[0.03] border border-white/10 rounded-[1.4rem] py-4 pl-16 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium appearance-none cursor-pointer">
                                                            <option className="bg-[#0b1c19]">Agriculture</option>
                                                            <option className="bg-[#0b1c19]">Logistics</option>
                                                            <option className="bg-[#0b1c19]">Retail/Wholesale</option>
                                                            <option className="bg-[#0b1c19]">Investment</option>
                                                        </select>
                                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-400">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-100/30 ml-4">Partnership Vision</label>
                                                <div className="relative">
                                                    <MessageSquare className="absolute left-6 top-6 w-5 h-5 text-emerald-100/20" />
                                                    <textarea
                                                        required
                                                        className="w-full bg-white/[0.03] border border-white/10 rounded-[1.4rem] py-4 pl-16 pr-6 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium h-32"
                                                        placeholder="How can we grow together?"
                                                    ></textarea>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={formStatus === 'submitting'}
                                                className="group relative w-full h-20 rounded-[1.5rem] bg-emerald-500 text-slate-950 font-black text-xl overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-emerald-500/20 disabled:opacity-50"
                                            >
                                                <span className="relative z-10 flex items-center justify-center gap-3">
                                                    {formStatus === 'submitting' ? 'Processing...' : 'Send Inquiry'}
                                                    {formStatus !== 'submitting' && <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />}
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-[200%] group-hover:animate-[shimmer_1.5s_infinite]" />
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-200%); }
                    100% { transform: translateX(200%); }
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out forwards;
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
