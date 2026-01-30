'use client';

import { useState } from 'react';
import {
    Settings as SettingsIcon,
    Globe,
    Lock,
    CreditCard,
    Bell,
    Palette,
    Save,
    Trash2,
    Check,
    Store,
    Mail,
    Phone,
    MapPin,
    Smartphone,
    GitBranch,
    Zap,
    Cpu,
    Activity,
    Plus
} from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'store' | 'localization' | 'payments' | 'security' | 'workflow' | 'advanced'>('store');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1200));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const tabs = [
        { id: 'store', label: 'Store Identity', icon: Store },
        { id: 'localization', label: 'Regional & SEO', icon: Globe },
        { id: 'payments', label: 'FinTech Integrations', icon: CreditCard },
        { id: 'security', label: 'System Security', icon: Lock },
        { id: 'workflow', label: 'Order Workflow', icon: GitBranch },
        { id: 'advanced', label: 'Feature Toggles', icon: Zap },
    ];

    return (
        <div className="max-w-5xl space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Global Configuration</h1>
                    <p className="text-sm text-slate-500">Master controls for your e-commerce ecosystem.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg ${saved
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                        }`}
                >
                    {saving ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : saved ? (
                        <Check className="w-4 h-4" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    {saving ? 'Syncing...' : saved ? 'Synced' : 'Save Config'}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Tabs */}
                <div className="w-full md:w-64 space-y-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.id
                                ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                                : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 space-y-8">
                    {activeTab === 'store' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Business Name</label>
                                    <input type="text" defaultValue="Brolf Premium Logistics" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Support Email</label>
                                    <input type="email" defaultValue="hq@brolf.com" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Motto / Tagline</label>
                                    <input type="text" defaultValue="Ethical Excellence in Premium Grain Export" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all" />
                                </div>
                            </div>

                            <hr className="border-slate-50" />

                            <h3 className="text-lg font-bold text-slate-900 pt-2">Contact Details</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/30">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100"><Phone className="w-4 h-4 text-indigo-500" /></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Line</p>
                                        <p className="text-sm font-semibold text-slate-700">+251 911 223 344</p>
                                    </div>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
                                </div>
                                <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50/30">
                                    <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100"><MapPin className="w-4 h-4 text-indigo-500" /></div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Office HQ</p>
                                        <p className="text-sm font-semibold text-slate-700">Addis Ababa, Bole Road, Block A4</p>
                                    </div>
                                    <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'localization' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900">Regional Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Base Currency</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                                        <option>Ethiopian Birr (ETB)</option>
                                        <option>US Dollar (USD)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Timezone</label>
                                    <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                                        <option>(GMT+3) East Africa Time</option>
                                        <option>(GMT+0) UTC</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payments' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900">Active Gateways</h3>
                            <div className="space-y-4">
                                {['Telebirr', 'CBE Birr', 'M-Pesa'].map((gate) => (
                                    <div key={gate} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm font-bold text-indigo-600 text-xs">
                                                {gate[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{gate}</p>
                                                <p className="text-[10px] text-emerald-600 font-bold uppercase">Connected</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative">
                                                <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                            </div>
                                            <button className="text-slate-400 hover:text-slate-600"><SettingsIcon className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900">Access Control</h3>
                            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-amber-900">Enhanced Security Required</p>
                                    <p className="text-xs text-amber-700 leading-relaxed mt-1">
                                        We recommend enabling two-factor authentication (2FA) for all administrative staff to prevent unauthorized access.
                                    </p>
                                </div>
                            </div>
                            <button className="w-full flex items-center justify-between p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-3 text-slate-700">
                                    <Lock className="w-4 h-4" />
                                    <span className="text-sm font-bold">Two-Factor Authentication</span>
                                </div>
                                <span className="text-xs font-bold text-indigo-600">Configure</span>
                            </button>
                        </div>
                    )}

                    {activeTab === 'workflow' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900">Order Lifecycle Customization</h3>
                            <p className="text-sm text-slate-500">Define the states and automated transitions for your fulfilment pipeline.</p>

                            <div className="space-y-4">
                                {[
                                    { label: 'Draft', color: 'bg-slate-100 text-slate-600' },
                                    { label: 'Pending Payment', color: 'bg-amber-100 text-amber-600' },
                                    { label: 'Processing', color: 'bg-indigo-100 text-indigo-600' },
                                    { label: 'Shipped', color: 'bg-blue-100 text-blue-600' },
                                    { label: 'Delivered', color: 'bg-emerald-100 text-emerald-600' },
                                ].map((status) => (
                                    <div key={status.label} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-slate-50/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Rules</button>
                                            <button className="text-xs font-bold text-indigo-600 hover:underline">Edit</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm font-bold hover:border-emerald-400 hover:text-emerald-500 transition-all flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Custom Workflow State
                            </button>
                        </div>
                    )}

                    {activeTab === 'advanced' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-bold text-slate-900">Experimental Flags</h3>
                            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex gap-4">
                                <Cpu className="w-5 h-5 text-indigo-600 shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-indigo-900">V2 Platform Capabilities</p>
                                    <p className="text-xs text-indigo-700 leading-relaxed mt-1">
                                        Enable cutting-edge features before they hit the stable branch. Caution: these may affect checkout performance.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'ai-desc', label: 'AI Inventory Descriptions', desc: 'Auto-generate SEO copy for new product units.', active: true },
                                    { id: 'v2-checkout', label: 'One-Tap Checkout V2', desc: 'Streamlined biometric-ready ordering flow.', active: false },
                                    { id: 'live-track', label: 'Real-time Logistics Map', desc: 'GPS tracking for internal delivery fleet.', active: true },
                                ].map((flag) => (
                                    <div key={flag.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white shadow-sm">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-bold text-slate-900">{flag.label}</p>
                                                {flag.active && <span className="bg-emerald-100 text-emerald-600 text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Active</span>}
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">{flag.desc}</p>
                                        </div>
                                        <button className={`w-12 h-6 rounded-full relative transition-all ${flag.active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${flag.active ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Danger Zone */}
                <div className="bg-rose-50/30 rounded-3xl border border-rose-100 p-8 space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-rose-900 flex items-center gap-2">
                            <Trash2 className="w-5 h-5" /> Danger Zone
                        </h3>
                        <p className="text-sm text-rose-700 mt-1 opacity-80">Irreversible actions that affect the entire store database.</p>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-rose-100">
                        <div>
                            <p className="text-sm font-bold text-slate-900">Clear Store Cache</p>
                            <p className="text-[11px] text-slate-500">Force refresh of all product and category metadata.</p>
                        </div>
                        <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all">
                            Execute Flush
                        </button>
                    </div>
                    <button className="w-full py-4 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-2xl text-sm font-bold border border-rose-200 transition-all">
                        Deactivate This Store Instance
                    </button>
                </div>
            </div>
        </div>
    );
}

const ShieldAlert = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
);
