import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateModelo3DDto {
  @IsString()
  nombre: string;

  @IsString()
  categoria: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsBoolean()
  isPublico?: boolean;
}

/** Datos para guardar una versión personalizada sin tocar el modelo original. */
export class DerivarModeloDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  pinturas?: any;

  /** true = compartida con la comunidad; false = solo para el usuario. */
  @IsOptional()
  @IsBoolean()
  isPublico?: boolean;
}

export class UpdateTransformacionesDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  raza?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  escalaX?: number;

  @IsOptional()
  @IsNumber()
  escalaY?: number;

  @IsOptional()
  @IsNumber()
  escalaZ?: number;

  @IsOptional()
  @IsNumber()
  rotacionX?: number;

  @IsOptional()
  @IsNumber()
  rotacionY?: number;

  @IsOptional()
  @IsNumber()
  rotacionZ?: number;

  @IsOptional()
  @IsNumber()
  posicionX?: number;

  @IsOptional()
  @IsNumber()
  posicionY?: number;

  @IsOptional()
  @IsNumber()
  posicionZ?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  pinturas?: any;

  @IsOptional()
  @IsBoolean()
  isPublico?: boolean;
}
