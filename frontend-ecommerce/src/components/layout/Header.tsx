'use client';

import Link from 'next/link';
import { useAuth } from '@/context';

export function Header() {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg">
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

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm text-emerald-100">
                                    {user?.email}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
