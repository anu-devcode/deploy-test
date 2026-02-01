'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, ChevronRight, ShoppingBag, ArrowRight, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { Product } from '@/lib/api';

export function SearchComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
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

    // Debounce logic if hook doesn't exist
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
            setResults([]);
        }
    }, [debouncedQuery]);

    const handleSearch = async (term: string) => {
        setLoading(true);
        try {
            const data = await api.searchProducts(term);
            setResults(data.products || []);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSearch = () => {
        if (!isOpen) {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            // Only close if empty, or force close
            if (!query) setIsOpen(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setQuery('');
        }
        if (e.key === 'Enter' && query) {
            saveSearch(query);
            router.push(`/shop?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                if (isOpen) {
                    setIsOpen(false);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    return (
        <div ref={containerRef} className={`relative flex items-center transition-all duration-500 ease-in-out z-20 ${isOpen ? 'w-48 sm:w-64 md:w-[400px]' : 'w-10'}`}>
            <div className={`absolute inset-0 bg-white/90 backdrop-blur-md border border-slate-200 rounded-full transition-all duration-500 ${isOpen ? 'opacity-100 shadow-xl shadow-indigo-500/10 scale-100' : 'opacity-0 scale-90'}`}></div>

            {/* Input Field */}
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search products..."
                className={`w-full bg-transparent h-10 md:h-12 pl-12 pr-10 rounded-full outline-none text-sm md:text-base text-slate-800 placeholder:text-slate-400 font-medium transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none w-0'}`}
            />

            {/* Icon Button */}
            <button
                onClick={toggleSearch}
                className={`absolute left-0 top-0 h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-full transition-all duration-500 z-10 ${isOpen ? 'text-indigo-600' : 'text-slate-500 md:text-slate-600 hover:text-indigo-600'}`}
            >
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Search className="w-5 h-5" />
                )}
            </button>

            {/* Clear Button */}
            {query && (
                <button
                    onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}

            {/* Predictive Results Dropdown */}
            {isOpen && (
                <div className={`absolute top-full mt-4 -right-16 md:right-auto md:left-0 w-[85vw] md:w-[140%] md:-ml-[20%] bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-2xl shadow-slate-200/50 rounded-[2rem] overflow-hidden p-2 z-[60] flex flex-col transition-all duration-300 ${query.length > 1 || results.length > 0 || (query.length === 0 && recentSearches.length > 0) ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-4 opacity-0 pointer-events-none'}`}>

                    {/* RECENT SEARCHES PANEL */}
                    {query.length === 0 && recentSearches.length > 0 && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center justify-between px-5 py-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recent Searches</span>
                                <button onClick={clearHistory} className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-wider">Clear</button>
                            </div>
                            <div className="flex flex-col gap-1">
                                {recentSearches.map((term, i) => (
                                    <button
                                        key={term}
                                        onClick={() => { setQuery(term); handleSearch(term); }}
                                        className="group flex items-center gap-3 px-5 py-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <History className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                        <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 flex-1 truncate">{term}</span>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 -rotate-45" />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* PREDICTIVE RESULTS PANEL */}
                    {(query.length > 1 || results.length > 0) && (
                        results.length > 0 ? (
                            <>
                                <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Suggested Products
                                </div>
                                <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.slug}`}
                                            onClick={() => { saveSearch(query); setIsOpen(false); }}
                                            className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-white hover:shadow-lg hover:shadow-indigo-500/5 transition-all border border-transparent hover:border-slate-100"
                                        >
                                            <div className="relative w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                                                {product.images && product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ShoppingBag className="w-5 h-5 text-slate-300" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors text-sm">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs font-medium text-slate-500">{product.category?.name || 'Product'}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                    <span className="text-xs font-bold text-emerald-600">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                        </Link>
                                    ))}
                                </div>
                                <div className="p-2 mt-2 border-t border-slate-100">
                                    <Link
                                        href={`/shop?search=${encodeURIComponent(query)}`}
                                        onClick={() => { saveSearch(query); setIsOpen(false); }}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        View all results
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </>
                        ) : (
                            loading ? (
                                <div className="p-8 text-center">
                                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500 mx-auto mb-2" />
                                </div>
                            ) : (
                                <div className="p-8 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Search className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <p className="text-sm font-bold text-slate-600">No results found</p>
                                    <p className="text-xs text-slate-400 mt-1">Try searching for generic terms like "Wheat" or "Corn"</p>
                                </div>
                            )
                        )
                    )}
                </div>
            )}
        </div>
    );
}
