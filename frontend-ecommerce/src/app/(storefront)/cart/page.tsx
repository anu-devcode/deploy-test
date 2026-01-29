'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context';
import { ShoppingCart, Trash2, ArrowRight, MapPin, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CartHero } from '@/components/cart';

export default function CartPage() {
    const { items, subtotal, itemCount, removeFromCart, clearCart, loading } = useCart();
    const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'success'>('cart');
    const [processing, setProcessing] = useState(false);
    const router = useRouter();

    const [shippingData, setShippingData] = useState({
        address: '',
        city: '',
        phone: '',
        notes: ''
    });

    const handleCheckout = () => {
        setProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setProcessing(false);
            setStep('success');
            clearCart();
        }, 2000);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (itemCount === 0 && step !== 'success') {
        return (
            <>
                <CartHero />
                <div className="min-h-screen bg-slate-50 flex flex-col">
                    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <ShoppingCart className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">Your cart is empty</h1>
                        <p className="text-slate-600 mb-8 max-w-md">
                            Looks like you haven't added any premium harvests yet. Start exploring our collection today!
                        </p>
                        <Link
                            href="/#products"
                            className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all"
                        >
                            Explore Products
                        </Link>
                    </main>
                </div>
            </>
        );
    }

    if (step === 'success') {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 text-white shadow-2xl shadow-emerald-500/30">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-4 text-emerald-600">Order Placed Successfully!</h1>
                    <p className="text-slate-600 mb-10 max-w-md font-medium">
                        Thank you for choosing Tsega Trading Group. We've received your order and our logistics team is already preparing your shipment.
                    </p>
                    <div className="flex gap-4">
                        <Link
                            href="/"
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all"
                        >
                            Back Home
                        </Link>
                        <Link
                            href="/profile"
                            className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all"
                        >
                            View Order
                        </Link>
                    </div>
                </main>
            </div>

        );
    }

    return (
        <div className="min-h-screen bg-[#022c22] flex flex-col transition-colors duration-1000">
            {/* Background Atmosphere */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px] animate-pulse delay-1000"></div>
            </div>


            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                    {/* Stepper */}
                    <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto relative z-10">
                        <div className={`flex flex-col items-center gap-2 flex-1`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step === 'cart' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-emerald-400'}`}>1</div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 'cart' ? 'text-white' : 'text-slate-500'}`}>Review Items</span>
                        </div>
                        <div className="h-[2px] w-20 bg-white/10 -mt-6"></div>
                        <div className={`flex flex-col items-center gap-2 flex-1`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step === 'shipping' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-emerald-400'}`}>2</div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 'shipping' ? 'text-white' : 'text-slate-500'}`}>Shipping</span>
                        </div>
                        <div className="h-[2px] w-20 bg-white/10 -mt-6"></div>
                        <div className={`flex flex-col items-center gap-2 flex-1`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step === 'payment' ? 'bg-emerald-500 text-slate-950 scale-110 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-white/10 text-emerald-400'}`}>3</div>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 'payment' ? 'text-white' : 'text-slate-500'}`}>Payment</span>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Left Side: Content */}
                        <div className="lg:col-span-8">
                            {step === 'cart' && (
                                <div className="space-y-6 animate-in slide-in-from-left duration-700">
                                    <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                                        Your Harvest <span className="px-5 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-full text-xs uppercase tracking-widest border border-emerald-500/20">{itemCount} items</span>
                                    </h2>
                                    {items.map((item) => (
                                        <div key={item.productId} className="bg-white/5 backdrop-blur-3xl p-6 rounded-[2.5rem] shadow-2xl border border-white/10 hover:border-emerald-500/40 transition-all group overflow-hidden relative">
                                            {/* Glow Effect */}
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[50px] group-hover:bg-emerald-500/10 transition-colors"></div>

                                            <div className="relative z-10 flex flex-wrap sm:flex-nowrap items-center gap-8">
                                                <div className="relative w-28 h-28 bg-white/5 rounded-3xl overflow-hidden flex items-center justify-center text-5xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
                                                    🌾
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors uppercase tracking-tight">
                                                        {item.product.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4 items-center">
                                                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.product.category}</span>
                                                        <span className="text-white/20">|</span>
                                                        <span className="text-2xl font-black text-emerald-400">ETB {item.product.price.toLocaleString()}</span>
                                                        <span className="text-white/20">|</span>
                                                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantity: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.productId)}
                                                    className="p-5 rounded-2xl bg-white/5 text-slate-500 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all active:scale-95"
                                                >
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step === 'shipping' && (
                                <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <h2 className="text-4xl font-black text-white mb-10 flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                                            <MapPin className="text-emerald-400 w-8 h-8" />
                                        </div>
                                        Logistics Details
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 ml-6">Full Shipping Address</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-white/10"
                                                placeholder="Bole, Addis Ababa"
                                                value={shippingData.address}
                                                onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 ml-6">Direct Phone Line</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-white/10"
                                                placeholder="+251 9xx xxx xxx"
                                                value={shippingData.phone}
                                                onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                                            />
                                        </div>
                                        <div className="sm:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/60 ml-6">Special Handling Instructions</label>
                                            <textarea
                                                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all h-32 placeholder:text-white/10"
                                                placeholder="e.g. Leave at front desk, gate code 1234..."
                                                value={shippingData.notes}
                                                onChange={(e) => setShippingData({ ...shippingData, notes: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[4rem] shadow-2xl border border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                    <h2 className="text-4xl font-black text-white mb-10 flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center">
                                            <CreditCard className="text-emerald-400 w-8 h-8" />
                                        </div>
                                        Payment Method
                                    </h2>
                                    <div className="space-y-5">
                                        {[
                                            { id: 'telebirr', name: 'Telebirr', desc: 'Secure mobile payment by Ethio Telecom', img: '📱' },
                                            { id: 'cbe', name: 'CBE Birr', desc: 'Direct bank transfer via CBE', img: '🏦' },
                                            { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when your harvest arrives', img: '🚚' }
                                        ].map((method) => (
                                            <label key={method.id} className="flex items-center gap-8 p-8 border-2 border-white/5 rounded-[3rem] cursor-pointer hover:border-emerald-500/40 transition-all select-none group has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-500/10">
                                                <input type="radio" name="payment" className="hidden" defaultChecked={method.id === 'telebirr'} />
                                                <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">{method.img}</div>
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">{method.name}</h4>
                                                    <p className="text-sm text-slate-500 font-medium">{method.desc}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-full border-2 border-white/20 group-hover:border-emerald-500 flex items-center justify-center transition-all">
                                                    <div className="w-4 h-4 bg-emerald-500 rounded-full opacity-0 group-has-[:checked]:opacity-100 transition-opacity"></div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Side: Sidebar */}
                        <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                            <div className="bg-slate-900 text-white rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                                {/* Decorative BG */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

                                <h3 className="text-2xl font-black mb-8 border-b border-white/10 pb-6 uppercase tracking-widest">Order Summary</h3>

                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between font-medium text-slate-400">
                                        <span>Subtotal</span>
                                        <span className="text-white">ETB {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-slate-400">
                                        <span>Shipping</span>
                                        <span className="text-emerald-400 uppercase text-xs font-black tracking-widest pt-1">Free</span>
                                    </div>
                                    <div className="flex justify-between font-medium text-slate-400">
                                        <span>Tax</span>
                                        <span className="text-white">ETB 0</span>
                                    </div>
                                    <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                        <span className="font-black text-slate-400 uppercase text-sm tracking-widest">Grand Total</span>
                                        <span className="text-4xl font-black text-emerald-400">ETB {subtotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {step === 'cart' && (
                                        <button
                                            onClick={() => setStep('shipping')}
                                            className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                        >
                                            Secure Checkout
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    )}
                                    {step === 'shipping' && (
                                        <button
                                            onClick={() => setStep('payment')}
                                            className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                        >
                                            Proceed to Payment
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>
                                    )}
                                    {step === 'payment' && (
                                        <button
                                            onClick={handleCheckout}
                                            disabled={processing}
                                            className="w-full py-5 bg-emerald-500 text-slate-950 rounded-2xl font-black text-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-3 active:scale-95 group disabled:opacity-50"
                                        >
                                            {processing ? 'Processing...' : 'Place Secure Order'}
                                            {!processing && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
                                        </button>
                                    )}

                                    {step !== 'cart' && (
                                        <button
                                            onClick={() => setStep(step === 'shipping' ? 'cart' : 'shipping')}
                                            className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                                        >
                                            Go Back
                                        </button>
                                    )}
                                </div>

                                <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 transition-colors">
                                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Enterprise-grade security guaranteed</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>

    );
}
