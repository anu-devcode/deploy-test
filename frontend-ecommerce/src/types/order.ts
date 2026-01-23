export type OrderStatus = "pending" | "paid" | "fulfilled" | "cancelled";

export type OrderLine = {
  id: string;
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
};

export type Order = {
  id: string;
  tenantId: string;
  orderNumber: string;
  createdAt: string; // ISO string
  status: OrderStatus;
  customer: {
    name: string;
    email: string;
  };
  lines: OrderLine[];
};

