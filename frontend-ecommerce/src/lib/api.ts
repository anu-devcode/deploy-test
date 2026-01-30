const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
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

export interface Category { id: string; name: string; slug: string; description?: string; _count?: { products: number }; }

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    inventory: { available: number; reserved: number; damaged: number };
    sku?: string;
    categoryId?: string;
    category?: Category;
    status?: string;
    retail: { enabled: boolean; price: number; unit: string; minOrder: number };
    bulk: { enabled: boolean; price: number; unit: string; minOrder: number };
    images?: string[];
    avgRating?: number;
    reviewCount?: number;
    compareAtPrice?: number;
    tenantId?: string;
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
}

export interface Order {
    id: string;
    orderNumber: string;
    total: number;
    status: OrderStatus;
    customer?: { name: string; email: string };
    isGuest?: boolean;
    guestEmail?: string;
    guestName?: string;
    trackingToken?: string;
    shippingAddress?: string;
    shippingCity?: string;
    paymentMethod?: string;
    items: any[];
    createdAt: string;
    updatedAt: string;
}
export type OrderStatus = string;
export type PaymentStatus = string;
export type AutomationTrigger = 'ORDER_CREATED' | 'STOCK_LOW' | 'CUSTOMER_REGISTERED' | 'PAYMENT_RECEIVED';
export type AutomationAction = 'SEND_EMAIL' | 'UPDATE_STATUS' | 'NOTIFY_STAFF' | 'GENERATE_INVOICE' | 'ADJUST_STOCK' | 'CREATE_NOTIFICATION';
export interface AutomationRule { id: string; name: string; trigger: AutomationTrigger; condition: string; action: AutomationAction; actionValue: string; enabled: boolean; createdAt: string; }
export interface AutomationLog { id: string; ruleId: string; ruleName: string; trigger: string; entityId: string; action: string; status: string; details: string; createdAt: string; }
export interface CreateProductInput { name: string; description?: string; price: number; stock?: number; categoryId?: string; retail?: any; bulk?: any; images?: string[]; }

export interface Customer {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    adminNotes?: string;
    flags?: string[];
    createdAt: string;
    updatedAt: string;
    _count?: { orders: number };
}

export interface Delivery {
    id: string;
    orderId: string;
    status: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
    driverName?: string;
    driverPhone?: string;
    estimatedTime?: string;
    actualDelivery?: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    orderId: string;
    amount: number;
    method: 'TELEBIRR' | 'CBE' | 'MPESA' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
    transactionId?: string;
    createdAt: string;
}

export interface Review {
    id: string;
    rating: number;
    comment?: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    productName: string;
    customerName: string;
    createdAt: string;
}

export interface AuditLog {
    id: string;
    productId: string;
    productName: string;
    type: 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'TRANSFER' | 'RETURN';
    quantity: number;
    notes?: string;
    date: string;
}

export type PromotionType = 'PERCENTAGE' | 'FIXED_AMOUNT';
export type PromotionTarget = 'PRODUCT' | 'CATEGORY' | 'CART';
export type PromoBusinessType = 'RETAIL' | 'BULK' | 'BOTH';

export interface Promotion {
    id: string;
    name: string;
    description?: string;
    code?: string;
    type: PromotionType;
    target: PromotionTarget;
    targetIds: string[];
    value: number;
    minAmount?: number;
    startDate?: string;
    endDate?: string;
    usageLimit?: number;
    currentUsage: number;
    businessType: PromoBusinessType;
    isActive: boolean;
    createdAt: string;
}

// CMS Types
export interface ContentPage {
    id: string;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    updatedAt: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    author: string;
    category: string;
    isPublished: boolean;
    updatedAt: string;
}

export type ContentBlockType = 'BANNER' | 'TESTIMONIAL' | 'FAQ' | 'STORY';
export interface ContentBlock {
    id: string;
    type: ContentBlockType;
    title: string;
    content: any; // Flexible content structure
    isActive: boolean;
    order: number;
}


class ApiClient {
    private tenantId: string | null = null;
    private token: string | null = null;

