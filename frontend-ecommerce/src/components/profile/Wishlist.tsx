'use client';

import { useWishlist, useCart, useBusiness } from '@/context';
import { ShoppingCart, Trash2, Heart, ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

export function Wishlist() {
    const { wishlist, toggleWishlist, loading } = useWishlist();
    const { addToCart } = useCart();
    const { mode } = useBusiness();

    const handleAddAllToCart = () => {
        wishlist.forEach(item => {
            const product = item.product;
            if (product) {
                const minOrder = mode === 'BULK' && product.bulk?.enabled
                    ? (product.bulk.minOrder || 1)
                    : (product.retail?.minOrder || 1);
                addToCart(product.id, minOrder);
            }
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <div className="w-16 h-16 rounded-full bg-slate-100 mb-4" />
                <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Your wishlist is empty</h3>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-xs">
                    Save your favorite items here to keep track of them for later.
                </p>
                <Link
                    href="/products"
                    className="mt-8 px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-black transition-all shadow-xl shadow-slate-900/20 flex items-center gap-3 uppercase tracking-widest text-xs"
                >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Wishlist</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Saved
                    </p>
                </div>

                <button
                    onClick={handleAddAllToCart}
                    className="px-8 py-4 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Add All to Cart
                </button>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlist.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    const isBulk = mode === 'BULK' && product.bulk?.enabled;
                    const displayPrice = isBulk ? product.bulk.price : (product.retail?.price || product.price);
                    const minOrder = isBulk ? (product.bulk.minOrder || 1) : (product.retail?.minOrder || 1);

                    return (
                        <div key={item.id} className="group relative bg-white rounded-3xl border border-slate-100 p-4 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                            <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-4">
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl opacity-50">
                                        {product.imageToken || '📦'}
                                    </div>
                                )}
                                <button
                                    onClick={() => toggleWishlist(product.id)}
                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                                {isBulk && (
                                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-amber-500 text-slate-900 text-[8px] font-black uppercase tracking-wider">
                                        Wholesale
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1 mb-4">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category?.name}</p>
                                <Link href={`/products/${product.slug || product.id}`} className="block">
                                    <h4 className="font-black text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors uppercase italic">{product.name}</h4>
                                </Link>
                                <p className="text-lg font-black text-emerald-600">ETB {displayPrice.toLocaleString()}</p>
                            </div>

                            <button
                                onClick={() => addToCart(product.id, minOrder)}
                                className="w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-black hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                            >
                                <ShoppingCart className="w-3.5 h-3.5" />
                                Add to Cart
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
