'use client';

import Link from 'next/link';
import { useAuth } from '@/context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import {
    LayoutDashboard,
    Package,
    Tag,
    ShoppingCart,
    Truck,
    CreditCard,
    Users,
    Star,
    Settings,
    LogOut,
    ChevronRight,
    Leaf
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
        return null;
    }

    const menuItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: Package },
        { href: '/admin/categories', label: 'Categories', icon: Tag },
        { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
        { href: '/admin/deliveries', label: 'Deliveries', icon: Truck },
        { href: '/admin/payments', label: 'Payments', icon: CreditCard },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/reviews', label: 'Reviews', icon: Star },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex">
            {/* Sidebar */}
            <aside className="w-72 bg-[#022c22] text-white flex flex-col sticky top-0 h-screen shadow-2xl z-50">
                {/* Logo Area */}
                <div className="p-8 pb-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:rotate-12 transition-transform duration-500">
                            <Leaf className="text-white w-6 h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-black tracking-tight leading-none text-white">BROLF<span className="text-emerald-400 font-serif italic text-2xl ml-0.5">Admin</span></span>
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500/60 mt-1">Management Hub</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-white/10 text-emerald-400 shadow-lg border border-white/5'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-emerald-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                </div>
                                {isActive && <ChevronRight className="w-4 h-4 animate-in slide-in-from-left-2" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile Area */}
                <div className="p-4 mt-auto">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>

                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center font-black text-white shadow-lg">
                                    {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex flex-col max-w-[120px]">
                                    <p className="text-xs font-black text-white truncate uppercase tracking-tight">{user?.email?.split('@')[0]}</p>
                                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mt-1">{user?.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-all flex items-center justify-center group/logout"
                            >
                                <LogOut className="w-4 h-4 group-hover/logout:-translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-h-screen relative overflow-hidden flex flex-col">
                {/* Header Background Decoration */}
                <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#022c22]/5 to-transparent pointer-events-none"></div>

                <div className="relative z-10 p-8 lg:p-12">
                    {children}
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(16, 185, 129, 0.3);
                }
            `}</style>
        </div>
    );
}
