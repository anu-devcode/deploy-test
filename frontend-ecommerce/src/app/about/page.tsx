'use client';

import Image from "next/image";

export default function AboutPage() {
    return (
        <>

            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-emerald-900">
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="/about-hero.png"
                        alt="Agriculture Hero"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/60 to-emerald-950/90" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 font-bold text-sm mb-6 animate-fade-in">
                        <span>🌱</span>
                        OUR JOURNEY
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                        Cultivating <span className="text-lime-400">Excellence</span> <br />
                        Since 2010
                    </h1>
                    <p className="text-xl text-emerald-50/80 max-w-2xl mx-auto font-medium leading-relaxed">
                        Connecting Ethiopia's finest farmers with the world through technology and trust.
                    </p>
                </div>

                {/* Decorative Wave */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTTAsOTZMMzAsMTEyQzYwLDEyOCwxMjAsMTYwLDE4MCwxNjBDMjQwLDE2MCwzMDAsMTI4LDM2MCwxMTJDNDIwLDk2LDQ4MCw5Niw1NDAsMTI4QzYwMCwxNjAsNjYwLDE5Miw3MjAsMTkyQzc4MCwxOTIsODQwLDE2MCw5MDAsMTM4LjdDOTYwLDExNywxMDIwLDEwNywxMDgwLDExMkMxMTQwLDExNywxMjAwLDEzOSwxMjYwLDE2MEMxMzIwLDE4MSwxMzgwLDE5MiwxNDEwLDE5N0wxNDQwLDIwMkwxNDQwLDMyMEwxNDEwLDMyMEMxMzgwLDMyMCwxMzIwLDMyMCwxMjYwLDMyMEMxMjAwLDMyMCwxMTQwLDMyMCwxMDgwLDMyMEMxMDIwLDMyMCw5NjAsMzIwLDkwMCwzMjBDODQwLDMyMCw3ODAsMzIwLDcyMCwzMjBDNjYwLDMyMCw2MDAsMzIwLDU0MCwzMjBDNDgwLDMyMCw0MjAsMzIwLDM2MCwzMjBDMzAwLDMyMCwyNDAsMzIwLDE4MCwzMjBDMTIwLDMyMCw2MCwzMjAsMzAsMzIwTDAsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-repeat-x" />
            </section>

            {/* Our Story Section */}
            <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500 to-lime-500 rounded-[3rem] opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white bg-white">
                            <Image
                                src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1000"
                                alt="Ethopian Farmers"
                                width={800}
                                height={600}
                                className="object-cover hover:scale-105 transition-transform duration-700"
                            />
                        </div>
                        {/* Stats Overlay */}
                        <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-3xl shadow-2xl border border-emerald-50 hidden md:block">
                            <div className="flex gap-8">
                                <div>
                                    <div className="text-4xl font-black text-emerald-600">15+</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase">Years</div>
                                </div>
                                <div className="w-px h-12 bg-slate-100"></div>
                                <div>
                                    <div className="text-4xl font-black text-emerald-600">50k+</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase">Farmers</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm">
                            ABOUT US
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            Bridging the Gap Between <span className="text-emerald-600">Nature</span> and <span className="text-emerald-600">Innovation</span>.
                        </h2>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Founded in the heart of Ethiopia, አዲስ Harvest (Addis Harvest) started with a simple vision: to empower local farmers by providing them with a platform to showcase their premium organic crops to a global audience.
                        </p>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Today, we are more than just an e-commerce platform. We are a community-driven ecosystem that ensures fair pricing, sustainable practices, and the highest quality standards from the moment a seed is planted until the harvest reaches your doorstep.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            {[
                                { title: '100% Organic', desc: 'Certified natural products' },
                                { title: 'Fair Trade', desc: 'Supporting local communities' },
                                { title: 'Quality Check', desc: 'Multi-stage lab testing' },
                                { title: 'Direct Source', desc: 'No middleman costs' },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">✓</div>
                                    <div>
                                        <div className="font-bold text-slate-900">{item.title}</div>
                                        <div className="text-xs text-slate-500 font-medium">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="bg-emerald-900 py-24 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px]" />

                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our Core Values</h2>
                        <p className="text-emerald-100/60 max-w-xl mx-auto font-medium">The principles that guide every decision we make.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: '🌍', title: 'Sustainability', desc: 'Prioritizing eco-friendly farming and biodegradable packaging for a healthier planet.' },
                            { icon: '🤝', title: 'Integrity', desc: 'Building relationships based on transparency, honesty, and mutual respect with every farmer.' },
                            { icon: '⭐', title: 'Excellence', desc: 'Committed to delivering only the finest hand-picked products that meet international standards.' },
                        ].map((value) => (
                            <div key={value.title} className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2rem] hover:bg-white/10 transition-colors group">
                                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{value.icon}</div>
                                <h3 className="text-2xl font-black text-white mb-4">{value.title}</h3>
                                <p className="text-emerald-100/70 leading-relaxed font-medium">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team / Farmer Highlight */}
            <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="text-center mb-16">
                    <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-sm mb-4">
                        MEET OUR HEROES
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900">The People Behind the Harvest</h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { name: 'Abebe Bikila', role: 'Coffee Specialist', img: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400' },
                        { name: 'Fatuma Ahmed', role: 'Spice Expert', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400' },
                        { name: 'Samuel Tekle', role: 'Grains Manager', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400' },
                        { name: 'Martha Yohannes', role: 'Quality Assurance', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
                    ].map((member) => (
                        <div key={member.name} className="group cursor-default">
                            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 shadow-xl">
                                <Image
                                    src={member.img}
                                    alt={member.name}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">{member.name}</h3>
                            <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider">{member.role}</p>
                        </div>
                    ))}
                </div>
            </section>

        </>
    );
}
