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
import { Billing } from '@/components/profile/Billing';
import { ProfileSidebar } from '@/components/profile/ProfileSidebar';
import { BottomNav } from '@/components/profile/BottomNav';
import { Wishlist } from '@/components/profile/Wishlist';
import { ActivityCenter } from '@/components/profile/ActivityCenter';
import {
    LayoutDashboard,
    ShoppingBag,
    MapPin,
    Wallet as WalletIcon,
    Settings,
    CreditCard,
    Heart,
    MessageSquare
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
    const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'messages');

    // Sync state with URL
    useEffect(() => {
        const tab = searchParams.get('tab');
        const section = searchParams.get('section');
        if (tab) setActiveTab(tab);
        if (section) setActiveSection(section);
    }, [searchParams]);

    const handleTabChange = (tab: string, section?: string) => {
        setActiveTab(tab);
        if (section) setActiveSection(section);
        const url = section ? `/profile?tab=${tab}&section=${section}` : `/profile?tab=${tab}`;
        router.push(url, { scroll: false });
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
                return <ProfileOverview orders={orders} loading={loading} onViewAllOrders={() => handleTabChange('orders')} onTabChange={handleTabChange} />;
            case 'orders':
                return <OrderHistory orders={orders} loading={loading} />;
            case 'addresses':
                return <AddressBook />;
            case 'settings':
                return <AccountSettings />;
            case 'wallet':
                return <Wallet />;
            case 'billing':
                return <Billing />;
            case 'wishlist':
                return <Wishlist />;
            case 'inbox':
                return <ActivityCenter initialSection={activeSection} />;
            default:
                return <ProfileOverview orders={orders} loading={loading} onViewAllOrders={() => handleTabChange('orders')} onTabChange={handleTabChange} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <main className="flex-1 w-full max-w-[1440px] mx-auto px-3 md:px-8 lg:px-12 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12 items-start">

                    {/* Sidebar - Desktop Only */}
                    <div className="hidden lg:block w-80 sticky top-24">
                        <ProfileSidebar
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 w-full flex flex-col gap-6 md:gap-8 min-h-[600px] mb-20 md:mb-0">
                        {/* Profile Header - Professional & Subtle (Hidden on Desktop as it's in Sidebar) */}
                        <div className="w-full lg:hidden">
                            <ProfileHeader />
                        </div>

                        {/* Tablet Navigation - Visible only on md (tablet) */}
                        <div className="hidden md:block lg:hidden w-full overflow-x-auto bg-white rounded-2xl p-2 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-2 min-w-max">
                                {[
                                    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                                    { id: 'orders', label: 'Orders', icon: ShoppingBag },
                                    { id: 'inbox', label: 'Activity Center', icon: MessageSquare },
                                    { id: 'wishlist', label: 'Wishlist', icon: Heart },
                                    { id: 'addresses', label: 'Addresses', icon: MapPin },
                                    { id: 'billing', label: 'Billing', icon: CreditCard },
                                    { id: 'wallet', label: 'Wallet', icon: WalletIcon },
                                    { id: 'settings', label: 'Settings', icon: Settings },
                                ].map((tab) => {
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

                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="bg-white/50 backdrop-blur-sm rounded-[2rem] md:rounded-[2.5rem] md:p-1">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
    );
}
