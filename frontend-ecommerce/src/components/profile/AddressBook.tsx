'use client';

import { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, Home, Briefcase, Star, Smartphone } from 'lucide-react';
import { api } from '@/lib/api';

interface Address {
    id: string;
    type: 'Home' | 'Work' | 'Other';
    label: string;
    street: string;
    city: string;
    phone: string;
    isDefault: boolean;
}

export function AddressBook() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({ type: 'Home' });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const data = await api.getAddresses();
            setAddresses(data);
        } catch (e) {
            console.error('Failed to fetch addresses', e);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newAddress.street || !newAddress.city) return;

        try {
            await api.addAddress(newAddress);
            await fetchAddresses();
            setIsAdding(false);
            setNewAddress({ type: 'Home' });
        } catch (e) {
            console.error('Failed to add address', e);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await api.deleteAddress(id);
            await fetchAddresses();
        } catch (e) {
            console.error('Failed to delete address', e);
        }
    };

    const handleSetDefault = async (id: string) => {
        try {
            await api.setAddressDefault(id);
            await fetchAddresses();
        } catch (e) {
            console.error('Failed to set default address', e);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24 md:pb-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="px-1 md:px-0">
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Saved Addresses</h2>
                    <p className="text-[10px] md:text-sm font-bold text-slate-400">Manage your shipping and billing locations</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center justify-center gap-2 px-6 py-4 md:py-3 bg-slate-900 text-white rounded-[20px] md:rounded-2xl font-black hover:bg-black transition-all shadow-xl shadow-slate-200 text-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add New Address</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Add New Form - Better Integrated */}
                {isAdding && (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl md:rounded-[2rem] p-5 md:p-8 space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="space-y-1">
                            <h3 className="font-black text-slate-900">New Address</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enter location details</p>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Label</label>
                                    <input
                                        placeholder="e.g. My Home"
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-slate-900 font-bold text-sm"
                                        value={newAddress.label || ''}
                                        onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Type</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-slate-900 font-bold text-sm h-[46px]"
                                        value={newAddress.type}
                                        onChange={e => setNewAddress({ ...newAddress, type: e.target.value as any })}
                                    >
                                        <option>Home</option>
                                        <option>Work</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                <input
                                    placeholder="+251 9..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-slate-900 font-bold text-sm"
                                    value={newAddress.phone || ''}
                                    onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Address / Directions</label>
                                <textarea
                                    placeholder="Street, Building, Apartment..."
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-slate-900 font-bold text-sm h-28 resize-none"
                                    value={newAddress.street || ''}
                                    onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg"
                                >
                                    Save Address
                                </button>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-4 bg-white text-slate-500 rounded-2xl font-black border border-slate-200 hover:bg-slate-50 transition-all text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Address Cards - Modern & Clean */}
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`relative p-6 md:p-8 rounded-[2rem] border transition-all group overflow-hidden ${addr.isDefault
                            ? 'bg-white border-slate-900 ring-1 ring-slate-900 shadow-xl shadow-slate-200'
                            : 'bg-white border-slate-100 shadow-sm hover:border-slate-300 hover:shadow-md'
                            }`}
                    >
                        {/* Background Decoration */}
                        {addr.isDefault && (
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                        )}

                        <div className="flex items-start justify-between mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${addr.isDefault ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                    {addr.type === 'Home' ? <Home className="w-5 h-5" /> :
                                        addr.type === 'Work' ? <Briefcase className="w-5 h-5" /> :
                                            <MapPin className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg leading-tight">{addr.label}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] mt-0.5">{addr.type}</p>
                                </div>
                            </div>

                            <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                {!addr.isDefault && (
                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="p-2.5 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 mb-8 relative z-10">
                            <div className="flex gap-3">
                                <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-600 leading-relaxed">{addr.street}</p>
                                    <p className="text-sm font-bold text-slate-400">{addr.city}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pt-2">
                                < Smartphone className="w-4 h-4 text-slate-300 shrink-0" />
                                <p className="text-sm font-bold text-slate-600">{addr.phone}</p>
                            </div>
                        </div>

                        <div className="relative z-10 flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                            {addr.isDefault ? (
                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Check className="w-3 h-3" />
                                    </div>
                                    Default Shipping
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleSetDefault(addr.id)}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                                >
                                    <Star className="w-3.5 h-3.5" />
                                    Set as Default
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
