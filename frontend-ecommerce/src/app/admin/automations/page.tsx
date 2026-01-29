'use client';

import { useEffect, useState } from 'react';
import api, { AutomationRule, AutomationLog, AutomationTrigger, AutomationAction } from '@/lib/api';
import {
    Zap,
    Plus,
    X,
    CheckCircle2,
    AlertCircle,
    Settings2,
    Trash2,
    Clock,
    Activity,
    ChevronRight,
    Play,
    Pause,
    Filter,
    Search,
    RefreshCw,
    Terminal,
    Bell,
    Mail,
    FileText,
    Shield
} from 'lucide-react';

export default function WorkflowAutomationPage() {
    const [rules, setRules] = useState<AutomationRule[]>([]);
    const [logs, setLogs] = useState<AutomationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'RULES' | 'LOGS'>('RULES');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [newRule, setNewRule] = useState<Partial<AutomationRule>>({
        name: '',
        trigger: 'ORDER_CREATED',
        condition: '',
        action: 'UPDATE_STATUS',
        actionValue: 'CONFIRMED'
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [rData, lData] = await Promise.all([
                api.getAutomationRules(),
                api.getAutomationLogs()
            ]);
            setRules(rData);
            setLogs(lData);
        } catch (error) {
            console.error('Failed to load automation data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRule = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createAutomationRule(newRule);
            setIsCreateModalOpen(false);
            setNewRule({ name: '', trigger: 'ORDER_CREATED', condition: '', action: 'UPDATE_STATUS', actionValue: 'CONFIRMED' });
            fetchData();
        } catch (error) {
            console.error('Failed to create rule:', error);
        }
    };

    const handleToggleRule = async (id: string, enabled: boolean) => {
        try {
            await api.updateAutomationRule(id, { enabled });
            setRules(rules.map(r => r.id === id ? { ...r, enabled } : r));
        } catch (error) {
            console.error('Failed to toggle rule:', error);
        }
    };

    const handleDeleteRule = async (id: string) => {
        if (!confirm('Are you sure you want to delete this automation?')) return;
        try {
            await api.deleteAutomationRule(id);
            setRules(rules.filter(r => r.id !== id));
        } catch (error) {
            console.error('Failed to delete rule:', error);
        }
    };

    const getTriggerIcon = (t: AutomationTrigger) => {
        switch (t) {
            case 'ORDER_CREATED': return ShoppingBag;
            case 'STOCK_LOW': return AlertCircle;
            case 'PAYMENT_RECEIVED': return CreditCard;
            case 'CUSTOMER_REGISTERED': return Users;
            default: return Zap;
        }
    };

    const getActionIcon = (a: AutomationAction) => {
        switch (a) {
            case 'UPDATE_STATUS': return RefreshCw;
            case 'NOTIFY_STAFF': return Bell;
            case 'SEND_EMAIL': return Mail;
            case 'GENERATE_INVOICE': return FileText;
            default: return Play;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Zap className="w-8 h-8 text-indigo-500" />
                        Command Automation
                    </h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure automated logistical responses</p>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-2xl">
                        <button
                            onClick={() => setActiveTab('RULES')}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'RULES' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Active Rules
                        </button>
                        <button
                            onClick={() => setActiveTab('LOGS')}
                            className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'LOGS' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Execution Log
                        </button>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" />
                        Create Automation
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            {activeTab === 'RULES' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {rules.map((rule) => (
                        <div key={rule.id} className={`bg-white p-8 rounded-[40px] border ${rule.enabled ? 'border-slate-100 shadow-sm' : 'border-slate-100 opacity-60 grayscale'} transition-all group`}>
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl ${rule.enabled ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                                        <Zap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{rule.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Rule ID: {rule.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleRule(rule.id, !rule.enabled)}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${rule.enabled ? 'bg-emerald-500' : 'bg-slate-200'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rule.enabled ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 line-clamp-1">
                                            <Terminal className="w-3 h-3" /> Event Trigger
                                        </p>
                                        <p className="text-xs font-black text-slate-900">{rule.trigger.replace('_', ' ')}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 line-clamp-1">
                                            <Activity className="w-3 h-3" /> Automated Action
                                        </p>
                                        <p className="text-xs font-black text-slate-900">{rule.action.replace('_', ' ')}</p>
                                    </div>
                                </div>

                                <div className="bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/50">
                                    <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-2">Execution Condition</p>
                                    <code className="text-[10px] font-mono font-bold text-indigo-700 bg-white px-2 py-1 rounded-lg border border-indigo-100 inline-block">{rule.condition || 'No condition (Always Run)'}</code>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Registered: {new Date(rule.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Settings2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteRule(rule.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-5 duration-700">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-slate-900">Execution Intelligence</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Audit log of automated command resolutions</p>
                        </div>
                        <button onClick={fetchData} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"><RefreshCw className="w-5 h-5" /></button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Execution Pulse</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rule Definition</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Entity</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Result Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-slate-100 rounded-lg"><Clock className="w-3.5 h-3.5 text-slate-400" /></div>
                                                <span className="text-xs font-bold text-slate-600 truncate max-w-[120px]">{new Date(log.createdAt).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2">
                                                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                                                <span className="text-sm font-black text-slate-900">{log.ruleName}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">ID: {log.entityId}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                                                <div className={`w-1 h-1 rounded-full ${log.status === 'SUCCESS' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest">{log.status}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-xs text-slate-400 font-medium italic">"{log.details}"</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create Rule Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsCreateModalOpen(false)}></div>
                    <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-10 bg-slate-900 text-white relative overflow-hidden">
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                        <Zap className="w-8 h-8 text-indigo-400" />
                                        New Logistical Rule
                                    </h3>
                                    <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-widest mt-1">Define Automated Command Sequences</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
                            </div>
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />
                        </div>

                        <form onSubmit={handleCreateRule} className="p-10 space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rule Identity (Name)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Ethiopia Local Priority Routing"
                                    value={newRule.name}
                                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Event Trigger</label>
                                    <select
                                        value={newRule.trigger}
                                        onChange={(e) => setNewRule({ ...newRule, trigger: e.target.value as any })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="ORDER_CREATED">Order Created</option>
                                        <option value="PAYMENT_RECEIVED">Payment Received</option>
                                        <option value="STOCK_LOW">Stock Low Alert</option>
                                        <option value="CUSTOMER_REGISTERED">New Registration</option>
                                    </select>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logistical Action</label>
                                    <select
                                        value={newRule.action}
                                        onChange={(e) => setNewRule({ ...newRule, action: e.target.value as any })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="UPDATE_STATUS">Update Status</option>
                                        <option value="NOTIFY_STAFF">Notify Staff</option>
                                        <option value="SEND_EMAIL">Contact Client</option>
                                        <option value="GENERATE_INVOICE">Sync Ledger</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Condition (Expression)</label>
                                <textarea
                                    placeholder="e.g. order.total > 10000 && customer.region == 'Addis Ababa'"
                                    value={newRule.condition}
                                    onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                                    rows={2}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-[10px] font-mono font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-6 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 hover:bg-indigo-700 active:scale-95"
                            >
                                Register Automation Node
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// Simple icons placeholders for internal mapping
function ShoppingBag(props: any) { return <Activity {...props} /> }
import { CreditCard, Users } from 'lucide-react';
