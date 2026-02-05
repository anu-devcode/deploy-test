import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        super({
            log: ['error', 'warn'],
        });
        console.log('🏗️ PrismaClient initialized with native engine');
    }

    async onModuleInit() {
        // Non-blocking connection check to avoid startup hangs
        this.verifyConnection();
    }

    private async verifyConnection() {
        try {
            console.log('🔄 Verifying database connection in background...');
            await this.$connect();
            console.log('✅ Database connection verified successfully');
        } catch (error) {
            console.error('❌ DATABASE CONNECTION FAILED:');
            console.error(error);
            // We don't throw here so the server stays "up" for Railway's health check
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}

// Global error handling for better debugging in Railway
process.on('unhandledRejection', (reason, promise) => {
    console.error('😱 Unhandled Rejection at:', promise, 'reason:', reason);
});
