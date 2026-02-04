import { AuthProvider, CartProvider, TenantProvider, SocketProvider, BusinessProvider, WishlistProvider, NotificationProvider, PromotionProvider } from '@/context';
// Default tenant slug used for legacy context
const DEFAULT_TENANT_SLUG = "adis-harvest";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <SocketProvider>
                <TenantProvider tenantSlug={DEFAULT_TENANT_SLUG}>
                    <BusinessProvider>
                        <NotificationProvider>
                            <WishlistProvider>
                                <PromotionProvider>
                                    <CartProvider>
                                        {children}
                                    </CartProvider>
                                </PromotionProvider>
                            </WishlistProvider>
                        </NotificationProvider>
                    </BusinessProvider>
                </TenantProvider>
            </SocketProvider>
        </AuthProvider>
    );
}

