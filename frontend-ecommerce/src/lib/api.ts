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
        },
        {
            id: 'p2',
            name: 'Durum Wheat',
            description: 'Premium grade durum wheat, ideal for pasta and specialty breads.',
            price: 980,
            stock: 610,
            inventory: { available: 580, reserved: 20, damaged: 10 },
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
            inventory: { available: 70, reserved: 15, damaged: 0 },
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

    private auditLogs: InventoryAuditLog[] = [
        { id: 'l1', productId: 'p1', action: 'STOCK_IN', quantity: 50, type: 'ADDITION', user: 'Admin', reason: 'Monthly Restock', createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'l2', productId: 'p2', action: 'STOCK_OUT', quantity: 10, type: 'REDUCTION', user: 'Staff', reason: 'Damaged during transit', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'l3', productId: 'p1', action: 'ADJUSTMENT', quantity: -2, type: 'REDUCTION', user: 'Admin', reason: 'Inventory Correction', createdAt: new Date(Date.now() - 3600000).toISOString() },
    ];

    private batches: StockBatch[] = [
        { id: 'b1', productId: 'p1', batchNumber: 'BAT-2024-001', quantity: 150, grade: 'Premium', expiryDate: '2025-12-01', receivedDate: '2024-01-10' },
        { id: 'b2', productId: 'p1', batchNumber: 'BAT-2024-002', quantity: 50, grade: 'Grade A', expiryDate: '2025-06-01', receivedDate: '2024-01-15' },
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
        },
        {
            id: 'rule2',
            name: 'Notify Staff on Low Stock',
            trigger: 'STOCK_LOW',
            condition: 'product.stock < 50',
            action: 'NOTIFY_STAFF',
            actionValue: 'Staff Channel',
            enabled: true,
            createdAt: new Date().toISOString()
        }
    ];

    private automationLogs: AutomationLog[] = [
        { id: 'log1', ruleId: 'rule1', ruleName: 'Auto-Confirm Large Orders', trigger: 'ORDER_CREATED', entityId: 'o102', action: 'UPDATE_STATUS', status: 'SUCCESS', details: 'Order ORD-2024-002 automatically confirmed.', createdAt: new Date(Date.now() - 86400000).toISOString() },
    ];

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
        if (lowerEmail === 'admin@test.com') {
            return { access_token: 'mock-jwt-token.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6ImFkbWluQHRlc3QuY29tIiwicm9sZSI6IkFETUlOIn0.signature' };
        }
        if (lowerEmail === 'staff@test.com') {
            return { access_token: 'mock-jwt-token.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlN0YWZmIiwiaWF0IjoxNTE2MjM5MDIyLCJlbWFpbCI6InN0YWZmQHRlc3QuY29tIiwicm9sZSI6IlNUQUZGIn0.signature' };
        }
        return { access_token: 'fake-token' };
    }

    // --- PRODUCTS & INVENTORY ---
    async getAdminProducts() {
        return this.products;
    }

    async getProductById(id: string) {
        return this.products.find(p => p.id === id);
    }

    async updateProduct(id: string, data: Partial<CreateProductInput>) {
        this.products = this.products.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
        const product = this.products.find(p => p.id === id) as Product;

        // Trigger for Stock Low
        if (product && product.stock < 50) {
            this.runAutomation('STOCK_LOW', product);
        }

        return product;
    }

    async createProduct(data: CreateProductInput) {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            categoryId: data.categoryId || 'cat1',
            category: this.categories.find(c => c.id === data.categoryId)?.name || 'General',
            status: 'ACTIVE',
            stock: data.stock || 0,
            inventory: { available: data.stock || 0, reserved: 0, damaged: 0 },
            retail: data.retail || { enabled: true, price: data.price, unit: 'kg', minOrder: 1 },
            bulk: data.bulk || { enabled: false, price: 0, unit: 'Quintal', minOrder: 1 },
            images: data.images || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        } as unknown as Product;
        this.products = [newProduct, ...this.products];
        return newProduct;
    }

    async deleteProduct(id: string) {
        this.products = this.products.filter(p => p.id !== id);
        return { success: true };
    }

    // --- CATEGORIES ---
    async getCategories() {
        return this.categories;
    }

    // --- STOCK MOVEMENTS & AUDIT ---
    async getStockAuditLogs() {
        return this.auditLogs;
    }

    async getProductBatches(productId: string) {
        return this.batches.filter(b => b.productId === productId);
    }

    async processStockMovement(data: { productId: string, action: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT', quantity: number, reason: string, batchNumber?: string, grade?: string }) {
        const product = this.products.find(p => p.id === data.productId);
        if (!product) throw new Error('Product not found');

        const quantity = data.quantity;
        if (data.action === 'STOCK_IN') {
            product.stock += quantity;
            product.inventory.available += quantity;
            if (data.batchNumber) {
                this.batches.push({
                    id: Math.random().toString(36).substr(2, 9),
                    productId: data.productId,
                    batchNumber: data.batchNumber,
                    quantity: quantity,
                    grade: data.grade || 'Standard',
                    receivedDate: new Date().toISOString()
                });
            }
        } else if (data.action === 'STOCK_OUT') {
            if (product.inventory.available < quantity) throw new Error('Insufficient available stock');
            product.stock -= quantity;
            product.inventory.available -= quantity;
        } else {
            product.stock += quantity; // adjustment can be negative
            product.inventory.available += quantity;
        }

        const newLog: InventoryAuditLog = {
            id: Math.random().toString(36).substr(2, 9),
            productId: data.productId,
            action: data.action,
            quantity: Math.abs(quantity),
            type: quantity >= 0 ? 'ADDITION' : 'REDUCTION',
            user: 'Admin',
            reason: data.reason,
            createdAt: new Date().toISOString()
        };
        this.auditLogs = [newLog, ...this.auditLogs];
        product.updatedAt = new Date().toISOString();

        // Trigger for Stock Low
        if (product.stock < 50) {
            this.runAutomation('STOCK_LOW', product);
        }

        return { success: true, product };
    }

    // --- ORDERS ---
    async getOrders() { return this.orders; }
    async updateOrderStatus(id: string, status: OrderStatus) {
        this.orders = this.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
        const order = this.orders.find(o => o.id === id) as Order;

        // Check for specific transitions
        if (status === 'CONFIRMED') {
            // Potential triggers
        }

        return order;
    }
    async createOrder(data: { customerId?: string, items: any[], total: number }) {
        const newOrder: Order = {
            id: Math.random().toString(36).substr(2, 9),
            orderNumber: `ORD-2026-${this.orders.length + 101}`,
            total: data.total,
            status: 'PENDING',
            customer: { name: 'Automated Test', email: 'test@example.com' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.orders = [newOrder, ...this.orders];

        // Trigger for Order Created
        this.runAutomation('ORDER_CREATED', newOrder);

        return newOrder;
    }
    async deleteOrder(id: string) {
        this.orders = this.orders.filter(o => o.id !== id);
        return { success: true };
    }

    // --- AUTOMATION ENGINE ---
    async getAutomationRules() { return this.automationRules; }
    async createAutomationRule(rule: Partial<AutomationRule>) {
        const newRule: AutomationRule = {
            id: Math.random().toString(36).substr(2, 9),
            name: rule.name || 'Untitled Rule',
            trigger: rule.trigger || 'ORDER_CREATED',
            condition: rule.condition || '',
            action: rule.action || 'NOTIFY_STAFF',
            actionValue: rule.actionValue || '',
            enabled: true,
            createdAt: new Date().toISOString()
        };
        this.automationRules = [newRule, ...this.automationRules];
        return newRule;
    }
    async updateAutomationRule(id: string, rule: Partial<AutomationRule>) {
        this.automationRules = this.automationRules.map(r => r.id === id ? { ...r, ...rule } : r);
        return this.automationRules.find(r => r.id === id);
    }
    async deleteAutomationRule(id: string) {
        this.automationRules = this.automationRules.filter(r => r.id !== id);
        return { success: true };
    }
    async getAutomationLogs() { return this.automationLogs; }

    private runAutomation(trigger: AutomationTrigger, entity: any) {
        const rules = this.automationRules.filter(r => r.trigger === trigger && r.enabled);
        rules.forEach(rule => {
            let matches = false;
            try {
                // Simple condition parser simulation
                if (!rule.condition) {
                    matches = true;
                } else {
                    if (trigger === 'ORDER_CREATED' && rule.condition.includes('order.total')) {
                        const threshold = parseInt(rule.condition.split('>')[1].trim());
                        if (entity.total > threshold) matches = true;
                    } else if (trigger === 'STOCK_LOW' && rule.condition.includes('product.stock')) {
                        const threshold = parseInt(rule.condition.split('<')[1].trim());
                        if (entity.stock < threshold) matches = true;
                    }
                }
            } catch (e) { console.error('Automation condition error', e); }

            if (matches) {
                // Perform action
                if (rule.action === 'UPDATE_STATUS' && trigger === 'ORDER_CREATED') {
                    this.updateOrderStatus(entity.id, rule.actionValue as OrderStatus);
                }

                // Log execution
                this.automationLogs.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    ruleId: rule.id,
                    ruleName: rule.name,
                    trigger: rule.trigger,
                    entityId: entity.id,
                    action: rule.action,
                    status: 'SUCCESS',
                    details: `Rule "${rule.name}" triggered for ${entity.orderNumber || entity.name}.`,
                    createdAt: new Date().toISOString()
                });
            }
        });
    }

    // --- ANALYTICS & DASHBOARD ---
    async getDashboardStats() {
        return {
            totalRevenue: 1254300,
            revenueGrowth: 15.4,
            activeOrders: this.orders.length,
            orderGrowth: 8.2,
            totalCustomers: 1240,
            customerGrowth: 24.5,
            newRegistrations: 42,
            avgOrderValue: 2986,
            aovGrowth: 5.1,
            abandonmentRate: 32.4,
            conversionRate: 6.8,
            siteStatus: 'Healthy',
            serverUptime: '99.99%',
            activeSessions: 156
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
        return [{ id: 1, title: 'Suspicious Activity Detected', message: 'Failed login attempts', time: '2 mins ago', type: 'SECURITY', read: false }];
    }
}

// Types
export interface PricingConfig { enabled: boolean; price: number; unit: string; minOrder: number; }
export interface StockBatch { id: string; productId: string; batchNumber: string; quantity: number; grade: string; expiryDate?: string; receivedDate: string; }
export interface InventoryState { available: number; reserved: number; damaged: number; }
export interface InventoryAuditLog { id: string; productId: string; action: 'STOCK_IN' | 'STOCK_OUT' | 'ADJUSTMENT'; quantity: number; type: 'ADDITION' | 'REDUCTION'; user: string; reason: string; createdAt: string; }

export interface AutomationRule {
    id: string;
    name: string;
    trigger: AutomationTrigger;
    condition: string;
    action: AutomationAction;
    actionValue: string;
    enabled: boolean;
    createdAt: string;
}

export type AutomationTrigger = 'ORDER_CREATED' | 'PAYMENT_RECEIVED' | 'STOCK_LOW' | 'CUSTOMER_REGISTERED';
export type AutomationAction = 'UPDATE_STATUS' | 'NOTIFY_STAFF' | 'SEND_EMAIL' | 'GENERATE_INVOICE';

export interface AutomationLog {
    id: string;
    ruleId: string;
    ruleName: string;
    trigger: AutomationTrigger;
    entityId: string;
    action: AutomationAction;
    status: 'SUCCESS' | 'FAILED';
    details: string;
    createdAt: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    inventory: InventoryState;
    sku?: string;
    images?: string[];
    categoryId?: string;
    category?: string;
    status?: string;
    retail: PricingConfig;
    bulk: PricingConfig;
    createdAt: string;
    updatedAt: string;
}

export interface Category { id: string; name: string; slug: string; description?: string; _count?: { products: number }; }
export interface CreateProductInput { name: string; description?: string; price: number; stock?: number; sku?: string; categoryId?: string; images?: string[]; retail?: PricingConfig; bulk?: PricingConfig; }
export interface Order { id: string; orderNumber: string; total: number; status: OrderStatus; customer: { name: string; email: string }; createdAt: string; updatedAt: string; }
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export const api = new ApiClient();
export default api;
