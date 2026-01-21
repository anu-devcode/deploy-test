'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header, Footer, ProductCard } from '@/components';
import api, { Product } from '@/lib/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setFeaturedProducts(data.slice(0, 4)); // Show first 4 products
      } catch (error) {
        console.error('Failed to fetch featured products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Dynamic Hero Section */}
        <section className="relative h-[600px] flex items-center bg-gray-900">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10"></div>
            {/* Placeholder for dynamic CMS hero image */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1625246333195-5848c4282ee8?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-60 animate-slow-zoom"></div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-2xl text-white">
              <span className="inline-block px-4 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-300 text-sm font-semibold mb-6 backdrop-blur-sm">
                Premium Agricultural Marketplace
              </span>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Fresh Crops <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                  Global Reach
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Connect directly with certified farmers and suppliers.
                Experience seamless trading with our B2B specialized platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all hover:scale-105 shadow-lg shadow-emerald-900/50"
                >
                  Explore Marketplace
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-4 bg-white/10 backdrop-blur text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
                >
                  Become a Supplier
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Professional Cards */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Market Categories</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Browse our comprehensive catalog of agricultural products sorted by category</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { name: 'Grains & Cereals', image: '🌾', desc: 'Wheat, Barley, Maize, Rice' },
                { name: 'Pulses & Legumes', image: '🫘', desc: 'Lentils, Beans, Peas, Chickpeas' },
                { name: 'Oilseeds', image: '🌻', desc: 'Sesame, Sunflower, Soybean' },
                { name: 'Spices & Herbs', image: '🌶️', desc: 'Pepper, Ginger, Turmeric' },
              ].map((category) => (
                <div key={category.name} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 mb-4">
                    <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-emerald-900/0 transition-colors z-10"></div>
                    <div className="w-full h-full flex items-center justify-center text-8xl bg-gray-50 group-hover:scale-110 transition-transform duration-500">
                      {category.image}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{category.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products - Dynamic Module */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Listings</h2>
                <p className="text-gray-500">Top rated products for this week</p>
              </div>
              <Link href="/products" className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-2">
                View All Results <span>→</span>
              </Link>
            </div>

            {loading ? (
              <div className="flex gap-4 overflow-hidden">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-1/4 h-80 bg-gray-200 animate-pulse rounded-2xl"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Stats Section - Trust Indicators */}
        <section className="py-20 bg-emerald-900 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/10">
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">5K+</div>
                <div className="text-sm text-emerald-100">Active Farmers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">10K+</div>
                <div className="text-sm text-emerald-100">Global Buyers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">50K+</div>
                <div className="text-sm text-emerald-100">Successful Trades</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
                <div className="text-sm text-emerald-100">Expert Support</div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
