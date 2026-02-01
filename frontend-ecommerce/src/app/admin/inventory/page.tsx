'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import {
    Package,
    History,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    ShieldCheck,
    Truck,
    Clock,
    Search,
    Filter,
    ArrowRightLeft,
    Plus,
    X,
    CheckCircle2,
    Database,
    Layers,
    TrendingUp,
    FileText,
    Settings2
} from 'lucide-react';

export default function InventoryPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AUDIT' | 'LOW_STOCK' | 'BATCHES'>('OVERVIEW');
    const [searchTerm, setSearchTerm] = useState('');
    const [batches, setBatches] = useState<any[]>([]);

    // Modal states
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [stockAction, setStockAction] = useState<'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT'>('STOCK_IN');
    const [stockForm, setStockForm] = useState({ quantity: 0, reason: '', batchNumber: '', grade: 'Premium', expiryDate: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pData, lData] = await Promise.all([
                api.getAdminProducts(),
                api.getStockAuditLogs()
            ]);
            setProducts(pData);
            setAuditLogs(lData);

            // Collect all batches for the batches tab
            const allBatches = await Promise.all(pData.map((p: any) => api.getProductBatches(p.id)));
            setBatches(allBatches.flat());
        } catch (error) {
            console.error('Failed to load inventory data:', error);
            setProducts([]);
            setAuditLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStockAction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.processStockMovement({
                productId: selectedProduct.id,
                action: stockAction,
                quantity: stockForm.quantity,
                reason: stockForm.reason,
                batchNumber: stockAction === 'STOCK_IN' ? stockForm.batchNumber : undefined,
                grade: stockAction === 'STOCK_IN' ? stockForm.grade : undefined
            });
            setIsStockModalOpen(false);
            setStockForm({ quantity: 0, reason: '', batchNumber: '', grade: 'Premium', expiryDate: '' });
            fetchData();
        } catch (error: any) {
            alert(error.message);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockProducts = products.filter(p => p.stock < 100);

    const renderStockBadge = (val: number, label: string, color: string) => (
        <div className={`px-4 py-2 rounded-2xl ${color} border border-white/10 flex flex-col`}>
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</span>
            <span className="text-sm font-black tracking-tight">{val} kg</span>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Logistical Integrity</h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Inventory & Stock Control Center</p>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl relative z-10 overflow-x-auto max-w-full">
                    {[
                        { id: 'OVERVIEW', label: 'Overview', icon: Database },
                        { id: 'BATCHES', label: 'Batch Lifecycle', icon: FileText },
                        { id: 'LOW_STOCK', label: 'Low Stock', icon: AlertTriangle },
                        { id: 'AUDIT', label: 'Audit Trail', icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20'
                                : 'text-slate-400 hover:text-slate-600 hover:bg-white'}`}
                        >
                            <tab.icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Quick KPI Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Stock Strength', value: products.reduce((acc, p) => acc + p.stock, 0), unit: 'Units', icon: Layers, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active Batches', value: '34 active', unit: '', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Pending Reserved', value: products.reduce((acc, p) => acc + p.inventory.reserved, 0), unit: 'Units', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Quarantined / Damaged', value: products.reduce((acc, p) => acc + p.inventory.damaged, 0), unit: 'Units', icon: ShieldCheck, color: 'text-rose-600', bg: 'bg-rose-50' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${kpi.bg} flex items-center justify-center ${kpi.color} mb-4`}>
                            <kpi.icon className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                        <h3 className="text-2xl font-black text-slate-900">{kpi.value} <span className="text-xs font-bold text-slate-300">{kpi.unit}</span></h3>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Scan SKU or Enter Product Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/5 transition-all outline-none"
                    />
                </div>
                <button className="p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <Filter className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {/* Main Content Areas */}
            {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 gap-4">
                    {filteredProducts.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                                        <Package className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-lg font-black text-slate-900">{p.name}</h4>
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-500 uppercase tracking-widest">{p.sku}</span>
                                        </div>
                                        <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">{p.category}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {renderStockBadge(p.inventory.available, 'Available', 'bg-emerald-500/10 text-emerald-600')}
                                    {renderStockBadge(p.inventory.reserved, 'Reserved', 'bg-amber-500/10 text-amber-600')}
                                    {renderStockBadge(p.inventory.damaged, 'Damaged', 'bg-rose-500/10 text-rose-600')}
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setStockAction('STOCK_IN');
                                            setIsStockModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-5 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:glow-emerald transition-all"
                                    >
                                        <ArrowUpRight className="w-3.5 h-3.5" /> Stock In
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setStockAction('STOCK_OUT');
                                            setIsStockModalOpen(true);
                                        }}
                                        className="flex items-center gap-2 px-5 py-3 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:glow-rose transition-all"
                                    >
                                        <ArrowDownRight className="w-3.5 h-3.5" /> Stock Out
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setStockAction('ADJUSTMENT');
                                            setIsStockModalOpen(true);
                                        }}
                                        className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
                                    >
                                        <Settings2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'LOW_STOCK' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {lowStockProducts.map((p) => (
                        <div key={p.id} className="bg-white p-8 rounded-[40px] border-2 border-rose-100 shadow-lg shadow-rose-200/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-[100px] -mr-8 -mt-8"></div>
                            <div className="relative z-10">
                                <AlertTriangle className="w-8 h-8 text-rose-500 mb-6" />
                                <h4 className="text-xl font-black text-slate-900">{p.name}</h4>
                                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mt-2">Critical Level: {p.stock} units remaining</p>

                                <div className="mt-8 flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(p.stock / 100) * 100}%` }}></div>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-2 mt-2">Estimated Exhaustion: 48 Hours</p>
                                    </div>
                                    <button
                                        onClick={() => { setSelectedProduct(p); setStockAction('STOCK_IN'); setIsStockModalOpen(true); }}
                                        className="px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-slate-900/20 transition-all"
                                    >
                                        Replenish Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'BATCHES' && (
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                    <div className="p-8 border-b border-slate-50">
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Batch Repository</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Expiration & Quality Oversight</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Identity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Name</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Quality Grade</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Vol.</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration Vector</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {batches.map((batch) => {
                                    const product = products.find(p => p.id === batch.productId);
                                    const isExpiringSoon = batch.expiryDate && new Date(batch.expiryDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;
                                    return (
                                        <tr key={batch.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all"><FileText className="w-3.5 h-3.5" /></div>
                                                    <span className="text-xs font-black text-slate-900">{batch.batchNumber}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-bold text-slate-600">{product?.name || 'Unknown Asset'}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${batch.grade === 'Premium' ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                                                    }`}>
                                                    {batch.grade}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-black text-slate-900">{batch.quantity} kg</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-bold ${isExpiringSoon ? 'text-rose-500' : 'text-slate-600'}`}>
                                                        {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : 'NO EXPIRY SET'}
                                                    </span>
                                                    {isExpiringSoon && <span className="text-[9px] font-black text-rose-500 uppercase tracking-tighter mt-1">Critical Expiration</span>}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'AUDIT' && (
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <h3 className="text-xl font-black text-slate-900">Immutable Audit Trail</h3>
                        <div className="flex items-center gap-2">
                            <button className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 tracking-widest uppercase">Export CSV</button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Vector</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action Entity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistik Adjustment</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized By</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Context / Reason</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {auditLogs.map((log) => {
                                    const product = products.find(p => p.id === log.productId);
                                    return (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-100 rounded-lg"><Clock className="w-3.5 h-3.5 text-slate-400" /></div>
                                                    <span className="text-xs font-bold text-slate-600">{new Date(log.createdAt).toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${log.action === 'STOCK_IN' ? 'bg-emerald-500 text-white' :
                                                    log.action === 'STOCK_OUT' ? 'bg-rose-500 text-white' : 'bg-slate-900 text-white'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900">{product?.name || 'Unknown Asset'}</span>
                                                    <span className={`text-[10px] font-black uppercase mt-1 ${log.type === 'ADDITION' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                        {log.type === 'ADDITION' ? '+' : '-'}{log.quantity} units
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs font-black text-slate-900">{log.user}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-xs text-slate-400 font-medium italic">"{log.reason}"</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Stock Movement Modal */}
            {isStockModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsStockModalOpen(false)}></div>
                    <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className={`p-8 ${stockAction === 'STOCK_IN' ? 'bg-emerald-500' : stockAction === 'STOCK_OUT' ? 'bg-rose-500' : 'bg-slate-900'} text-white`}>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-black tracking-tight">{stockAction.replace('_', ' ')}</h3>
                                <button onClick={() => setIsStockModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/10">
                                <Package className="w-8 h-8 opacity-60" />
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Target Asset</p>
                                    <p className="text-lg font-black leading-tight">{selectedProduct?.name}</p>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleStockAction} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                                    <input
                                        type="number"
                                        required
                                        value={stockForm.quantity}
                                        onChange={(e) => setStockForm({ ...stockForm, quantity: parseInt(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-xl font-black focus:ring-2 focus:ring-slate-100 outline-none"
                                    />
                                </div>
                                {stockAction === 'STOCK_IN' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</label>
                                        <select
                                            value={stockForm.grade}
                                            onChange={(e) => setStockForm({ ...stockForm, grade: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:ring-2 focus:ring-slate-100 outline-none appearance-none cursor-pointer"
                                        >
                                            <option>Premium</option>
                                            <option>Grade A</option>
                                            <option>Standard</option>
                                        </select>
                                    </div>
                                )}
                            </div>

                            {stockAction === 'STOCK_IN' && (
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Identity</label>
                                        <input
                                            type="text"
                                            placeholder="BAT-2026-X"
                                            value={stockForm.batchNumber}
                                            onChange={(e) => setStockForm({ ...stockForm, batchNumber: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-slate-100 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiration Date</label>
                                        <input
                                            type="date"
                                            value={stockForm.expiryDate}
                                            onChange={(e) => setStockForm({ ...stockForm, expiryDate: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:ring-2 focus:ring-slate-100 outline-none appearance-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Log Context / Reason</label>
                                <textarea
                                    required
                                    rows={3}
                                    placeholder="Enter reason for stock movement..."
                                    value={stockForm.reason}
                                    onChange={(e) => setStockForm({ ...stockForm, reason: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:ring-2 focus:ring-slate-100 outline-none resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-5 rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:-translate-y-1 ${stockAction === 'STOCK_IN' ? 'bg-emerald-500 text-white shadow-emerald-500/20' :
                                    stockAction === 'STOCK_OUT' ? 'bg-rose-500 text-white shadow-rose-500/20' : 'bg-slate-900 text-white shadow-slate-900/20'
                                    }`}
                            >
                                Process Transaction
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
