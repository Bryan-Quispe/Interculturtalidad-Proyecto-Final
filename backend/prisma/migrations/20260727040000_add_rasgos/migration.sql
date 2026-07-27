-- Rasgos de la mascota como lista cerrada: carácter, pelaje y señas.
-- Se guardan identificadores ('carinoso', 'peloLargo'...), nunca el rótulo,
-- porque el rótulo depende del idioma en que se mire la ficha. Así la
-- información que sirve para reconocer al animal se puede mostrar en kichwa
-- igual que en castellano, cosa que la descripción libre no permite.

-- AlterTable
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "rasgos" JSONB;
