import Link from 'next/link';
import { Header, Footer } from '@/components';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Quality Crop Products
                <span className="block text-emerald-200">From Farm to Table</span>
              </h1>
              <p className="text-xl text-emerald-100 mb-8 max-w-2xl">
                Your trusted platform for premium lentils, grains, legumes, and cereals.
                We connect farmers directly with buyers for the freshest products.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
                >
                  Browse Products
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 bg-white/10 backdrop-blur rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose BrolfEcommerce?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌾</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  Hand-selected crops from verified farms, ensuring the highest quality products for your business.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Reliable logistics network ensuring your orders reach you fresh and on time.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
                <p className="text-gray-600">
                  Direct from source pricing with transparent bulk discounts for wholesale buyers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Our Product Categories
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: 'Lentils', emoji: '🫘' },
                { name: 'Grains', emoji: '🌾' },
                { name: 'Legumes', emoji: '🥜' },
                { name: 'Cereals', emoji: '🌽' },
              ].map((category) => (
                <Link
                  key={category.name}
                  href={`/products?category=${category.name.toLowerCase()}`}
                  className="group bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="text-5xl mb-4">{category.emoji}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
            <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses already using BrolfEcommerce for their crop trading needs.
            </p>
            <Link
              href="/register"
              className="inline-block px-8 py-4 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Create Your Account
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
