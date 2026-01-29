'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge, Card, CardBody, CardHeader, Button } from "@/components";
import { tenants } from "@/lib/mock-data";
import { readJson, writeJson } from "@/lib/storage";
import type { Tenant } from "@/types";
import {
  Globe,
  Activity,
  Shield,
  Database,
  ChevronRight
} from 'lucide-react';

type TenantStatus = {
  tenantId: string;
  active: boolean;
};

const STATUS_KEY = "super-admin:tenant-status";
const defaultStatuses: TenantStatus[] = tenants.map((t) => ({ tenantId: t.id, active: true }));

export default function SuperAdminTenantsPage() {
  const [statuses, setStatuses] = useState<TenantStatus[]>(defaultStatuses);
  const [activeTab, setActiveTab] = useState<'CLUSTER' | 'NODES' | 'LOGS'>('CLUSTER');

  useEffect(() => {
    const saved = readJson<TenantStatus[]>(STATUS_KEY, defaultStatuses);
    setStatuses(saved);
  }, []);

  const handleToggle = (tenantId: string) => {
    setStatuses((prev) => {
      const next = prev.map((s) =>
        s.tenantId === tenantId ? { ...s, active: !s.active } : s
      );
      writeJson(STATUS_KEY, next);
      return next;
    });
  };

  const isActive = (tenant: Tenant) =>
    statuses.find((s) => s.tenantId === tenant.id)?.active ?? true;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
      {/* Header Intel */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Master Control Active</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Platform <span className="text-indigo-500">Cluster</span></h1>
          <p className="text-xs text-slate-500 mt-1 font-bold">Comprehensive oversight of all authorized tenant nodes and global system health.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-5 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
            <Database className="w-4 h-4" /> Provision New Node
          </button>
        </div>
      </div>

      {/* Cluster KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Master Nodes', value: '14 Active', icon: Globe, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Live Traffic', value: '8.4k rps', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Global Rev (MTD)', value: '$1.2M', icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'System Uptime', value: '99.99%', icon: Shield, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-all">
            <div className="relative z-10 flex flex-col gap-4">
              <div className={`w-10 h-10 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center`}>
                <kpi.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{kpi.label}</p>
                <p className="text-2xl font-black text-white mt-1">{kpi.value}</p>
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Tenant Control List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            {['CLUSTER', 'NODES', 'LOGS'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                {tab} Monitoring
              </button>
            ))}
          </div>

          <div className="grid gap-4">
            {tenants.map((tenant) => {
              const active = isActive(tenant);
              return (
                <div key={tenant.id} className="bg-slate-900/40 border border-slate-800/80 rounded-[32px] p-6 hover:border-indigo-500/30 transition-all group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-xl shadow-black/20 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: tenant.theme.primaryColor }}
                      >
                        {tenant.theme.logoText[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white tracking-tight">{tenant.name}</h3>
                          <div className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                            {active ? 'Operational' : 'Offline'}
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tenant ID: <span className="text-slate-400 font-mono">{tenant.slug}</span> | {tenant.industry}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/super-admin/${tenant.slug}`}
                        className="p-3 bg-slate-800/50 text-slate-400 hover:text-white hover:bg-indigo-600 rounded-xl transition-all"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="bg-slate-800/20 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest h-10 px-4"
                        onClick={() => handleToggle(tenant.id)}
                      >
                        Toggle State
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Global Security Logs */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-[32px] overflow-hidden">
            <div className="p-6 border-b border-slate-800 bg-indigo-600/5">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" /> Security Audit
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {[
                { event: 'Credential Override', node: 'brolf-main', time: '2m ago', type: 'SECURITY' },
                { event: 'Node Synchronized', node: 'agro-hub', time: '14m ago', type: 'SYSTEM' },
                { event: 'Access Revoked', node: 'test-node', time: '1h ago', type: 'ALERT' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 p-3 hover:bg-slate-800/50 rounded-2xl transition-all group">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${log.type === 'SECURITY' ? 'bg-rose-500/10 text-rose-400' :
                    log.type === 'ALERT' ? 'bg-amber-500/10 text-amber-400' : 'bg-indigo-500/10 text-indigo-400'
                    }`}>
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-white leading-none group-hover:text-indigo-400 transition-colors">{log.event}</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{log.node} • {log.time}</p>
                  </div>
                </div>
              ))}
              <button className="w-full py-3 text-[9px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-[0.2em] border-t border-slate-800 mt-2 transition-all">
                View Complete Audit Trail
              </button>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-[32px] p-6 relative overflow-hidden text-white shadow-2xl shadow-indigo-600/20">
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Platform Intelligence</p>
              <h3 className="text-lg font-black mt-2 leading-tight italic">Cluster expansion predicted: <span className="underline decoration-indigo-300">Q3 2026</span></h3>
              <p className="text-[10px] mt-4 font-bold leading-relaxed opacity-80">
                Global node distribution is currently optimized. Monitor traffic peaks in "Security Protocols" to adjust master throttle.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

