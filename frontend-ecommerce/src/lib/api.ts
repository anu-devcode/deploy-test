const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient {
    private tenantId: string | null = null;
    private token: string | null = null;

    // --- STATEFUL PERSISTENCE FOR MOCKS ---
    private products: Product[] = [
        {
            id: 'p1',
            name: 'Premium Red Lentils',
            description: 'High-protein, organic red lentils from the Ethiopian highlands.',
            price: 1290,
            stock: 240,
            sku: 'AG-LENT-01',
            categoryId: 'cat2',
            category: 'Pulses',
            status: 'ACTIVE',
            images: [],
            retail: { enabled: true, price: 1290, unit: 'kg', minOrder: 1 },
            bulk: { enabled: true, price: 115000, unit: 'Quintal', minOrder: 5 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'p2',
            name: 'Durum Wheat',
            description: 'Premium grade durum wheat, ideal for pasta and specialty breads.',
            price: 980,
            stock: 610,
            sku: 'AG-WHT-01',
            categoryId: 'cat1',
            category: 'Grains & Cereals',
            status: 'ACTIVE',
            images: [],
            retail: { enabled: true, price: 980, unit: 'kg', minOrder: 1 },
            bulk: { enabled: false, price: 0, unit: 'Quintal', minOrder: 1 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'p3',
            name: 'Sesame Seed',
            description: 'Export-quality hulled sesame seeds with high oil content.',
            price: 2450,
            stock: 85,
            sku: 'AG-SES-01',
            categoryId: 'cat3',
            category: 'Oilseeds',
            status: 'DRAFT',
            images: [],
            retail: { enabled: false, price: 0, unit: 'kg', minOrder: 1 },
            bulk: { enabled: true, price: 215000, unit: 'Quintal', minOrder: 2 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    private categories: Category[] = [
        { id: 'cat1', name: 'Grains & Cereals', slug: 'grains-cereals', description: 'Essential staples including wheat, barley, and maize.', _count: { products: 12 } },
        { id: 'cat2', name: 'Pulses', slug: 'pulses', description: 'High-protein legumes like lentils, beans, and chickpeas.', _count: { products: 24 } },
        { id: 'cat3', name: 'Oilseeds', slug: 'oilseeds', description: 'Seeds used for oil extraction, including sesame and niger seed.', _count: { products: 8 } },
        { id: 'cat4', name: 'Spices', slug: 'spices', description: 'Exotic and aromatic spices from across the region.', _count: { products: 15 } },
    ];

    private orders: Order[] = [
        { id: 'o101', orderNumber: 'ORD-2024-001', total: 2580, status: 'PENDING', customer: { name: 'Selam T.', email: 'selam@example.com' }, createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
        { id: 'o102', orderNumber: 'ORD-2024-002', total: 12450, status: 'SHIPPED', customer: { name: 'Abebe B.', email: 'abebe@example.com' }, createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString() },
        { id: 'o103', orderNumber: 'ORD-2024-003', total: 980, status: 'DELIVERED', customer: { name: 'Mekdes R.', email: 'mekdes@example.com' }, createdAt: new Date(Date.now() - 172800000).toISOString(), updatedAt: new Date().toISOString() }
    ];

    setTenantId(tenantId: string) {
        this.tenantId = tenantId;
    }

    setToken(token: string) {
        this.token = token;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (this.tenantId) headers['X-Tenant-Id'] = this.tenantId;
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;
        return headers;
    }

    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: { ...this.getHeaders(), ...headers },
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // --- AUTHENTICATION ---
    async login(email: string, password: string) {
        const lowerEmail = email.toLowerCase();
        if (lowerEmail === 'admin@test.com') {
            return { access_token: 'mock-jwt-token.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6IkFETUlOIn0.signature' };
        }
        if (lowerEmail === 'staff@test.com') {
            return { access_token: 'mock-jwt-token.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN0YWZmIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6InN0YWZmQHRlc3QuY29tIiwicm9sZSI6IlNUQUZGIn0.signature' };
        }
        return { access_token: 'fake-token' };
    }

    // --- PRODUCTS (PERSISTENT MOCKS) ---
    async getAdminProducts() {
        return this.products;
    }

    async getProductById(id: string) {
        return this.products.find(p => p.id === id);
    }

    async createProduct(data: CreateProductInput) {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            categoryId: data.categoryId || 'cat1',
            category: this.categories.find(c => c.id === data.categoryId)?.name || 'General',
            status: 'ACTIVE',
            retail: data.retail || { enabled: true, price: data.price, unit: 'kg', minOrder: 1 },
            bulk: data.bulk || { enabled: false, price: 0, unit: 'Quintal', minOrder: 1 },
            images: data.images || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as unknown as Product;
        this.products = [newProduct, ...this.products];
        return newProduct;
    }

    async updateProduct(id: string, data: Partial<CreateProductInput>) {
        this.products = this.products.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
        return this.products.find(p => p.id === id) as Product;
    }

    async deleteProduct(id: string) {
        this.products = this.products.filter(p => p.id !== id);
        return { success: true };
    }

    // --- CATEGORIES (PERSISTENT MOCKS) ---
    async getCategories() {
        return this.categories;
    }

    async createCategory(data: Partial<Category>) {
        const newCategory: Category = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || 'New Category',
            slug: data.slug || 'new-category',
            description: data.description || '',
            _count: { products: 0 }
        };
        this.categories = [newCategory, ...this.categories];
        return newCategory;
    }

    async deleteCategory(id: string) {
        this.categories = this.categories.filter(c => c.id !== id);
        return { success: true };
    }

    // --- ORDERS (PERSISTENT MOCKS) ---
    async getOrders() {
        return this.orders;
    }

    async getOrderById(id: string) {
        return this.orders.find(o => o.id === id);
    }

    async updateOrderStatus(id: string, status: OrderStatus) {
        this.orders = this.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
        return this.orders.find(o => o.id === id) as Order;
    }

    async deleteOrder(id: string) {
        this.orders = this.orders.filter(o => o.id !== id);
        return { success: true };
    }

    // --- CUSTOMERS ---
    async getCustomers() {
        return [
            { id: 'c1', name: 'Selam Tekle', email: 'selam@example.com', orders: 12, totalSpent: 45000, status: 'Active', joiningDate: new Date().toISOString() },
            { id: 'c2', name: 'Abebe Bikila', email: 'abebe@example.com', orders: 5, totalSpent: 12800, status: 'Active', joiningDate: new Date().toISOString() },
            { id: 'c3', name: 'Makeda Isayas', email: 'makeda@example.com', orders: 1, totalSpent: 1200, status: 'Inactive', joiningDate: new Date().toISOString() }
        ];
    }

    async updateCustomer(id: string, data: any) {
        return { id, ...data };
    }

    // --- LOGISTICS & DELIVERIES ---
    async getDeliveries() {
        return [
            { id: 'd1', orderId: '1001', provider: 'Ethio Post', trackingNumber: 'EP-9982-A', status: 'IN_TRANSIT' },
            { id: 'd2', orderId: '1002', provider: 'DHL Express', trackingNumber: 'DHL-5541-B', status: 'DELIVERED' },
            { id: 'd3', orderId: '1003', provider: 'Local Courier', trackingNumber: 'LC-1123-X', status: 'FAILED' }
        ];
    }

    // --- PAYMENTS ---
    async getPayments() {
        return [
            { id: 'pay1', amount: 2580, status: 'COMPLETED', method: 'Telebirr', date: new Date().toISOString() },
            { id: 'pay2', amount: 12450, status: 'COMPLETED', method: 'CBE Birr', date: new Date().toISOString() },
            { id: 'pay3', amount: 890, status: 'PENDING', method: 'M-Pesa', date: new Date().toISOString() }
        ];
    }

    // --- REVIEWS & MODERATION ---
    async getReviews() {
        return [
            { id: 'r1', rating: 5, content: 'Excellent quality lentils, highly recommended!', status: 'PENDING', customerName: 'Selam Tekle', productName: 'Premium Red Lentils', date: new Date().toISOString() },
            { id: 'r2', rating: 4, content: 'Fast delivery and good wheat.', status: 'APPROVED', customerName: 'Abebe Bikila', productName: 'Durum Wheat', date: new Date().toISOString() },
            { id: 'r3', rating: 1, content: 'Packaging was damaged.', status: 'PENDING', customerName: 'Anonymous', productName: 'Sesame Seed', date: new Date().toISOString() }
        ];
    }

    async moderateReview(id: string, status: 'APPROVED' | 'REJECTED') {
        return { id, status };
    }

    // --- STAFF MANAGEMENT ---
    async getStaff() {
        return [
            { id: 's1', name: 'Super Admin', email: 'admin@test.com', role: 'ADMIN', lastActive: new Date().toISOString(), status: 'ACTIVE' },
            { id: 's2', name: 'Operations Manager', email: 'staff@test.com', role: 'STAFF', lastActive: new Date().toISOString(), status: 'ACTIVE' },
            { id: 's3', name: 'Inventory Specialist', email: 'inv@test.com', role: 'STAFF', lastActive: new Date().toISOString(), status: 'INACTIVE' }
        ];
    }

    async inviteStaff(data: { email: string, role: string }) {
        return { id: Math.random().toString(36).substr(2, 9), ...data, status: 'INVITED', name: 'New Staff', lastActive: '-' };
    }

    // --- DASHBOARD ANALYTICS ---
    async getDashboardStats() {
        return {
            totalRevenue: 1254300,
            revenueGrowth: 15.4,
            activeOrders: this.orders.length,
            totalCustomers: 1240,
            siteStatus: 'Healthy',
            serverUptime: '99.99%',
            activeSessions: 156
        };
    }

    async getSalesHistory(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY') {
        // Return period-specific sales data
        if (period === 'MONTHLY') {
            return [
                { date: 'Aug', sales: 1200000, prevSales: 1100000, orders: 450, prevOrders: 400 },
                { date: 'Sep', sales: 1540000, prevSales: 1300000, orders: 520, prevOrders: 480 },
                { date: 'Oct', sales: 1100000, prevSales: 1250000, orders: 380, prevOrders: 410 },
                { date: 'Nov', sales: 1980000, prevSales: 1600000, orders: 650, prevOrders: 580 },
                { date: 'Dec', sales: 1650000, prevSales: 1550000, orders: 580, prevOrders: 550 },
                { date: 'Jan', sales: 2150000, prevSales: 1750000, orders: 740, prevOrders: 620 }
            ];
        }
        return [
            { date: '2026-01-23', sales: 120000, prevSales: 110000, orders: 45, prevOrders: 40 },
            { date: '2026-01-24', sales: 154000, prevSales: 130000, orders: 52, prevOrders: 48 },
            { date: '2026-01-25', sales: 110000, prevSales: 125000, orders: 38, prevOrders: 42 },
            { date: '2026-01-26', sales: 198000, prevSales: 160000, orders: 65, prevOrders: 55 },
            { date: '2026-01-27', sales: 165000, prevSales: 155000, orders: 58, prevOrders: 52 },
            { date: '2026-01-28', sales: 187000, prevSales: 140000, orders: 62, prevOrders: 50 },
            { date: '2026-01-29', sales: 215000, prevSales: 175000, orders: 74, prevOrders: 60 }
        ];
    }

    async getOperationalAlerts() {
        return [
            { id: 1, type: 'CRITICAL', title: 'Low Stock: Premium Red Lentils', time: '2 mins ago', icon: 'Box' },
            { id: 2, type: 'WARNING', title: 'Payment Delay: CBE Birr API Outage', time: '15 mins ago', icon: 'AlertTriangle' },
            { id: 3, type: 'INFO', title: 'New Staff Invited: Operations Team', time: '1 hour ago', icon: 'UserPlus' }
        ];
    }

    async getRevenueDistribution() {
        return [
            { category: 'Grains & Cereals', percentage: 45, value: 564435 },
            { category: 'Pulses', percentage: 30, value: 376290 },
            { category: 'Oilseeds', percentage: 15, value: 188145 },
            { category: 'Spices', percentage: 10, value: 125430 }
        ];
    }

    async getNotifications() {
        return [
            { id: 1, title: 'Suspicious Activity Detected', message: 'Multiple failed login attempts from IP 192.168.1.45', time: '2 mins ago', type: 'SECURITY', read: false },
            { id: 2, title: 'Inventory Alert', message: 'Stock levels for "Premium Teff" have dropped below 15%', time: '15 mins ago', type: 'INVENTORY', read: false },
            { id: 3, title: 'System Update', message: 'Backend API migration scheduled for 02:00 AM UTC', time: '1 hour ago', type: 'SYSTEM', read: true }
        ];
    }
}

// Types
export interface PricingConfig { enabled: boolean; price: number; unit: string; minOrder: number; }
export interface Product { id: string; name: string; description?: string; price: number; stock: number; sku?: string; images?: string[]; categoryId?: string; category?: string; status?: string; retail: PricingConfig; bulk: PricingConfig; createdAt: string; updatedAt: string; }
export interface Category { id: string; name: string; slug: string; description?: string; _count?: { products: number }; }
export interface CreateProductInput { name: string; description?: string; price: number; stock?: number; sku?: string; categoryId?: string; images?: string[]; retail?: PricingConfig; bulk?: PricingConfig; }
export interface Order { id: string; orderNumber: string; total: number; status: OrderStatus; customer: { name: string; email: string }; createdAt: string; updatedAt: string; }
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export const api = new ApiClient();
export default api;
