const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: unknown;
    headers?: Record<string, string>;
}

class ApiClient {
    private tenantId: string | null = null;
    private token: string | null = null;

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

        if (this.tenantId) {
            headers['X-Tenant-Id'] = this.tenantId;
        }

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers = {} } = options;

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: {
                ...this.getHeaders(),
                ...headers,
            },
            body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // Auth
    async login(email: string, password: string) {
        return this.request<{ access_token: string }>('/auth/login', {
            method: 'POST',
            body: { email, password },
        });
    }

    async register(email: string, password: string, role?: string) {
        return this.request<{ access_token: string }>('/auth/register', {
            method: 'POST',
            body: { email, password, role },
        });
    }

    // Storefront
    async getStorefrontProducts(params: StorefrontParams = {}) {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) query.append(key, String(value));
        });
        return this.request<{ products: Product[]; pagination: any }>(`/storefront/products?${query.toString()}`);
    }

    async getProduct(id: string) {
        return this.request<Product>(`/storefront/products/${id}`);
    }

    async getFeaturedProducts(limit = 8) {
        return this.request<Product[]>(`/storefront/featured?limit=${limit}`);
    }

    async getProductSuggestions(id: string, limit = 4) {
        return this.request<Product[]>(`/storefront/products/${id}/suggestions?limit=${limit}`);
    }

    async getCategories() {
        return this.request<Category[]>(`/storefront/categories`);
    }

    // Legacy Admin Products
    async getAdminProducts() {
        return this.request<Product[]>('/products');
    }

    async createProduct(data: CreateProductInput) {
        return this.request<Product>('/products', {
            method: 'POST',
            body: data,
        });
    }

    // Orders
    async getOrders() {
        return this.request<Order[]>('/orders');
    }


    async getOrder(id: string) {
        return this.request<Order>(`/orders/${id}`);
    }

    async createOrder(data: CreateOrderInput) {
        return this.request<Order>('/orders', {
            method: 'POST',
            body: data,
        });
    }

    async updateOrderStatus(id: string, status: OrderStatus) {
        return this.request<Order>(`/orders/${id}/status`, {
            method: 'PATCH',
            body: { status },
        });
    }

    // Cart
    async getCart(customerId: string) {
        return this.request<Cart>(`/cart/${customerId}`);
    }

    async addToCart(customerId: string, productId: string, quantity: number) {
        return this.request<Cart>(`/cart/${customerId}/items`, {
            method: 'POST',
            body: { productId, quantity },
        });
    }

    async removeFromCart(customerId: string, productId: string) {
        return this.request<{ message: string; cart: Cart }>(`/cart/${customerId}/items/${productId}`, {
            method: 'DELETE',
        });
    }

    async checkout(customerId: string, data: CheckoutInput) {
        return this.request<Order>(`/cart/${customerId}/checkout`, {
            method: 'POST',
            body: data,
        });
    }

    // Warehouse (Admin)
    async getWarehouses() {
        return this.request<Warehouse[]>('/warehouses');
    }

    // Reviews
    async createReview(data: CreateReviewInput) {
        return this.request<Review>('/reviews', {
            method: 'POST',
            body: data,
        });
    }

    async getProductReviews(productId: string) {
        return this.request<Review[]>(`/reviews/product/${productId}`);
    }

    async getProductStats(productId: string) {
        return this.request<{ averageRating: number; totalReviews: number }>(`/reviews/product/${productId}/stats`);
    }

    // CMS
    async getPage(slug: string) {
        return this.request<CmsPage>(`/cms/${slug}`);
    }
}

// Types
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    stock: number;
    sku?: string;
    images?: string[];
    tags?: string[];
    isFeatured?: boolean;
    categoryId?: string;
    category?: Category;
    avgRating?: number;
    reviewCount?: number;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parentId?: string;
    children?: Category[];
    _count?: { products: number };
}

export interface StorefrontParams {
    categoryId?: string;
    search?: string;
    tags?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
    sortBy?: 'price' | 'createdAt' | 'name';
    sortOrder?: 'asc' | 'desc';
}


export interface CreateProductInput {
    name: string;
    description?: string;
    price: number;
    stock?: number;
    sku?: string;
}

export interface Order {
    id: string;
    total: number;
    status: OrderStatus;
    customerId: string;
    tenantId: string;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product?: Product;
}

export interface CreateOrderInput {
    customerId: string;
    items: { productId: string; quantity: number }[];
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Cart {
    id: string;
    customerId: string;
    items: CartItem[];
    subtotal: number;
    itemCount: number;
}

export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    itemTotal: number;
    product: Product;
}

export interface CheckoutInput {
    shippingAddress: string;
    shippingCity: string;
    shippingCountry: string;
    paymentMethod: string;
}

export interface Warehouse {
    id: string;
    name: string;
    code: string;
    isDefault: boolean;
}

export interface Review {
    id: string;
    rating: number; // 1-5
    comment?: string;
    customerId: string;
    customer?: { firstName: string; lastName: string };
    createdAt: string;
}

export interface CreateReviewInput {
    productId: string;
    rating: number;
    comment?: string;
}

export interface CmsPage {
    id: string;
    title: string;
    slug: string;
    content: Record<string, any>;
}

export const api = new ApiClient();
export default api;
