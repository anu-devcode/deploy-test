'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, ChevronRight, ShoppingBag, ArrowRight, History, User, Store } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { Product } from '@/lib/api';

export function SearchComponent({ onToggle }: { onToggle?: (isOpen: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [globalResults, setGlobalResults] = useState<{ products: Product[], categories: any[], pages: any[] }>({ products: [], categories: [], pages: [] });
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('recentSearches');
        if (stored) {
            setRecentSearches(JSON.parse(stored));
        }
        // Fetch top categories for quick links
        api.getCategories().then(data => {
            // Take top 4-6 categories
            setCategories(data.slice(0, 6));
        }).catch(err => console.error('Failed to fetch categories', err));
    }, []);

    const saveSearch = (term: string) => {
        if (!term.trim()) return;
        const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    const clearHistory = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    // Debounce logic
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(handler);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.trim().length > 1) {
            handleSearch(debouncedQuery);
        } else {
            setGlobalResults({ products: [], categories: [], pages: [] });
        }
    }, [debouncedQuery]);

    const handleSearch = async (term: string) => {
        setLoading(true);
        try {
            const data = await api.globalSearch(term);
            setGlobalResults(data);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    const closeSearch = () => {
        setIsOpen(false);
        onToggle?.(false);
        setQuery('');
        setGlobalResults({ products: [], categories: [], pages: [] });
    };

    const toggleSearch = () => {
        if (!isOpen) {
            setIsOpen(true);
            onToggle?.(true);
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            // If there's text, clear it first, then if clicked again, close
            if (query) {
                setQuery('');
                inputRef.current?.focus();
            } else {
                setIsOpen(false);
                onToggle?.(false);
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            closeSearch();
        }
        if (e.key === 'Enter' && query) {
            saveSearch(query);
            router.push(`/search?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setIsOpen(false);
                    onToggle?.(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onToggle]);

    const QUICK_ACTIONS = [
        { name: 'Track My Order', href: '/track-order', description: 'Monitor your shipment status', icon: History },
        { name: 'My Profile', href: '/profile', description: 'Manage account and security', icon: User },
        { name: 'Shop Everything', href: '/shop', description: 'Browse full catalog', icon: ShoppingBag },
        { name: 'Contact Support', href: '/contact', description: 'Get help with your orders', icon: ArrowRight },
        { name: 'Admin Dashboard', href: '/admin', description: 'Management portal', icon: Store, roles: ['ADMIN', 'SUPERADMIN', 'STAFF'] },
        { name: 'View Wishlist', href: '/wishlist', description: 'Your saved items', icon: ChevronRight },
    ];

    const hasResults = globalResults.products.length > 0 ||
        globalResults.categories.length > 0 ||
        globalResults.pages.length > 0 ||
        (globalResults as any).promotions?.length > 0;

    const filteredActions = QUICK_ACTIONS.filter(action =>
        action.name.toLowerCase().includes(query.toLowerCase()) ||
        action.description.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div ref={containerRef} className={`relative flex items-center transition-all duration-700 ease-in-out z-20 ${isOpen ? 'w-full md:w-auto md:flex-1 md:max-w-[800px]' : 'w-10'}`}>
            <div className={`absolute inset-0 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-full transition-all duration-500 ${isOpen ? 'opacity-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] scale-100' : 'opacity-0 scale-90'}`}></div>

            {/* Input Field */}
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to find anything..."
                className={`relative z-10 w-full bg-transparent h-10 md:h-12 pl-12 pr-10 rounded-full outline-none text-sm md:text-base font-bold transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto text-slate-900 placeholder:text-slate-400 caret-emerald-600' : 'opacity-0 pointer-events-none w-0'}`}
                style={{ color: '#0f172a' }}
            />

            {/* Icon Button */}
            <button
                onClick={toggleSearch}
                className={`absolute left-0 top-0 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full transition-all duration-500 z-20 ${isOpen ? 'text-emerald-600' : 'text-slate-500 md:text-slate-600 hover:text-emerald-600'}`}
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Search className="w-5 h-5" />
                )}
            </button>

            {/* Close / Clear Button */}
            {isOpen && (
                <button
                    onClick={() => {
                        if (query) {
                            setQuery('');
                            inputRef.current?.focus();
                        } else {
                            closeSearch();
                        }
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all z-20"
                >
                    <X className={`w-4 h-4 transition-transform duration-300 ${query ? 'rotate-0' : 'rotate-90'}`} />
                </button>
            )}

            {/* Unified Command center Dropdown */}
            {isOpen && (
                <div className={`absolute top-full mt-4 left-[-1rem] w-[95vw] md:left-0 md:w-[120%] md:-ml-[10%] bg-white/98 backdrop-blur-2xl border border-emerald-100/50 shadow-2xl shadow-emerald-900/10 rounded-[2.5rem] overflow-hidden p-2 z-[60] flex flex-col transition-all duration-300 translate-y-0 opacity-100 pointer-events-auto`}>

                    {/* RECENT SEARCHES PANEL (Shown when query is empty) */}
                    {query.length === 0 && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between px-6 py-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">Site Nav & Commands</span>
                                {recentSearches.length > 0 && <button onClick={clearHistory} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider">Clear</button>}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-3 pb-4">
                                {QUICK_ACTIONS.map((action, i) => (
                                    <Link
                                        key={action.name}
                                        href={action.href}
                                        onClick={closeSearch}
                                        className="group flex items-center gap-4 p-4 hover:bg-emerald-50 rounded-2xl transition-all border border-transparent hover:border-emerald-100"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                            <action.icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex flex-col text-left">
                                            <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">{action.name}</span>
                                            <span className="text-[9px] font-bold text-slate-400">{action.description}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* RECENT TERMS */}
                            {recentSearches.length > 0 && (
                                <div className="border-t border-slate-100 mt-2 pt-2">
                                    <div className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Enquiries</div>
                                    <div className="flex flex-wrap gap-2 px-6 pb-4">
                                        {recentSearches.map((term) => (
                                            <button key={term} onClick={() => { setQuery(term); handleSearch(term); }} className="px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-full text-xs font-bold text-slate-600 transition-all">
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* GLOBAL RESULTS PANEL */}
                    {query.length > 0 && (
                        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar p-2">
                            {/* QUICK ACTIONS MATCHING */}
                            {filteredActions.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-600">Quick Actions</div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 px-2">
                                        {filteredActions.map(action => (
                                            <Link key={action.name} href={action.href} onClick={closeSearch} className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-2xl transition-all group border border-transparent hover:border-emerald-100">
                                                <action.icon className="w-4 h-4 text-emerald-600" />
                                                <span className="text-sm font-bold text-slate-700 group-hover:text-emerald-700">{action.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PROMOTIONS RESULTS */}
                            {(globalResults as any).promotions?.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-amber-600">Active Offers</div>
                                    <div className="flex flex-col gap-1 px-2">
                                        {(globalResults as any).promotions.map((promo: any) => (
                                            <div key={promo.id} className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100 border-dashed">
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-black uppercase text-amber-900">{promo.name}</span>
                                                    <span className="text-[10px] font-bold text-amber-700">Code: <span className="bg-white px-1.5 py-0.5 rounded border border-amber-200">{promo.code}</span></span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-lg font-black text-amber-600">{promo.type === 'PERCENTAGE' ? `${promo.value}%` : `$${promo.value}`} OFF</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CATEGORIES RESULTS */}
                            {globalResults.categories.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Categories</div>
                                    <div className="flex flex-col gap-1 px-2">
                                        {globalResults.categories.map(cat => (
                                            <Link key={cat.id} href={`/shop?category=${cat.slug}`} onClick={() => setIsOpen(false)} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all group border border-transparent hover:border-slate-100">
                                                <span className="text-sm font-bold text-slate-700 uppercase italic"># {cat.name}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-emerald-500 -rotate-45" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PRODUCTS RESULTS */}
                            {globalResults.products.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Products</div>
                                    <div className="flex flex-col gap-1 px-2">
                                        {globalResults.products.map(product => (
                                            <Link key={product.id} href={`/products/${product.slug}`} onClick={() => { saveSearch(query); setIsOpen(false); }} className="group flex items-center gap-4 p-3 rounded-[1.5rem] hover:bg-white hover:border-slate-100 hover:shadow-xl transition-all border border-transparent">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center overflow-hidden shrink-0">
                                                    {product.images?.[0] ? <img src={product.images[0]} alt="" className="w-full h-full object-cover" /> : <ShoppingBag className="w-5 h-5 text-slate-300" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-bold text-slate-800 truncate group-hover:text-emerald-600 text-sm">{product.name}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-slate-900">${product.price}</span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.category?.name}</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PAGES RESULTS */}
                            {globalResults.pages.length > 0 && (
                                <div className="mb-4">
                                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Support & Content</div>
                                    <div className="flex flex-col gap-1 px-2">
                                        {globalResults.pages.map(page => (
                                            <Link key={page.id} href={`/pages/${page.slug}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 rounded-2xl transition-all group">
                                                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors"><Search className="w-4 h-4" /></div>
                                                <span className="text-sm font-bold text-slate-700 flex-1">{page.title}</span>
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!hasResults && !filteredActions.length && !loading && (
                                <div className="p-16 text-center animate-in fade-in slide-in-from-bottom-4">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-5 border border-slate-100 shadow-inner">
                                        <X className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-800 tracking-tight">Zero Matches</h3>
                                    <p className="text-xs text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Try 'Track' for utilities or 'Help' for FAQs</p>
                                </div>
                            )}

                            <div className="p-3 mt-4 border-t border-slate-100">
                                <Link href={`/search?q=${encodeURIComponent(query)}`} onClick={() => { saveSearch(query); setIsOpen(false); }} className="flex items-center justify-center gap-3 w-full py-4 bg-slate-950 text-white rounded-2.5xl text-[11px] font-black uppercase tracking-[0.3em] hover:bg-emerald-700 transition-all shadow-xl shadow-slate-200">
                                    Enter Command Console
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
