'use client';

interface FilterSectionProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    categories: string[];
}

export function FilterSection({
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories
}: FilterSectionProps) {
    return (
        <section id="categories" className="max-w-[1400px] mx-auto px-6 lg:px-12 -mt-12 relative z-20">
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-emerald-100 p-8 lg:p-10">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <label className="block text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Search Products</label>
                        <div className="relative group">
                            <input
                                type="text"
                                placeholder="Search by name, description, or category..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-6 py-5 pl-14 rounded-2xl border-2 border-slate-200 bg-slate-50 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-medium"
                            />
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl group-focus-within:scale-110 transition-transform">🔍</span>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="mt-8">
                    <label className="block text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">Categories</label>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${!selectedCategory
                                ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-emerald-500 shadow-lg shadow-emerald-500/30 scale-105'
                                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${selectedCategory === cat
                                    ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-emerald-500 shadow-lg shadow-emerald-500/30 scale-105'
                                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-105'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
