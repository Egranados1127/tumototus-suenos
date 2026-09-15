// ══════════════════════════════════════════════════════════════════
// TuMotoTus Sueños — Bootstrap del API (main.ts)
// Arranque hiper-defensivo: proceso.exit(1) si algo falla
// ══════════════════════════════════════════════════════════════════

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // ─── VALIDACIONES PRE-ARRANQUE ─────────────────────────────────
  const envRequeridas = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const faltantes = envRequeridas.filter((v) => !process.env[v]);
  if (faltantes.length > 0) {
    logger.error(`Variables de entorno faltantes: ${faltantes.join(', ')}`);
    process.exit(1);
  }

  // ─── CREAR APP ─────────────────────────────────────────────────
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  // Sin fingerprinting
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // Prefijo global de la API
  app.setGlobalPrefix('api/v1');

  // CORS — acepta todos los orígenes si no se especifica ALLOWED_ORIGINS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,          // convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // ─── SWAGGER (solo en desarrollo) ─────────────────────────────
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('TuMotoTus Sueños — API')
      .setDescription('API de gestión de flota RTO y marketplace de domicilios')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    logger.log('Swagger disponible en: http://localhost:3001/docs');
  }

  // ─── GRACEFUL SHUTDOWN ─────────────────────────────────────────
  app.enableShutdownHooks();

  const puerto = process.env.PORT_API ?? 3001;
  await app.listen(puerto);
  logger.log(`API escuchando en: http://localhost:${puerto}/api/v1`);
  logger.log(`Entorno: ${process.env.NODE_ENV ?? 'development'}`);
}

bootstrap();
