'use client';

export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">ETB 0</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">💰</span>
                        </div>
                    </div>
                    <p className="text-sm text-green-600 mt-2">↑ 0% from last month</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🛒</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">No orders yet</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📦</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Add products to start</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Total Customers</p>
                            <p className="text-2xl font-bold text-gray-900">0</p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">No customers yet</p>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="p-6">
                    <div className="text-center py-12 text-gray-500">
                        <span className="text-4xl mb-4 block">📋</span>
                        <p>No orders yet</p>
                        <p className="text-sm mt-1">Orders will appear here once customers start buying</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
