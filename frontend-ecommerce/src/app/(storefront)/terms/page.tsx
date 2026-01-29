import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <nav className="mb-8">
                    <Link href="/" className="text-emerald-600 hover:underline">
                        ← Back to Home
                    </Link>
                </nav>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>

                <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8 text-gray-600">
                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the
                            terms and provisions of this agreement. If you do not agree to these terms,
                            please do not use this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Products and Pricing</h2>
                        <p>
                            All prices are displayed in Ethiopian Birr (ETB) and are subject to change
                            without notice. We reserve the right to modify or discontinue products
                            without prior notice.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Orders and Payment</h2>
                        <p>
                            When you place an order, you are offering to purchase a product subject to
                            these terms. All orders are subject to availability and confirmation of the
                            order price. Payment must be made at the time of ordering unless cash on
                            delivery is selected.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Shipping and Delivery</h2>
                        <p>
                            Delivery times are estimates and not guarantees. We are not responsible for
                            delays caused by circumstances beyond our control. Risk of loss and title
                            for items purchased pass to you upon delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Returns and Refunds</h2>
                        <p>
                            Items may be returned within 14 days of delivery for unused items in
                            original packaging. Refunds will be processed within 7-14 business days
                            after receiving the returned item.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">6. User Accounts</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account
                            information. You agree to accept responsibility for all activities that
                            occur under your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
                        <p>
                            If you have any questions about these Terms & Conditions, please contact us
                            at support@store.com.
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
