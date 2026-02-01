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
    slug: string;
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
    paymentStatus?: string;
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
    customer?: { firstName: string; lastName: string; email: string };
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


import { seedProducts, tenants as seedTenants } from './mock-data';

class ApiClient {
    private tenantId: string | null = null;
    private token: string | null = null;

    // --- STATEFUL PERSISTENCE FOR MOCks ---
    private products: Product[] = seedProducts.map(p => ({
        ...p,
        stock: p.stock || 100,
        inventory: { available: p.stock || 100, reserved: 0, damaged: 0 },
        categoryId: p.categoryId || (typeof p.category === 'string' ? p.category.toLowerCase().replace(/\s+/g, '-') : p.category?.id),
        category: typeof p.category === 'string' ? {
            id: p.category.toLowerCase().replace(/\s+/g, '-'),
            name: p.category,
            slug: p.category.toLowerCase().replace(/\s+/g, '-')
        } : p.category,
        retail: p.retail || { enabled: true, price: p.price, unit: 'pcs', minOrder: 1 },
        bulk: p.bulk || { enabled: true, price: Math.floor(p.price * 0.9), unit: 'box', minOrder: 10 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    })) as Product[];

    private categories: Category[] = Array.from(new Set(seedProducts.map(p =>
        typeof p.category === 'string' ? p.category : p.category?.name
    ))).map((name, index) => ({
        id: name!.toLowerCase().replace(/\s+/g, '-'),
        name: name!,
        slug: name!.toLowerCase().replace(/\s+/g, '-'),
        _count: { products: seedProducts.filter(p => (typeof p.category === 'string' ? p.category : p.category?.name) === name).length }
    }));

    private orders: Order[] = [
        { id: 'o101', orderNumber: 'ORD-2024-001', total: 2580, status: 'DELIVERED', paymentStatus: 'PAID', customer: { name: 'Selam T.', email: 'selam@example.com' }, items: [], createdAt: new Date(Date.now() - 3600000).toISOString(), updatedAt: new Date().toISOString() },
    ];
    private wishlists: Record<string, string[]> = {}; // customerId -> productIds

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
        { id: 'r1', rating: 5, comment: 'Exceptional quality lentils!', status: 'APPROVED', productName: 'Premium Red Lentils', customerName: 'Selam T.', customer: { firstName: 'Selam', lastName: 'T.', email: 'selam@example.com' }, createdAt: new Date().toISOString() },
        { id: 'r2', rating: 4, comment: 'Great for bulk purchases.', status: 'APPROVED', productName: 'Premium Red Lentils', customerName: 'Abebe B.', customer: { firstName: 'Abebe', lastName: 'B.', email: 'abebe@example.com' }, createdAt: new Date().toISOString() },
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

    async updateProfile(data: any) {
        try {
            return await this.request<any>('/profile', {
                method: 'PATCH',
                body: data
            });
        } catch (e) {
            console.warn('Backend profile update failed, falling back to mock', e);
            return {
                success: true,
                user: data
            };
        }
    }

    // Address Management
    async getAddresses() {
        try {
            return await this.request<any[]>('/profile/addresses');
        } catch (e) {
            console.warn('Backend getAddresses failed, falling back to mock');
            return [
                {
                    id: '1',
                    type: 'Home',
                    label: 'Primary residence',
                    street: 'Bole, near Edna Mall, Addis Ababa',
                    city: 'Addis Ababa',
                    phone: '+251 911 234567',
                    isDefault: true
                }
            ];
        }
    }

    async addAddress(data: any) {
        return await this.request<any>('/profile/addresses', {
            method: 'POST',
            body: data
        });
    }

    async deleteAddress(id: string) {
        return await this.request<any>(`/profile/addresses/${id}`, {
            method: 'DELETE'
        });
    }

    async setAddressDefault(id: string) {
        return await this.request<any>(`/profile/addresses/${id}/default`, {
            method: 'PATCH'
        });
    }

    async getProfile() {
        try {
            return await this.request<any>('/profile');
        } catch (e) {
            console.warn('Backend getProfile failed, falling back to mock');
            return this.customers[0]; // fallback to first mock customer
        }
    }

    async getBillingInfo() {
        try {
            return await this.request<any>('/profile/billing');
        } catch (e) {
            console.warn('Backend getBillingInfo failed, falling back to mock');
            return {
                savedMethods: [
                    { id: 'm1', type: 'CARD', brand: 'visa', last4: '4242', expiry: '12/26', isDefault: true }
                ],
                billingAddress: {
                    address: 'Bole, Addis Ababa',
                    city: 'Addis Ababa',
                    country: 'Ethiopia',
                }
            };
        }
    }

    async getInvoices() {
        try {
            return await this.request<any[]>('/profile/invoices');
        } catch (e) {
            console.warn('Backend getInvoices failed');
            return [];
        }
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
        // Build query string
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.featured) queryParams.append('featured', 'true');
        if (params.tags) queryParams.append('tags', params.tags.join(','));
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

        return this.request<any>(`/storefront/products?${queryParams.toString()}`);
    }

