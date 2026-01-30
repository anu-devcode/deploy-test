export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    _count?: {
        products: number;
    };
}
