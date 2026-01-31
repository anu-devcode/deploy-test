import Link from 'next/link';
import { Product } from '@/lib/api';
import { Heart, Eye, ShoppingCart, Star, Plus, Minus, Zap, Store } from 'lucide-react';
import { useCart, useBusiness, useWishlist } from '@/context';
import { tenants } from '@/lib/mock-data';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, updateQuantity, items } = useCart();
  const { mode } = useBusiness();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const tenant = tenants.find(t => t.id === product.tenantId);

  const cartItem = (items || []).find(i => i.productId === product.id);

  // Determine display price and unit based on mode
  const isBulk = mode === 'BULK' && product.bulk?.enabled;
  const displayPrice = isBulk ? product.bulk.price : (product.retail?.price || product.price);
  const displayUnit = isBulk ? (product.bulk.unit || 'Bulk') : (product.retail?.unit || 'ea');
  const minOrder = isBulk ? (product.bulk.minOrder || 1) : (product.retail?.minOrder || 1);

  // Link to slug if available, fallback to id
  const productUrl = `/products/${product.slug || product.id}`;

  // Map product images - fallback if no images array
  const productImages: { [key: string]: string } = {
    'p_ag_001': '/lentils.png',
    'p_ag_002': '/wheat.png',
    'p_ag_003': '/sesame.png',
  };

  const imageUrl = product.images?.[0] || productImages[product.id] || null;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-1.5 border border-slate-100 flex flex-col h-full">
      {/* Image Area - Clickable */}
      <Link href={productUrl} className="relative h-60 overflow-hidden bg-slate-50/50 block">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-7xl"
            style={{
              background: `linear-gradient(135deg, ${tenant?.theme.primaryColor || '#10b981'}10 0%, ${tenant?.theme.secondaryColor || tenant?.theme.primaryColor || '#14b8a6'}10 100%)`
            }}
          >
            <span className="opacity-80 group-hover:scale-110 transition-transform duration-500">
              {product.imageToken || '📦'}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[9px] font-bold text-emerald-800 uppercase tracking-wider shadow-sm border border-emerald-50">
            {tenant?.industry || 'General'}
          </span>
          {isBulk && (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              Wholesale
            </span>
          )}
          {product.compareAtPrice && !isBulk && (
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
              Sale
            </span>
          )}
        </div>
      </Link>

      {/* Hover Actions - Absolutely positioned to stay on top */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`w-9 h-9 rounded-full shadow-md flex items-center justify-center transition-all ${isInWishlist(product.id)
              ? 'bg-rose-500 text-white hover:bg-rose-600'
              : 'bg-white text-slate-600 hover:bg-emerald-600 hover:text-white'
            }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>
        <Link
          href={productUrl}
          className="w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-emerald-600 hover:text-white text-slate-600 transition-all"
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Quick Add Overlay */}
      {!cartItem && (
        <div className="absolute bottom-[200px] left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-center z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product.id, minOrder);
            }}
            className="w-full py-2.5 rounded-xl bg-white/95 backdrop-blur-sm text-slate-900 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all shadow-md flex items-center justify-center gap-2 border border-slate-100"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add {isBulk ? 'Wholesale' : 'to Cart'}
          </button>
        </div>
      )}

      {/* Content Area - Clickable */}
      <div className="p-5 space-y-3 flex flex-col flex-1 relative">
        <Link href={productUrl} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />

        <div className="flex items-center justify-between relative z-10 pointer-events-none">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-50 text-[9px] font-semibold text-slate-500 uppercase tracking-widest border border-slate-100">
            {typeof product.category === 'string' ? product.category : product.category?.name}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-current" />
            <span className="text-[10px] font-bold text-slate-600">{product.avgRating || 4.9}</span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-slate-800 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug min-h-[2.5rem] relative z-10 pointer-events-none">
          {product.name}
        </h3>

        {/* Tenant Branding - More subtle */}
        <div className="flex items-center gap-2 relative z-10 pointer-events-none">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white shadow-sm"
            style={{ backgroundColor: tenant?.theme.primaryColor || '#10b981' }}
          >
            {tenant?.theme.logoText?.[0] || 'B'}
          </div>
          <span className="text-[10px] font-medium text-slate-400">
            {tenant?.name || 'Brolf'}
          </span>
        </div>

        <div className="pt-3 border-t border-slate-50 mt-auto flex items-center justify-between gap-4 relative z-10">
          <div className="pointer-events-none">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-0.5">
              {isBulk ? 'Bulk Price' : 'Price'} / {displayUnit}
            </p>
            <div className="flex items-baseline gap-1.5">
              <p className="text-lg font-bold text-slate-900">
                ETB {Number(displayPrice).toLocaleString()}
              </p>
              {isBulk && product.price > displayPrice && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  -{Math.round((1 - displayPrice / product.price) * 100)}%
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cartItem ? (
              <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border border-slate-100">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(product.id, cartItem.quantity - minOrder);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center text-[10px] font-bold text-slate-700">{cartItem.quantity}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    updateQuantity(product.id, cartItem.quantity + minOrder);
                  }}
                  className="w-7 h-7 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addToCart(product.id, minOrder);
                }}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all shadow-sm ${isBulk ? 'bg-amber-500 text-slate-950 hover:bg-amber-600' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
