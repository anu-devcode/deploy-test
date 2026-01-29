'use client';

import { useState, useEffect } from 'react';
<<<<<<< HEAD
import {
    Tag,
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    ChevronRight,
    Package,
    ArrowRight,
    Leaf,
    Zap,
    LayoutGrid,
    AlertCircle
} from 'lucide-react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    children: Category[];
    _count?: { products: number };
}
=======
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
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546

const FALLBACK_CATEGORIES: Category[] = [
    { id: 'c1', name: 'Pulses & Grains', slug: 'pulses-grains', description: 'Premium lentils, wheat, and bulk grains.', children: [], _count: { products: 12 } },
    { id: 'c2', name: 'Oilseeds', slug: 'oilseeds', description: 'Export-grade sesame and sunflower seeds.', children: [], _count: { products: 8 } },
    { id: 'c3', name: 'Agri-Machinery', slug: 'machinery', description: 'Harvesters, tractors, and processing units.', children: [], _count: { products: 5 } },
    { id: 'c4', name: 'Specialized Produce', slug: 'specialized', description: 'Heirloom coffee and natural wild honey.', children: [], _count: { products: 14 } },
];

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

    useEffect(() => {
<<<<<<< HEAD
        // Simulate load
        setTimeout(() => {
            setCategories(FALLBACK_CATEGORIES);
            setLoading(false);
        }, 500);
    }, []);

    const handleCreate = async () => {
        console.log('Creating category:', newCategory);
        setShowCreate(false);
        setNewCategory({ name: '', slug: '', description: '' });
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">
                        Taxonomy <span className="text-emerald-600 font-serif italic normal-case">Architect</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Structure your global harvest classifications</p>
                </div>

                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 ${showCreate
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-emerald-500 text-[#022c22] hover:bg-emerald-400 shadow-emerald-500/20'
                        }`}
                >
                    {showCreate ? 'Cancel Protocol' : '+ New Classification'}
                </button>
            </div>

            {/* Creation Form */}
            {showCreate && (
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-50 animate-in slide-in-from-top-4 duration-500 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-50">
                            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <Zap className="text-emerald-600 w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Register <span className="text-emerald-600">Category</span></h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Display Label</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Export Grade Oilseeds"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">URL Identifier (Slug)</label>
                                <input
                                    type="text"
                                    placeholder="export-oilseeds"
                                    value={newCategory.slug}
                                    onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono text-sm"
                                />
                            </div>
                        </div>
                        <div className="space-y-2 mb-10">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Strategic Description</label>
                            <textarea
                                placeholder="Define the scope of this particular classification..."
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium h-24"
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                            <button
                                onClick={handleCreate}
                                className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20"
                            >
                                Commit Classification
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Listing */}
            <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm">
                            <Tag className="text-emerald-500 w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active <span className="text-emerald-600">Taxonomy</span></h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Master Classification Table</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="mt-6 text-sm font-black text-slate-400 uppercase tracking-widest">Calibrating Classifications...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50 text-left">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomenclature</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Routing Slug</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Asset Density</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {categories.map((category) => (
                                    <tr key={category.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer">
                                        <td className="px-10 py-8">
                                            <div className="flex items-center gap-6">
                                                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                                                    <Leaf className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-700 transition-colors">
                                                        {category.name}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-500 transition-colors max-w-xs truncate">
                                                        {category.description || 'No specialized description provided.'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8">
                                            <span className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-black text-slate-500 font-mono tracking-tighter uppercase whitespace-nowrap">
                                                /{category.slug}
                                            </span>
                                        </td>
                                        <td className="px-10 py-8 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xl font-black text-slate-900">{category._count?.products || 0}</span>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Listed Assets</span>
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
                                                <button className="w-10 h-10 bg-slate-900 border border-transparent rounded-xl flex items-center justify-center text-white hover:bg-emerald-600 transition-all">
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
=======
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
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
            </div>

            {/* Classification Insight */}
            <div className="bg-[#022c22] rounded-[3rem] p-12 text-white relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#022c22_80%)] z-10"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>

                <div className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-xl text-center md:text-left">
                        <h3 className="text-3xl font-black uppercase tracking-tight mb-4">Master <span className="text-emerald-400">Classifications</span></h3>
                        <p className="text-emerald-100/60 font-medium leading-relaxed">
                            Organize your agricultural repository with surgical precision. Correct taxonomy ensures high discoverability and optimized logistics for every listed asset.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[160px]">
                            <LayoutGrid className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
                            <p className="text-2xl font-black">12</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Hierarchies</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-center min-w-[160px]">
                            <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-4" />
                            <p className="text-2xl font-black">2</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Unclassified</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
