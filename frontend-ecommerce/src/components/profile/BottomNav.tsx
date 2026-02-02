'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    ShoppingBag,
    ShoppingCart,
    User,
    Store
} from 'lucide-react';
import { useCart } from '@/context';

export function BottomNav() {
    const pathname = usePathname();
    const { itemCount, toggleCart } = useCart();

    const tabs = [
        { id: 'home', label: 'Home', icon: Home, href: '/' },
        { id: 'shop', label: 'Shop', icon: Store, href: '/products' },
        { id: 'cart', label: 'Cart', icon: ShoppingCart, onClick: toggleCart, isCart: true },
        { id: 'account', label: 'Account', icon: User, href: '/profile?tab=menu' },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200/60 z-50 px-4 pb-safe-area-inset-bottom shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    // Check if active: profile matches account, /products matches shop, / matches home
                    const isActive = tab.href === '/'
                        ? pathname === '/'
                        : tab.href ? pathname.startsWith(tab.href) : false;

                    const content = (
                        <>
                            <div className={`relative p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-emerald-50 text-emerald-600' : 'group-hover:bg-slate-50 text-slate-400'
                                }`}>
                                <Icon className="w-5 h-5" />
                                {tab.isCart && itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                        {itemCount}
                                    </span>
                                )}
                                {isActive && !tab.isCart && (
                                    <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${isActive ? 'text-emerald-700 opacity-100' : 'text-slate-400 opacity-60'
                                }`}>
                                {tab.label}
                            </span>
                        </>
                    );

                    if (tab.onClick) {
                        return (
                            <button
                                key={tab.id}
                                onClick={tab.onClick}
                                className="flex flex-col items-center justify-center group flex-1 active:scale-90 transition-transform duration-200"
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <Link
                            key={tab.id}
                            href={tab.href!}
                            className="flex flex-col items-center justify-center group flex-1 active:scale-90 transition-transform duration-200"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
