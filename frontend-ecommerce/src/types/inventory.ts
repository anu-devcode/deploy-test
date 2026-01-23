export type InventoryItem = {
  id: string;
  tenantId: string;
  productId: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
};

export type Warehouse = {
  id: string;
  tenantId: string;
  name: string;
  code: string;
};

