'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
    const categories = ['Cereals', 'Legumes', 'Oil Seeds', 'Coffee', 'Spices'];
    const socials = [
        { name: 'Facebook', icon: Facebook, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'Linkedin', icon: Linkedin, href: '#' },
    ];

    return (
        <footer className="relative overflow-hidden bg-emerald-950 text-white">
            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 pb-12">
                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20 pb-16 border-b border-white/10">
                    <div className="text-center">
                        <div className="text-4xl mb-3">🚚</div>
                        <h4 className="font-bold text-white mb-1">Free Shipping</h4>
                        <p className="text-sm text-slate-400">On orders over 10,000 ETB</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-3">🔒</div>
                        <h4 className="font-bold text-white mb-1">Secure Payment</h4>
                        <p className="text-sm text-slate-400">100% protected</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-3">↩️</div>
                        <h4 className="font-bold text-white mb-1">Easy Returns</h4>
                        <p className="text-sm text-slate-400">30-day guarantee</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl mb-3">💬</div>
                        <h4 className="font-bold text-white mb-1">24/7 Support</h4>
                        <p className="text-sm text-slate-400">Always here to help</p>
                    </div>
                </div>

                {/* Top Section */}
                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-1 space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="flex text-3xl items-center">
                                <span className="text-green-500 font-semibold">አዲስ</span>
                                <span className="text-lime-400 font-bold ml-1">Harvest</span>
                            </div>
                        </Link>
                        <p className="text-slate-300 leading-relaxed font-medium">
                            Your trusted platform for premium agricultural products. From farm to table, we deliver excellence across Ethiopia.
                        </p>
                        <div className="flex gap-3">
                            {socials.map((social) => (
                                <button key={social.name} className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 transition-all duration-300 flex items-center justify-center">
                                    <span className="sr-only">{social.name}</span>
                                    <social.icon className="w-5 h-5 opacity-70" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-black mb-6 text-emerald-300">Company</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium">About Us</Link></li>
                            <li><Link href="/contact" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium">Contact Us</Link></li>
                            <li><Link href="/careers" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium">Careers</Link></li>
                            <li><Link href="/blog" className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-black mb-6 text-emerald-300">Shop</h4>
                        <ul className="space-y-3">
                            {categories.map(cat => (
                                <li key={cat}>
                                    <Link href={`/products?category=${cat}`} className="text-slate-300 hover:text-white hover:translate-x-1 inline-block transition-all duration-200 font-medium">
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-black mb-6 text-emerald-300">Stay Updated</h4>
                        <p className="text-slate-300 mb-4 font-medium">Get exclusive offers and agricultural updates</p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white/20 transition-all font-medium"
                            />
                            <button className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 font-bold hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="pt-8 border-t border-white/10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <p className="text-slate-400 font-medium text-center md:text-left text-sm">
                            © {new Date().getFullYear()} <span className="font-bold text-white">Brolf Ecommerce</span> | <a href="http://brolf.tech" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">Brolf Tech</a>. All rights reserved. Made with 💚 in Ethiopia
                        </p>
                        <div className="flex flex-wrap gap-6 justify-center">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                                <Link key={item} href="#" className="text-slate-400 hover:text-emerald-400 transition-colors font-medium text-xs font-medium">
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
