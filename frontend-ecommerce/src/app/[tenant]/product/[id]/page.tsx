'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams } from "next/navigation";
import { useCart, useTenant } from "@/context";
import { seedProducts, tenants } from "@/lib/mock-data";
import {
  ChevronLeft,
  ShoppingCart,
  ShieldCheck,
  Leaf,
  Globe,
  Zap,
  Star,
  Share2,
  Heart,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

export default function TenantProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const { addToCart } = useCart();
  const { tenant } = useTenant();

  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const product = useMemo(() => {
    return seedProducts.find((p) => p.id === productId);
  }, [productId]);

  if (!product) {
    notFound();
  }

  // Related products logic
  const relatedProducts = useMemo(() => {
    return seedProducts
      .filter(p => p.id !== productId && p.category === product.category)
      .slice(0, 4);
  }, [productId, product.category]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Product image mapping (matching ProductsSection)
  const productImages: { [key: string]: string } = {
    'p_ag_001': '/lentils.png',
    'p_ag_002': '/wheat.png',
    'p_ag_003': '/sesame.png',
  };

  const currentImage = productImages[product.id] || null;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs / Back button */}
      <div className="pt-24 lg:pt-32 pb-8 max-w-[1400px] mx-auto px-6 lg:px-12">
        <Link
          href="/#products"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-bold transition-colors group uppercase text-[10px] tracking-[0.2em]"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Collection
        </Link>
      </div>

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Visual Showcase (Left) */}
          <div className="space-y-8">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-50 border border-slate-100 group shadow-2xl shadow-emerald-500/5">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[12rem] animate-pulse">
                  {product.imageToken}
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-8 left-8 flex flex-col gap-3">
                <span className="px-5 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-xl text-emerald-700 font-black text-xs uppercase tracking-widest border border-white">
                  Elite Grade
                </span>
                <span className="px-5 py-2 rounded-full bg-emerald-600 shadow-xl text-white font-black text-xs uppercase tracking-widest">
                  100% Organic
                </span>
              </div>

              <button className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-all hover:scale-110">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: <ShieldCheck className="w-6 h-6" />, title: 'Quality Cert', desc: 'SGS Inspected' },
                { icon: <Zap className="w-6 h-6" />, title: 'Fast Export', desc: 'Direct Logistics' },
              ].map((feature, i) => (
                <div key={i} className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm italic">{feature.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Detail (Right) */}
          <div className="flex flex-col">
            <div className="flex-1 space-y-10">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                    Category: {product.category}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-slate-400 ml-2 text-sm font-bold">5.0 (248 reviews)</span>
                  </div>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-none tracking-tight mb-8">
                  {product.name}
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed font-medium">
                  {product.description}
                </p>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-3 gap-4 border-y border-slate-100 py-10">
                <div className="text-center">
                  <Globe className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                  <span className="block text-[10px] font-black uppercase text-slate-400">Exportable</span>
                  <span className="text-xs font-bold text-slate-900">Worldwide</span>
                </div>
                <div className="text-center border-x border-slate-100">
                  <Leaf className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                  <span className="block text-[10px] font-black uppercase text-slate-400">Sustainability</span>
                  <span className="text-xs font-bold text-slate-900">Eco-Friendly</span>
                </div>
                <div className="text-center">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
                  <span className="block text-[10px] font-black uppercase text-slate-400">Processing</span>
                  <span className="text-xs font-bold text-slate-900">Premium Grade</span>
                </div>
              </div>

              {/* Pricing & Selection */}
              <div className="space-y-8 pt-4">
                <div className="flex items-end gap-4">
                  <span className="text-6xl font-black text-emerald-600 tracking-tighter">
                    ETB {product.price.toLocaleString()}
                  </span>
                  <span className="text-slate-400 font-bold mb-2">/ metric ton</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="flex items-center bg-slate-100 p-2 rounded-[1.8rem] border border-slate-200 w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-16 text-center font-black text-xl">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center font-black text-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 w-full sm:w-auto h-20 rounded-[2rem] bg-slate-900 text-white font-black text-xl flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl relative overflow-hidden group"
                  >
                    <div className={`absolute inset-0 bg-emerald-500 flex items-center justify-center gap-3 transition-transform duration-500 ${isAdded ? 'translate-y-0' : 'translate-y-full'}`}>
                      <CheckCircle2 className="w-6 h-6" />
                      Added to Cart
                    </div>
                    <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Secure Import Order
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-black text-xl">
                  አ
                </div>
                <div>
                  <h5 className="font-black text-slate-900 text-sm">Tsega Trading Group</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Certified Exporter since 2004</p>
                </div>
              </div>
              <Share2 className="w-6 h-6 text-slate-300 hover:text-emerald-500 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        {/* Related Collection */}
        {relatedProducts.length > 0 && (
          <div className="mt-40">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-2">Related Harvest</h2>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">More from the {product.category} collection</p>
              </div>
              <Link href="/#products" className="hidden sm:flex items-center gap-2 text-emerald-600 font-black text-sm group">
                View Entire Catalog
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => {
                const relImg = productImages[p.id] || null;
                return (
                  <Link
                    key={p.id}
                    href={`/${tenant.slug}/product/${p.id}`}
                    className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-2"
                  >
                    <div className="relative aspect-square bg-slate-50 overflow-hidden">
                      {relImg ? (
                        <Image src={relImg} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">{p.imageToken}</div>
                      )}
                    </div>
                    <div className="p-8">
                      <h4 className="font-black text-slate-900 uppercase tracking-tight mb-2 group-hover:text-emerald-600 transition-colors">{p.name}</h4>
                      <p className="text-emerald-600 font-black">ETB {p.price.toLocaleString()}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
