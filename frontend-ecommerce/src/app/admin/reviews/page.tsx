'use client';

import { useState, useEffect } from 'react';
import api, { Review } from '@/lib/api';
import {
    Star,
    CheckCircle2,
    XCircle,
    MessageSquare,
    User,
    Package,
    Clock,
    Filter,
    ShieldCheck,
    AlertCircle,
    MoreVertical
} from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const data = await api.getReviews();
            setReviews(data);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleModerate = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            setLoading(true);
            await api.moderateReview(reviewId, status);
            setReviews(reviews.map(r => r.id === reviewId ? { ...r, status } : r));
        } catch (error) {
            console.error('Failed to moderate review:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = reviews.filter(r => r.status === activeTab);

    const stats = [
        { label: 'Pending Moderation', value: reviews.filter(r => r.status === 'PENDING').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Avg. Rating', value: '4.8/5', icon: Star, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Trusted Score', value: '98%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Review Moderation</h1>
                    <p className="text-sm text-slate-500">Manage customer feedback and ensure community standards.</p>
                </div>
                <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 sm:flex-none px-4 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab.charAt(0) + tab.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    Array(3).fill(0).map((_, i) => (
                        <div key={i} className="h-40 bg-slate-50 rounded-2xl animate-pulse"></div>
                    ))
                ) : filteredReviews.length === 0 ? (
                    <div className="bg-white p-20 rounded-2xl border border-slate-100 text-center flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-900">No {activeTab.toLowerCase()} reviews</p>
                    </div>
                ) : (
                    filteredReviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-200 transition-all group">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                                <div className="flex gap-4 w-full">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0">
                                        {review.customerName.charAt(0)}
                                    </div>
                                    <div className="space-y-1 w-full">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900">{review.customerName}</p>
                                            <span className="hidden sm:inline text-slate-300">•</span>
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500 font-medium">
                                            <Package className="w-3 h-3" />
                                            <span className="truncate max-w-[150px]">{review.productName}</span>
                                            <span className="text-slate-300">•</span>
                                            <Clock className="w-3 h-3" />
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                        <p className="text-sm text-slate-700 mt-3 leading-relaxed max-w-2xl break-words">
                                            {review.comment}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    {review.status === 'PENDING' ? (
                                        <>
                                            <button
                                                onClick={() => handleModerate(review.id, 'APPROVED')}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleModerate(review.id, 'REJECTED')}
                                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-700 rounded-lg text-xs font-bold hover:bg-rose-100 transition-all border border-rose-100"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                Reject
                                            </button>
                                        </>
                                    ) : (
                                        <button className="p-2 ml-auto sm:ml-0 text-slate-400 hover:text-slate-600 rounded-lg">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
