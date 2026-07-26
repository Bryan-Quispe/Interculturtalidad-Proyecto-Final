import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Configuración centralizada para almacenamiento de modelos 3D
 * Todos los modelos se refencian desde este punto
 */
@Injectable()
export class ConfiguracionAlmacenamientoModelos {
  /**
   * Rutas base de almacenamiento
   */
  readonly RUTAS_BASE = {
    PRINCIPAL: path.join(process.cwd(), 'src', 'modelos', 'almacenamiento'),
    GLB: path.join(
      process.cwd(),
      'src',
      'modelos',
      'almacenamiento',
      'glb',
    ),
    SKETCHFAB: path.join(
      process.cwd(),
      'src',
      'modelos',
      'almacenamiento',
      'sketchfab',
    ),
    TEMPORAL: path.join(process.cwd(), 'uploads', 'temporal'),
  };

  /**
   * Extensiones permitidas
   */
  readonly EXTENSIONES_PERMITIDAS = ['.glb', '.gltf', '.obj', '.fbx'];

  /**
   * Tipos MIME aceptados
   */
  readonly TIPOS_MIME_PERMITIDOS = [
    'model/gltf+json',
    'model/gltf-binary',
    'application/octet-stream',
    'text/plain',
    'application/x-zip-compressed',
  ];

  /**
   * Límites de almacenamiento
   */
  readonly LIMITES = {
    TAMAÑO_MAXIMO_MB: 100, // 100MB por archivo
    TAMAÑO_MAXIMO_BYTES: 100 * 1024 * 1024,
    TAMAÑO_TOTAL_ALMACENAMIENTO_GB: 500, // 500GB total
  };

  /**
   * Metadatos de formato
   */
  readonly FORMATOS = {
    GLB: {
      extension: '.glb',
      tipo: 'model/gltf-binary',
      descripcion: 'Formato GLB (binario)',
      tamaño_promedio_mb: 5,
    },
    GLTF: {
      extension: '.gltf',
      tipo: 'model/gltf+json',
      descripcion: 'Formato GLTF (JSON)',
      tamaño_promedio_mb: 10,
    },
    OBJ: {
      extension: '.obj',
      tipo: 'text/plain',
      descripcion: 'Formato OBJ (Wavefront)',
      tamaño_promedio_mb: 8,
    },
    FBX: {
      extension: '.fbx',
      tipo: 'application/octet-stream',
      descripcion: 'Formato FBX (Autodesk)',
      tamaño_promedio_mb: 12,
    },
  };

  constructor() {
    this.inicializarEstructura();
  }

  /**
   * Inicializar estructura de directorios
   */
  private inicializarEstructura(): void {
    Object.values(this.RUTAS_BASE).forEach((ruta) => {
      if (!fs.existsSync(ruta)) {
        fs.mkdirSync(ruta, { recursive: true });
        console.log(`✓ Directorio creado: ${ruta}`);
      }
    });
  }

  /**
   * Obtener ruta completa de un modelo
   */
  obtenerRutaCompleta(nombreArchivo: string, tipo: 'glb' | 'sketchfab' = 'glb'): string {
    const rutaBase = tipo === 'glb' ? this.RUTAS_BASE.GLB : this.RUTAS_BASE.SKETCHFAB;
    return path.join(rutaBase, nombreArchivo);
  }

  /**
   * Obtener ruta relativa para referencia en BD
   */
  obtenerRutaRelativa(nombreArchivo: string, tipo: 'glb' | 'sketchfab' = 'glb'): string {
    return `/modelos/${tipo}/${nombreArchivo}`;
  }

  /**
   * Validar extensión de archivo
   */
  validarExtension(nombreArchivo: string): boolean {
    const extension = path.extname(nombreArchivo).toLowerCase();
    return this.EXTENSIONES_PERMITIDAS.includes(extension);
  }

  /**
   * Validar tipo MIME
   */
  validarTipoMime(tipoMime: string): boolean {
    return this.TIPOS_MIME_PERMITIDOS.includes(tipoMime);
  }

  /**
   * Validar tamaño de archivo
   */
  validarTamaño(tamanioBytes: number): { valido: boolean; mensaje?: string } {
    if (tamanioBytes > this.LIMITES.TAMAÑO_MAXIMO_BYTES) {
      return {
        valido: false,
        mensaje: `Archivo demasiado grande. Máximo: ${this.LIMITES.TAMAÑO_MAXIMO_MB}MB`,
      };
    }
    return { valido: true };
  }

  /**
   * Obtener información del almacenamiento
   */
  obtenteInformacionAlmacenamiento(): {
    rutasPrincipal: string;
    extensionesPermitidas: string[];
    tamanioMaximoMB: number;
  } {
    return {
      rutasPrincipal: this.RUTAS_BASE.PRINCIPAL,
      extensionesPermitidas: this.EXTENSIONES_PERMITIDAS,
      tamanioMaximoMB: this.LIMITES.TAMAÑO_MAXIMO_MB,
    };
  }
}
