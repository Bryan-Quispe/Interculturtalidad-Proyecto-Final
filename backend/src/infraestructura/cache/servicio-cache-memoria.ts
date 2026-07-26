import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ServicioCacheMemoria {
  constructor(@Inject(CACHE_MANAGER) private gestor: Cache) {}

  /**
   * Obtener valor del caché
   */
  async obtener<T>(clave: string): Promise<T | null> {
    try {
      const resultado = await this.gestor.get<T>(clave);
      return resultado ?? null;
    } catch (error) {
      console.error(`Error al obtener caché: ${clave}`, error);
      return null;
    }
  }

  /**
   * Guardar valor en caché
   */
  async guardar(
    clave: string,
    valor: any,
    tiempoExpiracion: number = 3600, // 1 hora por defecto
  ): Promise<void> {
    try {
      await this.gestor.set(clave, valor, tiempoExpiracion * 1000);
    } catch (error) {
      console.error(`Error al guardar caché: ${clave}`, error);
    }
  }

  /**
   * Eliminar valor del caché
   */
  async eliminar(clave: string): Promise<void> {
    try {
      await this.gestor.del(clave);
    } catch (error) {
      console.error(`Error al eliminar caché: ${clave}`, error);
    }
  }

  /**
   * Limpiar todo el caché
   */
  async limpiarTodo(): Promise<void> {
    try {
      await this.gestor.reset();
    } catch (error) {
      console.error('Error al limpiar caché', error);
    }
  }

  /**
   * Generar clave de caché estándar
   */
  generarClave(
    espacio: string,
    identificador: string,
    sufijo?: string,
  ): string {
    return sufijo
      ? `${espacio}:${identificador}:${sufijo}`
      : `${espacio}:${identificador}`;
  }
}

// Constantes de espacios de caché
export const ESPACIOS_CACHE = {
  ANIMALES: 'animales',
  MODELOS3D: 'modelos3d',
  USUARIOS: 'usuarios',
  AUTENTICACION: 'auth',
} as const;

// Tiempos de expiración por defecto
export const TIEMPOS_EXPIRACION = {
  CORTO: 300, // 5 minutos
  MEDIO: 1800, // 30 minutos
  LARGO: 3600, // 1 hora
  MUY_LARGO: 86400, // 24 horas
} as const;
