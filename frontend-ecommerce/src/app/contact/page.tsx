'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In production, send to API
        console.log('Contact form:', formData);
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <nav className="mb-8">
                    <Link href="/" className="text-emerald-600 hover:underline">
                        ← Back to Home
                    </Link>
                </nav>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Contact Us</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>

                        {submitted ? (
                            <div className="text-center py-8">
                                <span className="text-4xl mb-4 block">✓</span>
                                <p className="text-lg text-gray-900">Thank you for your message!</p>
                                <p className="text-gray-500">We'll get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                                >
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Information</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900">📧 Email</h3>
                                <p className="text-gray-600">support@store.com</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">📞 Phone</h3>
                                <p className="text-gray-600">+251 911 123 456</p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">📍 Address</h3>
                                <p className="text-gray-600">
                                    Addis Ababa, Ethiopia<br />
                                    Bole Sub-City
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">🕒 Business Hours</h3>
                                <p className="text-gray-600">
                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                    Saturday: 10:00 AM - 4:00 PM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
