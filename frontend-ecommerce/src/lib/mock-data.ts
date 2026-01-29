import type { InventoryItem, Order, Product, Tenant, Warehouse } from "@/types";

export const DEFAULT_TENANT_SLUG = "acme-crops";

export const tenants: Tenant[] = [
  {
    id: "t_ag_001",
    slug: "acme-crops",
    name: "Acme Crops Co.",
    industry: "agriculture",
    theme: { primaryColor: "#10b981", secondaryColor: "#14b8a6", logoText: "Acme" },
  },
  {
    id: "t_mfg_001",
    slug: "Agriculture",
    name: "Agriculture",
    industry: "agriculture",
    theme: { primaryColor: "#2563eb", secondaryColor: "#7c3aed", logoText: "Forge" },
  },
  {
    id: "t_ret_001",
    slug: "agriculture",
    name: "Agriculture",
    industry: "agriculture",
    theme: { primaryColor: "#f97316", secondaryColor: "#ef4444", logoText: "Northwind" },
  },
];

export function getTenantBySlug(slug: string): Tenant | undefined {
  return tenants.find((t) => t.slug === slug);
}

export const seedWarehouses: Warehouse[] = [
  { id: "w_ag_1", tenantId: "t_ag_001", name: "Addis Central Warehouse", code: "ADD-C" },
  { id: "w_ag_2", tenantId: "t_ag_001", name: "Adama Depot", code: "ADA-D" },
  { id: "w_mfg_1", tenantId: "t_mfg_001", name: "Main Plant Storage", code: "PLT-1" },
  { id: "w_mfg_2", tenantId: "t_mfg_001", name: "Spare Parts Hub", code: "SPH-1" },
  { id: "w_ret_1", tenantId: "t_ret_001", name: "Wholesale DC", code: "DC-01" },
  { id: "w_ret_2", tenantId: "t_ret_001", name: "City Fulfillment", code: "FUL-02" },
];

export const seedProducts: Product[] = [
  // Agriculture
  {
    id: "p_ag_001",
    tenantId: "t_ag_001",
    name: "Premium Red Lentils",
    description: "Cleaned, graded lentils for retail and bulk buyers.",
    price: 1290,
    sku: "AG-LENT-RED-01",
    category: "Pulses & Legumes",
    status: "active",
    imageToken: "🫘",
    imageUrl: "/lentils.png",
  },
  {
    id: "p_ag_002",
    tenantId: "t_ag_001",
    name: "Durum Wheat (Grade A)",
    description: "High-protein durum wheat suitable for pasta and flour milling.",
    price: 980,
    sku: "AG-WHT-DUR-01",
    category: "Grains & Cereals",
    status: "active",
    imageToken: "🌾",
    imageUrl: "/wheat.png",
  },
  {
    id: "p_ag_003",
    tenantId: "t_ag_001",
    name: "Sesame Seed (Humera)",
    description: "Export quality sesame with consistent moisture and purity.",
    price: 2450,
    sku: "AG-SES-HUM-01",
    category: "Oilseeds",
    status: "active",
    imageToken: "🌻",
    imageUrl: "/sesame.png",
  },

  // Manufacturing / Agriculture Transition
  {
    id: "p_mfg_001",
    tenantId: "t_mfg_001",
    name: "Industrial Gearbox (G-200)",
    description: "Heavy-duty gearbox for conveyor and mixer systems.",
    price: 185000,
    sku: "MFG-GBX-G200",
    category: "Drive Systems",
    status: "active",
    imageToken: "⚙️",
    imageUrl: "/lentils.png",
  },
  {
    id: "p_mfg_002",
    tenantId: "t_mfg_001",
    name: "Hydraulic Hose Kit",
    description: "Field-ready hose kit with fittings for standard hydraulic lines.",
    price: 8900,
    sku: "MFG-HYD-HOSE-KIT",
    category: "Hydraulics",
    status: "active",
    imageToken: "🧰",
    imageUrl: "/lentils.png",
  },
  {
    id: "p_mfg_003",
    tenantId: "t_mfg_001",
    name: "Safety Gloves (Cut Resistant)",
    description: "ANSI cut-resistant gloves for industrial environments.",
    price: 420,
    sku: "MFG-PPE-GLV-CR",
    category: "PPE",
    status: "active",
    imageToken: "🧤",
    imageUrl: "/lentils.png",
  },

  // Retail / Wholesale
  {
    id: "p_ret_001",
    tenantId: "t_ret_001",
    name: "Organic Coffee Beans (1kg)",
    description: "Single-origin beans, roasted weekly for freshness.",
    price: 1550,
    sku: "RET-COF-ORG-1K",
    category: "Grocery",
    status: "active",
    imageToken: "☕",
    imageUrl: "/harvest-hero.png",
  },
  {
    id: "p_ret_002",
    tenantId: "t_ret_001",
    name: "LED Bulb Pack (6x)",
    description: "Energy-efficient LED bulbs (warm white).",
    price: 690,
    sku: "RET-LED-6PK",
    category: "Home & Hardware",
    status: "active",
    imageToken: "💡",
    imageUrl: "/lentils.png",
  },
  {
    id: "p_ret_003",
    tenantId: "t_ret_001",
    name: "Paper Towels (12 roll)",
    description: "Bulk pack, ideal for wholesale customers.",
    price: 860,
    sku: "RET-PAPER-12R",
    category: "Household",
    status: "active",
    imageToken: "🧻",
    imageUrl: "/lentils.png",
  },
];

