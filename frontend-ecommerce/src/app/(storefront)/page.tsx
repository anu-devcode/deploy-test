'use client';

import { useState, useEffect } from 'react';
import { api } from "@/lib/api";
import { FilterSection, Testimonials, ProductsSection, HowItWorks, BrandShowcase, HarvestStory } from "@/components/home";
import type { Product } from "@/types";
import { Hero } from '@/components/home/Hero';
import { useSocket } from '@/context';


export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                const data = await api.getProducts();
                // Handle both flat array and paginated response just in case
                const products = Array.isArray(data) ? data : (data as any).products || [];
                setAllProducts(products);
            } catch (err) {
                console.error("Failed to load products", err);
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, []);

    const { subscribe, socket } = useSocket();

    // Listen for real-time product/inventory updates
    useEffect(() => {
        if (!socket) return;

        const unsubProduct = subscribe('product_updated', (updatedProduct: Product) => {
            setAllProducts(prev => prev.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p));
        });

        const unsubInventory = subscribe('inventory_updated', (data: { productId: string, stock: number }) => {
            setAllProducts(prev => prev.map(p => p.id === data.productId ? { ...p, stock: data.stock } : p));
        });

        return () => {
            unsubProduct();
            unsubInventory();
        };
    }, [socket, subscribe]);

    // Filter products
    const filteredProducts = allProducts.filter((p) => {
        const categoryName = typeof p.category === 'string' ? p.category : p.category?.name || '';
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            categoryName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || categoryName === selectedCategory;

        const matchesIndustry = true; // Multi-tenancy removed

        return matchesSearch && matchesCategory && matchesIndustry;
    });

    // Get unique categories and industries
    const categories = Array.from(new Set(allProducts.map((p) =>
        typeof p.category === 'string' ? p.category : p.category?.name || ''
    )));

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
            <Hero
                allProducts={allProducts}
                tenants={[]}
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
                tenants={[]}
                setSearchQuery={setSearchQuery}
                setSelectedCategory={setSelectedCategory}
                setSelectedIndustry={setSelectedIndustry}
                formatPrice={formatPrice}
            />

            <BrandShowcase tenants={[]} />

            <HowItWorks />

            <Testimonials />
        </div>
    );
}
