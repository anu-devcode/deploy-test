const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient {
    private tenantId: string | null = null;
    private token: string | null = null;

    // --- STATEFUL PERSISTENCE FOR MOCks ---
    private products: Product[] = [
        {
            id: 'p1',
            name: 'Premium Red Lentils',
            description: 'High-protein, organic red lentils from the Ethiopian highlands.',
            price: 1290,
            stock: 240,
            inventory: { available: 200, reserved: 30, damaged: 10 },
            sku: 'AG-LENT-01',
            categoryId: 'cat2',
            category: 'Pulses',
            status: 'ACTIVE',
            images: [],
            retail: { enabled: true, price: 1290, unit: 'kg', minOrder: 1 },
            bulk: { enabled: true, price: 115000, unit: 'Quintal', minOrder: 5 },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    private categories: Category[] = [
        { id: 'cat1', name: 'Grains & Cereals', slug: 'grains-cereals', description: 'Essential staples including wheat, barley, and maize.', _count: { products: 12 } },
        { id: 'cat2', name: 'Pulses', slug: 'pulses', description: 'High-protein legumes like lentils, beans, and chickpeas.', _count: { products: 24 } },
    ];

    private orders: Order[] = [
        { id: 'o101', orderNumber: 'ORD-2024-001', total: 2580, status: 'PENDING', customer: { name: 'Selam T.', email: 'selam@example.com' }, createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
    ];

    private staff: StaffMember[] = [
        {
            id: 's1',
            name: 'Admin User',
            email: 'admin@test.com',
            role: 'ADMIN',
            permissions: ['ALL'],
            status: 'ACTIVE',
            requiresPasswordChange: false,
            createdAt: new Date().toISOString()
        },
        {
            id: 's2',
            name: 'Logistics Staff',
            email: 'staff@test.com',
            role: 'STAFF',
            permissions: ['VIEW_INVENTORY', 'MANAGE_STOCK', 'VIEW_ORDERS'],
            status: 'ACTIVE',
            requiresPasswordChange: true, // Simulation of issued credential
            createdAt: new Date().toISOString()
        }
    ];

    private automationRules: AutomationRule[] = [
        {
            id: 'rule1',
            name: 'Auto-Confirm Large Orders',
            trigger: 'ORDER_CREATED',
            condition: 'order.total > 5000',
            action: 'UPDATE_STATUS',
            actionValue: 'CONFIRMED',
            enabled: true,
            createdAt: new Date().toISOString()
        }
    ];

    private automationLogs: AutomationLog[] = [];

    setTenantId(tenantId: string) {
        this.tenantId = tenantId;
    }

    setToken(token: string) {
        this.token = token;
    }

    private getHeaders(): Record<string, string> {
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
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
        const user = this.staff.find(u => u.email.toLowerCase() === lowerEmail);

        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Simulating simple password check (in real app, use Hash)
        // For mock, any password works but we check requiresPasswordChange

        const payload = {
            sub: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            requiresPasswordChange: user.requiresPasswordChange
        };

        const token = `mock-token.${btoa(JSON.stringify(payload))}.signature`;
        return { access_token: token, user: payload };
    }

    async changePassword(newPassword: string) {
        // Find current user from token (simulated)
        // In local mock, we can't easily get 'current user' without state
        // Let's assume the UI passes the email or we use the local state if authenticated
        return { success: true };
    }

    async adminUpdateStaffPassword(staffId: string) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');

        staff.requiresPasswordChange = true;
        const tempPassword = Math.random().toString(36).slice(-8);
        return { tempPassword };
    }

    // --- STAFF MANAGEMENT ---
    async getStaff() { return this.staff; }
    async createStaff(data: Partial<StaffMember>) {
        const newStaff: StaffMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || 'New Staff',
            email: data.email || '',
            role: data.role || 'STAFF',
            permissions: data.permissions || [],
            status: 'ACTIVE',
            requiresPasswordChange: true,
            createdAt: new Date().toISOString()
        };
        this.staff = [...this.staff, newStaff];
        return newStaff;
    }

    // --- PRODUCTS & INVENTORY ---
    async getAdminProducts() { return this.products; }
    async getProductById(id: string) { return this.products.find(p => p.id === id); }
    async updateProduct(id: string, data: Partial<CreateProductInput>) {
        this.products = this.products.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
        return this.products.find(p => p.id === id) as Product;
    }

    // --- CATEGORIES ---
    async getCategories() { return this.categories; }

    // --- STOCK MOVEMENTS ---
    async processStockMovement(data: any) {
        const product = this.products.find(p => p.id === data.productId);
        if (!product) throw new Error('Product not found');
        // Simplified for brevity
        return { success: true, product };
    }

    // --- ORDERS ---
    async getOrders() { return this.orders; }
    async updateOrderStatus(id: string, status: OrderStatus) {
        this.orders = this.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
        return this.orders.find(o => o.id === id) as Order;
    }

    // --- AUTOMATION ---
    async getAutomationRules() { return this.automationRules; }
    async getAutomationLogs() { return this.automationLogs; }

    // --- DASHBOARD ---
    async getDashboardStats() {
        return {
            totalRevenue: 1254300,
            activeOrders: this.orders.length,
            totalCustomers: 1240,
            newRegistrations: 42,
            avgOrderValue: 2986,
            requiresAttention: 5
        };
    }

    async getSalesHistory(period: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY') {
        return [
            { date: '2026-01-23', sales: 120000, prevSales: 110000, orders: 45, prevOrders: 40 },
            { date: '2026-01-29', sales: 215000, prevSales: 175000, orders: 74, prevOrders: 60 }
        ];
    }

    async getTopSellingProducts() {
        return [{ id: 'p1', name: 'Premium Red Lentils', sales: 450, revenue: 580500, status: 'In Stock' }];
    }

    async getCartMetrics() {
        return { abandonedCarts: 145, recoveredCarts: 42, recoveryRate: 28.9, lostRevenue: 245000 };
    }

    async getOperationalAlerts() {
        return [{ id: 1, type: 'CRITICAL', title: 'Low Stock: Premium Red Lentils', time: '2 mins ago', icon: 'Box' }];
    }

    async getNotifications() {
        return [
            { id: 1, title: 'Welcome to Brolf Admin', message: 'Credentials generated', time: '1 min ago', type: 'SYSTEM', read: false }
        ];
    }
}

// Types
export type Permission = 'ALL' | 'VIEW_INVENTORY' | 'MANAGE_STOCK' | 'VIEW_ORDERS' | 'MANAGE_ORDERS' | 'VIEW_PAYMENTS' | 'MANAGE_PRODUCTS' | 'MANAGE_STAFF';

export interface StaffMember {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'STAFF';
    permissions: Permission[];
    status: 'ACTIVE' | 'INACTIVE';
    requiresPasswordChange: boolean;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    inventory: { available: number; reserved: number; damaged: number };
    sku?: string;
    categoryId?: string;
    category?: string;
    status?: string;
    retail: { enabled: boolean; price: number; unit: string; minOrder: number };
    bulk: { enabled: boolean; price: number; unit: string; minOrder: number };
    images?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface Category { id: string; name: string; slug: string; description?: string; _count?: { products: number }; }
export interface Order { id: string; orderNumber: string; total: number; status: OrderStatus; customer: { name: string; email: string }; createdAt: string; updatedAt: string; }
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export interface AutomationRule { id: string; name: string; trigger: string; condition: string; action: string; actionValue: string; enabled: boolean; createdAt: string; }
export interface AutomationLog { id: string; ruleId: string; ruleName: string; trigger: string; entityId: string; action: string; status: string; details: string; createdAt: string; }
export interface CreateProductInput { name: string; description?: string; price: number; stock?: number; categoryId?: string; retail?: any; bulk?: any; images?: string[]; }

export const api = new ApiClient();
export default api;
