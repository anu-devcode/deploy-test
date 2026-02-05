import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        const connectionString = process.env.DATABASE_URL;

        if (!connectionString) {
            console.warn('⚠️ DATABASE_URL not found in environment!');
        }

        const pool = new Pool({
            connectionString,
            // Supabase/Production usually requires SSL. 
            // rejectUnauthorized: false is common for Managed DBs with self-signed certs.
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
        });

        // Log pool errors
        pool.on('error', (err) => {
            console.error('❌ Unexpected error on idle database client', err);
        });

        const adapter = new PrismaPg(pool);
        super({ adapter });
    }

    async onModuleInit() {
        try {
            console.log('🔄 Connecting to database...');
            await this.$connect();
            console.log('✅ Database connected successfully');
        } catch (error) {
            console.error('❌ Database connection failed during onModuleInit:');
            console.error(error);
            throw error; // Re-throw to trigger bootstrap catch
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