    // --- STATEFUL PERSISTENCE FOR MOCks ---
    private products: Product[] = [
        {
            id: 'p1',
            name: 'Premium Red Lentils',
            description: 'Organic Ethiopian red lentils, high protein.',
            price: 129,
            stock: 850,
            inventory: { available: 850, reserved: 0, damaged: 0 },
            sku: 'LENT-001',
            categoryId: 'cat1',
            category: { id: 'cat1', name: 'Legumes', slug: 'legumes' },
            status: 'In Stock',
            avgRating: 4.8,
            reviewCount: 42,
            compareAtPrice: 1500,
            retail: { enabled: true, price: 129, unit: 'kg', minOrder: 1 },
            bulk: { enabled: true, price: 115, unit: 'quintal', minOrder: 1 },
            images: ['/products/lentils.jpg'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    private categories: Category[] = [
        { id: 'cat1', name: 'Grains & Cereals', slug: 'grains-cereals', description: 'Essential staples including wheat, barley, and maize.', _count: { products: 12 } },
        { id: 'cat2', name: 'Pulses', slug: 'pulses', description: 'High-protein legumes like lentils, beans, and chickpeas.', _count: { products: 24 } },
    ];

    private orders: Order[] = [
        { id: 'o101', orderNumber: 'ORD-2024-001', total: 2580, status: 'PENDING', customer: { name: 'Selam T.', email: 'selam@example.com' }, items: [], createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
    ];

    private notifications: any[] = [];
    private pages: ContentPage[] = [
        { id: '1', title: 'About Us', slug: 'about-us', content: 'Acme Crops has been serving farmers since 1994...', isPublished: true, updatedAt: new Date().toISOString() },
        { id: '2', title: 'Privacy Policy', slug: 'privacy', content: 'Your data is safe with us...', isPublished: true, updatedAt: new Date().toISOString() }
    ];
    private posts: BlogPost[] = [
        { id: '1', title: 'The Future of Durum Wheat', slug: 'future-of-wheat', content: 'Deep dive into yield optimization...', author: 'Dr. Selam', category: 'Agriculture', isPublished: true, updatedAt: new Date().toISOString() }
    ];
    private blocks: ContentBlock[] = [
        { id: '1', type: 'BANNER', title: 'Harvest Sale', content: { text: 'Save big this month!' }, isActive: true, order: 1 }
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
            requiresPasswordChange: true,
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
    private customers: Customer[] = [
        {
            id: 'c1',
            email: 'customer1@example.com',
            firstName: 'Kaleb',
            lastName: 'M.',
            phone: '+251 911 223344',
            address: 'Bole, Addis Ababa',
            city: 'Addis Ababa',
            country: 'Ethiopia',
            adminNotes: 'Frequent buyer, prefers bulk packaging.',
            flags: ['VIP', 'LEGACY'],
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date().toISOString(),
            _count: { orders: 12 }
        }
    ];
    private deliveries: Delivery[] = [
        { id: 'd1', orderId: 'o101', status: 'IN_TRANSIT', driverName: 'Abebe B.', driverPhone: '+251911223344', estimatedTime: new Date(Date.now() + 7200000).toISOString(), createdAt: new Date().toISOString() }
    ];
    private payments: Payment[] = [
        { id: 'pay1', orderId: 'o101', amount: 2580, method: 'TELEBIRR', status: 'COMPLETED', transactionId: 'TX12345678', createdAt: new Date().toISOString() }
    ];
    private reviews: Review[] = [
        { id: 'r1', rating: 5, comment: 'Excellent quality lentils!', status: 'APPROVED', productName: 'Premium Red Lentils', customerName: 'Selam T.', createdAt: new Date().toISOString() }
    ];
    private auditLogs: AuditLog[] = [
        { id: 'al1', productId: 'p1', productName: 'Premium Red Lentils', type: 'ADJUSTMENT', quantity: 50, notes: 'Restock from local warehouse', date: new Date().toISOString() }
    ];

    private promotions: Promotion[] = [
        {
            id: 'promo1',
            name: 'Welcome Discount',
            description: '10% off for new retail customers',
            code: 'WELCOME10',
            type: 'PERCENTAGE',
            target: 'CART',
            targetIds: [],
            value: 10,
            minAmount: 1000,
            businessType: 'RETAIL',
            isActive: true,
            currentUsage: 0,
            createdAt: new Date().toISOString()
        },
        {
            id: 'promo2',
            name: 'Bulk Pulse Special',
            description: 'Flat 500 ETB off on Pulses category for bulk buyers',
            code: 'BULKPULSE',
            type: 'FIXED_AMOUNT',
            target: 'CATEGORY',
            targetIds: ['cat2'],
            value: 500,
            minAmount: 5000,
            businessType: 'BULK',
            isActive: true,
            currentUsage: 0,
            createdAt: new Date().toISOString()
        }
    ];

    constructor() {
        // No-op constructor for now
    }

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
        return { success: true };
    }

    async adminUpdateStaffPassword(staffId: string) {
        const staff = this.staff.find(s => s.id === staffId);
        if (!staff) throw new Error('Staff not found');

        staff.requiresPasswordChange = true;
        const tempPassword = Math.random().toString(36).slice(-8);
        return { tempPassword };
    }

    async register(email: string, password: string, role: string) {
        return { success: true };
    }

    // --- CUSTOMER MANAGEMENT ---
    async getCustomers() { return this.customers; }

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
    async getProduct(id: string): Promise<Product | null> { return this.products.find(p => p.id === id) || null; }
    async getProductSuggestions(id: string): Promise<Product[]> {
        const product = await this.getProduct(id);
        if (!product) return this.products.slice(0, 4);
        return this.products.filter(p => p.categoryId === product.categoryId && p.id !== id).slice(0, 4);
    }
    async getProductBatches(id: string) { return []; }
    async getProductStockLogs(id: string) { return []; }
    async updateProduct(id: string, data: Partial<CreateProductInput>) {
        this.products = this.products.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
        return this.products.find(p => p.id === id) as Product;
    }

    async getStorefrontProducts(params: any) {
        return {
            products: this.products,
            pagination: { total: this.products.length, page: 1, limit: 10, totalPages: 1 }
        };
    }

    async createProduct(data: Partial<CreateProductInput>) {
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || 'New Product',
            description: data.description,
            price: data.price || 0,
            stock: data.stock || 0,
            categoryId: data.categoryId,
            inventory: { available: data.stock || 0, reserved: 0, damaged: 0 },
            retail: data.retail || { enabled: true, price: data.price || 0, unit: 'kg', minOrder: 1 },
            bulk: data.bulk || { enabled: false, price: 0, unit: 'quintal', minOrder: 1 },
            images: data.images || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.products = [newProduct, ...this.products];
        return newProduct;
    }

    async deleteProduct(id: string) {
        this.products = this.products.filter(p => p.id !== id);
        return { success: true };
    }

    // --- CATEGORIES ---
    async getCategories() { return this.categories; }
    async createCategory(data: Partial<Category>) {
        const newCat: Category = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || 'New Category',
            slug: data.slug || '',
            description: data.description,
            _count: { products: 0 }
        };
        this.categories = [...this.categories, newCat];
        return newCat;
    }
    async updateCategory(id: string, data: Partial<Category>) {
        this.categories = this.categories.map(c => c.id === id ? { ...c, ...data } : c);
        return this.categories.find(c => c.id === id);
    }
    async deleteCategory(id: string) {
        this.categories = this.categories.filter(c => c.id !== id);
        return { success: true };
    }

    // --- CMS ---
    async getPages() { return this.pages; }
    async updatePage(id: string, data: Partial<ContentPage>) {
        this.pages = this.pages.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p);
        return this.pages.find(p => p.id === id);
    }

    async getPosts() { return this.posts; }
    async createPost(data: Partial<BlogPost>) {
        const newPost = { id: Math.random().toString(), ...data, updatedAt: new Date().toISOString() } as BlogPost;
        this.posts = [newPost, ...this.posts];
        return newPost;
    }

    async getBlocks() { return this.blocks; }
    async updateBlock(id: string, data: Partial<ContentBlock>) {
        this.blocks = this.blocks.map(b => b.id === id ? { ...b, ...data } : b);
        return this.blocks.find(b => b.id === id);
    }

    // --- STOCK MOVEMENTS ---
    async processStockMovement(data: any) {
        const product = this.products.find(p => p.id === data.productId);
        if (!product) throw new Error('Product not found');
        return { success: true, product };
    }

    // --- ORDERS ---
    async getOrders() { return this.orders; }

    async trackOrder(orderNumber: string, email: string) {
        // Mock implementation searching local state
        const order = this.orders.find(o =>
            o.orderNumber === orderNumber &&
            (o.customer?.email === email || o.guestEmail === email)
        );

        if (order) return order;

        // Fallback to real API if not found in mock
        try {
            return await this.request<Order>(`/orders/track/email?orderNumber=${orderNumber}&email=${email}`);
        } catch (e) {
            throw new Error('Order not found');
        }
    }

    async updateOrderStatus(id: string, status: OrderStatus) {
        this.orders = this.orders.map(o => o.id === id ? { ...o, status, updatedAt: new Date().toISOString() } : o);
        return this.orders.find(o => o.id === id) as Order;
    }

    async checkout(data: any) {
        // Attempt to hit real backend
        try {
            return await this.request<Order>('/orders', {
                method: 'POST',
                body: data
            });
        } catch (e) {
            console.warn('Backend checkout failed, falling back to mock', e);
            // Fallback mock
            const newOrder: Order = {
                id: Math.random().toString(36).substr(2, 9),
                orderNumber: `ORD-${Date.now()}`,
                total: 0, // Should calculate from items
                status: 'PENDING',
                items: [],
                isGuest: data.isGuest,
                guestEmail: data.guestEmail,
                guestName: data.guestName,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            this.orders.push(newOrder);
            return newOrder;
        }
    }

    async deleteOrder(id: string) {
        this.orders = this.orders.filter(o => o.id !== id);
        return { success: true };
    }

}

export const api = new ApiClient();
export default api;
