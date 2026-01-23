'use client';

import { useState, useEffect } from 'react';

interface Review {
    id: string;
    rating: number;
    comment?: string;
    status: string;
    customer: {
        firstName?: string;
        lastName?: string;
        email: string;
    };
    product: {
        id: string;
        name: string;
    };
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
};

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING');

    useEffect(() => {
        setReviews([]);
        setLoading(false);
    }, [filter]);

    const handleModerate = async (reviewId: string, status: 'APPROVED' | 'REJECTED') => {
        // API call to moderate review
        console.log(`Moderating review ${reviewId} to ${status}`);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reviews</h1>
                <div className="flex gap-2">
                    {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === status
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : reviews.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="text-4xl block mb-4">⭐</span>
                        <p>No {filter.toLowerCase()} reviews</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {reviews.map((review) => (
                            <div key={review.id} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span key={star} className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[review.status]}`}>
                                                {review.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 mb-2">{review.comment || 'No comment'}</p>
                                        <div className="text-sm text-gray-500">
                                            <span>{review.customer.firstName} {review.customer.lastName}</span>
                                            <span className="mx-2">•</span>
                                            <span>{review.product.name}</span>
                                            <span className="mx-2">•</span>
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    {review.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleModerate(review.id, 'APPROVED')}
                                                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleModerate(review.id, 'REJECTED')}
                                                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
