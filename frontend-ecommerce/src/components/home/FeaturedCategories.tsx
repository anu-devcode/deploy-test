'use client';

interface FeaturedCategoriesProps {
    categories: string[];
    setSelectedCategory: (category: string | null) => void;
}

export function FeaturedCategories({ categories, setSelectedCategory }: FeaturedCategoriesProps) {
    const icons = ['🌾', '⚙️', '🏪', '🌻', '🧰', '☕', '💡', '🧻'];

    return (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 md:py-16">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 md:mb-3">Shop by Category</h2>
                <p className="text-base md:text-lg text-slate-600 font-medium px-4">Explore our diverse range of premium products</p>
            </div>
            <div className="flex justify-center">
                {categories.slice(0, 1).map((cat, index) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative flex flex-col items-center overflow-hidden rounded-2xl bg-white/80 backdrop-blur-lg border border-emerald-300 hover:border-emerald-500 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 p-6 md:p-8"
                    >
                        <div className="text-5xl md:text-6xl mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                            {icons[index % icons.length]}
                        </div>
                        <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {cat}
                        </h3>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-green-600/0 group-hover:from-emerald-600/15 group-hover:to-green-600/15 transition-all duration-300" />
                    </button>
                ))}
            </div>
        </section>
    );
}
