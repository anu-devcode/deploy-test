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
        <div className="space-y-8">
            {/* Categories */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={category.id}
                                checked={currentCategoryId === category.id}
                                onChange={() => handleCategoryChange(category.id)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor={category.id} className="ml-2 text-gray-600 hover:text-gray-900 cursor-pointer">
                                {category.name}
                                {category._count && <span className="text-gray-400 text-sm ml-1">({category._count.products})</span>}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button
                        onClick={handlePriceApply}
                        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Apply Price
                    </button>
                </div>
            </div>
        </div>
    );
}
