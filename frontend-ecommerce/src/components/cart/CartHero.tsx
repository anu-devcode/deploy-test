'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context';

export function CartHero() {
    const { addToCart } = useCart();
    const router = useRouter();

    const featuredItems = [
        {
            id: 'p_ag_001',
            icon: '🌾',
            title: 'Premium Red Lentils',
            price: '1,290 ETB',
            tag: 'Top Choice'
        },
        {
            id: 'p_ret_001',
            icon: '☕',
            title: 'Organic Coffee Beans',
            price: '1,550 ETB',
            tag: 'Featured'
        }
    ];

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-emerald-900 py-20">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/harvest-hero.png"
                    alt="Agriculture Hero"
                    fill
                    className="object-cover opacity-30 blur-[1px]"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-950/40 to-emerald-950/90" />
            </div>

            <div className="relative mt-10 z-10 max-w-[1400px] mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 font-bold text-xs mb-8">
                    <span>🌱</span>
                    CURATED SELECTIONS
                </div>

                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                    Your Harvest <span className="text-lime-400">Awaits</span>
                </h2>

                <p className="text-lg text-emerald-50/70 max-w-xl mx-auto mb-12 font-medium">
                    Exploration is the first step to discovery. Add our most requested premiums to your collection.
                </p>

                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {featuredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white/95 backdrop-blur-3xl p-8 rounded-[2.5rem] border-8 border-white shadow-2xl text-left hover:-translate-y-2 transition-all duration-500 group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-600 text-[10px] font-black text-white uppercase tracking-widest">
                                    {item.tag}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-2">{item.title}</h3>
                            <p className="text-2xl font-black text-emerald-600 mb-6">{item.price}</p>

                            <button
                                onClick={() => {
                                    addToCart(item.id, 1);
                                    router.push('/cart');
                                }}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-50 [mask-image:url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTQ0MCAzMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iMSIgZD0iTTAsOTZMMzAsMTEyQzYwLDEyOCwxMjAsMTYwLDE4MCwxNjBDMjQwLDE2MCwzMDAsMTI4LDM2MCwxMTJDNDIwLDk2LDQ4MCw5Niw1NDAsMTI4QzYwMCwxNjAsNjYwLDE5Miw3MjAsMTkyQzc4MCwxOTIsODQwLDE2MCw5MDAsMTM4LjdDOTYwLDExNywxMDIwLDEwNywxMDgwLDExMkMxMTQwLDExNywxMjAwLDEzOSwxMjYwLDE2MEMxMzIwLDE4MSwxMzgwLDE5MiwxNDEwLDE5N0wxNDQwLDIwMkwxNDQwLDMyMEwxNDEwLDMyMEMxMzgwLDMyMCwxMzIwLDMyMCwxMjYwLDMyMEMxMjAwLDMyMCwxMTQwLDMyMCwxMDgwLDMyMEMxMDIwLDMyMCw5NjAsMzIwLDkwMCwzMjBDODQwLDMyMCw3ODAsMzIwLDcyMCwzMjBDNjYwLDMyMCw2MDAsMzIwLDU0MCwzMjBDNDgwLDMyMCw0MjAsMzIwLDM2MCwzMjBDMzAwLDMyMCwyNDAsMzIwLDE4MCwzMjBDMTIwLDMyMCw2MCwzMjAsMzAsMzIwTDAsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-repeat-x" />
        </section>
    );
}
