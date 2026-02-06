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
  console.log('🚀 Starting bootstrap process...');
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: ['error', 'warn', 'log', 'debug'],
    });

    const port = process.env.PORT ?? 3001;
    console.log(`📡 Port resolved to: ${port}`);

    // Trust proxy for Railway/Vercel (X-Forwarded-For, etc.)
    app.set('trust proxy', 1);

    // Enable CORS for frontend
    const configService = app.get(ConfigService);
    const frontendUrl = configService.get<string>('FRONTEND_URL');

    app.enableCors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
          'http://localhost:3000',
          'http://localhost:3001',
          'https://frontend-ecommerce-red.vercel.app',
        ];

        if (frontendUrl) allowedOrigins.push(frontendUrl);

        // Check if origin is allowed or is a Vercel deployment
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With, Origin',
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

    // CRITICAL: Listen first so Railway health check passes immediately
    await app.listen(port, '0.0.0.0');
    console.log(`✅ API SERVER LISTENING ON 0.0.0.0:${port}`);

    console.log('✨ Bootstrap sequence completed successfully.');
  } catch (error) {
    console.error('❌ FATAL ERROR DURING BOOTSTRAP:');
    console.error(error);
    process.exit(1);
  }
}
bootstrap();
