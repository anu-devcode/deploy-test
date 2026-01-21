import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <nav className="mb-8">
                    <Link href="/" className="text-emerald-600 hover:underline">
                        ← Back to Home
                    </Link>
                </nav>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

                <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-600">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">We collect information you provide directly to us, including:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Name and contact information</li>
                            <li>Email address and phone number</li>
                            <li>Shipping and billing addresses</li>
                            <li>Payment information (processed securely)</li>
                            <li>Order history and preferences</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Process and fulfill your orders</li>
                            <li>Communicate with you about your orders</li>
                            <li>Send promotional communications (with your consent)</li>
                            <li>Improve our products and services</li>
                            <li>Prevent fraud and enhance security</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
                        <p>
                            We do not sell or rent your personal information to third parties. We may
                            share your information with service providers who assist in our operations,
                            such as payment processors and delivery partners.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
                        <p>
                            We implement appropriate security measures to protect your personal
                            information against unauthorized access, alteration, disclosure, or
                            destruction. However, no method of transmission over the Internet is
                            100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your data</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Cookies</h2>
                        <p>
                            We use cookies and similar technologies to improve your browsing experience,
                            analyze site traffic, and personalize content. You can control cookie
                            preferences through your browser settings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at
                            privacy@store.com.
                        </p>
                    </section>

                    <p className="text-sm text-gray-400 pt-4 border-t">
                        Last updated: January 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
