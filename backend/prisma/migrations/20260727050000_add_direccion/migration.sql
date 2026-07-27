-- Referencia a pie de calle del último avistamiento: vía, número si lo hay,
-- barrio y ciudad. La zona sola ("28 de Noviembre, Quito") nombra un barrio y
-- no orienta a quien lee el cartel en la calle.
--
-- No contradice la protección de la privacidad: lo que se publica es dónde se
-- vio al animal, no dónde vive su propietario, y el PDF sigue sin exportar
-- latitud ni longitud.

-- AlterTable
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "direccion" TEXT;
