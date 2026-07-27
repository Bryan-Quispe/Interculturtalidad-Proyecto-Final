import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export interface ImagenSubida {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);
  private readonly folder: string;
  private readonly configurado: boolean;

  constructor(private config: ConfigService) {
    const cloudName = this.config.get<string>('CLOUDINARY_CLOUD_NAME');
    const apiKey = this.config.get<string>('CLOUDINARY_API_KEY');
    const apiSecret = this.config.get<string>('CLOUDINARY_API_SECRET');
    this.folder = this.config.get<string>('CLOUDINARY_FOLDER') || 'mascotas3d/animales';
    this.configurado = Boolean(cloudName && apiKey && apiSecret);

    if (!this.configurado) {
      this.logger.warn(
        'Cloudinary no está configurado. Define CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET.',
      );
      return;
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
  }

  get estaConfigurado() {
    return this.configurado;
  }

  /**
   * Sube el buffer a Cloudinary. Las credenciales viven solo en el servidor:
   * el navegador nunca ve el API secret.
   */
  async subirImagen(file: Express.Multer.File): Promise<ImagenSubida> {
    if (!this.configurado) {
      throw new InternalServerErrorException(
        'El almacenamiento de imágenes no está configurado en el servidor.',
      );
    }

    const resultado = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
          resource_type: 'image',
          // Recorta el peso sin degradar el cartel impreso.
          transformation: [
            { width: 1600, height: 1600, crop: 'limit' },
            { quality: 'auto:good' },
          ],
        },
        (error, response) => {
          if (error || !response) {
            reject(error || new Error('Cloudinary no devolvió respuesta'));
            return;
          }
          resolve(response);
        },
      );
      stream.end(file.buffer);
    }).catch((error) => {
      this.logger.error(`Error al subir la imagen: ${error?.message}`);
      throw new InternalServerErrorException(
        'No se pudo subir la imagen. Intenta nuevamente.',
      );
    });

    return {
      url: resultado.secure_url,
      publicId: resultado.public_id,
      width: resultado.width,
      height: resultado.height,
      format: resultado.format,
      bytes: resultado.bytes,
    };
  }
}
