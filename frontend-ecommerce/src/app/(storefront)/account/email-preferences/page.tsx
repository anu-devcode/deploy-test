'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { Loader2, Mail, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EmailPreferencesPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState({
        marketing: true,
        orderUpdates: true,
        productUpdates: true,
    });

    useEffect(() => {
        if (user?.email) {
            loadPreferences();
        }
    }, [user]);

    const loadPreferences = async () => {
        try {
            const data = await api.getEmailPreferences(user?.email || '');
            if (data) {
                setPreferences({
                    marketing: data.marketing,
                    orderUpdates: data.orderUpdates,
                    productUpdates: data.productUpdates,
                });
            }
        } catch (error) {
            console.error('Failed to load email preferences:', error);
            // Don't show error toast on load to avoid nagging
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.updateEmailPreferences({
                email: user?.email || '',
                ...preferences,
            });
            toast.success('Preferences saved successfully');
        } catch (error) {
            console.error('Failed to save email preferences:', error);
            toast.error('Failed to save preferences');
        } finally {
            setSaving(false);
        }
    };

    const toggle = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">Email Preferences</h1>
                <p className="mt-2 text-slate-600">Manage what emails you receive from Adis Harvest.</p>
            </div>

            <div className="space-y-6 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                {/* Marketing Emails */}
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Marketing & Promotions</h3>
                            <p className="text-sm text-slate-500 mt-1">Receive exclusive offers, discounts, and news.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => toggle('marketing')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${preferences.marketing ? 'bg-emerald-600' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.marketing ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Product Updates */}
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">New Product Updates</h3>
                            <p className="text-sm text-slate-500 mt-1">Be the first to know about new arrivals and restocks.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => toggle('productUpdates')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${preferences.productUpdates ? 'bg-emerald-600' : 'bg-slate-200'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${preferences.productUpdates ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Order Updates */}
                <div className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors opacity-75">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900">Order Updates</h3>
                            <p className="text-sm text-slate-500 mt-1">Essential notifications about your orders and shipments.</p>
                            <p className="text-xs text-amber-600 mt-1 font-medium">Cannot be disabled for active orders.</p>
                        </div>
                    </div>
                    <button
                        disabled
                        className="relative inline-flex h-6 w-11 items-center rounded-full bg-emerald-600 opacity-50 cursor-not-allowed"
                    >
                        <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                    </button>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[120px]"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>
        </div>
    );
}
