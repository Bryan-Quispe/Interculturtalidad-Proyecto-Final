-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "animales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "raza" TEXT,
    "modeloId" TEXT,
    "usuarioId" TEXT NOT NULL,
    "imagen" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "animales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas_animales" (
    "id" TEXT NOT NULL,
    "tamano" TEXT,
    "color" TEXT,
    "habitat" TEXT,
    "animalId" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_animales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "modelos_3d" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "raza" TEXT,
    "descripcion" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3498db',
    "isPublico" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descargas" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modelos_3d_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos_modelos" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "tamano" INTEGER NOT NULL,
    "modeloId" TEXT NOT NULL,

    CONSTRAINT "archivos_modelos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transformaciones_modelos" (
    "id" TEXT NOT NULL,
    "escalaX" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "escalaY" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "escalaZ" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "rotacionX" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rotacionY" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "rotacionZ" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "posicionX" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "posicionY" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "posicionZ" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "modeloId" TEXT NOT NULL,

    CONSTRAINT "transformaciones_modelos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "animales_modeloId_key" ON "animales"("modeloId");

-- CreateIndex
CREATE UNIQUE INDEX "animales_slug_key" ON "animales"("slug");

-- CreateIndex
CREATE INDEX "animales_usuarioId_idx" ON "animales"("usuarioId");

-- CreateIndex
CREATE INDEX "animales_modeloId_idx" ON "animales"("modeloId");

-- CreateIndex
CREATE UNIQUE INDEX "caracteristicas_animales_animalId_key" ON "caracteristicas_animales"("animalId");

-- CreateIndex
CREATE UNIQUE INDEX "modelos_3d_slug_key" ON "modelos_3d"("slug");

-- CreateIndex
CREATE INDEX "modelos_3d_usuarioId_idx" ON "modelos_3d"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "archivos_modelos_modeloId_key" ON "archivos_modelos"("modeloId");

-- CreateIndex
CREATE UNIQUE INDEX "transformaciones_modelos_modeloId_key" ON "transformaciones_modelos"("modeloId");

-- AddForeignKey
ALTER TABLE "animales" ADD CONSTRAINT "animales_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "modelos_3d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "animales" ADD CONSTRAINT "animales_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas_animales" ADD CONSTRAINT "caracteristicas_animales_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "animales"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "modelos_3d" ADD CONSTRAINT "modelos_3d_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_modelos" ADD CONSTRAINT "archivos_modelos_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "modelos_3d"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transformaciones_modelos" ADD CONSTRAINT "transformaciones_modelos_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "modelos_3d"("id") ON DELETE CASCADE ON UPDATE CASCADE;
