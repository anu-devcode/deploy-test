'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { seedProducts } from '@/lib/mock-data';
import { readJson, writeJson } from '@/lib/storage';
import type { Product } from '@/types';
import { useTenant } from './TenantContext';
import { useAuth } from './AuthContext';

type CartItem = {
  productId: string;
  quantity: number;
  selected?: boolean;
};

type EnrichedCartItem = CartItem & {
  product: Product;
  lineTotal: number;
  selected: boolean;
};

type CartState = {
  items: CartItem[];
};

type CartContextType = {
  items: EnrichedCartItem[];
  selectedItems: EnrichedCartItem[];
  subtotal: number;
  selectedSubtotal: number;
  itemCount: number;
  selectedCount: number;
  loading: boolean;
  addToCart: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleSelection: (productId: string) => void;
  selectAll: (selected: boolean) => void;
  clearCart: () => void;
  clearSelectedItems: () => void;
  toggleCart: () => void;
  isOpen: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const emptyState: CartState = { items: [] };

export function CartProvider({ children }: { children: ReactNode }) {
  const { tenant } = useTenant();
  const { user, isAuthenticated } = useAuth();
  const [state, setState] = useState<CartState>(emptyState);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Storage keys: one for guest, one for user (tenant-scoped)
  const guestKey = `cart:guest:${tenant.id}`;
  const userKey = user ? `cart:user:${user.id}:${tenant.id}` : null;
  const activeKey = userKey || guestKey;

  // Load cart
  useEffect(() => {
    setLoading(true);
    const saved = readJson<CartState>(activeKey, emptyState);

    // If just logged in, merge guest cart into user cart
    if (isAuthenticated && user) {
      const guestCart = readJson<CartState>(guestKey, emptyState);
      if (guestCart.items.length > 0) {
        const mergedItems = [...saved.items];
        guestCart.items.forEach(guestItem => {
          const existing = mergedItems.find(i => i.productId === guestItem.productId);
          if (existing) {
            existing.quantity += guestItem.quantity;
          } else {
            mergedItems.push(guestItem);
          }
        });
        setState({ items: mergedItems });
        // Clear guest cart after merge
        writeJson(guestKey, emptyState);
      } else {
        setState(saved);
      }
    } else {
      setState(saved);
    }

    setLoading(false);
  }, [activeKey, isAuthenticated, user, tenant.id, guestKey]);

  // Persist cart
  useEffect(() => {
    if (!loading) {
      writeJson(activeKey, state);
    }
  }, [state, activeKey, loading]);

  const items: EnrichedCartItem[] = useMemo(() => {
    return state.items
      .map((item) => {
        const product = seedProducts.find((p) => p.id === item.productId);
        if (!product) return undefined;
        return {
          ...item,
          product,
          lineTotal: Number(product.price) * item.quantity,
          selected: item.selected !== false, // Default to true if undefined
        };
      })
      .filter((x): x is EnrichedCartItem => Boolean(x));
  }, [state.items]);

  const selectedItems = useMemo(() => items.filter(i => i.selected), [items]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.lineTotal, 0),
    [items]
  );

  const selectedSubtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.lineTotal, 0),
    [selectedItems]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const selectedCount = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems]
  );

  const addToCart = (productId: string, quantity: number) => {
    setState((prev) => {
      const existing = prev.items.find((i) => i.productId === productId);
      if (!existing) {
        return { items: [...prev.items, { productId, quantity, selected: true }] };
      }
      return {
        items: prev.items.map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + quantity, selected: true }
            : i
        ),
      };
    });
    setIsOpen(true); // Auto-open side cart
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setState((prev) => ({
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));
  };

  const removeFromCart = (productId: string) => {
    setState((prev) => ({
      items: prev.items.filter((i) => i.productId !== productId),
    }));
  };

  const toggleSelection = (productId: string) => {
    setState((prev) => ({
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, selected: i.selected === false } : i
      ),
    }));
  };

  const selectAll = (selected: boolean) => {
    setState((prev) => ({
      items: prev.items.map((i) => ({ ...i, selected })),
    }));
  };

  const clearCart = () => setState(emptyState);

  const clearSelectedItems = () => {
    setState((prev) => ({
      items: prev.items.filter((i) => i.selected === false),
    }));
  };

  const toggleCart = () => setIsOpen(!isOpen);

  return (
    <CartContext.Provider
      value={{
        items,
        selectedItems,
        subtotal,
        selectedSubtotal,
        itemCount,
        selectedCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        toggleSelection,
        selectAll,
        clearCart,
        clearSelectedItems,
        toggleCart,
        isOpen,
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

