import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Modelos3DService } from './modelos3d.service';
import { CreateModelo3DDto, DerivarModeloDto, UpdateTransformacionesDto } from './dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import { v4 as uuid } from 'uuid';
import * as path from 'path';

@Controller('modelos3d')
export class Modelos3DController {
  constructor(private modelos3dService: Modelos3DService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@CurrentUser() user: any) {
    return this.modelos3dService.getVisibleForUser(user);
  }

  @Get('catalogo/:categoria')
  async getCatalogoPorCategoria(@Param('categoria') categoria: string) {
    return this.modelos3dService.getCatalogoPorCategoria(categoria);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string, @CurrentUser() user: any) {
    return this.modelos3dService.getById(id, user);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = uuid();
          const ext = path.extname(file.originalname);
          cb(null, `${randomName}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowedMimes = [
          'model/gltf+json',
          'model/gltf-binary',
          'application/octet-stream',
          'text/plain',
        ];
        if (
          allowedMimes.includes(file.mimetype) ||
          file.originalname.endsWith('.glb') ||
          file.originalname.endsWith('.gltf') ||
          file.originalname.endsWith('.obj')
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException(
              'Solo se permiten archivos .glb, .gltf, .obj',
            ),
            false,
          );
        }
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateModelo3DDto,
    @CurrentUser() user: any,
  ) {
    return this.modelos3dService.uploadModelo(user.id, dto, file);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateTransformaciones(
    @Param('id') id: string,
    @Body() dto: UpdateTransformacionesDto,
    @CurrentUser() user: any,
  ) {
    return this.modelos3dService.updateTransformaciones(id, dto, user);
  }

  /**
   * Guarda una versión personalizada del modelo sin modificar el original.
   * Abierto a cualquier usuario autenticado: es la forma de que alguien sin
   * permisos de administrador pueda pintar su mascota.
   */
  @Post(':id/derivar')
  @UseGuards(JwtAuthGuard)
  async derivar(
    @Param('id') id: string,
    @Body() dto: DerivarModeloDto,
    @CurrentUser() user: any,
  ) {
    return this.modelos3dService.derivarModelo(user.id, id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async delete(@Param('id') id: string) {
    return this.modelos3dService.deleteModelo(id);
  }

  @Get('usuario/:usuarioId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.modelos3dService.getByUsuario(usuarioId);
  }
}
