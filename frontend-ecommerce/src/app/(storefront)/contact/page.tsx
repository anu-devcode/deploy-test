'use client';

import { useState } from "react";
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function ContactPage() {
    const socials = [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'Linkedin', icon: Linkedin, href: '#' },
    ];

    const [formState, setFormState] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Thank you for your message! Our team will get back to you shortly.');
        setFormState({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <>

            {/* Header section */}
            <section className="bg-emerald-900 pt-32 pb-48 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
                </div>
                <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-lime-400 font-bold text-sm mb-6 uppercase tracking-widest">
                        <span>✉️</span>
                        Get In Touch
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
                        We'd Love to <span className="text-lime-400">Hear</span> From You
                    </h1>
                    <p className="text-xl text-emerald-100/70 max-w-2xl mx-auto font-medium leading-relaxed">
                        Have questions about our products or want to partner with us? Reach out and let's start a conversation.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-24 relative z-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: '📍', title: 'Our Office', content: 'Tsega Building, Bole Road, Addis Ababa', action: 'View on Maps' },
                        { icon: '📞', title: 'Phone Support', content: '+251 987 654 321', action: 'Call Now' },
                        { icon: '📧', title: 'Email Us', content: 'contact@tsegatrading.com', action: 'Send Email' },
                    ].map((card) => (
                        <div key={card.title} className="bg-white rounded-[2rem] p-10 shadow-2xl shadow-emerald-900/10 border border-emerald-50 hover:-translate-y-2 transition-transform group text-center">
                            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center text-4xl mb-6 mx-auto group-hover:scale-110 group-hover:bg-emerald-600 transition-all duration-300">
                                {card.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">{card.title}</h3>
                            <p className="text-slate-600 font-medium mb-6 leading-relaxed">{card.content}</p>
                            <button className="text-emerald-600 font-black text-sm uppercase tracking-wider hover:text-emerald-700 transition-colors">
                                {card.action} →
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Form and Map */}
            <section className="py-24 max-w-[1400px] mx-auto px-6 lg:px-12">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-900/5 border border-slate-100 overflow-hidden">
                    <div className="grid lg:grid-cols-2">
                        {/* Form */}
                        <div className="p-10 lg:p-20">
                            <h2 className="text-4xl font-black text-slate-900 mb-10">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Your Name"
                                            value={formState.name}
                                            onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            placeholder="your@email.com"
                                            value={formState.email}
                                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="How can we help?"
                                        value={formState.subject}
                                        onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Message</label>
                                    <textarea
                                        rows={5}
                                        required
                                        placeholder="Tell us more about your inquiry..."
                                        value={formState.message}
                                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-900 resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 text-gray-500 font-black text-lg shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Visual / Info Section */}
                        <div className="bg-emerald-900 p-10 lg:p-20 relative overflow-hidden flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-[100px]" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />

                            <div className="relative z-10 space-y-12">
                                <div>
                                    <h3 className="text-3xl font-black text-white mb-6">Connect with Us</h3>
                                    <p className="text-emerald-100/70 text-lg font-medium leading-relaxed mb-8">
                                        Whether you are a local partner looking for sourcing opportunities or an international buyer interested in Tsega's premium harvests, our dedicated team is here to assist you.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">📅</div>
                                        <div>
                                            <div className="text-white font-bold text-lg">Work Hours</div>
                                            <div className="text-emerald-100/60 font-medium">Monday - Friday: 8:00 AM - 6:00 PM</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🌍</div>
                                        <div>
                                            <div className="text-white font-bold text-lg">Global Shipping</div>
                                            <div className="text-emerald-100/60 font-medium">Available to over 50 countries</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl">🌱</div>
                                        <div>
                                            <div className="text-white font-bold text-lg">Farmer Support</div>
                                            <div className="text-emerald-100/60 font-medium">24/7 technical assistance for registered farmers</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex gap-4 pt-8 border-t border-white/10">
                                    {socials.map((social) => (
                                        <button key={social.name} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black hover:bg-emerald-600 hover:border-emerald-500 transition-all">
                                            <social.icon className="w-6 h-6" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}
