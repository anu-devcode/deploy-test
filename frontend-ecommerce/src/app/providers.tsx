'use client';

import { AuthProvider, CartProvider } from '@/context';
import { useEffect } from 'react';
import api from '@/lib/api';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize tenant ID
        // In production, this might come from subdomain or domain lookup
        // For now, default to a fixed tenant or 'default'
        const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'default-tenant';
        api.setTenantId(tenantId);
        console.log('Initialized UI for Tenant:', tenantId);
    }, []);

    return (
        <AuthProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </AuthProvider>
    );
}
