import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

/** Formatos de foto admitidos. Se excluye GIF a propósito (es animado). */
export const FORMATOS_IMAGEN_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

const EXTENSIONES_PERMITIDAS = /\.(jpe?g|png|webp)$/i;
const MAX_BYTES = 8 * 1024 * 1024;

export const MENSAJE_FORMATO_INVALIDO =
  'Formato no permitido. Solo se aceptan imágenes JPG, JPEG, PNG o WEBP (los GIF no se admiten porque son animados).';

@Controller('uploads')
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post('imagen')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: MAX_BYTES, files: 1 },
      fileFilter: (_req, file, cb) => {
        // Se valida el tipo declarado Y la extensión: un archivo puede llegar
        // como application/octet-stream según el navegador.
        const tipoValido = FORMATOS_IMAGEN_PERMITIDOS.includes(file.mimetype);
        const extensionValida = EXTENSIONES_PERMITIDAS.test(file.originalname);

        if (tipoValido && extensionValida) {
          cb(null, true);
          return;
        }
        cb(new BadRequestException(MENSAJE_FORMATO_INVALIDO), false);
      },
    }),
  )
  async subirImagen(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se recibió ninguna imagen.');
    }

    // Comprobación por firma binaria: impide renombrar un .gif o un .exe a .jpg.
    if (!esImagenReal(file.buffer)) {
      throw new BadRequestException(MENSAJE_FORMATO_INVALIDO);
    }

    return this.uploadsService.subirImagen(file);
  }
}

/** Verifica los magic bytes de JPEG, PNG y WEBP. */
function esImagenReal(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (png.every((byte, index) => buffer[index] === byte)) return true;

  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  ) {
    return true;
  }

  return false;
}
