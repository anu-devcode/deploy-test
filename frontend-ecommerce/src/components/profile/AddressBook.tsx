'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Check, Home, Briefcase, Star } from 'lucide-react';

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
    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            type: 'Home',
            label: 'My Home',
            street: 'Bole, near Edna Mall',
            city: 'Addis Ababa',
            phone: '+251 911 234567',
            isDefault: true
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newAddress, setNewAddress] = useState<Partial<Address>>({ type: 'Home' });

    const handleAdd = () => {
        if (!newAddress.street || !newAddress.city) return;

        const address: Address = {
            id: Math.random().toString(36).substr(2, 9),
            type: newAddress.type as any || 'Home',
            label: newAddress.label || 'New Address',
            street: newAddress.street,
            city: newAddress.city,
            phone: newAddress.phone || '',
            isDefault: addresses.length === 0
        };

        setAddresses([...addresses, address]);
        setIsAdding(false);
        setNewAddress({ type: 'Home' });
    };

    const handleDelete = (id: string) => {
        setAddresses(addresses.filter(a => a.id !== id));
    };

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(a => ({
            ...a,
            isDefault: a.id === id
        })));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Address Book</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add New
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Add New Form */}
                {isAdding && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl p-6 space-y-4 animate-in zoom-in duration-300">
                        <h3 className="font-black text-slate-900">New Address Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                placeholder="Label (e.g. Home)"
                                className="col-span-2 px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500 font-bold"
                                value={newAddress.label || ''}
                                onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                            />
                            <select
                                className="px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500 font-bold"
                                value={newAddress.type}
                                onChange={e => setNewAddress({ ...newAddress, type: e.target.value as any })}
                            >
                                <option>Home</option>
                                <option>Work</option>
                                <option>Other</option>
                            </select>
                            <input
                                placeholder="Phone"
                                className="px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500 font-bold"
                                value={newAddress.phone || ''}
                                onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                            />
                            <textarea
                                placeholder="Street Address / Location"
                                className="col-span-2 px-4 py-3 rounded-xl bg-white border border-slate-200 outline-none focus:border-emerald-500 font-bold h-24 resize-none"
                                value={newAddress.street || ''}
                                onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                            />
                            <div className="col-span-2 flex gap-3">
                                <button
                                    onClick={handleAdd}
                                    className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-black transition-all"
                                >
                                    Save Address
                                </button>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-3 bg-white text-slate-500 rounded-xl font-black border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Address Cards */}
                {addresses.map((addr) => (
                    <div
                        key={addr.id}
                        className={`relative p-6 rounded-3xl border transition-all group ${addr.isDefault
                                ? 'bg-emerald-50/50 border-emerald-200 shadow-lg shadow-emerald-500/10'
                                : 'bg-white border-slate-100 shadow-sm hover:border-slate-300'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${addr.type === 'Home' ? 'bg-blue-100 text-blue-600' :
                                        addr.type === 'Work' ? 'bg-purple-100 text-purple-600' :
                                            'bg-slate-100 text-slate-600'
                                    }`}>
                                    {addr.type === 'Home' ? <Home className="w-5 h-5" /> :
                                        addr.type === 'Work' ? <Briefcase className="w-5 h-5" /> :
                                            <MapPin className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900">{addr.label}</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{addr.type}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 transition-colors">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(addr.id)}
                                    className="p-2 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1 mb-6 text-sm font-bold text-slate-600 pl-13">
                            <p>{addr.street}</p>
                            <p>{addr.city}</p>
                            <p className="flex items-center gap-2 mt-2 text-slate-400 text-xs uppercase tracking-widest">
                                Tel: {addr.phone}
                            </p>
                        </div>

                        {addr.isDefault ? (
                            <div className="absolute bottom-6 right-6 flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest bg-white px-3 py-1 rounded-full shadow-sm border border-emerald-100">
                                <Check className="w-3 h-3" />
                                Default
                            </div>
                        ) : (
                            <button
                                onClick={() => handleSetDefault(addr.id)}
                                className="absolute bottom-6 right-6 text-slate-400 hover:text-emerald-600 font-bold text-xs uppercase tracking-widest group-hover:visible invisible transition-all"
                            >
                                Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
