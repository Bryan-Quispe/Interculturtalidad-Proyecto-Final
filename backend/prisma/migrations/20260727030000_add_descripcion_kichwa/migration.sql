-- Descripción de la mascota en kichwa, escrita por su propio autor.
-- El texto libre no se traduce automáticamente —no existe traducción
-- castellano-kichwa fiable, y sobreescribir lo que alguien escribió sería
-- suplantarle—, así que cada lengua se guarda en su columna.

-- AlterTable
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "descripcionKw" TEXT;
