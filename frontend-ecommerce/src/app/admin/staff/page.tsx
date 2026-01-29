'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
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
    ShieldCheck
} from 'lucide-react';

export default function StaffPage() {
    const { user } = useAuth();
    const [staff, setStaff] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', role: 'STAFF' });

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchStaff();
        }
    }, [user]);

    const fetchStaff = async () => {
        try {
            const data = await api.getStaff();
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            const newMember = await api.inviteStaff(inviteData);
            setStaff([newMember, ...staff]);
            setShowInviteModal(false);
            setInviteData({ email: '', role: 'STAFF' });
        } catch (error) {
            console.error('Failed to invite staff:', error);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'ADMIN') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-600">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
                <p className="text-slate-500 max-w-sm">Only administrators can manage staff accounts and permissions.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
                    <p className="text-sm text-slate-500">Manage team members, roles, and administrative permissions.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                >
                    <UserPlus className="w-4 h-4" /> Invite Member
                </button>
            </div>

            {/* Role Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold">Administrators</h3>
                    </div>
                    <p className="text-indigo-100 text-xs leading-relaxed mb-4">
                        Full access to all system modules, including finance, staff management, and security settings.
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold bg-white/10 p-3 rounded-xl backdrop-blur-md">
                        <span>Active Admins</span>
                        <span>{staff.filter(s => s.role === 'ADMIN').length}</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <UserCog className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-900">Operators (Staff)</h3>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed mb-4">
                        Limited access to order processing, product management, and customer support. No financial data access.
                    </p>
                    <div className="flex items-center justify-between text-xs font-bold bg-slate-50 p-3 rounded-xl">
                        <span>Active Operators</span>
                        <span>{staff.filter(s => s.role === 'STAFF').length}</span>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-900">Invite Team Member</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <MoreVertical className="w-5 h-5 rotate-90" />
                                </button>
                            </div>
                            <form onSubmit={handleInvite} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="email"
                                            placeholder="e.g. member@brolf.com"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pl-10 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={inviteData.email}
                                            onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Assigned Role</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setInviteData({ ...inviteData, role: 'STAFF' })}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${inviteData.role === 'STAFF'
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <p className="text-xs font-bold">Operator</p>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setInviteData({ ...inviteData, role: 'ADMIN' })}
                                            className={`p-3 rounded-xl border-2 text-center transition-all ${inviteData.role === 'ADMIN'
                                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                                    : 'border-slate-100 text-slate-500 hover:bg-slate-50'
                                                }`}
                                        >
                                            <p className="text-xs font-bold">Admin</p>
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 transition-all active:scale-95 mt-4"
                                >
                                    Send Invitation
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Staff Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Activity</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-4 h-16 bg-slate-50/10"></td>
                                    </tr>
                                ))
                            ) : staff.map((member) => (
                                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                                                {member.name.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{member.name}</p>
                                                <p className="text-[11px] text-slate-500">{member.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {member.role === 'ADMIN' ? (
                                                <Shield className="w-3.5 h-3.5 text-indigo-500" />
                                            ) : (
                                                <UserCog className="w-3.5 h-3.5 text-slate-400" />
                                            )}
                                            <span className="text-xs font-bold text-slate-700">{member.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Clock className="w-3.5 h-3.5" />
                                            {member.lastActive === '-' ? 'Never' : new Date(member.lastActive).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${member.status === 'ACTIVE'
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                                            }`}>
                                            {member.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                                                <Lock className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg">
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
