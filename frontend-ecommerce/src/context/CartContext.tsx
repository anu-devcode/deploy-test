'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { Cart, CartItem } from '@/lib/api';
import { useAuth } from './AuthContext';

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    // WARNING: In a real app we would get the customer ID from the auth user profile.
    // For this demo, we'll assume the user ID is the customer ID or map it properly.
    // Since our User model and Customer model are separate, we would normally
    // fetch the 'Me' profile to get the linked Customer ID.
    // For now, let's use a placeholder or derived ID.
    const customerId = user ? 'TEMP_CUSTOMER_ID' : null; // TODO: Replace with real customer mapping

    useEffect(() => {
        if (isAuthenticated && customerId) {
            refreshCart();
        } else {
            setCart(null);
        }
    }, [isAuthenticated, customerId]);

    const refreshCart = async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const data = await api.getCart(customerId);
            setCart(data);
        } catch (error) {
            console.error('Failed to load cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId: string, quantity: number) => {
        if (!customerId) {
            // TODO: Handle guest cart or redirect to login
            alert("Please login to add items to cart");
            return;
        }

        try {
            const updatedCart = await api.addToCart(customerId, productId, quantity);
            setCart(updatedCart);
            // Optional: Show toast
        } catch (error) {
            console.error('Failed to add to cart:', error);
            alert('Failed to add item to cart');
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!customerId) return;
        try {
            // API currently returns { message, cart } but type def expects Cart.
            // We should check the actual response structure in api.ts
            // For now, we'll re-fetch or assume the hook updates.
            await api.removeFromCart(customerId, productId);
            refreshCart();
        } catch (error) {
            console.error('Failed to remove from cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
