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
    const [showForm, setShowForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

    useEffect(() => {
        fetchData();
    }, [productId]);

    const fetchData = async () => {
        try {
            const [reviewsData, statsData] = await Promise.all([
                api.getProductReviews(productId),
                api.getProductStats(productId)
            ]);
            setReviews(reviewsData);
            setStats(statsData);
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

    if (loading) return <div className="text-center py-4">Loading reviews...</div>;

    return (
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            <div className="flex items-center gap-8 mb-8">
                <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</div>
                    <StarRating rating={Math.round(stats.averageRating)} />
                    <p className="text-gray-500 mt-1">{stats.totalReviews} reviews</p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-6 py-2 border-2 border-emerald-600 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                >
                    Write a Review
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl mb-8">
                    <h3 className="text-lg font-semibold mb-4">Write your review</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <StarRating
                            rating={newReview.rating}
                            setRating={(r) => setNewReview({ ...newReview, rating: r })}
                            editable
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                            rows={4}
                            placeholder="Tell us what you like or dislike about this product..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Submit Review
                    </button>
                </form>
            )}

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold">
                                        {review.customer?.firstName?.[0] || 'A'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {review.customer?.firstName || 'Anonymous'} {review.customer?.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} />
                            </div>
                            {review.comment && <p className="text-gray-600">{review.comment}</p>}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
