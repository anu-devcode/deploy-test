'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { seedProducts } from '@/lib/mock-data';
import { readJson, writeJson } from '@/lib/storage';
import type { Product } from '@/types';
import { useTenant } from './TenantContext';

type CartItem = {
  productId: string;
  quantity: number;
};

type EnrichedCartItem = CartItem & {
  product: Product;
  lineTotal: number;
};

type CartState = {
  items: CartItem[];
};

type CartContextType = {
  items: EnrichedCartItem[];
  subtotal: number;
  itemCount: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const emptyState: CartState = { items: [] };

export function CartProvider({ children }: { children: ReactNode }) {
  const { tenant } = useTenant();
  const [state, setState] = useState<CartState>(emptyState);
  const [loading, setLoading] = useState(true);

  const storageKey = `cart:${tenant.id}`;

  useEffect(() => {
    // Load cart from localStorage when tenant changes
    const saved = readJson<CartState>(storageKey, emptyState);
    setState(saved);
    setLoading(false);
  }, [storageKey]);

  useEffect(() => {
    if (!loading) {
      writeJson(storageKey, state);
    }
  }, [state, storageKey, loading]);

  const items: EnrichedCartItem[] = useMemo(() => {
    const productsForTenant = seedProducts.filter((p) => p.tenantId === tenant.id);
    return state.items
      .map((item) => {
        const product = productsForTenant.find((p) => p.id === item.productId);
        if (!product) return undefined;
        return {
          ...item,
          product,
          lineTotal: product.price * item.quantity,
        };
      })
      .filter((x): x is EnrichedCartItem => Boolean(x));
  }, [state.items, tenant.id]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.lineTotal, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const addToCart = (productId: string, quantity: number) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === productId);
      if (!existing) {
        return { items: [...prev.items, { productId, quantity }] };
      }
      return {
        items: prev.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        ),
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setState((prev) => ({
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const clearCart = () => setState(emptyState);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        loading,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

