import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  OnModuleInit,
} from '@nestjs/common';
import { CategoriaAnimal } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateModelo3DDto, DerivarModeloDto, UpdateTransformacionesDto } from './dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class Modelos3DService implements OnModuleInit {
  private uploadDir = process.env.UPLOAD_DIR || './uploads';
  private modelosBaseDir = process.env.MODELOS_BASE_DIR || './Modelos';

  constructor(private prisma: PrismaService) {
    // Crear directorio si no existe
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async onModuleInit() {
    await this.syncDefaultModelsFromFilesystem();
  }

  private categoriaToFolder(categoria: string) {
    const normalized = categoria.trim().toLowerCase();
    if (normalized === 'perro') return 'Perro';
    if (normalized === 'gato') return 'Gato';
    if (normalized === 'conejo' || normalized === 'conejos') return 'Conejos';
    return null;
  }

  private categoriaToEnum(categoria: string) {
    const normalized = categoria.trim().toLowerCase();
    if (normalized === 'perro') return CategoriaAnimal.PERRO;
    if (normalized === 'gato') return CategoriaAnimal.GATO;
    if (normalized === 'conejo' || normalized === 'conejos') return CategoriaAnimal.CONEJO;
    return null;
  }

  private folderToCategoria(folder: string) {
    if (folder === 'Perro') return CategoriaAnimal.PERRO;
    if (folder === 'Gato') return CategoriaAnimal.GATO;
    if (folder === 'Conejos') return CategoriaAnimal.CONEJO;
    return null;
  }

  private humanizeFilename(filename: string) {
    const base = path.parse(filename).name;
    return base
      .replace(/[_-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  async syncDefaultModelsFromFilesystem() {
    const admin = await this.prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { id: true },
    });

    if (!admin) {
      return;
    }

    const existingModels = await this.prisma.modelo3D.findMany({
      include: { archivo: true },
    });
    const existingFiles = new Set(
      existingModels
        .map((model) => model.archivo?.filename)
        .filter((filename): filename is string => Boolean(filename)),
    );

    const speciesFolders = ['Perro', 'Gato', 'Conejos'];
    for (const folder of speciesFolders) {
      const categoria = this.folderToCategoria(folder);
      if (!categoria) continue;

      const basePath = path.resolve(this.modelosBaseDir, folder);
      if (!fs.existsSync(basePath)) continue;

      const entries = fs.readdirSync(basePath, { withFileTypes: true });
      for (const entry of entries) {
        if (!entry.isFile()) continue;

        const ext = path.extname(entry.name).toLowerCase();
        if (!['.glb', '.gltf', '.obj'].includes(ext)) continue;
        if (existingFiles.has(entry.name)) continue;

        await this.prisma.modelo3D.create({
          data: {
            nombre: this.humanizeFilename(entry.name),
            categoria,
            raza: folder,
            descripcion: `Modelo 3D importado desde la carpeta ${folder}`,
            color: '#3498db',
            pinturas: [],
            isPublico: true,
            usuarioId: admin.id,
            archivo: {
              create: {
                filename: entry.name,
                path: `/modelos/${folder}/${entry.name}`,
                mimetype: ext === '.obj' ? 'application/octet-stream' : 'model/gltf-binary',
                tamano: fs.statSync(path.join(basePath, entry.name)).size,
              },
            },
            transformaciones: {
              create: {
                escalaX: 1,
                escalaY: 1,
                escalaZ: 1,
              },
            },
          },
        });
      }
    }
  }

  async getCatalogoPorCategoria(categoria: string) {
    const folder = this.categoriaToFolder(categoria);
    if (!folder) {
      return [];
    }

    const basePath = path.resolve(this.modelosBaseDir, folder);
    if (!fs.existsSync(basePath)) {
      return [];
    }

    const files = fs.readdirSync(basePath, { withFileTypes: true });
    return files
      .filter((entry) => entry.isFile())
      .map((entry) => ({
        nombre: entry.name,
        categoria: folder,
        ruta: `/Modelos/${folder}/${entry.name}`,
        extension: path.extname(entry.name).toLowerCase(),
      }));
  }

  async uploadModelo(
    usuarioId: string,
    dto: CreateModelo3DDto,
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Debes subir un archivo');
    }

    // Validar extensión
    const allowedExtensions = ['.glb', '.gltf', '.obj'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      fs.unlinkSync(file.path);
      throw new BadRequestException('Formato de archivo no permitido');
    }

    try {
      const categoria = this.categoriaToEnum(dto.categoria);
      if (!categoria) {
        throw new BadRequestException('Categoría de modelo no válida');
      }

      const isPublico = dto.isPublico === true;

      const modelo = await this.prisma.modelo3D.create({
        data: {
          nombre: dto.nombre,
          categoria,
          raza: dto.raza,
          descripcion: dto.descripcion,
          color: dto.color || '#3498db',
          pinturas: [],
          isPublico,
          usuarioId,
          archivo: {
            create: {
              filename: file.filename,
              path: `/uploads/${file.filename}`,
              mimetype: file.mimetype,
              tamano: file.size,
            },
          },
          transformaciones: {
            create: {
              escalaX: 1,
              escalaY: 1,
              escalaZ: 1,
            },
          },
        },
        include: {
          archivo: true,
          transformaciones: true,
        },
      });

      return modelo;
    } catch (error) {
      // Eliminar archivo si falla la creación
      fs.unlinkSync(file.path);
      throw error;
    }
  }

  async getAll() {
    return this.prisma.modelo3D.findMany({
      include: {
        archivo: true,
        transformaciones: true,
        usuario: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string, user?: { id: string; role?: string }) {
    const modelo = await this.prisma.modelo3D.findUnique({
      where: { id },
      include: {
        archivo: true,
        transformaciones: true,
        usuario: {
          select: { id: true, name: true },
        },
      },
    });

    if (!modelo) {
      return null;
    }

    if (user?.role !== 'ADMIN' && !modelo.isPublico && modelo.usuarioId !== user?.id) {
      throw new ForbiddenException('No tienes permiso para ver este modelo');
    }

    return modelo;
  }

  async updateTransformaciones(
    id: string,
    dto: UpdateTransformacionesDto,
    user?: { id: string; role?: string },
  ) {
    const transformaciones: any = {};

    if (dto.escalaX !== undefined) transformaciones.escalaX = dto.escalaX;
    if (dto.escalaY !== undefined) transformaciones.escalaY = dto.escalaY;
    if (dto.escalaZ !== undefined) transformaciones.escalaZ = dto.escalaZ;
    if (dto.rotacionX !== undefined) transformaciones.rotacionX = dto.rotacionX;
    if (dto.rotacionY !== undefined) transformaciones.rotacionY = dto.rotacionY;
    if (dto.rotacionZ !== undefined) transformaciones.rotacionZ = dto.rotacionZ;
    if (dto.posicionX !== undefined) transformaciones.posicionX = dto.posicionX;
    if (dto.posicionY !== undefined) transformaciones.posicionY = dto.posicionY;
    if (dto.posicionZ !== undefined) transformaciones.posicionZ = dto.posicionZ;

    const modelo = await this.prisma.modelo3D.findUnique({
      where: { id },
      include: { transformaciones: true },
    });

    if (!modelo) {
      throw new BadRequestException('Modelo no encontrado');
    }

    if (user?.role !== 'ADMIN' && modelo.usuarioId !== user?.id) {
      throw new ForbiddenException('No tienes permiso para editar este modelo');
    }

    const data: any = {
      ...(dto.nombre !== undefined ? { nombre: dto.nombre } : {}),
      ...(dto.raza !== undefined ? { raza: dto.raza } : {}),
      ...(dto.descripcion !== undefined ? { descripcion: dto.descripcion } : {}),
      ...(dto.color !== undefined ? { color: dto.color } : {}),
      ...(dto.pinturas !== undefined ? { pinturas: dto.pinturas } : {}),
      ...(dto.isPublico !== undefined ? { isPublico: dto.isPublico } : {}),
    };

    if (Object.keys(transformaciones).length > 0) {
      data.transformaciones = {
        update: transformaciones,
      };
    }

    const updated = await this.prisma.modelo3D.update({
      where: { id },
      data,
      include: {
        archivo: true,
        transformaciones: true,
      },
    });

    return updated;
  }

  /**
   * Crea una copia personalizada del modelo para el usuario.
   *
   * Pintar no debe alterar el modelo base, porque está compartido con el resto
   * de la comunidad. La copia reutiliza el mismo archivo 3D en disco (solo
   * cambian la pintura y los datos), así que no ocupa espacio adicional.
   */
  async derivarModelo(
    usuarioId: string,
    baseId: string,
    dto: DerivarModeloDto,
    user?: { id: string; role?: string },
  ) {
    const base = await this.prisma.modelo3D.findUnique({
      where: { id: baseId },
      include: { archivo: true, transformaciones: true },
    });

    if (!base) {
      throw new BadRequestException('El modelo original no existe');
    }

    if (user?.role !== 'ADMIN' && !base.isPublico && base.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permiso para usar este modelo');
    }

    if (!base.archivo) {
      throw new BadRequestException('El modelo original no tiene archivo asociado');
    }

    return this.prisma.modelo3D.create({
      data: {
        nombre: dto.nombre?.trim() || `${base.nombre} (personalizado)`,
        categoria: base.categoria,
        raza: base.raza,
        descripcion: dto.descripcion ?? base.descripcion,
        color: base.color,
        pinturas: (dto.pinturas ?? []) as any,
        isPublico: dto.isPublico === true,
        usuarioId,
        // Si se deriva de una copia, se apunta igualmente al original.
        derivadoDeId: base.derivadoDeId ?? base.id,
        archivo: {
          create: {
            filename: base.archivo.filename,
            path: base.archivo.path,
            mimetype: base.archivo.mimetype,
            tamano: base.archivo.tamano,
          },
        },
        transformaciones: {
          create: {
            escalaX: base.transformaciones?.escalaX ?? 1,
            escalaY: base.transformaciones?.escalaY ?? 1,
            escalaZ: base.transformaciones?.escalaZ ?? 1,
            rotacionX: base.transformaciones?.rotacionX ?? 0,
            rotacionY: base.transformaciones?.rotacionY ?? 0,
            rotacionZ: base.transformaciones?.rotacionZ ?? 0,
            posicionX: base.transformaciones?.posicionX ?? 0,
            posicionY: base.transformaciones?.posicionY ?? 0,
            posicionZ: base.transformaciones?.posicionZ ?? 0,
          },
        },
      },
      include: {
        archivo: true,
        transformaciones: true,
        usuario: { select: { id: true, name: true } },
      },
    });
  }

  async deleteModelo(id: string) {
    const modelo = await this.prisma.modelo3D.findUnique({
      where: { id },
      include: { archivo: true },
    });

    if (!modelo) {
      throw new BadRequestException('Modelo no encontrado');
    }

    // El archivo 3D lo comparten el modelo base y sus copias personalizadas:
    // solo se borra del disco cuando ya no queda ningún modelo apuntando a él.
    if (modelo.archivo) {
      const otrosUsos = await this.prisma.archivoModelo.count({
        where: { path: modelo.archivo.path, modeloId: { not: id } },
      });

      if (otrosUsos === 0) {
        const filePath = path.join(this.uploadDir, modelo.archivo.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Eliminar de base de datos (cascade)
    return this.prisma.modelo3D.delete({
      where: { id },
    });
  }

  async getByUsuario(usuarioId: string) {
    return this.prisma.modelo3D.findMany({
      where: { usuarioId },
      include: {
        archivo: true,
        transformaciones: true,
      },
    });
  }

  async getVisibleForUser(user?: { id: string; role?: string }) {
    if (user?.role === 'ADMIN') {
      return this.getAll();
    }

    return this.prisma.modelo3D.findMany({
      where: {
        OR: [{ isPublico: true }, { usuarioId: user?.id }],
      },
      include: {
        archivo: true,
        transformaciones: true,
        usuario: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
