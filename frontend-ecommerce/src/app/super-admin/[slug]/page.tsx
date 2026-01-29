'use client';

import { notFound } from "next/navigation";
import { tenants, seedProducts, seedOrders } from "@/lib/mock-data";
import {
  Globe,
  Activity,
  Shield,
  Database,
  Package,
  ShoppingBag,
  Layers,
  Zap,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: { slug: string };
};

export default function SuperAdminTenantDetailPage({ params }: Props) {
  const tenant = tenants.find((t) => t.slug === params.slug);
  if (!tenant) notFound();

  const products = seedProducts.filter((p) => p.tenantId === tenant.id);
  const orders = seedOrders.filter((o) => o.tenantId === tenant.id);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Breadcrumb & Header */}
      <div>
        <Link href="/super-admin" className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4 hover:text-indigo-300 transition-colors w-fit">
          <ChevronLeft className="w-3 h-3" /> Root Cluster
        </Link>
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-indigo-600/20"
            style={{ backgroundColor: tenant.theme.primaryColor }}
          >
            {tenant.theme.logoText[0]}
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">{tenant.name} <span className="text-indigo-500">Node</span></h1>
            <p className="text-xs text-slate-500 mt-1 font-bold italic uppercase tracking-widest">Platform Allocation: <span className="text-slate-300">Level 4 Dedicated Instance</span></p>
          </div>
        </div>
      </div>

      {/* Node Vital Signs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] relative overflow-hidden group">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Instance Industry</p>
          <p className="text-2xl font-black text-white capitalize italic">{tenant.industry}</p>
          <div className="mt-6 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 w-3/4 animate-pulse" />
          </div>
          <p className="text-[9px] font-bold text-indigo-400 mt-2 uppercase tracking-tighter">Cluster Bandwidth: 75% Utilized</p>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] relative overflow-hidden">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Primary Cipher</p>
          <p className="text-2xl font-mono font-black text-white">{tenant.theme.primaryColor}</p>
          <div className="flex items-center gap-2 mt-6">
            <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: tenant.theme.primaryColor }} />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Core Narrative Secondary Overlay Active</span>
          </div>
        </div>
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-[40px] relative overflow-hidden bg-indigo-600/5">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Resource Allocation</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white">43</p>
            <p className="text-xs font-bold text-indigo-300 uppercase italic">Virtual CPUS</p>
          </div>
          <p className="text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-widest">Isolated Environment Stable</p>
        </div>
      </div>

      {/* Asset Distribution */}
      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* Products Asset Monitor */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-slate-800 bg-white/5 flex items-center justify-between">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <Package className="w-5 h-5 text-indigo-400" /> Asset Inventory
            </h2>
            <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{products.length} Units</span>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-left">
                  <th className="px-4 py-4">Descriptor</th>
                  <th className="px-4 py-4">Global SKU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {products.map((p) => (
                  <tr key={p.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-4 py-5 text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors">{p.name}</td>
                    <td className="px-4 py-5 text-[10px] font-mono text-slate-500">{p.sku}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Logistics Interface */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-[40px] overflow-hidden">
          <div className="p-8 border-b border-slate-800 bg-white/5 flex items-center justify-between">
            <h2 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-indigo-400" /> Transactional Logs
            </h2>
            <span className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">{orders.length} Executions</span>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-left">
                  <th className="px-4 py-4">Seq ID</th>
                  <th className="px-4 py-4">Target Entity</th>
                  <th className="px-4 py-4">Directive Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {orders.map((o) => (
                  <tr key={o.id} className="group hover:bg-white/5 transition-all">
                    <td className="px-4 py-5 text-[10px] font-mono text-indigo-400 font-bold">{o.orderNumber}</td>
                    <td className="px-4 py-5 text-xs font-bold text-slate-300">{o.customer.name}</td>
                    <td className="px-4 py-5">
                      <span className="px-3 py-1 bg-slate-800 text-slate-400 text-[9px] font-black rounded-full uppercase tracking-widest border border-slate-700">
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

