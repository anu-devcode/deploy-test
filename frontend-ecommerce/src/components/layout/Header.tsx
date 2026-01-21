'use client';

import Link from 'next/link';
import { useAuth, useCart } from '@/context';

export function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { cart } = useCart();

    return (
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tight">
                        BrolfEcommerce
                    </Link>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/products" className="hover:text-emerald-200 transition-colors">
                            Products
                        </Link>
                        <Link href="/about" className="hover:text-emerald-200 transition-colors">
                            About
                        </Link>
                        <Link href="/contact" className="hover:text-emerald-200 transition-colors">
                            Contact
                        </Link>
                    </nav>

                    <div className="flex items-center space-x-6">
                        <Link href="/cart" className="relative group">
                            <span className="text-2xl">🛒</span>
                            {cart && cart.itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-emerald-600">
                                    {cart.itemCount}
                                </span>
                            )}
                        </Link>

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-emerald-100 hidden sm:inline">
                                    {user?.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/login"
                                    className="px-4 py-2 hover:text-emerald-200 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-white text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
