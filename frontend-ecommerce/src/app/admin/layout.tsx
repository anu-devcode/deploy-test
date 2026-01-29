'use client';

import Link from 'next/link';
import { useAuth } from '@/context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    FolderTree,
    Truck,
    CreditCard,
    Users,
    Star,
    Settings,
    UserCog,
    LogOut,
    Search,
    Bell,
    ChevronDown,
    X,
    CheckCheck,
    AlertCircle,
    Info,
    ShieldAlert,
    User
} from 'lucide-react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, user, logout } = useAuth();
    const router = useRouter();

    // Notifications State
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);
    const accountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
        fetchNotifications();

        // Close dropdowns on outside click
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationOpen(false);
            }
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isAuthenticated, router]);

    const fetchNotifications = async () => {
        try {
            const data = await api.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const clearAll = () => {
        setNotifications([]);
        setIsNotificationOpen(false);
    };

    if (!isAuthenticated) {
        return null;
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    const navGroups = [
        {
            label: 'Sales & Fulfilment',
            items: [
                { label: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
                { label: 'Deliveries', icon: Truck, href: '/admin/deliveries' },
                { label: 'Payments', icon: CreditCard, href: '/admin/payments' },
            ]
        },
        {
            label: 'Categories & Content',
            items: [
                { label: 'Products', icon: Package, href: '/admin/products' },
                { label: 'Categories', icon: FolderTree, href: '/admin/categories' },
                { label: 'Reviews', icon: Star, href: '/admin/reviews' },
            ]
        },
        {
            label: 'Relationship & Mgmt',
            items: [
                { label: 'Customers', icon: Users, href: '/admin/customers' },
                ...(user?.role === 'ADMIN' ? [{ label: 'Staff', icon: UserCog, href: '/admin/staff' }] : []),
                { label: 'Settings', icon: Settings, href: '/admin/settings' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#0F172A] text-white flex flex-col fixed h-full z-50">
                <div className="p-6">
                    <Link href="/admin" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Brolf<span className="text-emerald-400">Admin</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
                    {/* Dashboard Link */}
                    <div>
                        <Link
                            href="/admin"
                            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors bg-slate-800/10 text-slate-300 hover:text-white"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </div>

                    {navGroups.map((group, idx) => (
                        <div key={idx} className="space-y-1">
                            <h3 className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                                {group.label}
                            </h3>
                            {group.items.map((item, idy) => (
                                <Link
                                    key={idy}
                                    href={item.href}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700/50"
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 bg-slate-900/50 border-t border-slate-800/50">
                    <div className="flex items-center gap-3 px-3 py-2 bg-slate-800/20 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <span className="text-emerald-400 font-bold text-xs">{user?.email?.[0].toUpperCase()}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
                            <p className="text-[10px] text-emerald-400/80 font-medium uppercase tracking-tighter">{user?.role}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/5 rounded-lg transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col pl-64">
                {/* Header */}
                <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
                    <div className="relative w-96 max-w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders, products..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell with Dropdown */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                className={`relative p-2 rounded-full transition-all duration-300 ${isNotificationOpen ? 'bg-indigo-50 text-indigo-600 ring-2 ring-indigo-500/20' : 'text-slate-500 hover:bg-slate-100'}`}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[10px] font-black text-white rounded-full border-2 border-white flex items-center justify-center animate-bounce">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown UI */}
                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Command Logs</h3>
                                        <button onClick={clearAll} className="text-[10px] font-black text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest">Clear All</button>
                                    </div>
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                                    <Bell className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400">No active alerts</p>
                                            </div>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => markAsRead(n.id)}
                                                    className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-all relative group ${!n.read ? 'bg-indigo-50/30' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.type === 'SECURITY' ? 'bg-rose-100 text-rose-600' :
                                                        n.type === 'INVENTORY' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'
                                                        }`}>
                                                        {n.type === 'SECURITY' && <ShieldAlert className="w-5 h-5" />}
                                                        {n.type === 'INVENTORY' && <AlertCircle className="w-5 h-5" />}
                                                        {n.type === 'SYSTEM' && <Info className="w-5 h-5" />}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-xs font-bold leading-tight ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>{n.title}</p>
                                                        <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                                                        <span className="text-[9px] font-black text-slate-300 mt-2 block uppercase tracking-widest">{n.time}</span>
                                                    </div>
                                                    {!n.read && (
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform"></div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="p-3 bg-slate-50/50 border-t border-slate-50">
                                        <button className="w-full py-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] hover:bg-indigo-50 rounded-xl transition-all">View Analytics History</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                        {/* User Account Dropdown */}
                        <div className="relative" ref={accountRef}>
                            <div
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-2xl transition-all duration-300 ${isAccountOpen ? 'bg-slate-100 ring-2 ring-slate-200' : 'hover:bg-slate-50'}`}
                            >
                                <div className="w-8 h-8 rounded-xl bg-indigo-600 border border-indigo-500 shadow-md flex items-center justify-center text-white text-xs font-black">
                                    {user?.email?.[0].toUpperCase()}
                                </div>
                                <div className="hidden md:block text-left mr-1">
                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter leading-none">{user?.email?.split('@')[0]}</p>
                                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">{user?.role}</p>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isAccountOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Account Dropdown UI */}
                            {isAccountOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 duration-200">
                                    <div className="p-5 bg-indigo-900 text-white relative overflow-hidden">
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none">Command Entity</p>
                                            <p className="text-sm font-black mt-1 truncate">{user?.email}</p>
                                            <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 rounded-full border border-emerald-500/20">
                                                <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                                                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Active Session</span>
                                            </div>
                                        </div>
                                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                                    </div>
                                    <div className="p-2">
                                        <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
                                            <div className="p-1.5 bg-slate-50 group-hover:bg-white rounded-lg transition-colors"><User className="w-4 h-4" /></div>
                                            Profile Intel
                                        </Link>
                                        <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
                                            <div className="p-1.5 bg-slate-50 group-hover:bg-white rounded-lg transition-colors"><Settings className="w-4 h-4" /></div>
                                            Node Settings
                                        </Link>
                                        <Link href="/admin/staff" className="flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all group">
                                            <div className="p-1.5 bg-slate-50 group-hover:bg-white rounded-lg transition-colors"><UserCog className="w-4 h-4" /></div>
                                            Access Vector
                                        </Link>
                                        <div className="h-[1px] bg-slate-50 mx-2 my-2"></div>
                                        <button
                                            onClick={logout}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all group"
                                        >
                                            <div className="p-1.5 bg-rose-50 rounded-lg group-hover:bg-white transition-colors"><LogOut className="w-4 h-4" /></div>
                                            Terminate Session
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
