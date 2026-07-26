-- AlterTable
ALTER TABLE "modelos_3d" ADD COLUMN     "derivadoDeId" TEXT;

-- CreateIndex
CREATE INDEX "modelos_3d_derivadoDeId_idx" ON "modelos_3d"("derivadoDeId");

-- AddForeignKey
ALTER TABLE "modelos_3d" ADD CONSTRAINT "modelos_3d_derivadoDeId_fkey" FOREIGN KEY ("derivadoDeId") REFERENCES "modelos_3d"("id") ON DELETE SET NULL ON UPDATE CASCADE;

