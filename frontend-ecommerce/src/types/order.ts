export type OrderStatus = "pending" | "PENDING_VERIFICATION" | "paid" | "confirmed" | "PROCESSING" | "PACKED" | "SHIPPED" | "fulfilled" | "cancelled" | "PENDING" | "CONFIRMED" | "DELIVERED";

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
  updatedAt?: string;
  status: OrderStatus;
  paymentMethod?: string;
  paymentStatus?: string;
  paymentId?: string; // For manual verification
  receiptUrl?: string; // For manual verification
  manualVerificationNote?: string;
  payments?: any[];
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  lines: OrderLine[];
};

