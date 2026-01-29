'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  Shield,
  Settings,
  LogOut,
  Command,
  Database,
  Activity,
  Users,
  ChevronRight,
  Search,
  Bell
} from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Platform Stats', icon: Activity, href: '/super-admin' },
    { label: 'Tenant Cluster', icon: Globe, href: '/super-admin' },
    { label: 'Security Protocols', icon: Shield, href: '/super-admin' },
    { label: 'Global Config', icon: Settings, href: '/super-admin' },
  ];

  return (
    <div className="min-h-screen bg-[#020617] flex font-sans text-slate-200">
      {/* Sidebar */}
      <aside className={`w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col fixed h-full z-50 transition-all duration-300`}>
        <div className="p-8">
          <Link href="/super-admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-indigo-600/20">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-tight block leading-none">Brolf<span className="text-indigo-400">HQ</span></span>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 block">Super Admin Node</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={idx}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'group-hover:text-indigo-400'} transition-colors`} />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{item.label}</span>
                </div>
                {isActive && <div className="w-1 h-1 bg-indigo-400 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 bg-slate-900/50 border-t border-slate-800/50">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-500/5 rounded-xl transition-all">
            <LogOut className="w-4 h-4" />
            Terminate Override
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col pl-64">
        <header className="h-20 border-b border-slate-800 bg-[#020617]/80 backdrop-blur-xl sticky top-0 z-40 px-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search cluster nodes, tenants..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Master Network Online</span>
            </div>
            <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#020617]" />
            </button>
            <div className="h-8 w-[1px] bg-slate-800" />
            <div className="flex items-center gap-3 border border-slate-800 bg-slate-900/50 px-3 py-1.5 rounded-2xl">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-[10px] font-black text-white">SA</div>
              <span className="text-[10px] font-black uppercase tracking-widest">Global Master</span>
            </div>
          </div>
        </header>

        <main className="p-10 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

