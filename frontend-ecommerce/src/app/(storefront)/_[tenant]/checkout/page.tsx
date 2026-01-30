'use client';

import { useState } from 'react';
import { useCart } from '@/context';
import { useTenant } from '@/context/TenantContext';
import { MapPin, CreditCard, PackageCheck, Check, ChevronRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Card, CardBody, CardHeader } from '@/components';

type Step = 'shipping' | 'payment' | 'review' | 'success';

export default function CheckoutPage() {
    const { tenant } = useTenant();
    const { items, subtotal, itemCount, clearCart } = useCart();
    const [step, setStep] = useState<Step>('shipping');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        phone: '',
        paymentMethod: 'telebirr'
    });
    const [processing, setProcessing] = useState(false);

    const handleNext = () => {
        if (step === 'shipping') setStep('payment');
        else if (step === 'payment') setStep('review');
        else if (step === 'review') {
            setProcessing(true);
            setTimeout(() => {
                setProcessing(false);
                setStep('success');
                clearCart();
            }, 1500);
        }
    };

    if (itemCount === 0 && step !== 'success') {
        return (
            <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                    <PackageCheck className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Your cart is empty</h1>
                <p className="text-slate-500 mt-4 font-bold">Add some premium products to start checkout.</p>
                <Link href={`/${tenant.slug}/shop`} className="mt-12 inline-block px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
                    Return to Store
                </Link>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="max-w-2xl mx-auto py-32 px-6 text-center">
                <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 animate-in zoom-in duration-500">
                    <PackageCheck className="w-16 h-16 text-emerald-600" />
                </div>
                <h1 className="text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">Order Confirmed!</h1>
                <p className="text-xl text-slate-600 mb-16 leading-relaxed font-medium">
                    Thank you for your purchase. We've sent a confirmation to <span className="font-bold text-slate-900">{formData.email || formData.phone}</span>.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                    <Link href={`/${tenant.slug}/dashboard`} className="px-10 py-6 rounded-3xl border-2 border-slate-200 font-black text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all text-center uppercase tracking-widest text-sm">
                        Track Order
                    </Link>
                    <Link href={`/${tenant.slug}/shop`} className="px-10 py-6 rounded-3xl bg-slate-900 text-white font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/20 text-center uppercase tracking-widest text-sm">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
            {/* Progress Bar */}
            <div className="flex items-center justify-center mb-20 max-w-3xl mx-auto px-4">
                {[
                    { id: 'shipping', icon: MapPin, label: 'Shipping' },
                    { id: 'payment', icon: CreditCard, label: 'Payment' },
                    { id: 'review', icon: PackageCheck, label: 'Review' }
                ].map((s, idx) => (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center relative gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${step === s.id ? 'bg-slate-900 text-white scale-110 shadow-2xl shadow-slate-900/20' :
                                (['shipping', 'payment', 'review'].indexOf(step) > idx ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-200')
                                }`}>
                                {['shipping', 'payment', 'review'].indexOf(step) > idx ? <Check className="w-7 h-7" /> : <s.icon className="w-7 h-7" />}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < 2 && (
                            <div className={`flex-1 h-0.5 mx-4 md:mx-10 rounded-full transition-colors duration-500 ${['shipping', 'payment', 'review'].indexOf(step) > idx ? 'bg-emerald-600' : 'bg-slate-100'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {step === 'shipping' && (
                        <div className="space-y-10">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Shipping Details</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Delivery Address</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                        placeholder="House No 123, Bole, Addis Ababa"
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">City</label>
                                    <input
                                        type="text"
                                        className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                        placeholder="Addis Ababa"
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        className="w-full px-6 py-5 rounded-3xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                        placeholder="+251 9XX XXX XXX"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="space-y-10">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Payment Method</h2>
                            <div className="space-y-5">
                                {[
                                    { id: 'telebirr', name: 'Telebirr SuperApp', desc: 'Secure mobile payment via Ethio Telecom', icon: '📱' },
                                    { id: 'cbe', name: 'CBE Birr', desc: 'Commercial Bank of Ethiopia Direct Transfer', icon: '🏦' },
                                    { id: 'cash', name: 'Cash on Delivery', desc: 'Pay with cash upon package arrival', icon: '🚚' }
                                ].map(method => (
                                    <button
                                        key={method.id}
                                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                                        className={`w-full p-8 rounded-[2.5rem] border-2 transition-all flex items-center justify-between group ${formData.paymentMethod === method.id ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-100 hover:border-emerald-200 bg-white'
                                            }`}
                                    >
                                        <div className="flex items-center gap-8">
                                            <div className="text-4xl">{method.icon}</div>
                                            <div className="text-left">
                                                <p className="text-xl font-black text-slate-900 uppercase tracking-tight">{method.name}</p>
                                                <p className="text-sm font-bold text-slate-500 mt-1">{method.desc}</p>
                                            </div>
                                        </div>
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-emerald-600 bg-emerald-600' : 'border-slate-200'
                                            }`}>
                                            {formData.paymentMethod === method.id && <Check className="w-5 h-5 text-white" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="space-y-12">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Order Review</h2>
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="p-10 rounded-[3rem] bg-slate-50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/50 blur-[80px] rounded-full" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 relative">Shipping Information</h4>
                                    <p className="text-xl font-black text-slate-900 mb-2">{formData.name}</p>
                                    <p className="text-lg font-bold text-slate-600 leading-relaxed">
                                        {formData.address}, {formData.city}<br />
                                        {formData.phone}
                                    </p>
                                </div>
                                <div className="p-10 rounded-[3rem] bg-slate-50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 blur-[80px] rounded-full" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 relative">Payment Strategy</h4>
                                    <p className="text-xl font-black text-slate-900 uppercase">{formData.paymentMethod}</p>
                                    <p className="text-lg font-bold text-slate-600 leading-relaxed">Secure transaction via provider network.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-1">Selected Harvest</h4>
                                <div className="space-y-4">
                                    {items.map(item => (
                                        <div key={item.productId} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl">
                                                    {item.product.imageToken}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase tracking-tight">{item.product.name}</p>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Qty: {item.quantity} × ETB {item.product.price.toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <p className="text-xl font-black text-slate-900">ETB {item.lineTotal.toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-16 pt-10 border-t border-slate-100 flex items-center justify-between">
                        {step !== 'shipping' && (
                            <button
                                onClick={() => setStep(step === 'payment' ? 'shipping' : 'payment')}
                                className="flex items-center gap-3 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]"
                            >
                                <ArrowLeft className="w-5 h-5" /> Back to prev step
                            </button>
                        )}
                        <div className="flex-1" />
                        <button
                            onClick={handleNext}
                            disabled={processing || (step === 'shipping' && (!formData.name || !formData.address || !formData.phone))}
                            className="px-12 py-6 rounded-3xl bg-slate-900 text-white font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/40 disabled:opacity-50 flex items-center gap-4 uppercase tracking-widest text-sm"
                        >
                            {processing ? 'Processing Order...' : step === 'review' ? 'Verify & Place Order' : 'Proceed Forward'}
                            {!processing && <ChevronRight className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit space-y-8">
                    <Card className="rounded-[4rem] border-none shadow-[0_32px_120px_-20px_rgba(0,0,0,0.08)] overflow-hidden">
                        <CardHeader className="bg-slate-50/50 p-10 border-b border-slate-100">
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Order Manifest</h3>
                        </CardHeader>
                        <CardBody className="p-10 space-y-8">
                            <div className="space-y-5">
                                <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Base Harvest</span>
                                    <span>ETB {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Cold Chain Logistics</span>
                                    <span className="text-emerald-600">Gratis</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Value Added Tax</span>
                                    <span>Included</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t-2 border-dashed border-slate-200 flex justify-between items-center">
                                <span className="text-lg font-black text-slate-900 uppercase tracking-widest">Total Value</span>
                                <span className="text-4xl font-black text-emerald-600">ETB {subtotal.toLocaleString()}</span>
                            </div>

                            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100/50">
                                <p className="text-[10px] font-black text-amber-800 leading-relaxed uppercase tracking-[0.2em] text-center">
                                    Simulated transaction mode active.<br />No actual funds will be processed.
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
}
