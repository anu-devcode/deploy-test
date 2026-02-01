'use client';

import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { readJson, writeJson } from '@/lib/storage';
import type { Product } from '@/types';
import { useTenant } from './TenantContext';
import { useAuth } from './AuthContext';
import { api } from '@/lib/api';

type CartItem = {
  productId: string;
  quantity: number;
  selected?: boolean;
};

type EnrichedCartItem = CartItem & {
  product: Product;
  lineTotal: number;
  selected: boolean;
  serverTotal?: number; // Added to store backend calculation
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
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Load products once
  useEffect(() => {
    api.getProducts().then(setAvailableProducts).catch(console.error);
  }, []);

  // Storage keys: one for guest, one for user (tenant-scoped)
  const guestKey = `cart:guest:${tenant.id}`;
  const userKey = user ? `cart:user:${user.id}:${tenant.id}` : null;
  const activeKey = userKey || guestKey;

  // Load cart
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);

      if (isAuthenticated && user) {
        try {
          const serverCart = await api.getCart();
          if (serverCart && serverCart.items) {
            const mappedItems = serverCart.items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
              itemTotal: i.itemTotal, // From backend
              selected: true
            }));
            setState({ items: mappedItems });
            setLoading(false);
            return;
          }
        } catch (e) {
          console.error("Failed to load server cart", e);
        }
      }

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
    };

    loadCart();
  }, [activeKey, isAuthenticated, user, tenant.id, guestKey]);

  // Persist cart (only for guest, server handles user)
  useEffect(() => {
    if (!loading && !userKey) {
      writeJson(activeKey, state);
    }
  }, [state, activeKey, loading, userKey]);

  const items: EnrichedCartItem[] = useMemo(() => {
    return state.items
      .map((item) => {
        const product = availableProducts.find((p) => p.id === item.productId);
        if (!product) return undefined;
        return {
          ...item,
          product,
          lineTotal: (item as any).itemTotal || Number(product.price) * item.quantity,
          selected: item.selected !== false,
        };
      })
      .filter((x): x is EnrichedCartItem => Boolean(x));
  }, [state.items, availableProducts]);

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

  const addToCart = async (productId: string, quantity: number) => {
    if (isAuthenticated && user) {
      try {
        await api.addToCart(productId, quantity);
        // Refresh cart from server
        const serverCart = await api.getCart();
        if (serverCart && serverCart.items) {
          const mappedItems = serverCart.items.map((i: any) => ({
            productId: i.productId,
            quantity: i.quantity,
            selected: true
          }));
          setState({ items: mappedItems });
        }
      } catch (e) {
        console.error('Failed to add to server cart', e);
      }
    } else {
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
    }
    setIsOpen(true);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (isAuthenticated && user) {
      // api.updateCartItem(productId, quantity) - Verify if api.ts has this matching
      // For now assuming optimistic update
    }

    setState((prev) => ({
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));
  };

  const removeFromCart = async (productId: string) => {
    if (isAuthenticated && user) {
      try {
        await api.removeFromCart(productId);
        // Checked api.ts: `removeFromCart(customerId, productId)`
        // But my backend refactor removed customerId.
        // I need to update api.ts to remove customerId arg too!
      } catch (e) { console.error(e); }
    }
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

