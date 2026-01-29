'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import {
    FolderTree,
    Plus,
    Search,
    MoreVertical,
    Edit2,
    Trash2,
    ChevronRight,
    Box,
    Layers,
    Tag
} from 'lucide-react';

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await api.getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNameChange = (name: string) => {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        setFormData({ ...formData, name, slug });
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newCat = await api.createCategory(formData);
            setCategories([newCat, ...categories]);
            setShowForm(false);
            setFormData({ name: '', slug: '', description: '' });
        } catch (error) {
            console.error('Failed to create category:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;
        try {
            setLoading(true);
            await api.deleteCategory(id);
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error('Failed to delete category:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
                    <p className="text-sm text-slate-500">Organize your products into logical groups for better structural control.</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                    {showForm ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Category</>}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-2xl border border-emerald-100 shadow-xl shadow-emerald-500/5 p-8 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">Display Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Organic Pulses"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">URL Slug</label>
                            <div className="relative">
                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={formData.slug}
                                    readOnly
                                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm italic text-slate-500 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-slate-700">Brief Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                rows={2}
                            />
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button
                                type="submit"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                            >
                                Save Category
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Classification</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Path / Slug</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Inventory</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-4 h-16 bg-slate-50/20"></td>
                                    </tr>
                                ))
                            ) : categories.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center text-slate-400">No categories defined yet</td>
                                </tr>
                            ) : categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{cat.name}</p>
                                                <p className="text-[10px] text-slate-400 max-w-[200px] truncate">{cat.description || 'No description provided'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        /{cat.slug}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Box className="w-3.5 h-3.5 text-slate-400" />
                                            <p className="text-sm text-slate-600 font-medium">{cat.productsCount || 0} Products</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-slate-100 hover:text-slate-600 rounded-lg transition-all">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
