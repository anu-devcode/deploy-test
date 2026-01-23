'use client';

import { Tenant } from '@/types';
import { ChevronRight, ShieldCheck, Globe, Zap } from 'lucide-react';

interface BrandShowcaseProps {
    tenants: Tenant[];
}

export function BrandShowcase({ tenants }: BrandShowcaseProps) {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-200/50 border border-slate-300/50 mb-6 font-bold text-xs uppercase tracking-widest text-slate-600">
                            Our Ecosystem
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight">
                            Trusted by Leading <br />
                            <span className="text-emerald-600 italic">Ethiopian Brands</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium max-w-sm lg:text-right">
                        We provide the digital infrastructure for Ethiopia's most innovative agricultural and manufacturing enterprises.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tenants.map((tenant) => (
                        <div
                            key={tenant.id}
                            className="group bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-10 -mt-10 transition-colors group-hover:bg-emerald-50" />

                            <div className="relative z-10">
                                {/* Brand Logo Placeholder */}
                                <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black mb-8 group-hover:scale-110 transition-transform duration-500 shadow-xl" style={{ backgroundColor: tenant.theme?.primaryColor }}>
                                    {tenant.theme?.logoText || tenant.name.charAt(0)}
                                </div>

                                <div className="mb-8">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider mb-3">
                                        {tenant.industry}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">{tenant.name}</h3>
                                    <p className="text-slate-500 font-medium line-clamp-2">
                                        Leading {tenant.industry} solutions powered by Addis Harvest infrastructure.
                                    </p>
                                </div>

                                <button className="flex items-center gap-2 text-emerald-600 font-black text-sm uppercase tracking-wider group/btn">
                                    View Products
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Placeholder for "Join as Brand" */}
                    <div className="group bg-emerald-600 rounded-[2.5rem] p-10 shadow-xl shadow-emerald-900/20 hover:shadow-2xl hover:shadow-emerald-900/40 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between border-4 border-white/10">
                        <div className="text-white">
                            <h3 className="text-3xl font-black mb-4">Partner With Us</h3>
                            <p className="text-emerald-100 font-medium opacity-90 mb-8">
                                Join our growing marketplace and reach thousands of customers across the country.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Zap className="w-4 h-4" /></div>
                                    <span className="text-sm font-bold">Fast Onboarding</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><Globe className="w-4 h-4" /></div>
                                    <span className="text-sm font-bold">Nationwide Reach</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><ShieldCheck className="w-4 h-4" /></div>
                                    <span className="text-sm font-bold">Secure Infrastructure</span>
                                </div>
                            </div>
                        </div>

                        <button className="mt-12 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-105 transition-all duration-300">
                            Apply Now
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