export const seedInventory: InventoryItem[] = [
  // Agriculture
  { id: "i_ag_001", tenantId: "t_ag_001", productId: "p_ag_001", warehouseId: "w_ag_1", onHand: 240, reserved: 12, reorderPoint: 50 },
  { id: "i_ag_002", tenantId: "t_ag_001", productId: "p_ag_002", warehouseId: "w_ag_2", onHand: 600, reserved: 40, reorderPoint: 120 },
  { id: "i_ag_003", tenantId: "t_ag_001", productId: "p_ag_003", warehouseId: "w_ag_1", onHand: 90, reserved: 5, reorderPoint: 30 },

  // Manufacturing / Agriculture
  { id: "i_mfg_001", tenantId: "t_mfg_001", productId: "p_mfg_001", warehouseId: "w_mfg_1", onHand: 8, reserved: 1, reorderPoint: 3 },
  { id: "i_mfg_002", tenantId: "t_mfg_001", productId: "p_mfg_002", warehouseId: "w_mfg_2", onHand: 75, reserved: 6, reorderPoint: 20 },
  { id: "i_mfg_003", tenantId: "t_mfg_001", productId: "p_mfg_003", warehouseId: "w_mfg_2", onHand: 340, reserved: 18, reorderPoint: 80 },

  // Retail / Agriculture
  { id: "i_ret_001", tenantId: "t_ret_001", productId: "p_ret_001", warehouseId: "w_ret_1", onHand: 120, reserved: 10, reorderPoint: 40 },
  { id: "i_ret_002", tenantId: "t_ret_001", productId: "p_ret_002", warehouseId: "w_ret_2", onHand: 210, reserved: 22, reorderPoint: 60 },
  { id: "i_ret_003", tenantId: "t_ret_001", productId: "p_ret_003", warehouseId: "w_ret_1", onHand: 95, reserved: 7, reorderPoint: 25 },
];

export const seedOrders: Order[] = [
  {
    id: "o_ag_001",
    tenantId: "t_ag_001",
    orderNumber: "ACME-10021",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: "paid",
    customer: { name: "Selam T.", email: "selam@example.com" },
    lines: [
      { id: "ol_1", productId: "p_ag_001", name: "Premium Red Lentils", unitPrice: 1290, quantity: 2 },
      { id: "ol_2", productId: "p_ag_002", name: "Durum Wheat (Grade A)", unitPrice: 980, quantity: 1 },
    ],
  },
  {
    id: "o_mfg_001",
    tenantId: "t_mfg_001",
    orderNumber: "FORGE-77201",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: "pending",
    customer: { name: "Addis Plant Ops", email: "ops@plant.example.com" },
    lines: [{ id: "ol_3", productId: "p_mfg_002", name: "Hydraulic Hose Kit", unitPrice: 8900, quantity: 3 }],
  },
  {
    id: "o_ret_001",
    tenantId: "t_ret_001",
    orderNumber: "NW-54011",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    status: "fulfilled",
    customer: { name: "Mekdes Retail", email: "mekdes@store.example.com" },
    lines: [
      { id: "ol_4", productId: "p_ret_001", name: "Organic Coffee Beans (1kg)", unitPrice: 1550, quantity: 1 },
      { id: "ol_5", productId: "p_ret_002", name: "LED Bulb Pack (6x)", unitPrice: 690, quantity: 2 },
    ],
  },
];
