'use client';

import { AuthProvider, CartProvider } from '@/context';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
}
