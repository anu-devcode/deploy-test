'use client';

<<<<<<< HEAD
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { seedProducts } from '@/lib/mock-data';
import {
    Package,
=======
import { useEffect, useState, useRef } from 'react';
import api, { Product, Category, PricingConfig } from '@/lib/api';
import {
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
    Plus,
    Search,
    Filter,
    MoreVertical,
<<<<<<< HEAD
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
=======
    Edit2,
    Trash2,
    ExternalLink,
    Box,
    AlertTriangle,
    CheckCircle2,
    LayoutGrid,
    List as ListIcon,
    Download,
    FolderTree,
    Tag,
    Image as ImageIcon,
    X,
    UploadCloud,
    Camera,
    ChevronDown,
    Truck,
    ShoppingCart,
    Globe,
    Layers,
    Eye,
    History,
    FileText,
    ArrowRight,
    Package
} from 'lucide-react';
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('LIST');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
<<<<<<< HEAD
        category: 'Pulses & Grains'
=======
        categoryId: '',
        images: [] as string[],
        retail: { enabled: true, price: '', unit: 'kg', minOrder: '1' },
        bulk: { enabled: false, price: '', unit: 'Quintal', minOrder: '5' }
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
<<<<<<< HEAD
            const data = await api.getAdminProducts();
            // Cast to central Product type and use seed products as fallback
            const combinedProducts = (data as any[]).length > 0 ? (data as any as Product[]) : seedProducts;
            setProducts(combinedProducts);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            setProducts(seedProducts);
=======
            setLoading(true);
            const [pData, cData] = await Promise.all([
                api.getAdminProducts(),
                api.getCategories()
            ]);
            setProducts(pData);
            setCategories(cData);
        } catch (error) {
            console.error('Failed to load data:', error);
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const newImages = Array.from(files).map(file => URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleEditClick = (product: Product) => {
        setIsEditing(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price.toString(),
            stock: product.stock.toString(),
            sku: product.sku || '',
            categoryId: product.categoryId || '',
            images: product.images || [],
            retail: {
                enabled: product.retail.enabled,
                price: product.retail.price.toString(),
                unit: product.retail.unit,
                minOrder: product.retail.minOrder.toString()
            },
            bulk: {
                enabled: product.bulk.enabled,
                price: product.bulk.price.toString(),
                unit: product.bulk.unit,
                minOrder: product.bulk.minOrder.toString()
            }
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const payload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price) || 0,
                stock: parseInt(formData.stock) || 0,
                sku: formData.sku || undefined,
<<<<<<< HEAD
            });
            setShowForm(false);
            setFormData({ name: '', description: '', price: '', stock: '', sku: '', category: 'Pulses & Grains' });
            fetchProducts();
=======
                categoryId: formData.categoryId || undefined,
                images: formData.images,
                retail: {
                    enabled: formData.retail.enabled,
                    price: parseFloat(formData.retail.price) || 0,
                    unit: formData.retail.unit,
                    minOrder: parseInt(formData.retail.minOrder) || 1
                },
                bulk: {
                    enabled: formData.bulk.enabled,
                    price: parseFloat(formData.bulk.price) || 0,
                    unit: formData.bulk.unit,
                    minOrder: parseInt(formData.bulk.minOrder) || 1
                }
            };

            if (isEditing) {
                const updated = await api.updateProduct(isEditing, payload);
                setProducts(products.map(p => p.id === isEditing ? updated : p));
            } else {
                const newProduct = await api.createProduct(payload);
                setProducts([newProduct, ...products]);
            }

            resetForm();
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
        } catch (error) {
            console.error('Failed to save product:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setShowForm(false);
        setIsEditing(null);
        setFormData({
            name: '', description: '', price: '', stock: '', sku: '', categoryId: '', images: [],
            retail: { enabled: true, price: '', unit: 'kg', minOrder: '1' },
            bulk: { enabled: false, price: '', unit: 'Quintal', minOrder: '5' }
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Permanently delete this product unit from inventory? This will remove all associated media and pricing logs.')) return;
        try {
            await api.deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
            if (selectedProduct?.id === id) setSelectedProduct(null);
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Total Stock', value: products.reduce((acc, p) => acc + p.stock, 0), icon: Box, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Inventory Value', value: 'ETB ' + products.reduce((acc, p) => acc + (p.retail.enabled ? p.retail.price * p.stock : 0), 0).toLocaleString(), icon: Globe, color: 'text-rose-600', bg: 'bg-rose-50' },
        { label: 'Live Units', value: products.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
<<<<<<< HEAD
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
=======
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Unit Management</h1>
                    <p className="text-sm text-slate-500">Logistical oversight for SKU inventory and wholesale/retail configurations.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                        <Download className="w-4 h-4" />
                        Export Logistics
                    </button>
                    <button
                        onClick={() => showForm ? resetForm() : setShowForm(true)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg active:scale-95 ${showForm ? 'bg-slate-200 text-slate-600' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'}`}
                    >
                        {showForm ? 'Cancel Operation' : <><Plus className="w-4 h-4" /> Add Unit</>}
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
            </div>

            {/* Inbound Listing Form */}
            {showForm && (
<<<<<<< HEAD
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
=======
                <div className="bg-white rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-500/5 p-8 animate-in slide-in-from-top-4 duration-400">
                    <div className="flex items-center gap-4 mb-10">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black ${isEditing ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            {isEditing ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{isEditing ? 'Refine Product Configuration' : 'Define New Product Unit'}</h2>
                            <p className="text-xs text-slate-400 font-medium">{isEditing ? `Modifying system record: ${isEditing}` : 'Registering a new logistical asset for distribution'}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                            {/* Media Section */}
                            <div className="space-y-6">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4 text-emerald-600" /> Visual Identity
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-slate-50/50 hover:bg-emerald-50/30 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 group px-10 text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                                        <UploadCloud className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Push Assets</p>
                                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium mt-1">Drag high-res PNG/JPG for gallery representation.</p>
                                    </div>
                                    <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                                </div>
                                {formData.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3">
                                        {formData.images.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group shadow-sm">
                                                <img src={src} alt="" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button type="button" onClick={() => removeImage(i)} className="w-8 h-8 bg-white text-rose-600 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Core Info Section */}
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2 space-y-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Inventory Name</label>
                                    <input
                                        type="text"
                                        placeholder="Technical title for catalog... (e.g. Ethiopian Highland Red Lentils)"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Taxonomy Category</label>
                                    <div className="relative">
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 appearance-none outline-none transition-all"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Asset SKU (Internal)</label>
                                    <input
                                        type="text"
                                        placeholder="AG-LENT-001"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Live Inventory Level</label>
                                    <div className="relative">
                                        <Box className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="number"
                                            value={formData.stock}
                                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2.5">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Base Reference Price</label>
                                    <div className="relative">
                                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input
                                            type="number"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-4 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MODE CONFIGURATION */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                            {/* Retail Config */}
                            <div className={`p-8 rounded-3xl border-2 transition-all duration-300 ${formData.retail.enabled ? 'border-emerald-200 bg-emerald-50/20 ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/5' : 'border-slate-100 bg-slate-50/30 opacity-60'}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.retail.enabled ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-200 text-slate-400'}`}>
                                            <ShoppingCart className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 tracking-tight">Retail Pipeline</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Consumer Mode</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, retail: { ...prev.retail, enabled: !prev.retail.enabled } }))}
                                        className={`w-14 h-7 rounded-full transition-all relative ${formData.retail.enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${formData.retail.enabled ? 'translate-x-8' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {formData.retail.enabled && (
                                    <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-bottom-3 duration-400">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price / Unit</label>
                                            <input
                                                type="number"
                                                value={formData.retail.price}
                                                onChange={(e) => setFormData(p => ({ ...p, retail: { ...p.retail, price: e.target.value } }))}
                                                className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                                placeholder="ETB"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metric Unit</label>
                                            <input
                                                type="text"
                                                value={formData.retail.unit}
                                                onChange={(e) => setFormData(p => ({ ...p, retail: { ...p.retail, unit: e.target.value } }))}
                                                className="w-full bg-white border border-emerald-100 rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                                placeholder="kg, pkg"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bulk Config */}
                            <div className={`p-8 rounded-3xl border-2 transition-all duration-300 ${formData.bulk.enabled ? 'border-indigo-200 bg-indigo-50/20 ring-4 ring-indigo-500/5 shadow-xl shadow-indigo-500/5' : 'border-slate-100 bg-slate-50/30 opacity-60'}`}>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${formData.bulk.enabled ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-200 text-slate-400'}`}>
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-900 tracking-tight">Wholesale Pipeline</h3>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Logistical Mode</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, bulk: { ...prev.bulk, enabled: !prev.bulk.enabled } }))}
                                        className={`w-14 h-7 rounded-full transition-all relative ${formData.bulk.enabled ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                    >
                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg transition-all duration-300 ${formData.bulk.enabled ? 'translate-x-8' : 'translate-x-1'}`} />
                                    </button>
                                </div>

                                {formData.bulk.enabled && (
                                    <div className="grid grid-cols-2 gap-5 animate-in slide-in-from-bottom-3 duration-400">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bulk Price</label>
                                            <input
                                                type="number"
                                                value={formData.bulk.price}
                                                onChange={(e) => setFormData(p => ({ ...p, bulk: { ...p.bulk, price: e.target.value } }))}
                                                className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                                placeholder="ETB"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistics Unit</label>
                                            <input
                                                type="text"
                                                value={formData.bulk.unit}
                                                onChange={(e) => setFormData(p => ({ ...p, bulk: { ...p.bulk, unit: e.target.value } }))}
                                                className="w-full bg-white border border-indigo-100 rounded-xl px-4 py-3 text-sm font-bold shadow-sm"
                                                placeholder="Quintal, MT"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="pt-6 flex gap-4 sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 border-t border-slate-50">
                            <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4.5 rounded-2xl text-sm font-black transition-all shadow-xl shadow-emerald-500/10 active:scale-95 flex items-center justify-center gap-3">
                                <CheckCircle2 className="w-5 h-5" /> {isEditing ? 'Commit Changes' : 'Publish Asset to Inventory'}
                            </button>
                            <button type="button" onClick={resetForm} className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-10 py-4.5 rounded-2xl text-sm font-black transition-all">
                                Discard Operation
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
                            </button>
                        </div>
                    </form>
                </div>
            )}

<<<<<<< HEAD
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
=======
            {/* Control Bar & Filter */}
            <div className="flex flex-wrap items-center gap-4 justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                        type="text"
                        placeholder="Search SKU, name, or metadata..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all"
                    />
                </div>
                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button onClick={() => setViewMode('LIST')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'LIST' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <ListIcon className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('GRID')} className={`p-2.5 rounded-xl transition-all ${viewMode === 'GRID' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
>>>>>>> 98372feb865722aa8435ac906c2e088f26d85546
            </div>

            {/* Inventory List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Details</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Structure</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level</th>
                                <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</th>
                                <th className="px-6 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/20 transition-colors group">
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative shadow-sm shrink-0">
                                                {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <Box className="w-6 h-6 text-slate-300 m-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 leading-none">{p.name}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="text-[9px] font-black text-slate-400 font-mono uppercase bg-slate-100 px-1.5 py-0.5 rounded tracking-tighter shadow-sm">{p.sku || 'NO-SKU'}</span>
                                                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-black uppercase">
                                                        <Layers className="w-3 h-3" /> {p.category || 'General'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-2.5">
                                            {p.retail.enabled && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm"><ShoppingCart className="w-3 h-3" /></div>
                                                    <p className="text-xs font-black text-slate-700">ETB {p.retail.price.toLocaleString()} <span className="text-slate-400 font-bold tracking-tight">/ {p.retail.unit}</span></p>
                                                </div>
                                            )}
                                            {p.bulk.enabled && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm"><Truck className="w-3 h-3" /></div>
                                                    <p className="text-xs font-black text-slate-700">ETB {p.bulk.price.toLocaleString()} <span className="text-slate-400 font-bold tracking-tight">/ {p.bulk.unit}</span></p>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="text-base font-black text-slate-900">{p.stock.toLocaleString()}</p>
                                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-black tracking-widest">Available Units</p>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm ${p.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-6 text-right">
                                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setSelectedProduct(p)}
                                                className="p-2.5 bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm active:scale-95"
                                                title="Inspect Asset"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditClick(p)}
                                                className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all shadow-sm active:scale-95"
                                                title="Modify Configuration"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all shadow-sm active:scale-95"
                                                title="Retire Asset"
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

            {/* Inventory Inspector Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-400">
                    <div className="bg-white w-full max-w-4xl rounded-[40px] shadow-3xl overflow-hidden animate-in zoom-in-95 duration-400 flex max-h-[90vh]">
                        {/* Left: Gallery & Visuals */}
                        <div className="w-2/5 bg-slate-50 p-10 flex flex-col gap-8">
                            <div className="aspect-square rounded-[32px] bg-white shadow-xl overflow-hidden border border-slate-100">
                                {selectedProduct.images?.[0] ? <img src={selectedProduct.images[0]} className="w-full h-full object-cover" /> : <Box className="w-12 h-12 text-slate-200 m-auto" />}
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {selectedProduct.images?.slice(1, 4).map((img, i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white border border-slate-100 overflow-hidden shadow-md">
                                        <img src={img} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {Array(Math.max(0, 3 - (selectedProduct.images?.length || 0 - 1))).fill(0).map((_, i) => (
                                    <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                                        <ImageIcon className="w-5 h-5 text-slate-300" />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-auto p-6 rounded-3xl bg-slate-900 text-white space-y-4">
                                <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                                    <History className="w-4 h-4" /> System Meta
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Created:</span>
                                        <span className="font-bold">{new Date(selectedProduct.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-400">Updated:</span>
                                        <span className="font-bold">{new Date(selectedProduct.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-xs pt-2 border-t border-slate-800">
                                        <span className="text-slate-400">SKU Reference:</span>
                                        <span className="font-mono text-emerald-400 font-black">{selectedProduct.sku || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Data & Actions */}
                        <div className="w-3/5 p-12 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">{selectedProduct.category || 'General'}</span>
                                    <h3 className="text-3xl font-black text-slate-900 mt-4 leading-tight">{selectedProduct.name}</h3>
                                </div>
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    <X className="w-6 h-6 text-slate-300" />
                                </button>
                            </div>

                            <p className="text-slate-500 text-sm leading-relaxed mb-10 font-medium">
                                {selectedProduct.description || 'No extended datasheet information available for this asset. The administrative record tracks logistical availability and multi-mode pricing configurations.'}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 space-y-2">
                                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Asset Valuation</p>
                                    <p className="text-2xl font-black text-slate-900">ETB {selectedProduct.price.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Base Unit Reference</p>
                                </div>
                                <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100 space-y-2">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Inventory Depth</p>
                                    <p className="text-2xl font-black text-slate-900">{selectedProduct.stock.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Current Total Units</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><Package className="w-3.5 h-3.5 inline mr-1" /> Active Configurations</h4>
                                <div className="flex flex-col gap-3">
                                    {selectedProduct.retail.enabled && (
                                        <div className="flex items-center justify-between p-4 px-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <ShoppingCart className="w-5 h-5 text-emerald-500" />
                                                <span className="text-sm font-bold text-slate-700">Retail Sales Mode</span>
                                            </div>
                                            <p className="text-sm font-black text-slate-900">ETB {selectedProduct.retail.price.toLocaleString()} <span className="text-slate-400 text-xs font-bold">/ {selectedProduct.retail.unit}</span></p>
                                        </div>
                                    )}
                                    {selectedProduct.bulk.enabled && (
                                        <div className="flex items-center justify-between p-4 px-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <Truck className="w-5 h-5 text-indigo-500" />
                                                <span className="text-sm font-bold text-slate-700">Wholesale Sales Mode</span>
                                            </div>
                                            <p className="text-sm font-black text-slate-900">ETB {selectedProduct.bulk.price.toLocaleString()} <span className="text-slate-400 text-xs font-bold">/ {selectedProduct.bulk.unit}</span></p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-auto grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => { setSelectedProduct(null); handleEditClick(selectedProduct); }}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white py-4.5 rounded-[24px] text-sm font-black transition-all shadow-xl shadow-indigo-500/10 flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Edit2 className="w-4 h-4" /> Modify Asset
                                </button>
                                <button
                                    onClick={() => handleDelete(selectedProduct.id)}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-600 py-4.5 rounded-[24px] text-sm font-black transition-all flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Retire Unit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