    async searchProducts(query: string) {
        return this.getStorefrontProducts({ search: query, limit: 5 });
    }

    async createProduct(data: Partial<CreateProductInput>) {
        const slug = (data.name || 'new-product').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const newProduct: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: data.name || 'New Product',
            slug,
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
                paymentStatus: 'PENDING',
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

    async initializePayment(data: { orderId: string; amount: number; method: string }) {
        try {
            return await this.request<any>('/payments/initialize', {
                method: 'POST',
                body: data
            });
        } catch (e) {
            console.warn('Backend payment initialization failed, falling back to mock');
            const instructions: any = {
                TELEBIRR: {
                    name: 'Telebirr SuperApp',
                    accountName: 'Adis Harvest Global',
                    accountNumber: '+251 912 345 678',
                    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=telebirr://pay?to=0912345678',
                    type: 'phone'
                },
                CBE: {
                    name: 'Commercial Bank of Ethiopia',
                    accountName: 'Adis Harvest PLC',
                    accountNumber: '1000123456789',
                    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=cbe:1000123456789',
                    type: 'account'
                }
            };
            return {
                paymentId: Math.random().toString(36).substr(2, 9),
                instructions: (instructions as any)[data.method] || { instructions: 'Follow on-screen steps.' }
            };
        }
    }

    async submitManualPayment(paymentId: string, data: { receiptUrl: string }) {
        return await this.request<any>(`/payments/${paymentId}/submit-manual`, {
            method: 'POST',
            body: data
        });
    }

    async verifyPayment(paymentId: string, approve: boolean, note?: string) {
        return await this.request<any>(`/payments/${paymentId}/verify`, {
            method: 'POST',
            body: { approve, note }
        });
    }

    async deleteOrder(id: string) {

        this.orders = this.orders.filter(o => o.id !== id);
        return { success: true };
    }

    // --- REVIEWS ---
    async getProductReviews(productId: string) {
        return this.reviews;
    }

    async getProductStats(productId: string) {
        const totalReviews = this.reviews.length;
        const averageRating = totalReviews > 0
            ? this.reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
            : 0;
        return { averageRating, totalReviews };
    }

    // --- DASHBOARD ---
    async getDashboardStats() {
        return {
            totalRevenue: 125430,
            revenueChange: 12.5,
            activeOrders: 42,
            ordersChange: 8.2,
            totalCustomers: 850,
            customersChange: 5.4,
            avgOrderValue: 2986,
            avgOrderChange: -2.1
        };
    }

    // --- WISHLIST ---
    async getWishlist(customerId: string) {
        try {
            return await this.request<any>(`/wishlist/${customerId}`);
        } catch (e) {
            const productIds = this.wishlists[customerId] || [];
            return {
                id: 'mock-wishlist',
                customerId,
                items: productIds.map(pid => ({
                    id: `wi-${pid}`,
                    productId: pid,
                    product: this.products.find(p => p.id === pid)
                })).filter(item => item.product)
            };
        }
    }

    async addToWishlist(customerId: string, productId: string) {
        try {
            return await this.request<any>(`/wishlist/${customerId}/items`, {
                method: 'POST',
                body: { productId }
            });
        } catch (e) {
            if (!this.wishlists[customerId]) this.wishlists[customerId] = [];
            if (!this.wishlists[customerId].includes(productId)) {
                this.wishlists[customerId].push(productId);
            }
            return this.getWishlist(customerId);
        }
    }

    async removeFromWishlist(customerId: string, productId: string) {
        try {
            return await this.request<any>(`/wishlist/${customerId}/items/${productId}`, {
                method: 'DELETE'
            });
        } catch (e) {
            if (this.wishlists[customerId]) {
                this.wishlists[customerId] = this.wishlists[customerId].filter(id => id !== productId);
            }
            return this.getWishlist(customerId);
        }
    }

    async getSalesHistory(period: string) {
        return [
            { date: 'Mon', revenue: 4500, orders: 12 },
            { date: 'Tue', revenue: 5200, orders: 15 },
            { date: 'Wed', revenue: 4800, orders: 11 },
            { date: 'Thu', revenue: 6100, orders: 18 },
            { date: 'Fri', revenue: 5900, orders: 17 },
            { date: 'Sat', revenue: 7200, orders: 22 },
            { date: 'Sun', revenue: 6800, orders: 20 }
        ];
    }

    async getOperationalAlerts() {
        return [
            { id: '1', level: 'CRITICAL', type: 'INVENTORY', message: 'Ethiopian Yirgacheffe (Bulk) is below 5% stock', time: '10m ago' },
            { id: '2', level: 'WARNING', type: 'PAYMENT', message: 'Unusual failure rate for Telebirr payments', time: '45m ago' },
            { id: '3', level: 'INFO', type: 'SYSTEM', message: 'Weekly automated backup completed', time: '2h ago' }
        ];
    }

    async getTopSellingProducts() {
        return [
            { id: '1', name: 'Sidamo Coffee Beans', sales: 450, revenue: 45000, trend: 'UP' },
            { id: '2', name: 'Harar Whole Bean', sales: 380, revenue: 38000, trend: 'UP' },
            { id: '3', name: 'Organic Teff', sales: 320, revenue: 16000, trend: 'DOWN' }
        ];
    }

    async getCartMetrics() {
        return {
            activeCarts: 124,
            abandonmentRate: 32.5,
            recoveredCarts: 18,
            topAbandonmentProducts: [
                { id: '1', name: 'Honey 500g', count: 15 },
                { id: '2', name: 'Spices Mix', count: 12 }
            ]
        };
    }

    async createReview(data: any) {
        const newReview: Review = {
            id: Math.random().toString(),
            rating: data.rating,
            comment: data.comment,
            status: 'PENDING',
            productName: 'Product', // Should fetch from product state
            customerName: 'Anonymous',
            customer: { firstName: 'Anonymous', lastName: '', email: '' },
            createdAt: new Date().toISOString()
        };
        this.reviews.push(newReview);
        return newReview;
    }

    // --- NOTIFICATIONS ---
    async getNotifications() {
        return this.request<any[]>('/notifications');
    }

    async getRecentNotifications() {
        return this.request<any[]>('/notifications/recent');
    }

    async getUnreadNotificationsCount() {
        return this.request<{ count: number }>('/notifications/unread-count');
    }

    async markNotificationAsRead(id: string) {
        return this.request<any>(`/notifications/${id}/read`, { method: 'PATCH' });
    }

    // --- MESSAGES / HELP ---
    async getMessages() {
        return this.request<any[]>('/messages');
    }

    async getUnreadMessagesCount() {
        return this.request<{ count: number }>('/messages/unread-count');
    }

    async getMessageThread(id: string) {
        return this.request<any>(`/messages/${id}`);
    }

    async sendMessage(data: { subject?: string; content: string; parentId?: string }) {
        return this.request<any>('/messages', {
            method: 'POST',
            body: data
        });
    }

    // Admin Specific
    async getAdminMessages() {
        return this.request<any[]>('/messages/admin');
    }

    async adminReplyToMessage(id: string, content: string) {
        return this.request<any>(`/messages/admin/${id}/reply`, {
            method: 'POST',
            body: { content }
        });
    }

    async updateMessageStatus(id: string, status: string) {
        return this.request<any>(`/messages/${id}/status`, {
            method: 'PATCH',
            body: { status }
        });
    }

    async markMessageAsRead(id: string) {
        return this.request<any>(`/messages/${id}/read`, { method: 'PATCH' });
    }

}

export const api = new ApiClient();
export default api;
