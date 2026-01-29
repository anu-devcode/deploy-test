'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
    {
        question: 'How do I place an order?',
        answer: 'Simply browse our products, add items to your cart, and proceed to checkout. You can pay using various local payment methods including Telebirr, CBE, and M-Pesa.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept Telebirr, CBE (Commercial Bank of Ethiopia), M-Pesa, bank transfers, and cash on delivery for eligible orders.',
    },
    {
        question: 'How long does delivery take?',
        answer: 'Delivery times vary by location. Within Addis Ababa, expect 1-3 business days. For other regions, delivery typically takes 3-7 business days.',
    },
    {
        question: 'Can I track my order?',
        answer: 'Yes! Once your order is shipped, you will receive tracking information. You can also view your order status in your account dashboard.',
    },
    {
        question: 'What is your return policy?',
        answer: 'We accept returns within 14 days of delivery for unused items in original packaging. Please contact our support team to initiate a return.',
    },
    {
        question: 'How can I contact customer support?',
        answer: 'You can reach us via email at support@store.com, by phone at +251 911 123 456, or through our contact form.',
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 py-16">
                <nav className="mb-8">
                    <Link href="/" className="text-emerald-600 hover:underline">
                        ← Back to Home
                    </Link>
                </nav>

                <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                <p className="text-gray-600 mb-8">Find answers to common questions about our store and services.</p>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <span className="font-medium text-gray-900">{faq.question}</span>
                                <span className="text-2xl text-gray-400">
                                    {openIndex === index ? '−' : '+'}
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-4">
                                    <p className="text-gray-600">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-emerald-50 rounded-2xl p-8 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h2>
                    <p className="text-gray-600 mb-4">We're here to help!</p>
                    <Link
                        href="/contact"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}
