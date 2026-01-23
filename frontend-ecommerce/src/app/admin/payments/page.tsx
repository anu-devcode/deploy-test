'use client';

import { useState, useEffect } from 'react';

interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: string;
    status: string;
    transactionId?: string;
    createdAt: string;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
    FAILED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
};

const methodLabels: Record<string, string> = {
    TELEBIRR: 'Telebirr',
    CBE: 'CBE',
    MPESA: 'M-Pesa',
    BANK_TRANSFER: 'Bank Transfer',
    CASH_ON_DELIVERY: 'Cash on Delivery',
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPayments([]);
        setLoading(false);
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : payments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="text-4xl block mb-4">💳</span>
                        <p>No payments yet</p>
                        <p className="text-sm mt-1">Payments will appear when orders are placed</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Transaction ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Method</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {payments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm">
                                        {payment.transactionId || payment.id.slice(0, 12)}
                                    </td>
                                    <td className="px-6 py-4 font-semibold">
                                        ETB {payment.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {methodLabels[payment.method] || payment.method}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[payment.status]}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(payment.createdAt).toLocaleDateString()}
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
