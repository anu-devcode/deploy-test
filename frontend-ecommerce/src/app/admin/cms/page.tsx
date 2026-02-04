'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
    FileText,
    BookOpen,
    Layers,
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    CheckCircle,
    XCircle,
    ChevronRight,
    Layout
} from 'lucide-react';
import { ContentPage, BlogPost, ContentBlock } from '@/types/cms';

export default function AdminCMSPage() {
    const [activeTab, setActiveTab] = useState<'PAGES' | 'BLOG' | 'BLOCKS'>('PAGES');
    const [pages, setPages] = useState<ContentPage[]>([]);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [blocks, setBlocks] = useState<ContentBlock[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [pData, bData, blData] = await Promise.all([
                api.getPages(),
                api.getPosts(),
                api.getBlocks()
            ]);
            setPages(pData || []);
            setPosts(bData || []);
            setBlocks(blData || []);
        } catch (error) {
            console.error('Failed to load CMS data:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'PAGES', label: 'Static Pages', icon: FileText },
        { id: 'BLOG', label: 'Blog Posts', icon: BookOpen },
        { id: 'BLOCKS', label: 'Content Blocks', icon: Layers },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Content Workspace</h1>
                    <p className="text-sm text-slate-500">Orchestrate your storefront's narrative and static assets.</p>
                </div>
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                    <Plus className="w-4 h-4" />
                    New {activeTab === 'PAGES' ? 'Page' : activeTab === 'BLOG' ? 'Post' : 'Block'}
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-full sm:w-fit overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                            ? 'bg-white text-emerald-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                    type="text"
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all shadow-sm"
                />
            </div>

            {/* Content List */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {activeTab === 'PAGES' && (
                    <div className="divide-y divide-slate-50">
                        {pages.map((page) => (
                            <div key={page.id} className="p-6 hover:bg-slate-50/50 transition-colors group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-5 w-full">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{page.title}</h3>
                                        <p className="text-xs text-slate-400 mt-1 font-mono truncate">/{page.slug}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Status</p>
                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase mt-2 ${page.isPublished ? 'text-emerald-500' : 'text-slate-400'}`}>
                                            {page.isPublished ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                            {page.isPublished ? 'Live' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <button className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-all"><Eye className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'BLOG' && (
                    <div className="divide-y divide-slate-50">
                        {posts.map((post) => (
                            <div key={post.id} className="p-6 hover:bg-slate-50/50 transition-colors group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-5 w-full">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 truncate">{post.title}</h3>
                                        <div className="flex flex-wrap items-center gap-3 mt-1">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.category}</span>
                                            <span className="text-[10px] text-slate-300">•</span>
                                            <span className="text-[10px] font-bold text-slate-400">{post.author}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl transition-all">
                                        Edit Content <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'BLOCKS' && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blocks.map((block) => (
                            <div key={block.id} className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl ${block.type === 'BANNER' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                        <Layout className="w-5 h-5" />
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${block.isActive ? 'text-emerald-500' : 'text-slate-300'}`}>
                                        {block.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <h4 className="font-bold text-slate-900 mb-1">{block.title}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-4">{block.type}</p>
                                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                                    <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Configure</button>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button className="p-1.5 hover:bg-slate-100 text-slate-400 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                                        <button className="p-1.5 hover:bg-rose-50 text-rose-400 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && pages.length === 0 && posts.length === 0 && blocks.length === 0 && (
                    <div className="p-20 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Layers className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No content found</h3>
                        <p className="text-sm text-slate-400 mt-2">Start building your storefront experience today.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
