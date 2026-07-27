-- Recupera cinco columnas que existían en schema.prisma pero que ninguna
-- migración creaba. Se habían añadido al esquema con `prisma db push`, que
-- sincroniza la base local sin generar migración; en un despliegue limpio,
-- donde solo corre `prisma migrate deploy`, las columnas no existían y toda
-- consulta que las seleccionara respondía 500.
--
-- IF NOT EXISTS permite aplicarla sobre bases que ya recibieron el `db push`
-- sin que falle.

-- AlterTable
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "telefonoContacto" TEXT;
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "ultimaVezVisto" TEXT;
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "fechaVisto" TIMESTAMP(3);
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "fotos" JSONB;

-- AlterTable
ALTER TABLE "modelos_3d" ADD COLUMN IF NOT EXISTS "pinturas" JSONB;
