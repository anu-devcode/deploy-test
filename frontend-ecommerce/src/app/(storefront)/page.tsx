'use client';

import { useState } from 'react';
import { seedProducts, tenants } from "@/lib/mock-data";
import { FilterSection, Testimonials, ProductsSection, HowItWorks, BrandShowcase, HarvestStory } from "@/components/home";
import type { Product } from "@/types";
import { Hero } from '@/components/home/Hero';

import { PromotionBanner } from '@/components/storefront/PromotionBanner';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

    // Get all products
    const allProducts: Product[] = seedProducts;

    // Filter products
    const filteredProducts = allProducts.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || p.category === selectedCategory;

        const tenant = tenants.find(t => t.id === p.tenantId);
        const matchesIndustry = !selectedIndustry || tenant?.industry === selectedIndustry;

        return matchesSearch && matchesCategory && matchesIndustry;
    });

    // Get unique categories and industries
    const categories = Array.from(new Set(allProducts.map((p) => p.category)));

    // Format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'ETB',
            minimumFractionDigits: 0,
        }).format(price / 100);
    };

    return (
        <div className="bg-slate-50 transition-colors duration-500">
            <PromotionBanner />
            <Hero
                allProducts={allProducts}
                tenants={tenants}
            />

            <div id="impact">
                <HarvestStory />
            </div>

            <FilterSection
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
            />

            <ProductsSection
                filteredProducts={filteredProducts}
                allProducts={allProducts}
                tenants={tenants}
                setSearchQuery={setSearchQuery}
                setSelectedCategory={setSelectedCategory}
                setSelectedIndustry={setSelectedIndustry}
                formatPrice={formatPrice}
            />

            <BrandShowcase tenants={tenants} />

            <HowItWorks />

            <Testimonials />
        </div>
    );
}
