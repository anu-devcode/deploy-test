'use client';

import { Sprout, CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';

const steps = [
    {
        title: 'Ethical Sourcing',
        description: 'We partner directly with local smallholder farmers, ensuring fair prices and the highest quality organic produce.',
        icon: Sprout,
        color: 'from-emerald-500 to-green-600',
        delay: '0'
    },
    {
        title: 'Quality Selection',
        description: 'Our experts meticulously inspect every harvest. Only the most premium, nutrient-rich goods make it to your table.',
        icon: CheckCircle2,
        color: 'from-green-500 to-lime-600',
        delay: '100'
    },
    {
        title: 'Fresh Packaging',
        description: 'Innovative, eco-friendly packaging designed to lock in flavor and freshness while protecting the environment.',
        icon: Package,
        color: 'from-lime-500 to-emerald-500',
        delay: '200'
    },
    {
        title: 'Direct Delivery',
        description: 'From our farms to your doorstep in record time. We ensure the harvest reaches you at the peak of its freshness.',
        icon: Truck,
        color: 'from-emerald-600 to-green-700',
        delay: '300'
    }
];

export function HowItWorks() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden bg-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] opacity-60" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-lime-50 rounded-full blur-[100px] opacity-60" />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-4 md:mb-6 transition-transform hover:scale-105 duration-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-emerald-700 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">Our Process</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">
                        The <span className="text-emerald-600 italic">Farm-to-Table</span> Journey
                    </h2>
                    <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed px-4">
                        Experience transparency like never before. We've streamlined the agricultural supply chain to deliver the freshest Ethiopian produce directly to you.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
                    {/* Connecting Line - Desktop */}
                    <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-emerald-100 -translate-y-12 z-0" />

                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="group relative flex flex-col items-center text-center z-10"
                        >
                            {/* Icon Container */}
                            <div className="relative mb-6 md:mb-8">
                                <div className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-gradient-to-br ${step.color} p-0.5 transform transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-2xl shadow-emerald-900/10`}>
                                    <div className="w-full h-full bg-white rounded-[1.2rem] md:rounded-[1.4rem] flex items-center justify-center relative overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                                        <step.icon className={`w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br ${step.color} bg-clip-text text-emerald-600 group-hover:scale-110 transition-transform duration-500`} />
                                    </div>
                                </div>
                                {/* Step Number */}
                                <div className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs md:text-sm shadow-xl border-2 md:border-4 border-white">
                                    0{index + 1}
                                </div>
                            </div>

                            <h3 className="text-lg md:text-xl font-black text-slate-900 mb-2 md:mb-4 group-hover:text-emerald-600 transition-colors">
                                {step.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-500 font-medium leading-relaxed px-4">
                                {step.description}
                            </p>

                            {/* Mobile Arrow */}
                            {index !== steps.length - 1 && (
                                <div className="lg:hidden mt-12 text-emerald-200">
                                    <ArrowRight className="w-6 h-6 rotate-90" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 md:mt-24 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-slate-900 overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px] group-hover:bg-lime-500/20 transition-all duration-700" />

                    <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                        <div className="max-w-2xl text-center lg:text-left">
                            <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-2 md:mb-4 leading-tight">
                                Ready to experience the <span className="text-emerald-400">freshest harvest?</span>
                            </h3>
                            <p className="text-slate-400 text-base md:text-lg font-medium">
                                Join thousands of satisfied customers who get their premium organic goods delivered weekly.
                            </p>
                        </div>
                        <button
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="w-full lg:w-auto bg-white text-slate-900 px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-base md:text-lg hover:scale-105 hover:bg-emerald-50 transition-all duration-300 shadow-2xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            Start Shopping
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
