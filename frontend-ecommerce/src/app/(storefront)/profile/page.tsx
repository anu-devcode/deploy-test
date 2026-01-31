'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Header, Footer } from '@/components';
import { useRouter, useSearchParams } from 'next/navigation';
import api, { Order } from '@/lib/api';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileOverview } from '@/components/profile/ProfileOverview';
import { OrderHistory } from '@/components/profile/OrderHistory';
import { AddressBook } from '@/components/profile/AddressBook';
import { AccountSettings } from '@/components/profile/AccountSettings';
import { Wallet } from '@/components/profile/Wallet';
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Wallet as WalletIcon,
    Settings
} from 'lucide-react';

export default function ProfilePage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Get initial tab from URL or default to overview
    const initialTab = searchParams.get('tab') || 'overview';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'wallet', label: 'Wallet', icon: WalletIcon },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Sync state with URL
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/profile?tab=${tab}`, { scroll: false });
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const allOrders = await api.getOrders();
                // Filter orders for current user (Mock logic)
                const myOrders = allOrders.filter(o =>
                    o.customer?.email === user?.email ||
                    o.guestEmail === user?.email
                );
                setOrders(myOrders);
            } catch (error) {
                console.error('Failed to fetch profile data', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isAuthenticated, router, user]);

    if (!isAuthenticated) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return <ProfileOverview orders={orders} loading={loading} onViewAllOrders={() => handleTabChange('orders')} />;
            case 'orders':
                return <OrderHistory orders={orders} loading={loading} />;
            case 'addresses':
                return <AddressBook />;
            case 'settings':
                return <AccountSettings />;
            case 'wallet':
                return <Wallet />;
            default:
                return <ProfileOverview orders={orders} loading={loading} onViewAllOrders={() => handleTabChange('orders')} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Header Section */}
                    <ProfileHeader />

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-2xl p-2 md:p-3 shadow-sm border border-slate-100 overflow-x-auto">
                        <div className="flex items-center gap-2 min-w-max">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${isActive
                                            ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100'
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {renderContent()}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
