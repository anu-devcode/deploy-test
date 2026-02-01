'use client';

import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context';
import { useAuth } from '@/context/AuthContext';
import { MapPin, CreditCard, PackageCheck, Check, ChevronRight, ArrowLeft, Upload, QrCode, ShieldCheck, Info, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Card, CardBody, CardHeader, Badge } from '@/components';
import { api } from '@/lib/api';

type Step = 'account' | 'address' | 'review' | 'payment' | 'success';

export default function CheckoutPage() {
    const {
        selectedItems: items,
        selectedSubtotal: subtotal,
        selectedCount: itemCount,
        clearSelectedItems
    } = useCart();
    const { isAuthenticated, user } = useAuth();
    const [step, setStep] = useState<Step>('account');
    const [isGuest, setIsGuest] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        phone: '',
        paymentMethod: 'telebirr'
    });
    const [saveToProfile, setSaveToProfile] = useState(false);
    const [editFields, setEditFields] = useState<Record<string, boolean>>({});
    const [processing, setProcessing] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-skip account step if logged in and fetch profile/addresses
    useEffect(() => {
        if (isAuthenticated && user) {
            if (step === 'account') setStep('address');

            const fetchData = async () => {
                try {
                    const [profile, addresses] = await Promise.all([
                        api.getProfile(),
                        api.getAddresses()
                    ]);

                    setSavedAddresses(addresses);

                    // Pre-fill from profile/default address
                    const defaultAddr = addresses.find((a: any) => a.isDefault) || addresses[0];
                    if (defaultAddr) {
                        setSelectedAddressId(defaultAddr.id);
                        setShowAddressForm(false);
                        setFormData(prev => ({
                            ...prev,
                            name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : (profile.name || prev.name),
                            email: profile.email || prev.email,
                            phone: defaultAddr.phone || profile.phone || prev.phone,
                            address: defaultAddr.street,
                            city: defaultAddr.city,
                        }));
                    } else {
                        setFormData(prev => ({
                            ...prev,
                            name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : (profile.name || prev.name),
                            email: profile.email || prev.email,
                            phone: profile.phone || prev.phone,
                        }));
                    }
                } catch (e) {
                    console.error('Failed to fetch profile for pre-fill', e);
                }
            };
            fetchData();
        }
    }, [isAuthenticated, user, step === 'account']);

    const handleAddressSelect = (addr: any) => {
        setSelectedAddressId(addr.id);
        setShowAddressForm(false);
        setFormData(prev => ({
            ...prev,
            address: addr.street,
            city: addr.city,
            phone: addr.phone || prev.phone
        }));
    };

    const handleNext = async () => {
        if (step === 'account') setStep('address');
        else if (step === 'address') {
            if (isGuest && !isAuthenticated) setStep('review');
            else setStep('payment');
        }
        else if (step === 'review') setStep('payment');
        else if (step === 'payment') {
            await handleCompleteOrder();
        }
    };

    const handleCompleteOrder = async () => {
        if (formData.paymentMethod === 'online') return;

        setProcessing(true);
        try {
            // 1. Create Order
            const payload = {
                customerId: user?.id,
                isGuest: isGuest && !isAuthenticated,
                guestEmail: formData.email,
                guestName: formData.name, // Always send name for sync/guest
                guestPhone: formData.phone,
                shippingAddress: formData.address,
                shippingCity: formData.city,
                paymentMethod: formData.paymentMethod,
                saveAddressToProfile: isAuthenticated && saveToProfile,
                items: items.map(i => ({ productId: i.productId, quantity: i.quantity }))
            };

            const order = await api.checkout(payload);

            // 2. Handle Manual Payment Initialization if needed
            if (formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'cbe') {
                const payInfo = await api.initializePayment({
                    orderId: order.id,
                    amount: subtotal,
                    method: formData.paymentMethod.toUpperCase()
                });

                // 3. Submit Receipt if present
                if (receiptUrl) {
                    await api.submitManualPayment(payInfo.paymentId, { receiptUrl });
                }
            }

            // 4. Finalize
            setStep('success');
            clearSelectedItems();
        } catch (err) {
            console.error('Order completion failed', err);
            alert('Order processing failed. Please check your connection and try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            // Mock upload
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                await new Promise(resolve => setTimeout(resolve, 1000));
                setReceiptUrl('mock-receipt-url.jpg');
                setUploading(false);
            };
        } catch (e) {
            setUploading(false);
        }
    };

    const handleGuestCheckout = () => {
        setIsGuest(true);
        setStep('address');
    };

    const manualInstructions: any = {
        telebirr: {
            name: 'Telebirr',
            accountName: 'Adis Harvest Global',
            accountNumber: '+251 912 345 678',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=telebirr://pay?to=0912345678',
            type: 'phone'
        },
        cbe: {
            name: 'CBE',
            accountName: 'Adis Harvest PLC',
            accountNumber: '1000123456789',
            qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=cbe:1000123456789',
            type: 'account'
        }
    };

    if (itemCount === 0 && step !== 'success') {
        return (
            <div className="max-w-[1400px] mx-auto px-6 py-24 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
                    <PackageCheck className="w-12 h-12" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Your cart is empty</h1>
                <p className="text-slate-500 mt-4 font-bold">Add some products to start checkout.</p>
                <Link href="/#products" className="mt-12 inline-block px-10 py-5 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all">
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
                <h1 className="text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight italic">Order Launched!</h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed font-medium">
                    {formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'cbe'
                        ? "Order received. Once your receipt is verified, we'll begin the fulfillment sequence."
                        : "Thank you for your purchase. Your order is being processed for immediate dispatch."
                    }
                </p>
                <div className="grid sm:grid-cols-2 gap-6 mt-12">
                    <Link href={isGuest ? "/track-order" : "/profile"} className="px-10 py-6 rounded-3xl border-2 border-slate-200 font-black text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all text-center uppercase tracking-widest text-sm">
                        Track Order
                    </Link>
                    <Link href="/#products" className="px-10 py-6 rounded-3xl bg-slate-900 text-white font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/20 text-center uppercase tracking-widest text-sm">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-24">
            {/* Progress bar */}
            <div className="flex items-center justify-center mb-16 max-w-2xl mx-auto">
                {[
                    { id: 'account', label: 'Account' },
                    { id: 'address', label: 'Address' },
                    ...(isGuest && !isAuthenticated ? [{ id: 'review', label: 'Review' }] : []),
                    { id: 'payment', label: 'Payment' }
                ].map((s, idx, arr) => (
                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs transition-all ${step === s.id ? 'bg-slate-900 text-white scale-110 shadow-lg' :
                                (['account', 'address', 'review', 'payment'].indexOf(step) > ['account', 'address', 'review', 'payment'].indexOf(s.id) ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-300')
                                }`}>
                                {['account', 'address', 'review', 'payment'].indexOf(step) > ['account', 'address', 'review', 'payment'].indexOf(s.id) ? <Check className="w-5 h-5" /> : idx + 1}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${step === s.id ? 'text-slate-900' : 'text-slate-400'}`}>
                                {s.label}
                            </span>
                        </div>
                        {idx < arr.length - 1 && (
                            <div className={`flex-1 h-px mx-4 ${['account', 'address', 'review', 'payment'].indexOf(step) > ['account', 'address', 'review', 'payment'].indexOf(s.id) ? 'bg-emerald-600' : 'bg-slate-100'}`} />
                        )}
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8">
                    {step === 'account' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Account</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 group hover:border-emerald-500/30 transition-all">
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-6">Login</h3>
                                    <form className="space-y-4">
                                        <input type="email" placeholder="Email" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm" />
                                        <input type="password" placeholder="Password" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none font-bold text-sm" />
                                        <button className="w-full py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-emerald-600 transition-all text-xs uppercase tracking-widest">Login</button>
                                    </form>
                                    <Link href="/register" className="mt-6 block text-center text-[10px] font-bold text-slate-400 hover:text-emerald-600 uppercase tracking-widest">Create Account</Link>
                                </div>
                                <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-transparent flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-4">Guest</h3>
                                        <p className="text-xs font-bold text-slate-500 leading-relaxed mb-8">Fast checkout without account. You can track your order using email.</p>
                                    </div>
                                    <button onClick={handleGuestCheckout} className="w-full py-4 rounded-2xl border-2 border-slate-200 text-slate-900 font-black hover:border-slate-900 transition-all text-xs uppercase tracking-widest">Guest Checkout</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'address' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-end justify-between">
                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Address</h2>
                                {isAuthenticated && savedAddresses.length > 0 && (
                                    <button
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 underline underline-offset-4 decoration-2"
                                    >
                                        {showAddressForm ? 'Use Saved Address' : 'Use Different Address'}
                                    </button>
                                )}
                            </div>

                            {isAuthenticated && !showAddressForm && savedAddresses.length > 0 && (
                                <div className="grid md:grid-cols-2 gap-4">
                                    {savedAddresses.map((addr: any) => (
                                        <button
                                            key={addr.id}
                                            onClick={() => handleAddressSelect(addr)}
                                            className={`p-6 rounded-[2.5rem] border-2 text-left transition-all relative group ${selectedAddressId === addr.id ? 'border-emerald-600 bg-emerald-50/30' : 'border-slate-50 bg-white hover:border-slate-200'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`p-2 rounded-xl ${selectedAddressId === addr.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black uppercase tracking-tight text-slate-900">{addr.type}</span>
                                                    {addr.isDefault && (
                                                        <span className="ml-2 text-[8px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Default</span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm font-black text-slate-900 mb-1">{addr.street}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{addr.city}</p>
                                            {selectedAddressId === addr.id && (
                                                <div className="absolute top-6 right-6 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {(showAddressForm || !isAuthenticated) && (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Name', key: 'name', placeholder: 'Full Name', type: 'text' },
                                        { label: 'Email', key: 'email', placeholder: 'Email Address', type: 'email' },
                                        { label: 'City', key: 'city', placeholder: 'City', type: 'text' },
                                        { label: 'Phone', key: 'phone', placeholder: 'Phone Number', type: 'tel' }
                                    ].map(field => {
                                        const value = (formData as any)[field.key];
                                        const isEditing = editFields[field.key];
                                        const showSummary = isAuthenticated && value && !isEditing;

                                        if (showSummary) {
                                            return (
                                                <div key={field.key} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-between group hover:border-slate-200 transition-all">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{field.label}</label>
                                                        <p className="font-black text-slate-900 text-sm ml-1">{value}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setEditFields(prev => ({ ...prev, [field.key]: true }))}
                                                        className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-700 underline underline-offset-4 decoration-2"
                                                    >
                                                        Change
                                                    </button>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={field.key} className="space-y-2">
                                                <div className="flex justify-between items-center ml-1">
                                                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{field.label}</label>
                                                    {isEditing && (
                                                        <button
                                                            onClick={() => setEditFields(prev => ({ ...prev, [field.key]: false }))}
                                                            className="text-[8px] font-bold text-slate-300 uppercase tracking-widest hover:text-slate-900"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                                <input
                                                    type={field.type}
                                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900 text-sm"
                                                    placeholder={field.placeholder}
                                                    value={value}
                                                    onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                                                    autoFocus={isEditing}
                                                />
                                            </div>
                                        );
                                    })}
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Location</label>
                                        <input
                                            type="text"
                                            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-emerald-500 outline-none transition-all font-bold text-slate-900 text-sm"
                                            placeholder="House number and street"
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            )}

                            {isAuthenticated && showAddressForm && (
                                <div className="flex items-center gap-3 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 mt-6 group cursor-pointer hover:border-emerald-200 transition-all" onClick={() => setSaveToProfile(!saveToProfile)}>
                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${saveToProfile ? 'bg-slate-900 border-slate-900 shadow-lg' : 'border-slate-200 group-hover:border-slate-400'}`}>
                                        {saveToProfile && <Check className="w-4 h-4 text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">Save to my profile</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Use this address for future orders</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'review' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Review</h2>
                            <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Contact Information</h3>
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900">{formData.name}</p>
                                            <p className="text-sm font-bold text-slate-500">{formData.email}</p>
                                            <p className="text-sm font-bold text-slate-500">{formData.phone}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Shipping Address</h3>
                                        <div className="space-y-1">
                                            <p className="font-black text-slate-900">{formData.address}</p>
                                            <p className="text-sm font-bold text-slate-500">{formData.city}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-8 border-t border-slate-50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed text-center">Please verify your details before proceeding to payment. Once the order is placed, address changes may require support intervention.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight italic">Payment</h2>
                            <div className="grid lg:grid-cols-5 gap-10">
                                {/* selection */}
                                <div className="lg:col-span-3 space-y-4">
                                    {[
                                        { id: 'telebirr', name: 'Telebirr', desc: 'Secure Mobile Pay', icon: '📱' },
                                        { id: 'cbe', name: 'CBE', desc: 'Bank Transfer', icon: '🏦' },
                                        { id: 'cash', name: 'Cash', desc: 'Pay on Delivery', icon: '🚚' },
                                        { id: 'online', name: 'Online', desc: 'Coming Soon', icon: '💳', comingSoon: true }
                                    ].map(method => (
                                        <div key={method.id} className="relative">
                                            <button
                                                disabled={method.comingSoon}
                                                onClick={() => {
                                                    setFormData({ ...formData, paymentMethod: method.id });
                                                    if (method.id === 'cash') setReceiptUrl(null);
                                                }}
                                                className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${method.comingSoon ? 'opacity-40 grayscale cursor-not-allowed' :
                                                    formData.paymentMethod === method.id ? 'border-emerald-600 bg-emerald-50/30 shadow-lg shadow-emerald-500/5' : 'border-slate-50 hover:border-emerald-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5 text-left">
                                                    <div className="text-2xl">{method.icon}</div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{method.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{method.desc}</p>
                                                    </div>
                                                </div>
                                                {!method.comingSoon && (
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.paymentMethod === method.id ? 'border-emerald-600 bg-emerald-600' : 'border-slate-100 group-hover:border-emerald-400'}`}>
                                                        {formData.paymentMethod === method.id && <Check className="w-4 h-4 text-white" />}
                                                    </div>
                                                )}
                                            </button>

                                            {/* Instructions and upload */}
                                            {formData.paymentMethod === method.id && (method.id === 'telebirr' || method.id === 'cbe') && (
                                                <div className="mt-4 p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 animate-in fade-in zoom-in-95 duration-300">
                                                    <div className="flex flex-col md:flex-row gap-6">
                                                        <div className="flex-1 space-y-4">
                                                            <div className="p-4 bg-white rounded-2xl border border-slate-100">
                                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Account</p>
                                                                <p className="text-sm font-black text-slate-900 font-mono">{manualInstructions[method.id].accountNumber}</p>
                                                                <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">{manualInstructions[method.id].accountName}</p>
                                                            </div>
                                                            <div
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className={`h-32 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer ${receiptUrl ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-500'}`}
                                                            >
                                                                {uploading ? (
                                                                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
                                                                ) : receiptUrl ? (
                                                                    <div className="text-center">
                                                                        <Check className="w-6 h-6 text-emerald-600 mx-auto" />
                                                                        <p className="text-[9px] font-black text-emerald-700 uppercase mt-1">Receipt uploaded</p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center px-4">
                                                                        <Upload className="w-6 h-6 text-slate-300 mx-auto mb-2" />
                                                                        <p className="text-[9px] font-black text-slate-900 uppercase">Upload receipt</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                                                        </div>
                                                        <div className="text-center">
                                                            <img src={manualInstructions[method.id].qrCode} className="w-32 h-32 mx-auto mix-blend-multiply opacity-80" alt="QR" />
                                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Scan code</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Right Side: Summary & Action */}
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
                                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest italic">Order Summary</h4>
                                        <div className="space-y-4">
                                            {items.slice(0, 3).map(item => (
                                                <div key={item.productId} className="flex justify-between items-center text-[11px]">
                                                    <Link
                                                        href={`/products/${item.product.slug || item.product.id}`}
                                                        className="font-bold text-slate-500 truncate pr-4 hover:text-emerald-600 transition-colors"
                                                    >
                                                        {item.product.name} × {item.quantity}
                                                    </Link>
                                                    <span className="font-black text-slate-900 whitespace-nowrap">ETB {item.lineTotal.toLocaleString()}</span>
                                                </div>
                                            ))}
                                            {itemCount > 3 && <p className="text-[9px] font-bold text-slate-400 uppercase">+ {itemCount - 3} more</p>}
                                        </div>
                                        <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</span>
                                            <span className="text-3xl font-black text-emerald-600">ETB {subtotal.toLocaleString()}</span>
                                        </div>

                                        <button
                                            onClick={handleCompleteOrder}
                                            disabled={processing || ((formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'cbe') && !receiptUrl)}
                                            className="w-full py-5 rounded-[2rem] bg-slate-900 text-white font-black hover:bg-black transition-all shadow-2xl shadow-slate-900/40 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                        >
                                            {processing ? 'Processing...' : 'Place Order'}
                                            {!processing && <ShieldCheck className="w-5 h-5" />}
                                        </button>

                                        {((formData.paymentMethod === 'telebirr' || formData.paymentMethod === 'cbe') && !receiptUrl) && (
                                            <p className="text-[9px] font-bold text-amber-600 text-center uppercase flex items-center justify-center gap-1.5 animate-pulse">
                                                <AlertCircle className="w-3 h-3" /> Receipt Required
                                            </p>
                                        )}
                                    </div>

                                    <div className="p-6 rounded-[2rem] bg-emerald-50 border border-emerald-100 flex gap-4">
                                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                                        <p className="text-[9px] font-bold text-emerald-800 leading-relaxed uppercase">Secure payment. Your data is protected.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Actions */}
                    <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                        {step !== 'account' && (
                            <button onClick={() => {
                                if (step === 'address') setStep('account');
                                else if (step === 'review') setStep('address');
                                else if (step === 'payment') setStep(isGuest && !isAuthenticated ? 'review' : 'address');
                            }} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-[0.2em]">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        )}
                        <div className="flex-1" />
                        {step !== 'payment' && (
                            <button
                                onClick={handleNext}
                                disabled={step === 'address' && (!formData.name || !formData.address || !formData.phone)}
                                className="px-10 py-5 rounded-2xl bg-slate-900 text-white font-black hover:bg-black transition-all shadow-xl shadow-slate-900/40 disabled:opacity-50 flex items-center gap-3 uppercase tracking-widest text-xs"
                            >
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Desktop Sticky Summary (Only on Shipping/Account) */}
                {step !== 'payment' && (
                    <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit hidden lg:block">
                        <Card className="rounded-[3rem] border-none shadow-[0_32px_120px_-20px_rgba(0,0,0,0.06)] overflow-hidden bg-white">
                            <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">Order</h3>
                            </CardHeader>
                            <CardBody className="p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Subtotal</span>
                                        <span className="text-slate-900">ETB {subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>Shipping</span>
                                        <span className="text-emerald-600 italic">Free</span>
                                    </div>
                                </div>
                                <div className="pt-6 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Total</span>
                                    <span className="text-3xl font-black text-emerald-600">ETB {subtotal.toLocaleString()}</span>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
}
