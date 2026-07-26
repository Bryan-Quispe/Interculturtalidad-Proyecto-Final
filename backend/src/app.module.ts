import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { AnimalesModule } from './modules/animales/animales.module';
import { Modelos3DModule } from './modules/modelos3d/modelos3d.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { HealthController } from './common/health/health.controller';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Base de datos
    PrismaModule,

    // Módulos de la aplicación
    AuthModule,
    UsersModule,
    AnimalesModule,
    Modelos3DModule,
    UploadsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
