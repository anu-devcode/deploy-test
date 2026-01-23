'use client';

import Image from 'next/image';

export function HarvestStory() {
    return (
        <section className="py-24 relative overflow-hidden bg-white">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 -skew-x-12 transform translate-x-1/2"></div>

            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image Side */}
                    <div className="relative">
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                            <Image
                                src="/harvest-hero.png"
                                alt="Ethiopian Harvest"
                                fill
                                className="object-cover"
                            />
                            {/* Overlay Card */}
                            <div className="absolute bottom-8 right-8 left-8 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-2xl">✨</div>
                                    <div>
                                        <p className="text-sm font-bold text-amber-800 uppercase tracking-wider">Quality First</p>
                                        <p className="text-slate-900 font-bold">100% Traceable Harvest</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl -z-10"></div>
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl -z-10 animate-pulse"></div>
                    </div>

                    {/* Content Side */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-sm font-black text-emerald-600 uppercase tracking-[0.2em]">Our Heritage</h2>
                            <h3 className="text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                                From Fertile Soil to <span className="text-emerald-600">Your Table</span>
                            </h3>
                            <p className="text-xl text-slate-600 leading-relaxed font-medium">
                                We believe in the power of agriculture to transform lives. Every grain of sesame,
                                every pulse, and every crop we offer is a testament to the hard work of
                                Ethiopian farmers and the richness of our land.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-6">
                            {[
                                { title: 'Direct Sourcing', desc: 'Working directly with farmers to ensure fair prices and quality.', icon: '🤝' },
                                { title: 'Modern Standards', desc: 'Implementing cutting-edge tech in traditional farming.', icon: '🚜' },
                                { title: 'Sustainability', desc: 'Committed to eco-friendly practices and soil health.', icon: '🌱' },
                                { title: 'Global Reach', desc: 'Bringing the best of Ethiopia to the world stage.', icon: '🌍' }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors border border-emerald-100/50">
                                    <div className="text-3xl mb-3">{item.icon}</div>
                                    <h4 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-slate-600 font-medium">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4">
                            <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-600/20 transition-all duration-300 transform hover:-translate-y-1">
                                Discover Our Impact
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
