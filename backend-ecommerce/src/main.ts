import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketIoAdapter } from './common/adapters/socket-io.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const configService = app.get(ConfigService);
    const port = process.env.PORT ?? 3001;

    console.log(`Starting application on port ${port}...`);
    console.log(`DATABASE_URL defined: ${!!process.env.DATABASE_URL}`);

    // Trust proxy for Railway/Vercel (X-Forwarded-For, etc.)
    app.set('trust proxy', 1);

    // Enable CORS for frontend - Strict Whitelist Mode
    app.enableCors({
      origin: true,
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    });

    // Global validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    app.use(cookieParser());
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    // Serve static files from the uploads directory
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    // Global prefix
    app.setGlobalPrefix('api', {
      exclude: ['/'], // Keep root route accessible for health checks
    });

    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application successfully started and listening on 0.0.0.0:${port}`);
  } catch (error) {
    console.error('❌ FATAL ERROR DURING BOOTSTRAP:');
    console.error(error);
    process.exit(1);
  }
}
bootstrap();
