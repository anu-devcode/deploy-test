'use client';

import { useState, useEffect } from 'react';

interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    children: Category[];
    _count?: { products: number };
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', slug: '', description: '' });

    useEffect(() => {
        setCategories([]);
        setLoading(false);
    }, []);

    const handleCreate = async () => {
        // API call to create category
        console.log('Creating category:', newCategory);
        setShowCreate(false);
        setNewCategory({ name: '', slug: '', description: '' });
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                >
                    + Add Category
                </button>
            </div>

            {showCreate && (
                <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">New Category</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={newCategory.name}
                            onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="text"
                            placeholder="Slug (e.g., electronics)"
                            value={newCategory.slug}
                            onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <textarea
                        placeholder="Description (optional)"
                        value={newCategory.description}
                        onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                        className="w-full mt-4 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        rows={2}
                    />
                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleCreate}
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700"
                        >
                            Create
                        </button>
                        <button
                            onClick={() => setShowCreate(false)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <span className="text-4xl block mb-4">🏷️</span>
                        <p>No categories yet</p>
                        <p className="text-sm mt-1">Create categories to organize your products</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Slug</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Products</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((category) => (
                                <tr key={category.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{category.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{category.slug}</td>
                                    <td className="px-6 py-4">{category._count?.products || 0}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-emerald-600 hover:text-emerald-800 text-sm font-medium mr-4">
                                            Edit
                                        </button>
                                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
