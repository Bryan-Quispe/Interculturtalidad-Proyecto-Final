import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AnimalesService } from './animales.service';
import { CreateAnimalDto, UpdateAnimalDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { RolesGuard } from '@/common/guards/roles.guard';

@Controller('animales')
export class AnimalesController {
  constructor(private animalesService: AnimalesService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAll(
    @Query('usuarioId') usuarioId?: string,
    @Query('categoria') categoria?: string,
  ) {
    return this.animalesService.getAll({ usuarioId, categoria });
  }

  @Get('mios')
  @UseGuards(JwtAuthGuard)
  async getMine(@CurrentUser() user: any) {
    return this.animalesService.getMine(user.id);
  }

  @Get('publicos')
  async getPublicos(
    @Query('categoria') categoria?: string,
    @Query('zona') zona?: string,
  ) {
    return this.animalesService.getPublicos({ categoria, zona });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.animalesService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() dto: CreateAnimalDto,
    @CurrentUser() user: any,
  ) {
    return this.animalesService.createAnimal(user.id, dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAnimalDto,
    @CurrentUser() user: any,
  ) {
    const animal = await this.animalesService.getById(id);
    if (!animal) {
      throw new ForbiddenException('Mascota no encontrada');
    }
    if (user.role !== 'ADMIN' && animal.usuarioId !== user.id) {
      throw new ForbiddenException('No tienes permiso para editar esta mascota');
    }
    return this.animalesService.updateAnimal(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.animalesService.deleteAnimal(id, user);
  }
}
