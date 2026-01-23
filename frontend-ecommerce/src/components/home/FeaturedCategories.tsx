'use client';

interface FeaturedCategoriesProps {
    categories: string[];
    setSelectedCategory: (category: string | null) => void;
}

export function FeaturedCategories({ categories, setSelectedCategory }: FeaturedCategoriesProps) {
    const icons = ['🌾', '⚙️', '🏪', '🌻', '🧰', '☕', '💡', '🧻'];

    return (
        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16">
            <div className="text-center mb-12">
                <h2 className="text-4xl font-black text-slate-900 mb-3">Shop by Category</h2>
                <p className="text-lg text-slate-600 font-medium">Explore our diverse range of premium products</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {categories.map((cat, index) => (
                    <button
                        key={cat}
                        onClick={() => {
                            setSelectedCategory(cat);
                            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-emerald-100 hover:border-emerald-300"
                    >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{icons[index % icons.length]}</div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{cat}</h3>
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-green-600/0 group-hover:from-emerald-600/10 group-hover:to-green-600/10 transition-all duration-300"></div>
                    </button>
                ))}
            </div>
        </section>
    );
}
