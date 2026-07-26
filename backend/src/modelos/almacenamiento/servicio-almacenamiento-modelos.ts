import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ConfiguracionAlmacenamientoModelos } from './configuracion-almacenamiento-modelos';

/**
 * Servicio para gestionar archivos de modelos 3D
 * Centraliza todas las operaciones de lectura/escritura
 */
@Injectable()
export class ServicioAlmacenamientoModelos {
  constructor(
    private configuracion: ConfiguracionAlmacenamientoModelos,
  ) {}

  /**
   * Guardar archivo de modelo 3D
   */
  async guardarModelo(
    archivo: Express.Multer.File,
    tipo: 'glb' | 'sketchfab' = 'glb',
  ): Promise<{
    nombreArchivo: string;
    rutaRelativa: string;
    tamaño: number;
  }> {
    // Validaciones
    if (!this.configuracion.validarExtension(archivo.originalname)) {
      throw new Error(`Extensión no permitida: ${path.extname(archivo.originalname)}`);
    }

    const validacionTamaño = this.configuracion.validarTamaño(archivo.size);
    if (!validacionTamaño.valido) {
      throw new Error(validacionTamaño.mensaje);
    }

    // Generar nombre único
    const timestamp = Date.now();
    const nombreUnico = `modelo_${timestamp}_${archivo.filename}`;
    const rutaCompleta = this.configuracion.obtenerRutaCompleta(nombreUnico, tipo);

    // Guardar archivo
    fs.writeFileSync(rutaCompleta, archivo.buffer);

    return {
      nombreArchivo: nombreUnico,
      rutaRelativa: this.configuracion.obtenerRutaRelativa(nombreUnico, tipo),
      tamaño: archivo.size,
    };
  }

  /**
   * Obtener archivo de modelo
   */
  obtenerArchivo(nombreArchivo: string, tipo: 'glb' | 'sketchfab' = 'glb'): Buffer {
    const rutaCompleta = this.configuracion.obtenerRutaCompleta(nombreArchivo, tipo);

    if (!fs.existsSync(rutaCompleta)) {
      throw new Error(`Archivo no encontrado: ${nombreArchivo}`);
    }

    return fs.readFileSync(rutaCompleta);
  }

  /**
   * Eliminar archivo de modelo
   */
  eliminarModelo(nombreArchivo: string, tipo: 'glb' | 'sketchfab' = 'glb'): boolean {
    const rutaCompleta = this.configuracion.obtenerRutaCompleta(nombreArchivo, tipo);

    if (fs.existsSync(rutaCompleta)) {
      fs.unlinkSync(rutaCompleta);
      return true;
    }

    return false;
  }

  /**
   * Verificar si existe un archivo
   */
  existeModelo(nombreArchivo: string, tipo: 'glb' | 'sketchfab' = 'glb'): boolean {
    const rutaCompleta = this.configuracion.obtenerRutaCompleta(nombreArchivo, tipo);
    return fs.existsSync(rutaCompleta);
  }

  /**
   * Obtener información del archivo
   */
  obtenerInformacionArchivo(
    nombreArchivo: string,
    tipo: 'glb' | 'sketchfab' = 'glb',
  ): {
    nombre: string;
    tamaño: number;
    fechaCreacion: Date;
    extension: string;
  } {
    const rutaCompleta = this.configuracion.obtenerRutaCompleta(nombreArchivo, tipo);

    if (!fs.existsSync(rutaCompleta)) {
      throw new Error(`Archivo no encontrado: ${nombreArchivo}`);
    }

    const stats = fs.statSync(rutaCompleta);

    return {
      nombre: nombreArchivo,
      tamaño: stats.size,
      fechaCreacion: stats.birthtime,
      extension: path.extname(nombreArchivo),
    };
  }

  /**
   * Listar todos los modelos de un tipo
   */
  listarModelos(tipo: 'glb' | 'sketchfab' = 'glb'): string[] {
    const rutaBase = this.configuracion.RUTAS_BASE[tipo === 'glb' ? 'GLB' : 'SKETCHFAB'];

    if (!fs.existsSync(rutaBase)) {
      return [];
    }

    return fs.readdirSync(rutaBase).filter((archivo) =>
      this.configuracion.validarExtension(archivo),
    );
  }
}
