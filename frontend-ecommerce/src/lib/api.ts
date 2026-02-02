import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// --- TYPES (Preserved) ---
export interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

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

// --- API CLIENT ---

class ApiClient {
    private client: AxiosInstance;
    private tenantId: string | null = null; // Deprecated but kept for compatibility

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        // Request Interceptor (Minimal - browser handles cookies)
        this.client.interceptors.request.use((config) => {
            // Token is now in cookie, so Authorization header is not needed manually
            return config;
        });

        // Response Interceptor for Token Refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const response = await this.client.post('/auth/refresh');
                        // Browser will update cookies automatically
                        return this.client(originalRequest);
                    } catch (refreshError) {
                        // Refresh token also failed, logout user
                        return Promise.reject(refreshError);
                    }
                }
                const message = error.response?.data?.message || error.message || 'An error occurred';
                return Promise.reject(new Error(message));
            }
        );
    }

    setToken(token: string) {
        // Deprecated: browser handles HttpOnly cookies
    }

    setTenantId(tenantId: string) {
        this.tenantId = tenantId; // No-op in single tenant, but kept for interface compatibility
    }

    // Helper to keep the existing calling pattern if needed, or we can use direct axios methods
    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;
        const config: AxiosRequestConfig = {
            url: endpoint,
            method,
            data: body,
            headers,
        };
        const response = await this.client.request<T>(config);
        return response.data;
    }

    // --- AUTHENTICATION ---
    async login(email: string, password: string, portal: 'STOREFRONT' | 'ADMIN' = 'STOREFRONT') {
        const response = await this.client.post('/auth/login', { email, password, portal });
        return response.data; // Returned object is { user: { ... } }
    }

    async register(email: string, password: string, firstName?: string, lastName?: string, role: string = 'CUSTOMER') {
        const response = await this.client.post('/auth/register', {
            email,
            password,
            firstName: firstName || null,
            lastName: lastName || null,
            role: role || 'CUSTOMER'
        });
        return response.data;
    }

    async logout() {
        const response = await this.client.post('/auth/logout');
        return response.data;
    }

    async changePassword(newPassword: string) {
        // Assuming a profile/password endpoint exists
        return this.client.patch('/profile/password', { password: newPassword }).then(r => r.data);
    }

    async adminUpdateStaffPassword(staffId: string) {
        return this.client.patch(`/staff/${staffId}/reset-password`).then(r => r.data);
    }

    async getProfile() {
        return this.client.get('/profile').then(r => r.data);
    }

    async updateProfile(data: any) {
        return this.client.patch('/profile', data).then(r => r.data);
    }

    async deleteAccount() {
        return this.client.post('/auth/delete-account').then(r => r.data);
    }

    // --- SESSIONS ---
    async getSessions() {
        return this.client.post('/auth/sessions').then(r => r.data);
    }

    async revokeSession(sessionId: string) {
        return this.client.post(`/auth/sessions/revoke/${sessionId}`).then(r => r.data);
    }

    async logoutAllDevices() {
        return this.client.post('/auth/logout-all').then(r => r.data);
    }

    // --- TWO-FACTOR AUTHENTICATION ---
    async getTwoFactorSettings() {
        return this.client.get('/auth/2fa/settings').then(r => r.data);
    }

    async updateTwoFactorSettings(enabled: boolean, method?: string) {
        return this.client.post('/auth/2fa/settings', { enabled, method }).then(r => r.data);
    }

    // --- ADDRESS MANAGEMENT ---
    async getAddresses() {
        return this.client.get('/profile/addresses').then(r => r.data);
    }

    async addAddress(data: any) {
        return this.client.post('/profile/addresses', data).then(r => r.data);
    }

    async deleteAddress(id: string) {
        return this.client.delete(`/profile/addresses/${id}`).then(r => r.data);
    }

    async setAddressDefault(id: string) {
        return this.client.patch(`/profile/addresses/${id}/default`).then(r => r.data);
    }

    async getBillingInfo() {
        return this.client.get('/profile/billing').then(r => r.data);
    }

    async getInvoices() {
        return this.client.get('/profile/billing/invoices').then(r => r.data);
    }

    async getBillingMethods() {
        return this.client.get('/profile/billing/methods').then(r => r.data);
    }

    async addBillingMethod(data: any) {
        return this.client.post('/profile/billing/methods', data).then(r => r.data);
    }

    async deleteBillingMethod(id: string) {
        return this.client.delete(`/profile/billing/methods/${id}`).then(r => r.data);
    }

    async setBillingMethodDefault(id: string) {
        return this.client.patch(`/profile/billing/methods/${id}/default`).then(r => r.data);
    }


    async getProducts(): Promise<Product[]> {
        // For simple listing, we'll use the storefront endpoint
        return this.client.get('/storefront/products').then(r => r.data.products || r.data);
    }

    // --- PRODUCTS ---
    async getStorefrontProducts(params: any) {
        // Map frontend params to backend params
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('q', params.search); // Backend often uses 'q'
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        // Add others as needed
        return this.client.get(`/storefront/products?${queryParams.toString()}`).then(r => r.data);
    }

    async globalSearch(query: string) {
        return this.client.get('/storefront/search', { params: { q: query } }).then(r => r.data);
    }

    async searchProducts(query: string) {
        return this.getStorefrontProducts({ search: query, limit: 5 });
    }

    async getProduct(slugOrId: string) {
        return this.client.get(`/storefront/products/${slugOrId}`).then(r => r.data);
    }

    async getProductSuggestions(id: string) {
        return this.client.get(`/storefront/products/${id}/suggestions`)
            .then(r => r.data)
            .catch(() => []);
    }

    async getAdminProducts() {
        // Maybe separate admin endpoint or generic findAll
        return this.client.get('/products').then(r => r.data);
    }

    async createProduct(data: Partial<CreateProductInput>) {
        return this.client.post('/products', data).then(r => r.data);
    }

    async updateProduct(id: string, data: Partial<CreateProductInput>) {
        return this.client.patch(`/products/${id}`, data).then(r => r.data);
    }


    async deleteProduct(id: string) {
        return this.client.delete(`/products/${id}`).then(r => r.data);
    }

    async getProductBatches(id: string) {
        return this.client.get(`/warehouses/batches/product/${id}`).then(r => r.data);
    }

    async getProductStockLogs(id: string) {
        return this.client.get(`/warehouses/stock-logs/product/${id}`).then(r => r.data);
    }

    async getStockAuditLogs() {
        return this.client.get('/warehouses/stock-logs').then(r => r.data);
    }

    async processStockMovement(data: any) {
        return this.client.post('/warehouses/stock-movement', data).then(r => r.data);
    }

    // --- CATEGORIES ---
    async getCategories() {
        return this.client.get('/categories').then(r => r.data);
    }

    async createCategory(data: Partial<Category>) {
        return this.client.post('/categories', data).then(r => r.data);
    }

    async updateCategory(id: string, data: Partial<Category>) {
        return this.client.patch(`/categories/${id}`, data).then(r => r.data);
    }

    async deleteCategory(id: string) {
        return this.client.delete(`/categories/${id}`).then(r => r.data);
    }

    // --- CART ---
    // Note: If backend manages cart via token/session
    async getCart() { return this.client.get('/cart').then(r => r.data); }
    async addToCart(productId: string, quantity: number) {
        return this.client.post('/cart/items', { productId, quantity }).then(r => r.data);
    }
    // Need to check if CartService was fully implemented in backend in this flow
    // If not, we might fail here. Assuming standard CartModule exists.

    // --- ORDERS ---
    async getOrders() {
        return this.client.get('/orders').then(r => r.data);
    }

    async trackOrder(orderNumber: string, email: string) {
        return this.client.get(`/orders/track`, { params: { orderNumber, email } }).then(r => r.data);
    }

    async updateOrderStatus(id: string, status: OrderStatus) {
        return this.client.patch(`/orders/${id}/status`, { status }).then(r => r.data);
    }

    async checkout(data: any) {
        return this.client.post('/orders', data).then(r => r.data);
    }

    async deleteOrder(id: string) {
        // Admin only?
        return this.client.delete(`/orders/${id}`).then(r => r.data);
    }

    // --- PAYMENTS ---
    async initializePayment(data: { orderId: string; amount: number; method: string }) {
        return this.client.post('/payments/initialize', data).then(r => r.data);
    }

    async submitManualPayment(paymentId: string, data: { receiptUrl: string }) {
        return this.client.post(`/payments/${paymentId}/submit-manual`, data).then(r => r.data);
    }

    async verifyPayment(paymentId: string, approve: boolean, note?: string) {
        return this.client.post(`/payments/${paymentId}/verify`, { approve, note }).then(r => r.data);
    }

    // --- WISHLIST ---
    async getWishlist() {
        return this.client.get('/wishlist').then(r => r.data);
    }

    async addToWishlist(productId: string) {
        return this.client.post('/wishlist/items', { productId }).then(r => r.data);
    }

    async removeFromCart(productId: string) {
        return this.client.delete(`/cart/items/${productId}`).then(r => r.data);
    }

    // --- REVIEWS ---
    async getProductReviews(productId: string) {
        return this.client.get(`/products/${productId}/reviews`)
            .then(r => r.data)
            .catch(() => []);
    }

    async getProductStats(productId: string) {
        // Could be part of product details
        return { averageRating: 0, totalReviews: 0 };
    }

    async createReview(data: any) {
        return this.client.post('/reviews', data).then(r => r.data);
    }


    // --- STAFF ---
    async getStaff() {
        return this.client.get('/staff').then(r => r.data);
    }

    async createStaff(data: Partial<StaffMember>) {
        return this.client.post('/staff', data).then(r => r.data);
    }

    // --- CUSTOMERS ---
    async getCustomers() {
        return this.client.get('/customers').then(r => r.data);
    }

    // --- CMS ---
    async getPages() { return this.client.get('/cms/pages').then(r => r.data); }
    async updatePage(id: string, data: any) { return this.client.patch(`/cms/pages/${id}`, data).then(r => r.data); }
    async getPosts() { return this.client.get('/cms/posts').then(r => r.data); }
    async createPost(data: any) { return this.client.post('/cms/posts', data).then(r => r.data); }
    async getBlocks() { return []; }
    async updateBlock(id: string, data: any) { return {}; }

    // --- NOTIFICATIONS & MESSAGES ---
    async getNotifications() { return this.client.get('/notifications').then(r => r.data); }
    async getRecentNotifications() { return this.client.get('/notifications/recent').then(r => r.data); }
    async getUnreadNotificationsCount() { return this.client.get('/notifications/unread-count').then(r => r.data); }
    async markNotificationAsRead(id: string) { return this.client.patch(`/notifications/${id}/read`).then(r => r.data); }

    async getMessages() { return this.client.get('/messages').then(r => r.data); }
    async getUnreadMessagesCount() { return this.client.get('/messages/unread-count').then(r => r.data); }
    async getMessageThread(id: string) { return this.client.get(`/messages/${id}`).then(r => r.data); }
    async sendMessage(data: any) { return this.client.post('/messages', data).then(r => r.data); }
    async getAdminMessages() { return this.client.get('/messages/admin').then(r => r.data); }
    async adminReplyToMessage(id: string, content: string) { return this.client.post(`/messages/${id}/reply`, { content }).then(r => r.data); }
    async updateMessageStatus(id: string, status: string) { return this.client.patch(`/messages/${id}/status`, { status }).then(r => r.data); }
    async markMessageAsRead(id: string) { return this.client.patch(`/messages/${id}/read`).then(r => r.data); }

    // --- ANALYTICS ---
    async getDashboardStats() {
        return this.client.get('/admin/analytics/dashboard').then(r => r.data);
    }

    async getInventorySummary() {
        return this.client.get('/admin/analytics/inventory-summary').then(r => r.data);
    }

    async getOrdersSummary() {
        return this.client.get('/admin/analytics/orders-summary').then(r => r.data);
    }

    async getSalesHistory(period: string) {
        return this.client.get('/admin/analytics/sales', { params: { period } }).then(r => r.data);
    }

    async getOperationalAlerts() {
        return this.client.get('/admin/analytics/alerts').then(r => r.data);
    }

    async getTopSellingProducts() {
        return this.client.get('/admin/analytics/top-products').then(r => r.data);
    }

    async getCartMetrics() {
        return this.client.get('/admin/analytics/cart-metrics').then(r => r.data);
    }

    // --- PROMOTIONS ---
    async calculateDiscounts(code: string, items: any[], type: string) {
        return this.client.post('/promotions/calculate', { code, items, type }).then(r => r.data);
    }

    async getPromotions(): Promise<Promotion[]> {
        return this.client.get('/storefront/promotions').then(r => r.data);
    }
}

export const api = new ApiClient();
export default api;
