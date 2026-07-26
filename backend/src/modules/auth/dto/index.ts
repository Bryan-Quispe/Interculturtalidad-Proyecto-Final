import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * Nombres de persona: letras de cualquier alfabeto, espacios y los signos que
 * aparecen en apellidos reales (guion en "Núñez-García", apóstrofo en "O'Brien").
 * Se excluyen dígitos y símbolos: no hay nombres con `<script>` ni con `@`.
 * Debe empezar por letra para que no pase " -- ".
 */
const NOMBRE_PERSONA = /^\p{L}[\p{L}\s'’-]*$/u;

export class LoginDto {
  // El correo se guarda normalizado: nadie debería registrarse dos veces por
  // escribirlo con mayúsculas o con espacios sobrantes al copiar y pegar.
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  @MaxLength(254, { message: 'El correo electrónico es demasiado largo.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @MaxLength(72, { message: 'La contraseña no puede superar los 72 caracteres.' })
  password: string;
}

export class RegisterDto extends LoginDto {
  // Colapsa espacios repetidos y recorta los extremos antes de validar.
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
  )
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(60, { message: 'El nombre no puede superar los 60 caracteres.' })
  @Matches(NOMBRE_PERSONA, {
    message: 'El nombre solo puede contener letras y espacios.',
  })
  name: string;
}
