'use client';

import { useState, useEffect } from 'react';
import api, { StaffMember, Permission } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import {
    UserCog,
    Plus,
    Shield,
    Mail,
    Clock,
    MoreVertical,
    Trash2,
    UserPlus,
    Lock,
    ShieldAlert,
    ShieldCheck,
    CheckCircle2,
    X,
    Key,
    Copy,
    ChevronDown,
    Activity,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

const PERMISSIONS_LIST: { id: Permission; label: string; description: string }[] = [
    { id: 'VIEW_INVENTORY', label: 'View Inventory', description: 'Can see warehouse stock levels and batch info.' },
    { id: 'MANAGE_STOCK', label: 'Manage Stock', description: 'Can perform stock-in/out and adjustments.' },
    { id: 'MANAGE_PRODUCTS', label: 'Manage Products', description: 'Can create and edit product listings.' },
    { id: 'VIEW_ORDERS', label: 'View Orders', description: 'Can view order history and customer details.' },
    { id: 'MANAGE_ORDERS', label: 'Process Orders', description: 'Can update order statuses and shipping.' },
    { id: 'VIEW_PAYMENTS', label: 'View Finance', description: 'Can access payment logs and revenue data.' },
    { id: 'MANAGE_STAFF', label: 'Administer Staff', description: 'Can create and manage other staff members.' },
];

export default function StaffPage() {
    const { adminUser: currentUser } = useAuth();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [tempCredential, setTempCredential] = useState<string | null>(null);

    // Form State
    const [form, setForm] = useState({
        name: '',
        email: '',
        role: 'STAFF' as 'ADMIN' | 'STAFF',
        permissions: [] as Permission[]
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const data = await api.getStaff();
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newMember = await api.createStaff({
                ...form,
                permissions: form.role === 'ADMIN' ? ['ALL'] : form.permissions
            });

            // Generate temporary credential for the new user
            const { tempPassword } = await api.adminUpdateStaffPassword(newMember.id);
            setTempCredential(tempPassword);

            setForm({ name: '', email: '', role: 'STAFF', permissions: [] });
            toast.success('Staff member created successfully');
            // Keep modal open to show credential
        } catch (error: any) {
            console.error('Failed to create staff:', error);
            const message = error.response?.data?.message || error.message || 'Failed to create staff';
            toast.error(message);
        }
    };

    const handleResetPassword = async (id: string) => {
        try {
            const { tempPassword } = await api.adminUpdateStaffPassword(id);
            setTempCredential(tempPassword);
            setIsResetModalOpen(true);
            const updatedStaff = staff.map(s => s.id === id ? { ...s, requiresPasswordChange: true } : s);
            setStaff(updatedStaff);
        } catch (error) {
            console.error('Failed to reset password:', error);
        }
    };

    const togglePermission = (perm: Permission) => {
        if (form.permissions.includes(perm)) {
            setForm({ ...form, permissions: form.permissions.filter(p => p !== perm) });
        } else {
            setForm({ ...form, permissions: [...form.permissions, perm] });
        }
    };

    const closeModals = () => {
        setIsCreateModalOpen(false);
        setIsResetModalOpen(false);
        setTempCredential(null);
    };

    if (currentUser?.role !== 'ADMIN' && !currentUser?.permissions.includes('ALL')) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
                <p className="text-slate-500 max-w-sm">Only administrators with full authorization can manage command staff and permissions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <UserPlus className="w-8 h-8 text-indigo-500" />
                        Staff Management
                    </h1>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Configure administrative nodes and access vectors</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    Initialize New Staff
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Personnel</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Role Vector</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorizations</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Security State</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {staff.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-900 font-black border border-slate-200">
                                                {(member.name || 'Unknown').split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900">{member.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            {member.role === 'ADMIN' ? (
                                                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                                            ) : (
                                                <UserCog className="w-3.5 h-3.5 text-slate-400" />
                                            )}
                                            <span className="text-xs font-bold text-slate-700">{member.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {member.permissions.includes('ALL') ? (
                                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 rounded text-[9px] font-black uppercase">FULL_AUTH</span>
                                            ) : (
                                                member.permissions.map((p, index) => (
                                                    <span key={`${member.id}-${p}-${index}`} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-black uppercase">
                                                        {String(p).split('_')[0]}
                                                    </span>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {member.requiresPasswordChange ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                <Key className="w-3 h-3" /> OTP_PENDING
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                                <ShieldCheck className="w-3 h-3" /> SECURED
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleResetPassword(member.id)}
                                                className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all group/btn"
                                            >
                                                <Lock className="w-4 h-4" />
                                                <span className="sr-only">Reset Password</span>
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
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

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModals}></div>
                    <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        {tempCredential ? (
                            <div className="p-10 space-y-8">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-lg">
                                        <ShieldCheck className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Staff Node Initialized</h3>
                                    <p className="text-sm text-slate-500">A one-time temporary credential has been generated. Provide this to the staff member immediately.</p>
                                </div>

                                <div className="bg-slate-900 p-8 rounded-3xl relative overflow-hidden group">
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Temporary Access Cipher</p>
                                            <p className="text-3xl font-mono font-black text-white tracking-wider">{tempCredential}</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(tempCredential);
                                                alert('Credential copied to clipboard');
                                            }}
                                            className="p-4 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl transition-all"
                                        >
                                            <Copy className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl" />
                                </div>

                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4 text-amber-700">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold leading-relaxed">
                                        FOR SECURITY: This credential is only shown once. If lost, you must perform a security reset to generate a new temporary cipher.
                                    </p>
                                </div>

                                <button
                                    onClick={closeModals}
                                    className="w-full py-6 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black active:scale-95"
                                >
                                    Dismiss & Complete Initialization
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateStaff}>
                                <div className="p-10 bg-slate-900 text-white flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-black tracking-tight">Initialize Personnel</h3>
                                        <p className="text-indigo-300/60 text-[10px] font-black uppercase tracking-widest mt-1">Register new administrative command node</p>
                                    </div>
                                    <button onClick={closeModals} className="p-3 hover:bg-white/10 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
                                </div>

                                <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                            <input
                                                type="text" required
                                                placeholder="e.g. Abebe Bekele"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Email</label>
                                            <input
                                                type="email" required
                                                placeholder="staff@brolf.com"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 text-sm font-bold focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Command Role</label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, role: 'STAFF' })}
                                                className={`p-6 rounded-3xl border-2 text-left transition-all ${form.role === 'STAFF' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-50 hover:bg-slate-50'}`}
                                            >
                                                <p className={`text-sm font-black ${form.role === 'STAFF' ? 'text-indigo-600' : 'text-slate-900'}`}>Operator Staff</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">Restricted granular access vectors</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, role: 'ADMIN' })}
                                                className={`p-6 rounded-3xl border-2 text-left transition-all ${form.role === 'ADMIN' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-50 hover:bg-slate-50'}`}
                                            >
                                                <p className={`text-sm font-black ${form.role === 'ADMIN' ? 'text-indigo-600' : 'text-slate-900'}`}>Administrator</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1">Full system-wide command authority</p>
                                            </button>
                                        </div>
                                    </div>

                                    {form.role === 'STAFF' && (
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Granular Authorizations</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {PERMISSIONS_LIST.map((perm) => (
                                                    <div
                                                        key={perm.id}
                                                        onClick={() => togglePermission(perm.id)}
                                                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${form.permissions.includes(perm.id) ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-50 hover:bg-slate-50'}`}
                                                    >
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className={`text-[11px] font-black uppercase tracking-tight ${form.permissions.includes(perm.id) ? 'text-emerald-700' : 'text-slate-900'}`}>{perm.label}</span>
                                                            {form.permissions.includes(perm.id) && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                                        </div>
                                                        <p className="text-[9px] text-slate-400 font-bold leading-tight">{perm.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-10 bg-slate-50 border-t border-slate-100">
                                    <button
                                        type="submit"
                                        className="w-full py-6 bg-indigo-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 hover:bg-indigo-700"
                                    >
                                        Register node & generate credential
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Reset Modal (Feedback only) */}
            {isResetModalOpen && tempCredential && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={closeModals}></div>
                    <div className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 p-10">
                        <div className="text-center space-y-4 mb-8">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-md">
                                <RefreshCw className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Reset Triggered</h3>
                            <p className="text-sm text-slate-500">Access has been revoked. Provide this new temporary cipher to the staff member.</p>
                        </div>

                        <div className="bg-slate-900 p-8 rounded-3xl flex items-center justify-between mb-8">
                            <div>
                                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">New Temporary Cipher</p>
                                <p className="text-3xl font-mono font-black text-white tracking-wider">{tempCredential}</p>
                            </div>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(tempCredential);
                                    alert('Credential copied');
                                }}
                                className="p-4 bg-white/10 text-white rounded-2xl"
                            >
                                <Copy className="w-6 h-6" />
                            </button>
                        </div>

                        <button
                            onClick={closeModals}
                            className="w-full py-6 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            Return to Command List
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
