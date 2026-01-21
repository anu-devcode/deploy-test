import Link from 'next/link';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <nav className="mb-8">
                    <Link href="/" className="text-emerald-600 hover:underline">
                        ← Back to Home
                    </Link>
                </nav>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">About Us</h1>

                <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to our store! We are dedicated to providing high-quality products
                            and exceptional customer service. Our mission is to make online shopping
                            simple, enjoyable, and accessible to everyone.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We believe in offering products that combine quality, value, and style.
                            Every item in our store is carefully selected to meet the highest standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Us?</h2>
                        <ul className="text-gray-600 space-y-2">
                            <li>✓ Quality products you can trust</li>
                            <li>✓ Fast and reliable shipping</li>
                            <li>✓ Excellent customer support</li>
                            <li>✓ Secure payment options</li>
                            <li>✓ Easy returns and refunds</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
