import 'dotenv/config';
import { PrismaClient, Role, PromotionType, PromotionTarget, PromoBusinessType } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...');

    // ---------------------------
    // 1. ADMIN USER
    // ---------------------------
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@adisharvest.com' },
        update: {},
        create: {
            email: 'admin@adisharvest.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: Role.ADMIN,
            isFirstLogin: false,
        },
    });
    console.log(`✅ Admin user created: ${admin.email}`);

    // Create Customer profile for Admin to allow shopping features
    await prisma.customer.upsert({
        where: { email: 'admin@adisharvest.com' },
        update: {},
        create: {
            id: admin.id,
            email: 'admin@adisharvest.com',
            firstName: 'Admin',
            lastName: 'User',
        },
    });

    // Create ALL permission and assign to admin
    const allPermission = await prisma.permission.upsert({
        where: { name: 'ALL' },
        update: {},
        create: {
            name: 'ALL',
            description: 'Full administrative access',
        },
    });

    await prisma.userPermission.upsert({
        where: {
            userId_permissionId: {
                userId: admin.id,
                permissionId: allPermission.id,
            },
        },
        update: {},
        create: {
            userId: admin.id,
            permissionId: allPermission.id,
        },
    });
    console.log('✅ Admin permissions assigned');

    // ---------------------------
    // 2. WAREHOUSES
    // ---------------------------
    const mainWarehouse = await prisma.warehouse.upsert({
        where: { code: 'WH-MAIN' },
        update: {},
        create: {
            name: 'Main Warehouse',
            code: 'WH-MAIN',
            address: 'Bole Road, Addis Ababa',
            city: 'Addis Ababa',
            country: 'Ethiopia',
            isDefault: true,
        },
    });

    const bulkWarehouse = await prisma.warehouse.upsert({
        where: { code: 'WH-BULK' },
        update: {},
        create: {
            name: 'Bulk Storage Facility',
            code: 'WH-BULK',
            address: 'Industrial Zone, Debre Zeit',
            city: 'Debre Zeit',
            country: 'Ethiopia',
            isDefault: false,
        },
    });
    console.log('✅ Warehouses created');

    // ---------------------------
    // 3. CATEGORIES
    // ---------------------------
    // Create categories - use findFirst + create pattern to avoid null parentId issues
    let grains = await prisma.category.findFirst({ where: { slug: 'grains' } });
    if (!grains) {
        grains = await prisma.category.create({
            data: {
                name: 'Grains & Cereals',
                slug: 'grains',
                description: 'Premium Ethiopian grains and cereals',
            },
        });
    }

    let legumes = await prisma.category.findFirst({ where: { slug: 'legumes' } });
    if (!legumes) {
        legumes = await prisma.category.create({
            data: {
                name: 'Legumes & Pulses',
                slug: 'legumes',
                description: 'High-quality beans, lentils, and peas',
            },
        });
    }

    let spices = await prisma.category.findFirst({ where: { slug: 'spices' } });
    if (!spices) {
        spices = await prisma.category.create({
            data: {
                name: 'Spices & Herbs',
                slug: 'spices',
                description: 'Authentic Ethiopian spices and herbs',
            },
        });
    }

    let oilseeds = await prisma.category.findFirst({ where: { slug: 'oilseeds' } });
    if (!oilseeds) {
        oilseeds = await prisma.category.create({
            data: {
                name: 'Oilseeds',
                slug: 'oilseeds',
                description: 'Sesame, niger seed, and more',
            },
        });
    }
    console.log('✅ Categories created');

    // ---------------------------
    // 4. PRODUCTS
    // ---------------------------
    const products = [
        {
            name: 'Premium Teff (White)',
            slug: 'premium-teff-white',
            description: 'High-grade white teff, perfect for injera. Sourced from Debre Zeit region.',
            price: 120,
            compareAtPrice: 150,
            stock: 500,
            sku: 'TEFF-WH-001',
            images: ['/images/products/teff-white.jpg'],
            tags: ['teff', 'injera', 'gluten-free', 'ethiopian'],
            isPublished: true,
            isFeatured: true,
            retailPrice: 120,
            bulkPrice: 9500,
            bulkEnabled: true,
            categoryId: grains.id,
            warehouseId: mainWarehouse.id,
        },
        {
            name: 'Red Teff',
            slug: 'red-teff',
            description: 'Nutritious red teff with earthy flavor. Rich in iron and calcium.',
            price: 100,
            stock: 400,
            sku: 'TEFF-RD-001',
            images: ['/images/products/teff-red.jpg'],
            tags: ['teff', 'red-teff', 'healthy'],
            isPublished: true,
            retailPrice: 100,
            bulkPrice: 8000,
            bulkEnabled: true,
            categoryId: grains.id,
            warehouseId: mainWarehouse.id,
        },
        {
            name: 'Ethiopian Lentils (Misir)',
            slug: 'ethiopian-lentils',
            description: 'Premium red lentils for traditional Ethiopian dishes like Misir Wot.',
            price: 85,
            stock: 300,
            sku: 'LENT-RD-001',
            images: ['/images/products/lentils.jpg'],
            tags: ['lentils', 'misir', 'protein'],
            isPublished: true,
            isFeatured: true,
            retailPrice: 85,
            bulkPrice: 6800,
            bulkEnabled: true,
            categoryId: legumes.id,
            warehouseId: mainWarehouse.id,
        },
        {
            name: 'Berbere Spice Mix',
            slug: 'berbere-spice-mix',
            description: 'Authentic Ethiopian berbere blend with 15+ spices. Perfect for stews.',
            price: 180,
            compareAtPrice: 220,
            stock: 200,
            sku: 'SPICE-BB-001',
            images: ['/images/products/berbere.jpg'],
            tags: ['berbere', 'spice', 'ethiopian', 'hot'],
            isPublished: true,
            isFeatured: true,
            retailPrice: 180,
            categoryId: spices.id,
            warehouseId: mainWarehouse.id,
        },
        {
            name: 'Mitmita (Hot Pepper)',
            slug: 'mitmita-pepper',
            description: 'Fiery Ethiopian mitmita pepper blend. Use sparingly!',
            price: 160,
            stock: 150,
            sku: 'SPICE-MT-001',
            images: ['/images/products/mitmita.jpg'],
            tags: ['mitmita', 'pepper', 'hot', 'spicy'],
            isPublished: true,
            retailPrice: 160,
            categoryId: spices.id,
            warehouseId: mainWarehouse.id,
        },
        {
            name: 'Ethiopian Sesame Seeds',
            slug: 'ethiopian-sesame',
            description: 'Premium white sesame seeds, ideal for tahini and baking.',
            price: 200,
            stock: 250,
            sku: 'OIL-SES-001',
            images: ['/images/products/sesame.jpg'],
            tags: ['sesame', 'oilseed', 'baking'],
            isPublished: true,
            retailPrice: 200,
            bulkPrice: 16000,
            bulkEnabled: true,
            categoryId: oilseeds.id,
            warehouseId: bulkWarehouse.id,
        },
        {
            name: 'Niger Seed (Nug)',
            slug: 'niger-seed-nug',
            description: 'Traditional Ethiopian niger seed for oil extraction and cooking.',
            price: 140,
            stock: 180,
            sku: 'OIL-NUG-001',
            images: ['/images/products/niger-seed.jpg'],
            tags: ['niger', 'nug', 'oil', 'traditional'],
            isPublished: true,
            retailPrice: 140,
            bulkPrice: 11000,
            bulkEnabled: true,
            categoryId: oilseeds.id,
            warehouseId: bulkWarehouse.id,
        },
        {
            name: 'Chickpeas (Shimbra)',
            slug: 'chickpeas-shimbra',
            description: 'Organic Ethiopian chickpeas, perfect for Shiro and hummus.',
            price: 75,
            stock: 350,
            sku: 'LEG-CHK-001',
            images: ['/images/products/chickpeas.jpg'],
            tags: ['chickpeas', 'shimbra', 'shiro', 'protein'],
            isPublished: true,
            retailPrice: 75,
            bulkPrice: 6000,
            bulkEnabled: true,
            categoryId: legumes.id,
            warehouseId: mainWarehouse.id,
        },
    ];

    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product as any,
        });
    }
    console.log(`✅ ${products.length} Products created`);

    // ---------------------------
    // 5. PROMOTIONS
    // ---------------------------
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());

    await prisma.promotion.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            name: 'Welcome Discount',
            description: '10% off your first order',
            code: 'WELCOME10',
            type: PromotionType.PERCENTAGE,
            target: PromotionTarget.CART,
            value: 10,
            minAmount: 500,
            startDate: now,
            endDate: nextMonth,
            usageLimit: 100,
            businessType: PromoBusinessType.RETAIL,
            isActive: true,
        },
    });

    await prisma.promotion.upsert({
        where: { code: 'BULK20' },
        update: {},
        create: {
            name: 'Bulk Order Discount',
            description: '20% off for bulk orders over 10,000 ETB',
            code: 'BULK20',
            type: PromotionType.PERCENTAGE,
            target: PromotionTarget.CART,
            value: 20,
            minAmount: 10000,
            startDate: now,
            endDate: nextMonth,
            usageLimit: 50,
            businessType: PromoBusinessType.BULK,
            isActive: true,
        },
    });

    await prisma.promotion.upsert({
        where: { code: 'FREESHIP' },
        update: {},
        create: {
            name: 'Free Shipping',
            description: 'Free shipping on orders over 2,000 ETB',
            code: 'FREESHIP',
            type: PromotionType.FIXED_AMOUNT,
            target: PromotionTarget.CART,
            value: 200, // Shipping cost waived
            minAmount: 2000,
            startDate: now,
            endDate: nextMonth,
            usageLimit: 200,
            businessType: PromoBusinessType.BOTH,
            isActive: true,
        },
    });
    console.log('✅ Promotions created');

    // ---------------------------
    // 6. AUTOMATION RULES
    // ---------------------------
    // Use individual creates with existence checks
    const automationRules = [
        {
            name: 'Auto-Confirm Small Orders',
            trigger: 'ORDER_CREATED',
            condition: { maxAmount: 1000 },
            action: 'AUTO_CONFIRM',
            isActive: true,
        },
        {
            name: 'Notify Admin on Large Orders',
            trigger: 'ORDER_CREATED',
            condition: { minAmount: 10000 },
            action: 'NOTIFY_ADMIN',
            isActive: true,
        },
        {
            name: 'Low Stock Alert',
            trigger: 'STOCK_UPDATED',
            condition: { minStock: 10 },
            action: 'NOTIFY_ADMIN',
            isActive: true,
        },
        {
            name: 'Welcome Email',
            trigger: 'CUSTOMER_REGISTERED',
            condition: undefined,
            action: 'SEND_WELCOME_EMAIL',
            isActive: true,
        },
        {
            name: 'Payment Received Notification',
            trigger: 'PAYMENT_VERIFIED',
            condition: undefined,
            action: 'NOTIFY_CUSTOMER',
            isActive: true,
        },
    ];

    for (const rule of automationRules) {
        const existing = await prisma.automationRule.findFirst({ where: { name: rule.name } });
        if (!existing) {
            await prisma.automationRule.create({ data: rule as any });
        }
    }
    console.log('✅ Automation rules created');

    // ---------------------------
    // 7. STORE CONFIG
    // ---------------------------
    await (prisma as any).storeConfig.upsert({
        where: { id: 'global' },
        update: {},
        create: {
            id: 'global',
            isSocialLoginEnabled: false,
        },
    });
    console.log('✅ Store config initialized');

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
