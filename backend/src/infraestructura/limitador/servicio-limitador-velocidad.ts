import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

/**
 * Servicio para gestionar límites de velocidad
 * Previene ataques de fuerza bruta y abuso de API
 */
@Injectable()
export class ServicioLimitadorVelocidad extends ThrottlerGuard {
  /**
   * Configuración de límites por tipo de operación
   */
  readonly LIMITES = {
    AUTENTICACION: {
      peticiones: 5,
      duracion: 15 * 60, // 15 minutos
      mensaje: 'Demasiados intentos de inicio de sesión. Intenta más tarde.',
    },
    CREAR_RECURSO: {
      peticiones: 10,
      duracion: 60 * 60, // 1 hora
      mensaje: 'Límite de creación de recursos alcanzado.',
    },
    GENERAL: {
      peticiones: 100,
      duracion: 60 * 60, // 1 hora
      mensaje: 'Demasiadas peticiones. Intenta más tarde.',
    },
    SUBIR_ARCHIVO: {
      peticiones: 3,
      duracion: 60 * 60, // 1 hora
      mensaje: 'Límite de carga de archivos alcanzado.',
    },
  };

  /**
   * Obtener identificador del cliente
   */
  protected getTracker(req: any): string {
    return req.user?.id || req.ip;
  }
}
