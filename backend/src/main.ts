import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  /**
   * CORS. En producción el frontend vive en Vercel, que genera un dominio por
   * despliegue de preview además del de producción. Por eso CORS_ORIGIN acepta
   * una lista separada por comas y, si se define VERCEL_PREVIEW_PATTERN, se
   * permiten también los subdominios *.vercel.app del proyecto.
   */
  const origenesPermitidos = (configService.get<string>('CORS_ORIGIN') || '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Peticiones sin Origin (curl, health checks, apps nativas) pasan.
      if (!origin) return callback(null, true);
      if (origenesPermitidos.includes(origin)) return callback(null, true);
      if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origen no permitido por CORS: ${origin}`), false);
    },
    credentials: true,
  });

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          field: error.property,
          messages: Object.values(error.constraints || {}),
        }));
        return new BadRequestException({
          statusCode: 400,
          message: 'Validation error',
          errors: messages,
        });
      },
    }),
  );

  // Servir archivos estáticos de uploads
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Servir modelos 3D pre-existentes
  app.useStaticAssets(path.join(__dirname, '..', 'Modelos'), {
    prefix: '/modelos/',
  });

  // Prefix global
  app.setGlobalPrefix('api');

  // Render inyecta PORT y exige escuchar en 0.0.0.0, no en localhost.
  const port = configService.get('PORT') || 3333;
  await app.listen(port, '0.0.0.0');

  console.log(`✓ API ejecutándose en puerto ${port}`);
}

bootstrap().catch((err) => {
  console.error('✗ Error al iniciar la aplicación:', err);
  process.exit(1);
});
