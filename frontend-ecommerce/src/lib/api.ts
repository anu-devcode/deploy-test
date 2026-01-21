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

    // Products
    async getProducts() {
        return this.request<Product[]>('/products');
    }

    async getProduct(id: string) {
        return this.request<Product>(`/products/${id}`);
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
}

// Types
export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    sku?: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
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

export const api = new ApiClient();
export default api;
