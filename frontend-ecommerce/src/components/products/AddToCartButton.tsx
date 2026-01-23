'use client';

import { useState } from 'react';
import { useCart } from '@/context';

interface AddToCartButtonProps {
  productId: string;
  quantity?: number;
  variant?: 'default' | 'large';
}

export function AddToCartButton({ productId, quantity = 1, variant = 'default' }: AddToCartButtonProps) {
  const { addToCart, loading } = useCart();
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAdding(true);
    addToCart(productId, quantity);
    
    setTimeout(() => {
      setAdding(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 300);
  };

  const baseClasses = variant === 'large'
    ? 'w-full px-6 py-4 text-base font-bold rounded-xl'
    : 'w-full px-4 py-3 text-sm font-semibold rounded-lg';

  return (
    <button
      onClick={handleAdd}
      disabled={adding || loading || success}
      className={`bg-[color:var(--tenant-primary,#10b981)] text-white ${baseClasses} hover:brightness-110 active:scale-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[color:var(--tenant-primary,#10b981)]/20 hover:shadow-xl hover:shadow-[color:var(--tenant-primary,#10b981)]/30`}
    >
      {success ? (
        <>
          <span className="text-lg">✓</span>
          <span>Added!</span>
        </>
      ) : adding ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          <span className="text-lg">🛒</span>
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
