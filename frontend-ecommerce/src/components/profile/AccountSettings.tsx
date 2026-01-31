'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { Lock, Mail, Bell, CheckCircle2, Shield, Smartphone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function AccountSettings() {
    const { user } = useAuth();
    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        promos: true
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.new !== passwordData.confirm) return;

        setLoading(true);
        try {
            await api.changePassword(passwordData.new);
            setSuccess('Password updated successfully');
            setPasswordData({ current: '', new: '', confirm: '' });
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-2xl font-black text-slate-900">Account Settings</h2>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Security Section */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900">Security</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Password & Authentication</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Current Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-emerald-500 focus:bg-white font-bold transition-all"
                                        placeholder="Enter current password"
                                        value={passwordData.current}
                                        onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-emerald-500 focus:bg-white font-bold transition-all"
                                        placeholder="New password"
                                        value={passwordData.new}
                                        onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Confirm</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 outline-none focus:border-emerald-500 focus:bg-white font-bold transition-all"
                                        placeholder="Confirm new"
                                        value={passwordData.confirm}
                                        onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !passwordData.new}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-black transition-all disabled:opacity-50"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                            {success && (
                                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    {success}
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                <Mail className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900">Contact Info</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manage your identity</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 mb-1 block">Email Address</label>
                                <input
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 font-bold text-slate-500 cursor-not-allowed"
                                    value={user?.email || ''}
                                    readOnly
                                />
                                <p className="text-[10px] text-slate-400 mt-1 ml-1 font-bold">Contact support to change email safely.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Notifications & Preferences */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-black text-slate-900">Notifications</h3>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Customize your alerts</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { id: 'email', label: 'Order Updates via Email', desc: 'Receive updates about your order status.' },
                                { id: 'sms', label: 'SMS Notifications', desc: 'Get text messages for delivery updates.' },
                                { id: 'promos', label: 'Marketing & Promotions', desc: 'Be the first to know about sales and offers.' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <div className="pr-4">
                                        <h4 className="font-black text-slate-900 text-sm">{item.label}</h4>
                                        <p className="text-xs font-bold text-slate-400 mt-1">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={(notifications as any)[item.id]}
                                            onChange={() => setNotifications({ ...notifications, [item.id]: !(notifications as any)[item.id] })}
                                        />
                                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
