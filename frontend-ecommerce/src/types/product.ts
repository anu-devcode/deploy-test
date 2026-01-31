export type ProductStatus = "active" | "archived" | "unknown";

export type Product = {
  id: string;
  tenantId?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  categoryId?: string;
  category: string | { id: string; name: string; slug: string };
  status: ProductStatus;
  retail: { enabled: boolean; price: number; unit: string; minOrder: number };
  bulk: { enabled: boolean; price: number; unit: string; minOrder: number };
  /** Simple emoji/image token for mock display */
  imageToken?: string;
  imageUrl?: string;
  images?: string[];
  compareAtPrice?: number;
  avgRating?: number;
  reviewCount?: number;
};
