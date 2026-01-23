'use client';

import { AuthProvider, CartProvider, TenantProvider } from '@/context';
import { DEFAULT_TENANT_SLUG } from '@/lib/mock-data';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <TenantProvider tenantSlug={DEFAULT_TENANT_SLUG}>
                <CartProvider>
                    {children}
                </CartProvider>
            </TenantProvider>
        </AuthProvider>
    );
}

