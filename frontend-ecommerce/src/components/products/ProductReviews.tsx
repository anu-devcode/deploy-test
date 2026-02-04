'use client';

import { useState, useEffect } from 'react';
import api, { Review } from '@/lib/api';

interface StarRatingProps {
    rating: number;
    setRating?: (rating: number) => void;
    editable?: boolean;
}

export function StarRating({ rating, setRating, editable = false }: StarRatingProps) {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex text-yellow-400">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        key={index}
                        type="button"
                        className={`text-2xl ${editable ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => editable && setRating && setRating(ratingValue)}
                        onMouseEnter={() => editable && setHover(ratingValue)}
                        onMouseLeave={() => editable && setHover(0)}
                        disabled={!editable}
                    >
                        {ratingValue <= (hover || rating) ? '★' : '☆'}
                    </button>
                );
            })}
        </div>
    );
}

interface ProductReviewsProps {
    productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
    const [loading, setLoading] = useState(true);
    const [canReview, setCanReview] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchData();
    }, [productId]);

    const fetchData = async () => {
        try {
            const [reviewsData, statsData, reviewStatus] = await Promise.all([
                api.getProductReviews(productId),
                api.getProductStats(productId),
                api.canReview(productId)
            ]);
            setReviews(reviewsData);
            setStats(statsData);
            setCanReview(reviewStatus);
        } catch (e) {
            console.error("Failed to fetch reviews", e);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createReview({
                productId,
                rating: newReview.rating,
                comment: newReview.comment,
            });
            setShowForm(false);
            setNewReview({ rating: 5, comment: '' });
            fetchData();
        } catch (error) {
            console.error('Failed to submit review:', error);
            alert('Failed to submit review. You may have already reviewed this product.');
        }
    };

    if (loading) return <div className="text-center py-12 text-slate-400 font-medium">Loading reviews...</div>;

    return (
        <div className="mt-20 border-t border-slate-100 pt-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Community Feedback</h2>
                    <p className="text-slate-500 font-medium">Rating and reviews from verified buyers.</p>
                </div>

                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-slate-900">{stats.averageRating.toFixed(1)}</div>
                        <div>
                            <StarRating rating={Math.round(stats.averageRating)} />
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">{stats.totalReviews} total reviews</p>
                        </div>
                    </div>

                    {canReview && (
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-sm"
                        >
                            {showForm ? 'Cancel Review' : 'Write a Review'}
                        </button>
                    )}
                    {!canReview && (
                        <div className="px-6 py-3 bg-slate-100 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest cursor-not-allowed flex items-center gap-2">
                            Verified Purchase Required
                        </div>
                    )}
                </div>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-3xl mb-12 border border-slate-100 animate-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Write your review</h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rating</label>
                            <StarRating
                                rating={newReview.rating}
                                setRating={(r) => setNewReview({ ...newReview, rating: r })}
                                editable
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Comment</label>
                            <textarea
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-700"
                                rows={4}
                                placeholder="Share your experience with this product..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200"
                        >
                            Publish Review
                        </button>
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.length === 0 ? (
                    <div className="col-span-2 text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <p className="text-slate-400 font-medium italic">No reviews yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-8 rounded-3xl border border-slate-100 hover:border-emerald-100 transition-colors">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold shadow-sm">
                                        {review.customer?.firstName?.[0] || 'A'}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">
                                            {review.customer?.firstName || 'Anonymous'} {review.customer?.lastName}
                                        </p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            {review.comment && (
                                <p className="text-slate-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
