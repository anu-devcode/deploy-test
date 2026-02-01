import { AuthProvider, CartProvider, TenantProvider, SocketProvider, BusinessProvider, WishlistProvider, NotificationProvider } from '@/context';
import { DEFAULT_TENANT_SLUG } from '@/lib/mock-data';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SocketProvider>
                <TenantProvider tenantSlug={DEFAULT_TENANT_SLUG}>
                    <BusinessProvider>
                        <NotificationProvider>
                            <WishlistProvider>
                                <CartProvider>
                                    {children}
                                </CartProvider>
                            </WishlistProvider>
                        </NotificationProvider>
                    </BusinessProvider>
                </TenantProvider>
            </SocketProvider>
        </AuthProvider>
    );
}

