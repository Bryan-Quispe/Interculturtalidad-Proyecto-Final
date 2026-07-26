import { Injectable, ForbiddenException } from '@nestjs/common';
import { CategoriaAnimal } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';
import { CreateAnimalDto, UpdateAnimalDto } from './dto';

@Injectable()
export class AnimalesService {
  constructor(private prisma: PrismaService) {}

  private includeAnimal = {
    caracteristicas: true,
    modelo: {
      include: {
        archivo: true,
        transformaciones: true,
      },
    },
    usuario: {
      select: { id: true, name: true, email: true, avatar: true, zona: true },
    },
  };

  async createAnimal(usuarioId: string, dto: CreateAnimalDto) {
    const {
      caracteristicas,
      modeloId,
      categoria: categoriaRaw,
      fechaVisto,
      fotos,
      latitud,
      longitud,
      ...animalData
    } = dto;
    const categoria = categoriaRaw as CategoriaAnimal;

    return this.prisma.$transaction(async (prisma) => {
      const animal = await prisma.animal.create({
        data: {
          categoria,
          ...animalData,
          ...(fechaVisto ? { fechaVisto: new Date(fechaVisto) } : {}),
          ...(fotos ? { fotos } : {}),
          ...(latitud !== undefined ? { latitud } : {}),
          ...(longitud !== undefined ? { longitud } : {}),
          ...(modeloId ? { modeloId } : {}),
          usuarioId,
        },
      });

      if (caracteristicas) {
        await prisma.caracteristicasAnimal.create({
          data: {
            ...caracteristicas,
            animalId: animal.id,
          },
        });
      }

      return prisma.animal.findUnique({
        where: { id: animal.id },
        include: this.includeAnimal,
      });
    });
  }

  async getAll(filtros?: { usuarioId?: string; categoria?: string }) {
    const where: any = {};

    if (filtros?.usuarioId) {
      where.usuarioId = filtros.usuarioId;
    }

    if (filtros?.categoria) {
      where.categoria = filtros.categoria;
    }

    return this.prisma.animal.findMany({
      where,
      include: this.includeAnimal,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMine(usuarioId: string) {
    return this.prisma.animal.findMany({
      where: { usuarioId },
      include: this.includeAnimal,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPublicos(filtros?: { categoria?: string; zona?: string }) {
    const where: any = { isPublico: true };

    if (filtros?.categoria) {
      where.categoria = filtros.categoria;
    }

    if (filtros?.zona) {
      where.zona = {
        contains: filtros.zona,
        mode: 'insensitive',
      };
    }

    return this.prisma.animal.findMany({
      where,
      include: this.includeAnimal,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(id: string) {
    return this.prisma.animal.findUnique({
      where: { id },
      include: this.includeAnimal,
    });
  }

  async updateAnimal(id: string, dto: UpdateAnimalDto) {
    const {
      caracteristicas,
      modeloId,
      categoria: categoriaRaw,
      fechaVisto,
      fotos,
      latitud,
      longitud,
      ...animalData
    } = dto;
    const categoria = categoriaRaw as CategoriaAnimal | undefined;

    return this.prisma.$transaction(async (prisma) => {
      const animalUpdateData: any = { ...animalData };
      if (categoria) {
        animalUpdateData.categoria = categoria;
      }
      if (modeloId !== undefined) {
        animalUpdateData.modeloId = modeloId;
      }
      if (fechaVisto !== undefined) {
        animalUpdateData.fechaVisto = fechaVisto ? new Date(fechaVisto) : null;
      }
      if (fotos !== undefined) {
        animalUpdateData.fotos = fotos;
      }
      if (latitud !== undefined) {
        animalUpdateData.latitud = latitud;
      }
      if (longitud !== undefined) {
        animalUpdateData.longitud = longitud;
      }

      await prisma.animal.update({
        where: { id },
        data: animalUpdateData,
      });

      if (caracteristicas) {
        await prisma.caracteristicasAnimal.upsert({
          where: { animalId: id },
          update: caracteristicas,
          create: {
            ...caracteristicas,
            animalId: id,
          },
        });
      }

      return prisma.animal.findUnique({
        where: { id },
        include: this.includeAnimal,
      });
    });
  }

  async deleteAnimal(id: string, user?: { id: string; role?: string }) {
    const animal = await this.prisma.animal.findUnique({
      where: { id },
      select: { id: true, usuarioId: true },
    });

    if (!animal) {
      throw new ForbiddenException('Mascota no encontrada');
    }

    if (user?.role !== 'ADMIN' && animal.usuarioId !== user?.id) {
      throw new ForbiddenException('No tienes permiso para eliminar esta mascota');
    }

    return this.prisma.animal.delete({
      where: { id },
    });
  }

  async getByUsuario(usuarioId: string) {
    return this.prisma.animal.findMany({
      where: { usuarioId },
      include: this.includeAnimal,
    });
  }
}
