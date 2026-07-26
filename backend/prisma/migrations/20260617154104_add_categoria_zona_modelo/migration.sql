/*
  Warnings:

  - Added the required column `categoria` to the `animales` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoria` to the `modelos_3d` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CategoriaAnimal" AS ENUM ('PERRO', 'GATO', 'CONEJO');

-- DropIndex
DROP INDEX "animales_modeloId_key";

-- AlterTable
ALTER TABLE "animales" ADD COLUMN     "categoria" "CategoriaAnimal" NOT NULL,
ADD COLUMN     "googlePlaceId" TEXT,
ADD COLUMN     "isPublico" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "latitud" DOUBLE PRECISION,
ADD COLUMN     "longitud" DOUBLE PRECISION,
ADD COLUMN     "zona" TEXT;

-- AlterTable
ALTER TABLE "modelos_3d" ADD COLUMN     "categoria" "CategoriaAnimal" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "zona" TEXT;
