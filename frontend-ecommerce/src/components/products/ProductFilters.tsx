'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/api';

interface ProductFiltersProps {
    categories: Category[];
}

export function ProductFilters({ categories }: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for filters to avoid rapid URL updates
    const [priceRange, setPriceRange] = useState({
        min: searchParams.get('minPrice') || '',
        max: searchParams.get('maxPrice') || ''
    });

    const currentCategoryId = searchParams.get('categoryId');

    const handleCategoryChange = (categoryId: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (categoryId === currentCategoryId) {
            params.delete('categoryId');
        } else {
            params.set('categoryId', categoryId);
        }
        params.delete('page'); // Reset to page 1
        router.push(`/products?${params.toString()}`);
    };

    const handlePriceApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        if (priceRange.min) params.set('minPrice', priceRange.min);
        else params.delete('minPrice');

        if (priceRange.max) params.set('maxPrice', priceRange.max);
        else params.delete('maxPrice');

        params.delete('page');
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="space-y-10">
            {/* Categories */}
            <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Categories</h3>
                <div className="space-y-3">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center group">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    id={category.id}
                                    checked={currentCategoryId === category.id}
                                    onChange={() => handleCategoryChange(category.id)}
                                    className="peer w-5 h-5 opacity-0 absolute cursor-pointer"
                                />
                                <div className={`w-5 h-5 rounded-lg border-2 transition-all flex items-center justify-center ${currentCategoryId === category.id
                                        ? 'bg-emerald-600 border-emerald-600'
                                        : 'border-slate-200 group-hover:border-emerald-300'
                                    }`}>
                                    {currentCategoryId === category.id && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    )}
                                </div>
                            </div>
                            <label
                                htmlFor={category.id}
                                className={`ml-3 text-sm font-bold cursor-pointer transition-colors ${currentCategoryId === category.id ? 'text-emerald-700' : 'text-slate-500 group-hover:text-slate-900'
                                    }`}
                            >
                                {category.name}
                                {category._count && <span className="text-slate-400 text-xs ml-2">({category._count.products})</span>}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Price Range</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Min</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Max</label>
                            <input
                                type="number"
                                placeholder="Any"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-sm"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handlePriceApply}
                        className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                    >
                        Apply Filters
                    </button>
                    {(priceRange.min || priceRange.max) && (
                        <button
                            onClick={() => {
                                setPriceRange({ min: '', max: '' });
                                const params = new URLSearchParams(searchParams.toString());
                                params.delete('minPrice');
                                params.delete('maxPrice');
                                router.push(`/products?${params.toString()}`);
                            }}
                            className="w-full text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-all text-center"
                        >
                            Reset Price
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
