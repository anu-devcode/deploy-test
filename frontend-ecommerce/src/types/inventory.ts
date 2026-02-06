export type InventoryItem = {
  id: string;
  productId: string;
  warehouseId: string;
  onHand: number;
  reserved: number;
  reorderPoint: number;
};

export type Warehouse = {
  id: string;
  name: string;
  code: string;
};

