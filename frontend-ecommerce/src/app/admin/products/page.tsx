'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { seedProducts } from '@/lib/mock-data';
import {
    Package,
    Plus,
    Search,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    Leaf,
    Zap,
    AlertCircle
} from 'lucide-react';
import { Product } from '@/types';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
        category: 'Pulses & Grains'
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await api.getAdminProducts();
            // Cast to central Product type and use seed products as fallback
            const combinedProducts = (data as any[]).length > 0 ? (data as any as Product[]) : seedProducts;
            setProducts(combinedProducts);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts(seedProducts);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createProduct({
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                sku: formData.sku || undefined,
            });
            setShowForm(false);
            setFormData({ name: '', description: '', price: '', stock: '', sku: '', category: 'Pulses & Grains' });
            fetchProducts();
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Product <span className="text-emerald-600 font-serif italic normal-case">Inventory</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Manage and monitor your global agricultural assets</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group flex-1 md:w-64">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Identify specific asset..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${showForm
                            ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-950/20'
                            : 'bg-emerald-500 text-[#022c22] hover:bg-emerald-400 shadow-emerald-500/20'
                            }`}
                    >
                        {showForm ? 'Cancel Operation' : '+ Initiate Listing'}
                    </button>
                </div>
            </div>

            {/* Inbound Listing Form */}
            {showForm && (
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-50 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                            <Zap className="text-emerald-600 w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Asset <span className="text-emerald-600">Declaration</span></h2>
                    </div>

                    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Product Nomenclature</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                                required
                                placeholder="e.g. Export Grade Teff"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Stock Keeping Unit (SKU)</label>
                            <input
                                type="text"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                                placeholder="AG-TFF-001"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Classification</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold appearance-none cursor-pointer"
                            >
                                <option>Pulses & Grains</option>
                                <option>Oilseeds</option>
                                <option>Agri-Machinery</option>
                                <option>Specialized Produce</option>
                            </select>
                        </div>
                        <div className="lg:col-span-2 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Asset Specification</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold h-24"
                                placeholder="Detailed botanical or technical description..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Valuation (ETB)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-black text-emerald-600"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">On-Hand Count</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 lg:col-span-3 pt-6 border-t border-slate-50 flex justify-end">
                            <button
                                type="submit"
                                className="px-12 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                            >
                                Deploy Asset to Repository
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Asset Table */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Package className="text-emerald-500 w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active <span className="text-emerald-600">Inventory</span></h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Master List</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-3 bg-white rounded-xl border border-slate-100 hover:border-emerald-500/30 transition-all text-slate-400 hover:text-emerald-600 shadow-sm">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Synchronizing Repository...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Botanical/Commercial Asset</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU Sequence</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {products.map((product) => (
                                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 shadow-sm border border-slate-100">
                                                    {product.imageToken || '📦'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 uppercase tracking-tight text-lg group-hover:text-emerald-700 transition-colors">
                                                        {product.name}
                                                    </span>
                                                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                                                        {product.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500 font-mono tracking-tighter uppercase whitespace-nowrap">
                                                {product.sku || 'UNSPECIFIED'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="text-xl font-black text-slate-900 whitespace-nowrap">
                                                ETB {Number(product.price).toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8">
                                            <div className="flex flex-col gap-2">
                                                <div className={`flex items-center gap-2 group/tip relative cursor-help`}>
                                                    <div className={`w-3 h-3 rounded-full ${(product as any).stock > 50 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                        (product as any).stock > 10 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' :
                                                            'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse'
                                                        }`} />
                                                    <span className="font-black text-slate-900 text-lg">{(product as any).stock ?? 120}</span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units</span>
                                                </div>
                                                {(product as any).stock < 20 && (
                                                    <div className="flex items-center gap-1.5 text-rose-500">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Critical Reorder</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-500/30 transition-all shadow-sm">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <button className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-all border border-transparent">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <button className="p-2 text-slate-300 group-hover:hidden transition-all">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        Displaying <span className="text-slate-900">{products.length}</span> Assets in Repository
                    </p>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 cursor-not-allowed transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-1 px-4">
                            <span className="w-10 h-10 rounded-xl bg-emerald-500 text-[#022c22] flex items-center justify-center font-black text-sm shadow-lg shadow-emerald-500/20">1</span>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-500/30 transition-all shadow-sm">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
