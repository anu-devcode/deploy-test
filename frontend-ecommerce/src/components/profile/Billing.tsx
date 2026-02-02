'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Download, FileText, MapPin, CheckCircle2, MoreVertical, Trash2, ShieldCheck, ExternalLink, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface PaymentMethod {
    id: string;
    type: 'VISA' | 'MASTERCARD' | 'TELEBIRR' | 'CBE' | 'ONLINE' | 'MPESA';
    brand?: string;
    last4?: string;
    expiry?: string;
    isDefault: boolean;
}

interface Invoice {
    id: string;
    orderNumber: string;
    createdAt: string;
    total: number;
    status: string;
    paymentStatus: string;
}

export function Billing() {
    const [savedMethods, setSavedMethods] = useState<PaymentMethod[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [billingAddress, setBillingAddress] = useState<any>(null);

    useEffect(() => {
        loadBillingData();
    }, []);

    const loadBillingData = async () => {
        setLoading(true);
        try {
            const [billingInfo, invoiceData] = await Promise.all([
                api.getBillingInfo(),
                api.getInvoices()
            ]);
            setSavedMethods(billingInfo.savedMethods);
            setBillingAddress(billingInfo.billingAddress);
            setInvoices(invoiceData);
        } catch (error) {
            console.error('Failed to load billing data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMethod = async (id: string) => {
        if (!confirm('Are you sure you want to remove this payment method?')) return;
        try {
            await api.deleteBillingMethod(id);
            setSavedMethods(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            alert('Failed to remove payment method');
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await api.setBillingMethodDefault(id);
            setSavedMethods(prev => prev.map(m => ({
                ...m,
                isDefault: m.id === id
            })));
        } catch (error) {
            alert('Failed to set default payment method');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Secure Vault...</p>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
            <header className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Payments & Billing</h2>
                <p className="text-slate-500 font-medium">Manage your payment methods, billing details, and view invoices.</p>
            </header>

            {/* Payment Methods Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-emerald-500" />
                        Saved Methods
                    </h3>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shadow-lg shadow-slate-200 active:scale-95">
                        <Plus className="w-4 h-4" />
                        Add New
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedMethods.map((method) => (
                        <div key={method.id} className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 ${method.isDefault ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'}`}>
                            {method.isDefault && (
                                <span className="absolute -top-3 left-6 px-3 py-1 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-full shadow-lg">Default</span>
                            )}

                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm uppercase ${method.type === 'VISA' ? 'bg-blue-50 text-blue-600' : method.type === 'TELEBIRR' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {method.type === 'TELEBIRR' ? 'TB' : method.brand?.charAt(0) || method.type.charAt(0)}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleRemoveMethod(method.id)}
                                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="font-black text-slate-900">{method.brand || method.type} {method.last4 && `•••• ${method.last4}`}</p>
                                {method.expiry && <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Expires {method.expiry}</p>}
                                {(method.type === 'TELEBIRR' || method.type === 'MPESA') && <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Digital Wallet</p>}
                            </div>

                            <div className="mt-6 flex items-center justify-between">
                                {!method.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(method.id)}
                                        className="text-xs font-black text-emerald-600 hover:text-emerald-700 transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Billing Address & Security */}
            <div className="grid lg:grid-cols-2 gap-8">
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-emerald-500" />
                        Billing Address
                    </h3>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest text-slate-400">Current Address</h4>
                        </div>
                        <p className="font-bold text-slate-700 leading-relaxed">
                            {billingAddress?.address || 'No billing address set'}<br />
                            {billingAddress?.city && billingAddress?.city + ', '}{billingAddress?.country || 'Ethiopia'}
                        </p>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                        <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
                        <div className="space-y-1">
                            <p className="font-black text-emerald-900 text-sm">Secure Billing</p>
                            <p className="text-emerald-700 text-xs font-medium">Your billing information is encrypted and never shared with third parties.</p>
                        </div>
                    </div>
                </section>

                <section className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 space-y-6">
                        <h3 className="text-xl font-black flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-400" />
                            Auto-Reload
                        </h3>
                        <p className="text-slate-400 font-medium">Automatically add points to your wallet when your balance falls below a certain amount.</p>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-6 bg-slate-800 rounded-full relative p-1 cursor-pointer">
                                <div className="w-4 h-4 bg-slate-600 rounded-full"></div>
                            </div>
                            <span className="font-bold text-slate-500">Currently Disabled</span>
                        </div>
                        <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-black hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group/btn">
                            Configure Auto-Reload
                            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </section>
            </div>

            {/* Invoices History */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-emerald-500" />
                        Recent Invoices
                    </h3>
                    <button className="text-sm font-black text-slate-500 hover:text-slate-900 transition-colors">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                                <th className="px-8 py-4">Invoice Number</th>
                                <th className="px-8 py-4">Date</th>
                                <th className="px-8 py-4">Amount</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="group hover:bg-slate-50 transition-colors">
                                    <td className="px-8 py-6">
                                        <span className="font-black text-slate-900">{inv.orderNumber}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-sm font-bold text-slate-500">{new Date(inv.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="font-black text-slate-900">ETB {Number(inv.total).toLocaleString()}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className={`w-4 h-4 ${inv.paymentStatus === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-300'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${inv.paymentStatus === 'COMPLETED' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {inv.paymentStatus}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all group-hover:shadow-lg">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
