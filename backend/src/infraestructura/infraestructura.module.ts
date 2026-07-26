import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { ServicioCacheMemoria } from './cache/servicio-cache-memoria';
import { ServicioLimitadorVelocidad } from './limitador/servicio-limitador-velocidad';

@Module({
  imports: [
    // Configurar caché en memoria (cambiar a Redis en producción)
    CacheModule.register({
      isGlobal: true,
      ttl: 3600, // 1 hora por defecto
      max: 1000, // máximo 1000 items en caché
    }),

    // Configurar limitador de velocidad
    ThrottlerModule.forRoot({
      ttl: 60000, // 1 minuto
      limit: 100, // 100 peticiones por minuto
    }),
  ],
  providers: [ServicioCacheMemoria, ServicioLimitadorVelocidad],
  exports: [ServicioCacheMemoria, ServicioLimitadorVelocidad],
})
export class ModuloInfraestructura {}
