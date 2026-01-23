'use client';

import Link from 'next/link';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white">
                <div className="p-4 border-b border-gray-800">
                    <Link href="/" className="text-xl font-bold text-emerald-400">
                        BrolfAdmin
                    </Link>
                </div>

                <nav className="p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </Link>

                    <Link
                        href="/admin/products"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>📦</span>
                        <span>Products</span>
                    </Link>

                    <Link
                        href="/admin/categories"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>🏷️</span>
                        <span>Categories</span>
                    </Link>

                    <Link
                        href="/admin/orders"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>🛒</span>
                        <span>Orders</span>
                    </Link>

                    <Link
                        href="/admin/deliveries"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>🚚</span>
                        <span>Deliveries</span>
                    </Link>

                    <Link
                        href="/admin/payments"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>💳</span>
                        <span>Payments</span>
                    </Link>

                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>👥</span>
                        <span>Customers</span>
                    </Link>

                    <Link
                        href="/admin/reviews"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>⭐</span>
                        <span>Reviews</span>
                    </Link>

                    <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-400">{user?.email}</p>
                            <p className="text-xs text-emerald-400">{user?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            🚪
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    );
}
