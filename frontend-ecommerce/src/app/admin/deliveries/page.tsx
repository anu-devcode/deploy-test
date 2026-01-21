'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Delivery {
    id: string;
    orderId: string;
    status: string;
    driverName?: string;
    driverPhone?: string;
    estimatedTime?: string;
    order: {
        orderNumber?: string;
        customer: {
            firstName?: string;
            lastName?: string;
        };
    };
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ASSIGNED: 'bg-blue-100 text-blue-800',
    PICKED_UP: 'bg-indigo-100 text-indigo-800',
    IN_TRANSIT: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
};

export default function DeliveriesPage() {
    const [deliveries, setDeliveries] = useState<Delivery[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated data - in production, fetch from API
        setDeliveries([]);
        setLoading(false);
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Deliveries</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : deliveries.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="text-4xl block mb-4">🚚</span>
                        <p>No deliveries yet</p>
                        <p className="text-sm mt-1">Deliveries will appear when orders are shipped</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Order</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Customer</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Driver</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ETA</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {deliveries.map((delivery) => (
                                <tr key={delivery.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/orders/${delivery.orderId}`} className="text-emerald-600 hover:underline">
                                            {delivery.order.orderNumber || delivery.orderId.slice(0, 8)}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">
                                        {delivery.order.customer.firstName} {delivery.order.customer.lastName}
                                    </td>
                                    <td className="px-6 py-4">
                                        {delivery.driverName || '-'}
                                        {delivery.driverPhone && <span className="text-gray-400 ml-2">({delivery.driverPhone})</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[delivery.status]}`}>
                                            {delivery.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {delivery.estimatedTime || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium">
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
