import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
    try {
        const admin = await prisma.user.findUnique({ where: { email: 'admin@adisharvest.com' } });
        if (!admin) {
            console.log('❌ Admin user not found');
            return;
        }
        console.log('Admin User ID:', admin.id);

        const customer = await prisma.customer.findUnique({ where: { id: admin.id } });
        if (customer) {
            console.log('✅ Customer profile found for Admin!');
            console.log('Customer ID:', customer.id);
        } else {
            console.log('❌ Customer profile MISSING for Admin!');
            // Check if customer exists with email but different ID
            const anyCustomer = await prisma.customer.findUnique({ where: { email: 'admin@adisharvest.com' } });
            if (anyCustomer) {
                console.log('⚠️ Customer exists with email but different ID:', anyCustomer.id);
            }
        }
    } catch (error) {
        console.error('Error during verification:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verify();
