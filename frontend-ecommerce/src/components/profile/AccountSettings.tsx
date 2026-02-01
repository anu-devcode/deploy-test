'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { ArrowLeft, ChevronRight, Lock, Mail, Bell, CheckCircle2, Shield, Smartphone, UserCircle, Camera, Trash2, Laptop } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SecuritySettings from './SecuritySettings';

type Section = 'profile' | 'security' | 'notifications' | 'sessions';

export function AccountSettings() {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [activeSection, setActiveSection] = useState<Section | null>(null);

    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        avatar: user?.avatar || '',
        language: user?.preferences?.locale || 'en-US',
        timezone: user?.preferences?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        promos: true
    });

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateProfile(profileData);
            if (user) {
                const updatedUser = {
                    ...user,
                    name: profileData.name,
                    phone: profileData.phone,
                    avatar: profileData.avatar,
                    preferences: {
                        locale: profileData.language,
                        timezone: profileData.timezone
                    }
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
            setSuccess('Profile updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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

    const sections = [
        { id: 'profile' as Section, label: 'Personal Information', desc: 'Avatar, Name, Phone & Region', icon: UserCircle, color: 'bg-slate-900', textColor: 'text-white' },
        { id: 'security' as Section, label: 'Security & Password', desc: 'Password & Authentication', icon: Lock, color: 'bg-rose-50', textColor: 'text-rose-500' },
        { id: 'sessions' as Section, label: 'Login Security', desc: 'Active Sessions & Devices', icon: Laptop, color: 'bg-blue-50', textColor: 'text-blue-500' },
        { id: 'notifications' as Section, label: 'Notifications', desc: 'Email & SMS Preferences', icon: Bell, color: 'bg-amber-50', textColor: 'text-amber-500' }
    ];

    if (!activeSection) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
                {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className="bg-white p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200 transition-all group flex flex-col items-start text-left"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${section.color} ${section.textColor} flex items-center justify-center mb-6 md:mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div className="flex-1 w-full">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{section.label}</h3>
                                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                                </div>
                                <p className="text-sm font-bold text-slate-400">{section.desc}</p>
                            </div>
                        </button>
                    );
                })}

                {/* Floating Feedback Toast */}
                {success && (
                    <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 p-4 px-6 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 z-50 ring-1 ring-white/10">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="font-black text-sm">{success}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <button
                onClick={() => setActiveSection(null)}
                className="flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Settings
            </button>

            {activeSection === 'profile' && (
                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 md:mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Personal Information</h3>
                            <p className="text-sm font-bold text-slate-400">Manage your basic details and preferences</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mb-8 md:mb-10 p-5 md:p-6 bg-slate-50 rounded-3xl md:rounded-[2rem] border border-slate-100">
                        <div className="relative group">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] bg-slate-900 flex items-center justify-center text-white text-3xl md:text-4xl font-black shadow-2xl overflow-hidden ring-4 ring-white">
                                {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    profileData.name.charAt(0) || 'U'
                                )}
                            </div>
                            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:bg-emerald-600 transition-all hover:scale-110 active:scale-95">
                                <Camera className="w-5 h-5" />
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setProfileData({ ...profileData, avatar: reader.result as string });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </label>
                            {profileData.avatar && (
                                <button
                                    type="button"
                                    onClick={() => setProfileData({ ...profileData, avatar: '' })}
                                    className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 text-white rounded-lg flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all hover:scale-110 opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Picture</p>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-slate-900 focus:bg-white font-bold transition-all"
                                    placeholder="Enter your full name"
                                    value={profileData.name}
                                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Phone Number</label>
                                <div className="relative">
                                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="tel"
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-slate-900 focus:bg-white font-bold transition-all"
                                        placeholder="+251 9..."
                                        value={profileData.phone}
                                        onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email (Primary)</label>
                                <div className="relative">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-400 cursor-not-allowed opacity-60"
                                        value={user?.email || ''}
                                        disabled
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100">Verified</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Language</label>
                                    <select
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-slate-900 font-black text-sm"
                                        value={profileData.language}
                                        onChange={e => setProfileData({ ...profileData, language: e.target.value })}
                                    >
                                        <option value="en-US">English (US)</option>
                                        <option value="am-ET">Amharic (ET)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Timezone</label>
                                    <input
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-400 text-sm cursor-not-allowed opacity-60"
                                        value={profileData.timezone}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end pt-6 border-t border-slate-50">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto px-12 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Update Details'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeSection === 'security' && (
                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 md:mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security & Password</h3>
                            <p className="text-sm font-bold text-slate-400">Protect your account with a strong password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordChange} className="max-w-xl space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Current Password</label>
                            <input
                                type="password"
                                className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-rose-500 focus:bg-white font-bold transition-all"
                                placeholder="••••••••"
                                value={passwordData.current}
                                onChange={e => setPasswordData({ ...passwordData, current: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">New Password</label>
                                <input
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-rose-500 focus:bg-white font-bold transition-all"
                                    placeholder="Enter new"
                                    value={passwordData.new}
                                    onChange={e => setPasswordData({ ...passwordData, new: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Confirm New</label>
                                <input
                                    type="password"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-rose-500 focus:bg-white font-bold transition-all"
                                    placeholder="Confirm new"
                                    value={passwordData.confirm}
                                    onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !passwordData.new}
                            className="w-full px-10 py-4 md:py-5 bg-rose-600 text-white rounded-2xl font-black hover:bg-rose-700 transition-all shadow-xl shadow-rose-100 disabled:opacity-50"
                        >
                            Update Password
                        </button>
                    </form>
                </div>
            )}

            {activeSection === 'notifications' && (
                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 md:mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
                            <Bell className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notification Preferences</h3>
                            <p className="text-sm font-bold text-slate-400">Control how we communicate with you</p>
                        </div>
                    </div>

                    <div className="space-y-4 max-w-3xl">
                        {[
                            { id: 'email', label: 'Order Status Emails', desc: 'Critical notifications about your purchases and delivery status.' },
                            { id: 'sms', label: 'SMS Notifications', desc: 'Real-time delivery alerts directly to your mobile device.' },
                            { id: 'promos', label: 'Marketing Communications', desc: 'Exclusive offers, new harvesting seasons, and special events.' }
                        ].map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-4 md:p-6 rounded-2xl md:rounded-[1.5rem] bg-slate-50 border border-slate-100 hover:border-amber-200 transition-all group">
                                <div className="pr-4 md:pr-8">
                                    <h4 className="font-black text-slate-900 tracking-tight group-hover:text-amber-700 transition-colors text-sm md:text-base">{item.label}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={(notifications as any)[item.id]}
                                        onChange={() => setNotifications({ ...notifications, [item.id]: !(notifications as any)[item.id] })}
                                    />
                                    <div className="w-12 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 shadow-inner"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeSection === 'sessions' && (
                <div className="bg-white rounded-3xl md:rounded-[2.5rem] p-5 md:p-12 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4 mb-8 md:mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                            <Laptop className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Login Security</h3>
                            <p className="text-sm font-bold text-slate-400">Manage active sessions and devices</p>
                        </div>
                    </div>
                    <SecuritySettings />
                </div>
            )}

            {/* Floating Feedback Toast */}
            {success && (
                <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-10 p-4 px-6 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-10 z-50 ring-1 ring-white/10">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-black text-sm">{success}</span>
                </div>
            )}
        </div>
    );
}
