'use client';

import Link from 'next/link';
import { useCart } from '@/context';
import { Header, Footer } from '@/components';
import { useState } from 'react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { cart, removeFromCart, refreshCart } = useCart();
    const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping'>('cart');
    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        country: '',
        paymentMethod: 'CASH_ON_DELIVERY',
    });
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cart?.customerId) return;

        setProcessing(true);
        try {
            await api.checkout(cart.customerId, {
                shippingAddress: shippingData.address,
                shippingCity: shippingData.city,
                shippingCountry: shippingData.country,
                paymentMethod: shippingData.paymentMethod,
            });

            // Success
            await refreshCart();
            router.push('/admin/orders'); // Or a success page
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-8">
                    <div className="text-6xl mb-6">🛒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
                    <p className="text-gray-600 mb-8">Looks like you haven't added any items yet.</p>
                    <Link
                        href="/products"
                        className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        Start Shopping
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center text-3xl">
                                        🌾
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500">Unit Price: ETB {item.product.price}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="font-bold text-lg text-gray-900">
                                                ETB {Number(item.itemTotal).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>

                                        <button
                                            onClick={() => removeFromCart(item.productId)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Remove"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary & Checkout */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-6 rounded-2xl shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal ({cart.itemCount} items)</span>
                                        <span>ETB {Number(cart.subtotal).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
                                        <span>Total</span>
                                        <span>ETB {Number(cart.subtotal).toLocaleString()}</span>
                                    </div>
                                </div>

                                {checkoutStep === 'cart' ? (
                                    <button
                                        onClick={() => setCheckoutStep('shipping')}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                                    >
                                        Proceed to Checkout
                                    </button>
                                ) : (
                                    <form onSubmit={handleCheckout} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                            <input
                                                required
                                                type="text"
                                                value={shippingData.address}
                                                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                placeholder="Street Address"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={shippingData.city}
                                                    onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={shippingData.country}
                                                    onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                    placeholder="Country"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                            <select
                                                value={shippingData.paymentMethod}
                                                onChange={(e) => setShippingData({ ...shippingData, paymentMethod: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            >
                                                <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
                                                <option value="TELEBIRR">Telebirr</option>
                                                <option value="CBE">CBE Transfer</option>
                                            </select>
                                        </div>

                                        <div className="pt-4 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setCheckoutStep('cart')}
                                                className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-50 rounded-xl"
                                            >
                                                Back
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                                            >
                                                {processing ? 'Processing...' : 'Place Order'}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
