'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header, Footer } from '@/components';
import { useRouter } from 'next/navigation';
import api, { Order } from '@/lib/api';
import { Package, User, Settings, LogOut, ChevronRight, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    const { user, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [isAuthenticated, activeTab, router]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const data = await api.getOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                        <p className="text-gray-500">{user?.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar Navigation */}
                    <div className="bg-white rounded-2xl shadow-sm p-4 h-fit">
                        <nav className="flex flex-col gap-2">
                            <button
                                onClick={() => setActiveTab('overview')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'overview'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <User size={20} />
                                Overview
                            </button>
                            <button
                                onClick={() => setActiveTab('orders')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'orders'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Package size={20} />
                                Orders
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'settings'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Settings size={20} />
                                Settings
                            </button>
                            <hr className="my-2 border-gray-100" />
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={20} />
                                Sign Out
                            </button>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="md:col-span-3">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="text-gray-500 mb-1">Total Orders</div>
                                        <div className="text-3xl font-bold text-gray-900">0</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="text-gray-500 mb-1">Member Since</div>
                                        <div className="text-3xl font-bold text-gray-900">2026</div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <div className="text-gray-500 mb-1">Loyalty Points</div>
                                        <div className="text-3xl font-bold text-emerald-600">0</div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Account Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                                            <div className="text-gray-900">{user?.email}</div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500 mb-1">Account Type</label>
                                            <div className="inline-block px-2 py-1 bg-gray-100 rounded-md text-sm text-gray-700 font-medium font-mono">
                                                {user?.role || 'CUSTOMER'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900">Order History</h2>
                                </div>

                                {loadingOrders ? (
                                    <div className="p-12 text-center text-gray-500">Loading orders...</div>
                                ) : orders.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                                        <Package className="h-12 w-12 text-gray-300 mb-4" />
                                        <p className="text-lg font-medium text-gray-900 mb-2">No orders yet</p>
                                        <p className="mb-6">Start shopping to see your orders here.</p>
                                        <Link href="/products" className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                            Browes Products
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {orders.map((order) => (
                                            <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <div className="text-sm text-gray-500">Order #{order.id.substring(0, 8)}</div>
                                                        <div className="font-bold text-gray-900 mt-1">
                                                            {new Date(order.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm text-gray-600">
                                                        {order.items.length} items
                                                    </div>
                                                    <div className="text-lg font-bold text-emerald-600">
                                                        ETB {order.total.toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h2>
                                <form className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                        <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                        <input type="password" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                                    </div>
                                    <button type="button" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                                        Update Password
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
