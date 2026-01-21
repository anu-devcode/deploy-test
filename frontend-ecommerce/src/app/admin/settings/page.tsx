'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(false);
    const [storeName, setStoreName] = useState('Brolf Eco Store');
    const [supportEmail, setSupportEmail] = useState('support@brolf.com');
    const [currency, setCurrency] = useState('ETB');

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
        alert('Settings saved successfully (Mock)');
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500">Manage your store configuration</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">General Information</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSave} className="max-w-xl space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
                            <input
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                            <select
                                value={currency}
                                onChange={(e) => setCurrency(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="ETB">Ethiopian Birr (ETB)</option>
                                <option value="USD">US Dollar (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                            </select>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Danger Zone</h2>
                </div>
                <div className="p-6">
                    <p className="text-sm text-gray-500 mb-4">
                        Permanently delete your store and all associated data. This action cannot be undone.
                    </p>
                    <button className="px-6 py-2 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium">
                        Delete Store
                    </button>
                </div>
            </div>
        </div>
    );
}
