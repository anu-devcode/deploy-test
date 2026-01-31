'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { useCart } from '@/context';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { itemCount, toggleCart } = useCart();
    const { isAuthenticated, user } = useAuth();
    const pathname = usePathname();
    const isLandingPage = pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial state
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Logic:
    // 1. Landing Page: Transparent/White Text at top -> White Pill/Dark Text on scroll
    // 2. Internal Page: Transparent/Dark Text at top -> White Pill/Dark Text on scroll

    const showPill = isScrolled;
    const isDarkText = isScrolled || !isLandingPage;

    const navLinks = [
        { name: 'Products', href: '/#products' },
        { name: 'Categories', href: '/#categories' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-4 md:px-6 ${showPill ? 'py-2 md:py-4' : 'py-4 md:py-10'
                    }`}
            >
                <div className={`max-w-[1400px] mx-auto transition-all duration-700 ${showPill
                    ? 'px-4 md:px-8 py-2 md:py-4 rounded-2xl md:rounded-[2.5rem] bg-white/80 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(2,44,34,0.15)] border border-emerald-100/50 scale-[0.98]'
                    : 'px-4 md:px-6 py-0 bg-transparent border-transparent scale-100'
                    }`}>
                    <div className="flex items-center justify-between">
                        {/* Master Logo Logic */}
                        <Link href="/" className="group flex items-center gap-3 md:gap-5 hover:opacity-100 transition-all duration-500">
                            <div className="relative shrink-0">
                                <div className="absolute -inset-4 bg-emerald-500/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 opacity-0 group-hover:opacity-100"></div>
                                <div className={`relative w-0 h-0 md:w-0 md:h-0 bg-gradient-to-br from-emerald-600 to-green-700 rounded-lg md:rounded-[1.2rem] flex items-center justify-center font-black text-7xl md:text-7xl shadow-xl group-hover:-rotate-[-50deg] transition-transform duration-700 border border-white/20 ${isDarkText ? 'text-green-800' : 'text-white'
                                    }`}>
                                    አ
                                </div>
                            </div>
                            <div className="flex flex-col -space-y-1 md:-space-y-2">
                                <span className={`text-3xl md:text-[3.5rem] font-black tracking-tighter uppercase transition-all duration-700 ${isDarkText ? 'text-green-800' : 'text-white'
                                    }`}>ዲስ</span>
                                <span className={`text-[8px] md:text-[14px] font-black tracking-[0.3em] md:tracking-[0.5em] uppercase transition-all duration-700 ${isDarkText ? 'text-emerald-600' : 'text-emerald-300'
                                    }`}>Harvest</span>
                            </div>
                        </Link>

                        {/* Navigation - Ultra Minimalist till Interaction */}
                        <nav className="hidden lg:flex items-center gap-16">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`relative group text-[11px] font-black tracking-[0.4em] uppercase transition-all duration-700 ${isDarkText ? 'text-slate-700 hover:text-emerald-700' : 'text-white/80 hover:text-white'
                                        }`}
                                >
                                    <span className="relative z-10 px-2">{item.name}</span>
                                    <span className="absolute inset-x-0 bottom-0 h-0 group-hover:h-full bg-emerald-500/5 -z-0 transition-all duration-300 rounded-lg"></span>
                                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-1 bg-emerald-500 rounded-full transition-all duration-700 group-hover:w-full opacity-0 group-hover:opacity-100 blur-[0.5px]" />
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2 sm:gap-6 md:gap-10">
                            {/* Search */}
                            <button className={`relative p-2 md:p-4 rounded-full transition-all duration-700 group ${isDarkText
                                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                : 'bg-white/5 text-white hover:bg-white/10'
                                }`}>
                                <Search className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-125 transition-transform" />
                                <span className="absolute inset-0 rounded-full border border-current opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700"></span>
                            </button>

                            {/* Account - Desktop Only */}
                            <Link
                                href={isAuthenticated ? '/profile' : '/login'}
                                className={`hidden md:flex relative p-2 md:p-4 rounded-full transition-all duration-700 group ${isDarkText
                                    ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                                    : 'bg-white/5 text-white hover:bg-white/10'
                                    }`}
                            >
                                <User className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-125 transition-transform" />
                                <span className="absolute inset-0 rounded-full border border-current opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-700"></span>
                            </Link>

                            {/* Cart */}
                            <button
                                onClick={toggleCart}
                                className={`relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 lg:w-40 lg:h-14 rounded-full font-black text-[11px] tracking-[0.3em] uppercase transition-all duration-700 active:scale-90 ${isDarkText
                                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30'
                                    : 'bg-white text-slate-950 shadow-2xl hover:bg-emerald-50'
                                    }`}
                            >
                                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 lg:mr-3" />
                                <span className="hidden lg:inline">Cart</span>
                                <span className={`absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-black border-2 ${isDarkText ? 'bg-amber-500 text-slate-950 border-white' : 'bg-emerald-500 text-white border-[#01110e]'
                                    }`}>
                                    {itemCount}
                                </span>
                            </button>

                            {/* Mobile Logic */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`lg:hidden p-2 md:p-4 rounded-full transition-all duration-700 ${isDarkText
                                    ? 'bg-slate-100 text-slate-700'
                                    : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                            >
                                {isMobileMenuOpen ? <X className="w-5 h-5 md:w-6 md:h-6" /> : <Menu className="w-5 h-5 md:w-6 md:h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Experience Upgrade */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-500">
                        <div className="absolute inset-0 bg-[#01110e]/95 backdrop-blur-3xl" onClick={() => setIsMobileMenuOpen(false)} />
                        <nav className="relative h-full flex flex-col items-center justify-center gap-8 md:gap-12 p-8">
                            <div className="mb-8">
                                <span className="text-emerald-500 font-black text-6xl">አ</span>
                            </div>
                            {navLinks.map((item, i) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl md:text-5xl font-black text-white hover:text-emerald-500 transition-all tracking-[0.2em] uppercase text-center animate-in slide-in-from-bottom-10"
                                    style={{ animationDelay: `${i * 100}ms` }}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {/* Mobile Account Link */}
                            <Link
                                href={isAuthenticated ? '/profile' : '/login'}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl md:text-5xl font-black text-white hover:text-emerald-500 transition-all tracking-[0.2em] uppercase text-center animate-in slide-in-from-bottom-10"
                                style={{ animationDelay: `${navLinks.length * 100}ms` }}
                            >
                                {isAuthenticated ? 'My Account' : 'Sign In'}
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="mt-8 md:mt-12 w-16 h-16 md:w-20 md:h-20 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/10"
                            >
                                <X className="w-6 h-6 md:w-8 md:h-8" />
                            </button>
                        </nav>
                    </div>
                )}
            </header>

            {/* Navbar Spacer for Internal Pages */}
            {!isLandingPage && <div className="h-20 md:h-28 w-full" />}
        </>
    );
}
