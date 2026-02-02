'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api, Product, Category, Promotion } from '@/lib/api';
import { ProductCard } from '@/components/products/ProductCard';
import { Search, ShoppingBag, ArrowRight, Tag, BookOpen, Gift, History, User, Store, ChevronRight } from 'lucide-react';

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<{
        products: Product[],
        categories: Category[],
        pages: any[],
        promotions: Promotion[]
    }>({ products: [], categories: [], pages: [], promotions: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const data = await api.globalSearch(query);
                setResults({
                    products: data.products || [],
                    categories: data.categories || [],
                    pages: data.pages || [],
                    promotions: data.promotions || []
                });
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const QUICK_ACTIONS = [
        { name: 'Track My Order', href: '/track-order', description: 'Monitor your shipment status', icon: History },
        { name: 'My Profile', href: '/profile', description: 'Manage account and security', icon: User },
        { name: 'Shop Everything', href: '/shop', description: 'Browse full catalog', icon: ShoppingBag },
        { name: 'Contact Support', href: '/contact', description: 'Get help with your orders', icon: ArrowRight },
        { name: 'Admin Dashboard', href: '/admin', description: 'Management portal', icon: Store },
    ].filter(a => a.name.toLowerCase().includes(query.toLowerCase()));

    const totalResults = (results.products?.length || 0) +
        (results.categories?.length || 0) +
        (results.pages?.length || 0) +
        (results.promotions?.length || 0) +
        QUICK_ACTIONS.length;

    if (!query) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                    <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-4">Start Searching</h1>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Enter a keyword to explore the entire platform</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 md:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-20">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">
                        <Link href="/" className="hover:text-emerald-700 transition-colors">Home</Link>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-slate-900">Global Search</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4">
                                Search Results
                            </h1>
                            <div className="flex items-center gap-4">
                                <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-black text-xs uppercase">
                                    "{query}"
                                </span>
                                <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                                    {totalResults} items identified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-4">
                                <div className="h-8 w-48 bg-slate-200 rounded-full animate-pulse"></div>
                                <div className="h-64 bg-slate-200 rounded-[2.5rem] animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                ) : totalResults === 0 ? (
                    <div className="text-center py-40 bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                        <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                            <Search className="w-10 h-10 text-rose-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-4">No Matches Found</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">
                            Try searching for generic terms like 'help', 'track', or 'product'
                        </p>
                    </div>
                ) : (
                    <div className="space-y-24">
                        {/* QUICK ACTIONS SECTION */}
                        {QUICK_ACTIONS.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-8 px-2 flex items-center gap-3">
                                    Command Center Actions
                                    <div className="h-px flex-1 bg-emerald-100"></div>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {QUICK_ACTIONS.map(action => (
                                        <Link key={action.name} href={action.href} className="group flex items-center gap-6 p-6 bg-white hover:bg-emerald-600 rounded-[2rem] border border-slate-100 transition-all duration-500 shadow-xl shadow-slate-200/20 hover:shadow-emerald-200/50 hover:-translate-y-2">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
                                                <action.icon className="w-7 h-7" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black text-slate-900 group-hover:text-white transition-colors">{action.name}</span>
                                                <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-100 transition-colors uppercase tracking-wider">{action.description}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PROMOTIONS SECTION */}
                        {results.promotions.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-8 px-2 flex items-center gap-3">
                                    Active Offers & Coupons
                                    <div className="h-px flex-1 bg-amber-100"></div>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {results.promotions.map(promo => (
                                        <div key={promo.id} className="relative overflow-hidden bg-white border-2 border-dashed border-amber-200 rounded-[2.5rem] p-10 flex items-center justify-between group shadow-xl shadow-amber-900/5 hover:-translate-y-1 transition-all duration-500">
                                            <div className="relative z-10">
                                                <h4 className="text-2xl font-black text-slate-900 mb-2">{promo.name}</h4>
                                                <p className="text-slate-500 font-bold text-sm mb-6 max-w-xs">{promo.description}</p>
                                                <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 rounded-2xl border border-amber-100 text-amber-700 font-black text-xs uppercase tracking-[0.2em]">
                                                    CODE: {promo.code}
                                                </div>
                                            </div>
                                            <div className="text-right relative z-10">
                                                <span className="text-5xl md:text-7xl font-black text-amber-600 tracking-tighter block mb-2">
                                                    {promo.type === 'PERCENTAGE' ? `${promo.value}%` : `$${promo.value}`}
                                                </span>
                                                <span className="text-xs font-black text-amber-800 uppercase tracking-widest italic">OFF DISCOUNT</span>
                                            </div>
                                            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700"></div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* CATEGORIES SECTION */}
                        {results.categories.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2 flex items-center gap-3">
                                    Information Architecture
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                </h3>
                                <div className="flex flex-wrap gap-4 px-2">
                                    {results.categories.map(cat => (
                                        <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="px-10 py-5 bg-white hover:bg-slate-900 border border-slate-100 hover:border-slate-900 rounded-full shadow-lg shadow-slate-200/50 hover:shadow-slate-400/50 transition-all duration-500 group">
                                            <span className="text-lg font-black text-slate-900 group-hover:text-white uppercase tracking-tighter italic"># {cat.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PRODUCTS SECTION */}
                        {results.products.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2 flex items-center gap-3">
                                    Identified Products
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                    {results.products.map(product => (
                                        <div key={product.id} className="scale-95 hover:scale-100 transition-transform duration-500">
                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* PAGES SECTION */}
                        {results.pages.length > 0 && (
                            <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-400">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 px-2 flex items-center gap-3">
                                    Knowledge Base & Guides
                                    <div className="h-px flex-1 bg-slate-100"></div>
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {results.pages.map(page => (
                                        <Link key={page.id} href={`/pages/${page.slug}`} className="p-8 bg-white hover:bg-slate-50 border border-slate-100 rounded-[2.5rem] transition-all group relative overflow-hidden flex flex-col items-start shadow-xl shadow-slate-200/20">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 mb-6 transition-colors">
                                                <BookOpen className="w-6 h-6" />
                                            </div>
                                            <h4 className="text-xl font-black text-slate-900 mb-3">{page.title}</h4>
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 mt-auto">
                                                Read Article <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SearchResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
            <SearchResultsContent />
        </Suspense>
    );
}
