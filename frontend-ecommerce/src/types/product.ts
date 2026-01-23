export type ProductStatus = "active" | "archived";

export type Product = {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  category: string;
  status: ProductStatus;
  /** Simple emoji/image token for mock display */
  imageToken?: string;
  imageUrl?: string;
};

