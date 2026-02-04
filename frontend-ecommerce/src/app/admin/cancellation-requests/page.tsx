'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Package, Search, X, Clock, MessageSquare, AlertCircle, ChevronDown, User, Calendar, Ban, CheckCircle2 } from 'lucide-react';

interface CancellationRequest {
    id: string;
    orderId: string;
    order: {
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: string;
        items: any[];
        shippingAddress?: string;
        shippingCity?: string;
    };
    customer?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
    };
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    staffFeedback?: string;
    reviewedByUser?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    requestedAt: string;
    reviewedAt?: string;
}

export default function CancellationRequestsPage() {
    const [requests, setRequests] = useState<CancellationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
    const [reviewingId, setReviewingId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const status = filter === 'ALL' ? undefined : filter;
            const data = await api.getCancellationRequests(status);
            setRequests(data);
        } catch (e) {
            console.error('Failed to fetch cancellation requests:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (requestId: string, decision: 'APPROVED' | 'REJECTED') => {
        if (decision === 'REJECTED' && !feedback.trim()) {
            alert('Please provide feedback when rejecting a request.');
            return;
        }

        setSubmitting(true);
        try {
            await api.reviewCancellationRequest(requestId, decision, feedback);
            await fetchRequests();
            setReviewingId(null);
            setFeedback('');
            alert(`Request ${decision.toLowerCase()} successfully.`);
        } catch (e: any) {
            console.error('Failed to review request:', e);
            alert(e.message || 'Failed to review request.');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            req.order?.orderNumber?.toLowerCase().includes(query) ||
            req.customer?.email?.toLowerCase().includes(query) ||
            req.customer?.firstName?.toLowerCase().includes(query) ||
            req.customer?.lastName?.toLowerCase().includes(query) ||
            req.reason.toLowerCase().includes(query)
        );
    });

    const pendingCount = requests.filter(r => r.status === 'PENDING').length;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Cancellation Requests</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1">Review and manage customer order cancellation requests</p>
                </div>
                {pendingCount > 0 && (
                    <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-black text-amber-700">{pendingCount} Pending Review</span>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by order #, customer, or reason..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold focus:border-slate-900 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === status
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                </div>
            )}

            {/* Empty State */}
            {!loading && filteredRequests.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900">No Requests Found</h3>
                    <p className="text-sm font-bold text-slate-400 mt-2">
                        {filter === 'PENDING' ? 'No pending cancellation requests at this time.' : 'No cancellation requests match your criteria.'}
                    </p>
                </div>
            )}

            {/* Requests List */}
            {!loading && filteredRequests.length > 0 && (
                <div className="space-y-4">
                    {filteredRequests.map((request) => (
                        <div
                            key={request.id}
                            className={`bg-white rounded-[1.5rem] border transition-all overflow-hidden ${request.status === 'PENDING'
                                ? 'border-amber-200 ring-1 ring-amber-100 shadow-lg shadow-amber-50'
                                : 'border-slate-100 shadow-sm'
                                }`}
                        >
                            <div className="p-6 md:p-8">
                                {/* Request Header */}
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${request.status === 'PENDING' ? 'bg-amber-100 text-amber-600' :
                                            request.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                                'bg-rose-100 text-rose-600'
                                            }`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-lg font-black text-slate-900">Order {request.order?.orderNumber}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border ${request.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    request.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                        'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}>
                                                    {request.status}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-slate-100 text-slate-500 border border-slate-200">
                                                    {request.order?.status}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                                <span className="flex items-center gap-1.5">
                                                    <User className="w-3.5 h-3.5" />
                                                    {request.customer?.firstName} {request.customer?.lastName} ({request.customer?.email})
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    Requested {new Date(request.requestedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Total</p>
                                        <p className="text-xl font-black text-slate-900">ETB {request.order?.total?.toLocaleString()}</p>
                                    </div>
                                </div>

                                {/* Cancellation Reason - Highlighted */}
                                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 mb-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 mb-2 flex items-center gap-2">
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        Customer's Reason for Cancellation
                                    </h4>
                                    <p className="text-base font-bold text-amber-900">{request.reason}</p>
                                </div>

                                {/* Order Items Summary */}
                                <div className="mb-6">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Order Items ({request.order?.items?.length})</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {request.order?.items?.slice(0, 3).map((item: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold text-slate-600">
                                                {item.product?.name || 'Product'} × {item.quantity}
                                            </span>
                                        ))}
                                        {request.order?.items?.length > 3 && (
                                            <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-500">
                                                +{request.order.items.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Staff Feedback (if reviewed) */}
                                {request.status !== 'PENDING' && request.staffFeedback && (
                                    <div className={`p-4 rounded-2xl mb-6 ${request.status === 'APPROVED' ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                                        <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-2 ${request.status === 'APPROVED' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            Staff Response
                                        </h4>
                                        <p className={`text-sm font-bold ${request.status === 'APPROVED' ? 'text-emerald-700' : 'text-rose-700'}`}>
                                            {request.staffFeedback}
                                        </p>
                                        {request.reviewedByUser && (
                                            <p className={`text-xs font-bold mt-2 ${request.status === 'APPROVED' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                — {request.reviewedByUser.firstName} {request.reviewedByUser.lastName} • {new Date(request.reviewedAt!).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Review Actions (for pending requests) */}
                                {request.status === 'PENDING' && (
                                    <div className="border-t border-slate-100 pt-6">
                                        {reviewingId === request.id ? (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                                        Feedback / Response to Customer
                                                    </label>
                                                    <textarea
                                                        value={feedback}
                                                        onChange={(e) => setFeedback(e.target.value)}
                                                        placeholder="Provide feedback (required for rejection, optional for approval)..."
                                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-bold focus:border-slate-900 outline-none transition-all h-24 resize-none"
                                                    />
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setReviewingId(null);
                                                            setFeedback('');
                                                        }}
                                                        className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={() => handleReview(request.id, 'REJECTED')}
                                                        disabled={submitting || !feedback.trim()}
                                                        className="flex-1 px-6 py-3 bg-rose-500 text-white rounded-xl font-black hover:bg-rose-600 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <Ban className="w-4 h-4" />
                                                        Reject Request
                                                    </button>
                                                    <button
                                                        onClick={() => handleReview(request.id, 'APPROVED')}
                                                        disabled={submitting}
                                                        className="flex-1 px-6 py-3 bg-emerald-500 text-white rounded-xl font-black hover:bg-emerald-600 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        Approve & Cancel Order
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => setReviewingId(request.id)}
                                                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-black hover:bg-black transition-all text-sm flex items-center gap-2 shadow-lg shadow-slate-200"
                                                >
                                                    Review Request
                                                    <ChevronDown className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
