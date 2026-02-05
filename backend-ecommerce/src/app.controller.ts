import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async checkHealth() {
    try {
      // Test DB connection
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', db: true, timestamp: new Date().toISOString() };
    } catch (error) {
      return { status: 'error', db: false, error: error.message };
    }
  }
}
