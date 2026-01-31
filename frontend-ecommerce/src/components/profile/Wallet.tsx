'use client';

import { Wallet as WalletIcon, TrendingUp, TrendingDown, Clock, CreditCard } from 'lucide-react';

export function Wallet() {
    // Mock Data
    const balance = 1250;
    const pendingPoints = 450;
    const transactions = [
        { id: 1, type: 'EARNED', amount: 120, desc: 'Purchase Reward - Order #8832', date: '2026-01-28' },
        { id: 2, type: 'EARNED', amount: 45, desc: 'Review Reward - Premium Red Lentils', date: '2026-01-25' },
        { id: 3, type: 'SPENT', amount: -500, desc: 'Redeemed for Coupon', date: '2026-01-20' },
        { id: 4, type: 'EARNED', amount: 320, desc: 'Purchase Reward - Order #8421', date: '2026-01-15' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-2xl font-black text-slate-900">Wallet & Points</h2>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Balance Card */}
                <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-colors duration-700"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-sm">
                                <WalletIcon className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Total Balance</span>
                        </div>
                        <h3 className="text-5xl font-black mb-2">{balance.toLocaleString()} <span className="text-2xl text-emerald-400">PTS</span></h3>
                        <p className="text-slate-400 font-bold text-sm">≈ ETB {(balance / 10).toLocaleString()} redeemable value</p>

                        <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
                            <button className="flex-1 py-3 bg-white text-slate-900 rounded-xl font-black hover:bg-emerald-400 hover:text-slate-900 transition-all shadow-lg hover:shadow-emerald-500/20">
                                Redeem Points
                            </button>
                        </div>
                    </div>
                </div>

                {/* Pending / Info Card */}
                <div className="bg-white p-8 rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                                <Clock className="w-6 h-6" />
                            </div>
                            <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Pending Points</span>
                        </div>
                        <h3 className="text-4xl font-black text-slate-900 mb-2">{pendingPoints} <span className="text-xl text-amber-500">PTS</span></h3>
                        <p className="text-slate-500 font-bold text-sm">Points from recent orders will be available after delivery confirmation.</p>
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="bg-white rounded-[2rem] shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-black text-slate-900">Points History</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {transactions.map((tx) => (
                        <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tx.type === 'EARNED' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                                    }`}>
                                    {tx.type === 'EARNED' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{tx.desc}</p>
                                    <p className="text-xs font-bold text-slate-400 mt-0.5">{tx.date}</p>
                                </div>
                            </div>
                            <span className={`text-lg font-black ${tx.type === 'EARNED' ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                {tx.type === 'EARNED' ? '+' : ''}{tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
