import { IsString, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class CaracteristicasDto {
  @IsOptional()
  @IsString()
  tamano?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  habitat?: string;
}

export class CreateAnimalDto {
  @IsString()
  nombre: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  /**
   * Descripcion escrita por la persona en kichwa. Es opcional y separada
   * porque el texto libre no se traduce automaticamente: solo su autor puede
   * decir lo mismo en la otra lengua.
   */
  @IsOptional()
  @IsString()
  descripcionKw?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  zona?: string;

  @IsOptional()
  @IsString()
  googlePlaceId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitud?: number;

  @IsOptional()
  @IsString()
  telefonoContacto?: string;

  @IsOptional()
  @IsString()
  ultimaVezVisto?: string;

  @IsOptional()
  @IsString()
  fechaVisto?: string;

  @IsOptional()
  @IsString()
  modeloId?: string;

  @IsOptional()
  fotos?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CaracteristicasDto)
  caracteristicas?: CaracteristicasDto;
}

export class UpdateAnimalDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  /**
   * Descripcion escrita por la persona en kichwa. Es opcional y separada
   * porque el texto libre no se traduce automaticamente: solo su autor puede
   * decir lo mismo en la otra lengua.
   */
  @IsOptional()
  @IsString()
  descripcionKw?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  zona?: string;

  @IsOptional()
  @IsString()
  googlePlaceId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitud?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitud?: number;

  @IsOptional()
  @IsString()
  telefonoContacto?: string;

  @IsOptional()
  @IsString()
  ultimaVezVisto?: string;

  @IsOptional()
  @IsString()
  fechaVisto?: string;

  @IsOptional()
  @IsString()
  modeloId?: string;

  @IsOptional()
  fotos?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CaracteristicasDto)
  caracteristicas?: CaracteristicasDto;
}
