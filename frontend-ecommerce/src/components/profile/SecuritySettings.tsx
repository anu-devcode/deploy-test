'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Laptop, Trash2, LogOut, Info, Shield, Smartphone, Mail, Key } from 'lucide-react';

interface TwoFactorSettings {
    twoFactorEnabled: boolean;
    twoFactorMethod: string | null;
}

export default function SecuritySettings() {
    const { user, deleteAccount, logout } = useAuth();
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    // 2FA State
    const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings>({
        twoFactorEnabled: false,
        twoFactorMethod: null
    });
    const [is2FALoading, setIs2FALoading] = useState(false);

    useEffect(() => {
        loadSessions();
        loadTwoFactorSettings();
    }, []);

    const loadSessions = async () => {
        try {
            const data = await api.getSessions();
            setSessions(data);
        } catch (error) {
            console.error('Failed to load sessions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTwoFactorSettings = async () => {
        try {
            const data = await api.getTwoFactorSettings();
            setTwoFactorSettings(data);
        } catch (error) {
            console.error('Failed to load 2FA settings', error);
        }
    };

    const handleToggle2FA = async (method: string) => {
        setIs2FALoading(true);
        try {
            const isEnabling = twoFactorSettings.twoFactorMethod !== method;
            const result = await api.updateTwoFactorSettings(isEnabling, isEnabling ? method : undefined);
            setTwoFactorSettings(result);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update 2FA settings');
        } finally {
            setIs2FALoading(false);
        }
    };

    const handleRevokeSession = async (sessionId: string) => {
        if (!confirm('Are you sure you want to log out this device?')) return;
        try {
            await api.revokeSession(sessionId);
            setSessions(sessions.filter(s => s.id !== sessionId));
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to revoke session');
        }
    };

    const handleLogoutAll = async () => {
        if (!confirm('Are you sure you want to log out from ALL devices?')) return;
        try {
            await api.logoutAllDevices();
            logout();
        } catch (error) {
            alert('Failed to logout from all devices');
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = confirm('CRITICAL: This will permanently delete your account and all associated data. This action cannot be undone. Are you absolutely sure?');
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            await deleteAccount();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to delete account');
            setIsDeleting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading security settings...</div>;

    const twoFactorMethods = [
        {
            id: 'email',
            label: 'Email Verification',
            desc: 'Receive a verification code via email when logging in',
            icon: Mail,
            color: 'bg-blue-50 text-blue-500'
        },
        {
            id: 'authenticator',
            label: 'Authenticator App',
            desc: 'Use Google Authenticator, Authy, or similar apps',
            icon: Smartphone,
            color: 'bg-purple-50 text-purple-500'
        },
        {
            id: 'sms',
            label: 'SMS Verification',
            desc: 'Receive a verification code via SMS (requires phone number)',
            icon: Key,
            color: 'bg-emerald-50 text-emerald-500'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Two-Factor Authentication Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Two-Factor Authentication</h3>
                        <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {twoFactorMethods.map((method) => {
                        const Icon = method.icon;
                        const isActive = twoFactorSettings.twoFactorMethod === method.id;

                        return (
                            <div
                                key={method.id}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isActive
                                        ? 'bg-indigo-50/50 border-indigo-200'
                                        : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-xl ${method.color}`}>
                                        <Icon size={18} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm">{method.label}</h4>
                                        <p className="text-[10px] text-slate-500 font-medium">{method.desc}</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isActive}
                                        disabled={is2FALoading}
                                        onChange={() => handleToggle2FA(method.id)}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                                </label>
                            </div>
                        );
                    })}
                </div>

                {twoFactorSettings.twoFactorEnabled && (
                    <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-medium">
                        <Shield size={16} />
                        Two-factor authentication is enabled via {twoFactorSettings.twoFactorMethod}
                    </div>
                )}
            </section>

            <hr className="border-slate-100" />

            {/* Active Sessions Section */}
            <section className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                        <Laptop size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">Active Sessions</h3>
                        <p className="text-xs text-slate-500">Devices currently logged into your account</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-lg ${session.isPrimary ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                                    <Laptop size={18} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-slate-800 text-sm">
                                            {session.userAgent ? (session.userAgent.includes('Windows') ? 'Windows PC' : session.userAgent.includes('Mac') ? 'Mac' : session.userAgent.includes('iPhone') ? 'iPhone' : 'Mobile Device') : 'Unknown Device'}
                                        </p>
                                        {session.isPrimary && (
                                            <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-bold uppercase tracking-wider">Primary</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500">{session.ipAddress || 'IP Hidden'} • Joined {new Date(session.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {!session.isPrimary && user?.isPrimary && (
                                <button
                                    onClick={() => handleRevokeSession(session.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Revoke Access"
                                >
                                    <LogOut size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {user?.isPrimary && (
                    <button
                        onClick={handleLogoutAll}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
                    >
                        <LogOut size={18} />
                        Logout from all other devices
                    </button>
                )}
            </section>

            {/* Authority Info Card */}
            {!user?.isPrimary && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
                    <Info size={20} className="shrink-0" />
                    <p className="text-xs">
                        <b>Limited Authority:</b> This is not your primary device. Management features like revoking other sessions or deleting the account are only available from your first device.
                    </p>
                </div>
            )}

            {/* Danger Zone */}
            {user?.isPrimary && (
                <section className="bg-red-50/50 border border-red-100 rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-red-100 text-red-600">
                            <Trash2 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-red-900">Danger Zone</h3>
                            <p className="text-xs text-red-600/70">Proceed with extreme caution</p>
                        </div>
                    </div>

                    <div className="bg-white border border-red-100 rounded-xl p-5">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Delete Account</h4>
                                <p className="text-xs text-slate-500">Order history, addresses, and wishlist cannot be recovered.</p>
                            </div>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete Account'}
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
