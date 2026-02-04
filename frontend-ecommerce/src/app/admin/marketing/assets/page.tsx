'use client';

import { useState, useEffect, useRef } from 'react';
import api from '@/lib/api';
import {
    Plus,
    Download,
    Share2,
    Trash2,
    QrCode,
    Image as ImageIcon,
    LayoutGrid,
    Maximize,
    ChevronRight,
    Search,
    Filter,
    ArrowLeft,
    Box,
    ExternalLink,
    Loader2,
    Check,
    Palette,
    Type,
    Save,
    RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';

export default function MarketingAssetsPage() {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDesignerOpen, setIsDesignerOpen] = useState(false);
    const [products, setProducts] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        type: 'FLYER',
        productId: '',
        title: '',
        description: '',
        promoCode: '',
        qrLink: '',
        template: 'modern',
        config: {
            primaryColor: '#10b981',
            textColor: '#0f172a',
            showLogo: true
        }
    });

    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadAssets();
        loadProducts();
    }, []);

    const loadAssets = async () => {
        try {
            const data = await api.getMarketingAssets();
            setAssets(data || []);
        } catch (error) {
            console.error('Failed to load assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProducts = async () => {
        try {
            const data = await api.getProducts();
            setProducts(data || []);
        } catch (error) {
            console.error('Failed to load products:', error);
        }
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.qrLink) {
            toast.error('Name and QR link are required');
            return;
        }

        try {
            // Sanitize payload to avoid sending empty strings for optional fields
            const payload = {
                ...formData,
                productId: formData.productId || undefined,
                promoCode: formData.promoCode || undefined,
                title: formData.title || undefined,
                description: formData.description || undefined,
            };

            const newAsset = await api.createMarketingAsset(payload);
            setAssets([newAsset, ...assets]);
            setIsDesignerOpen(false);
            toast.success('Asset created successfully');
            resetForm();
        } catch (error) {
            toast.error('Failed to create asset');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this asset?')) return;
        try {
            await api.deleteMarketingAsset(id);
            setAssets(assets.filter(a => a.id !== id));
            toast.success('Asset deleted');
        } catch (error) {
            toast.error('Failed to delete asset');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'FLYER',
            productId: '',
            title: '',
            description: '',
            promoCode: '',
            qrLink: '',
            template: 'modern',
            config: {
                primaryColor: '#10b981',
                textColor: '#0f172a',
                showLogo: true
            }
        });
    };

    const downloadAsset = (id: string) => {
        const node = document.getElementById(`asset-node-${id}`);
        if (!node) return;

        // Force a slight delay to ensure everything is rendered, 
        // and use options to guarantee dimensions and background
        toPng(node, {
            backgroundColor: '#ffffff',
            pixelRatio: 2,
            cacheBust: true,
        })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `adis-marketing-asset-${id}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('oops, something went wrong!', err);
                toast.error('Failed to generate image');
            });
    };

    const handleProductSelect = (e: any) => {
        const prodId = e.target.value;
        const prod = products.find(p => p.id === prodId);
        if (prod) {
            setFormData({
                ...formData,
                productId: prodId,
                title: prod.name,
                description: prod.description || `Fresh ${prod.name} now available at our store!`,
                qrLink: `${window.location.origin}/products/${prod.slug}`
            });
        }
    };

    return (
        <div className="space-y-8 pb-20">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketing Assets</h1>
                    <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs flex items-center gap-2">
                        <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
                        Banners, Flyers & QR Generators
                    </p>
                </div>

                <button
                    onClick={() => setIsDesignerOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Create New Design
                </button>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
                    </div>
                ) : assets.length === 0 ? (
                    <div className="col-span-full bg-white py-32 rounded-[3rem] border border-slate-200 border-dashed text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <ImageIcon className="w-10 h-10" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">No marketing assets yet</h3>
                        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Design your first high-conversion flyer or banner</p>
                        <button
                            onClick={() => setIsDesignerOpen(true)}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            Start Designing
                        </button>
                    </div>
                ) : (
                    assets.map((asset) => (
                        <div key={asset.id} className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 hover:-translate-y-2">
                            {/* Card Preview Area */}
                            <div className="aspect-[4/5] bg-slate-50 relative p-6 flex flex-col items-center justify-center overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px]"></div>

                                {/* The Target Component for downloading (placed offscreen but within reasonable bounds) */}
                                <div
                                    id={`asset-node-${asset.id}`}
                                    style={{
                                        position: 'fixed',
                                        left: '-9999px',
                                        top: '0',
                                        backgroundColor: 'white',
                                        width: '400px',
                                        height: '500px'
                                    }}
                                    className="p-8 flex flex-col items-center text-center"
                                >
                                    <div className="w-full flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center"><Box className="w-3.5 h-3.5 text-white" /></div>
                                            <span className="text-[10px] font-black text-slate-900 uppercase">Adis Harvest</span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-4">{asset.title}</h2>
                                    <p className="text-sm font-medium text-slate-500 mb-8">{asset.description}</p>
                                    <QRCodeSVG value={asset.qrLink} size={200} />
                                    <div className="mt-auto pt-8 border-t border-slate-50 w-full">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Scan to Buy Now</p>
                                    </div>
                                </div>

                                {/* Mock Card Design for List View */}
                                <div className={`w-full h-full rounded-2xl bg-white shadow-lg p-6 flex flex-col items-center text-center relative z-10 border border-slate-100 ${asset.template === 'vibrant' ? 'bg-emerald-50' : ''}`}>
                                    <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
                                        <Box className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 leading-tight mb-2 uppercase tracking-wide">{asset.title || 'Special Offer'}</h4>
                                    <p className="text-[10px] text-slate-500 font-bold mb-6 line-clamp-3">{asset.description || 'Scan to view our latest collection'}</p>

                                    <div className="mt-auto w-32 h-32 bg-white border border-slate-100 rounded-2xl p-2 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        <QRCodeSVG value={asset.qrLink} size={112} />
                                    </div>

                                    {asset.promoCode && (
                                        <div className="mt-4 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg">
                                            <p className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">{asset.promoCode}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Hover Overlay Actions */}
                                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-20">
                                    <button
                                        onClick={() => downloadAsset(asset.id)}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 hover:bg-emerald-500 hover:text-white transition-all shadow-xl active:scale-90"
                                    >
                                        <Download className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(asset.id)}
                                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-xl active:scale-90"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Info Area */}
                            <div className="p-6 text-center">
                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[9px] font-black tracking-widest text-slate-500 uppercase mb-3 inline-block">
                                    {asset.type}
                                </span>
                                <h3 className="text-lg font-black text-slate-900 truncate mb-1">{asset.name}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                    {asset.product?.name || 'Manual Asset'}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Designer Drawer/Modal */}
            {isDesignerOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl transition-all duration-500" onClick={() => setIsDesignerOpen(false)}></div>
                    <div className="relative w-full max-w-6xl h-[90vh] bg-white rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20">
                        {/* Designer Sidebar (Controls) */}
                        <div className="w-full md:w-[400px] bg-white border-r border-slate-100 flex flex-col">
                            <div className="p-8 border-b border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200">
                                        <Palette className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase tracking-widest">Card Studio</h2>
                                </div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configure your marketing node</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                                {/* Type Selector */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Vector</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['FLYER', 'BANNER', 'SOCIAL_POST', 'QR_ONLY'].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={`px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.type === type ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-100' : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-500/30'}`}
                                            >
                                                {type.split('_')[0]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Connect to Product */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Source Product (Optional)</label>
                                    <select
                                        onChange={handleProductSelect}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 outline-none transition-all"
                                    >
                                        <option value="">Manual Entry</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Content Fields */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Name</label>
                                        <input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            type="text" placeholder="e.g. Summer Harvest Flyer" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:border-indigo-600 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Headline</label>
                                        <input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            type="text" placeholder="e.g. 30% OFF FRESH CROPS" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:border-indigo-600 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={3} placeholder="Tell them why they should scan..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:border-indigo-600 outline-none resize-none"></textarea>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">QR Destination Link</label>
                                        <div className="relative">
                                            <input
                                                value={formData.qrLink}
                                                onChange={(e) => setFormData({ ...formData, qrLink: e.target.value })}
                                                type="text" placeholder="https://example.com/..." className="w-full px-4 py-3 pl-12 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:border-indigo-600 outline-none"
                                            />
                                            <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Promo Code</label>
                                        <input
                                            value={formData.promoCode}
                                            onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                                            type="text" placeholder="e.g. HARVEST30" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold focus:border-indigo-600 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                                <button
                                    onClick={() => setIsDesignerOpen(false)}
                                    className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-all flex items-center gap-2"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Cancel
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <Save className="w-4 h-4" />
                                    Deploy Asset
                                </button>
                            </div>
                        </div>

                        {/* Designer Canvas (Preview) */}
                        <div className="flex-1 bg-slate-200/50 p-8 md:p-12 flex items-center justify-center overflow-auto">
                            <div className="relative w-full max-w-sm aspect-[4/5] bg-white rounded-[3rem] shadow-2xl overflow-hidden p-10 flex flex-col items-center">
                                {/* Design Guide Grid */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:24px_24px]"></div>

                                {/* Header Mock */}
                                <div className="w-full flex items-center justify-between mb-12 relative z-10">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center rotate-3"><Box className="w-5 h-5 text-white" /></div>
                                        <span className="text-[12px] font-black text-slate-900 tracking-tighter uppercase">Adis<span className="text-emerald-500">Harvest</span></span>
                                    </div>
                                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[8px] font-black text-emerald-600 uppercase tracking-widest">Digital Twin</div>
                                </div>

                                {/* Content Mock */}
                                <div className="flex-1 w-full flex flex-col items-center justify-center text-center relative z-10">
                                    <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-8 ring-[12px] ring-indigo-50/30">
                                        <QrCode className="w-12 h-12 text-indigo-600" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-4 tracking-tight uppercase">
                                        {formData.title || 'Your Story Starts Here'}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-[240px]">
                                        {formData.description || 'Custom description line for your marketing campaign.'}
                                    </p>

                                    <div className="mt-12 w-44 h-44 bg-white rounded-[2.5rem] p-5 flex items-center justify-center shadow-2xl ring-1 ring-slate-100 group">
                                        {formData.qrLink ? (
                                            <QRCodeSVG value={formData.qrLink} size={132} className="group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <QrCode className="w-16 h-16 text-slate-100" />
                                        )}
                                    </div>

                                    {formData.promoCode && (
                                        <div className="mt-8 px-6 py-2 bg-slate-900 rounded-full">
                                            <span className="text-[10px] font-black text-white tracking-[0.3em] uppercase">{formData.promoCode}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Mock */}
                                <div className="mt-8 pt-8 border-t border-slate-50 w-full text-center relative z-10">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Integrated Marketplace Link</p>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-[20%] -right-10 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-[20%] -left-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl"></div>
                            </div>
                        </div>

                        {/* Top Close Button (Mobile Only) */}
                        <button
                            onClick={() => setIsDesignerOpen(false)}
                            className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl md:hidden"
                        >
                            <ArrowLeft className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
