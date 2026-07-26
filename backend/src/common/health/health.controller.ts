import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Endpoint que consulta Render para decidir si el despliegue está vivo.
 * Toca la base de datos a propósito: un proceso arriba con la conexión caída
 * no debería contar como sano.
 */
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: 'ok',
      uptime: Math.round(process.uptime()),
    };
  }
}
