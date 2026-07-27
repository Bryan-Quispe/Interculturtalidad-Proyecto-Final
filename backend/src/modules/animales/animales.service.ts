import { Injectable, ForbiddenException } from '@nestjs/common';
import { CategoriaAnimal } from '@prisma/client';
import { PrismaService } from '@/common/prisma/prisma.service';

import { CreateAnimalDto, UpdateAnimalDto } from './dto';

/**
 * Distancia entre dos puntos por la formula del semiverseno. Basta con esta
 * aproximacion esferica: el error frente a un elipsoide es de metros, y aqui
 * se comparan radios de kilometros.
 */
function distanciaEnKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const RADIO_TIERRA_KM = 6371;
  const aRadianes = (grados: number) => (grados * Math.PI) / 180;
  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(aRadianes(lat1)) * Math.cos(aRadianes(lat2)) * Math.sin(dLon / 2) ** 2;
  return RADIO_TIERRA_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

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
      rasgos,
      telefonos,
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
          ...(rasgos ? { rasgos } : {}),
          ...(telefonos ? { telefonos } : {}),
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

  async getPublicos(filtros?: {
    categoria?: string;
    zona?: string;
    lat?: number;
    lng?: number;
    radioKm?: number;
  }) {
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

    const animales = await this.prisma.animal.findMany({
      where,
      include: this.includeAnimal,
      orderBy: { createdAt: 'desc' },
    });

    /**
     * Cercanía por coordenadas y no por nombre de barrio.
     *
     * Comparar cadenas no sirve: dos personas del mismo sector escriben
     * "El Beaterio", "Beaterio" o el barrio contiguo que el mapa tenga
     * cartografiado, y ninguna coincide con la otra. La distancia entre dos
     * puntos no admite esa ambigüedad.
     */
    if (filtros?.lat === undefined || filtros?.lng === undefined) {
      return animales;
    }

    const radioKm = filtros.radioKm && filtros.radioKm > 0 ? filtros.radioKm : 10;

    return animales
      .map((animal) => ({
        animal,
        distanciaKm:
          animal.latitud !== null && animal.longitud !== null
            ? distanciaEnKm(filtros.lat!, filtros.lng!, animal.latitud, animal.longitud)
            : null,
      }))
      // Sin coordenadas no se puede afirmar que esté cerca, pero tampoco que
      // esté lejos: se conserva al final antes que ocultar una búsqueda activa.
      .filter((item) => item.distanciaKm === null || item.distanciaKm <= radioKm)
      .sort((a, b) => (a.distanciaKm ?? Infinity) - (b.distanciaKm ?? Infinity))
      .map((item) => ({
        ...item.animal,
        distanciaKm: item.distanciaKm === null ? null : Math.round(item.distanciaKm * 10) / 10,
      }));
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
      rasgos,
      telefonos,
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
      if (rasgos !== undefined) {
        animalUpdateData.rasgos = rasgos;
      }
      if (telefonos !== undefined) {
        animalUpdateData.telefonos = telefonos;
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
