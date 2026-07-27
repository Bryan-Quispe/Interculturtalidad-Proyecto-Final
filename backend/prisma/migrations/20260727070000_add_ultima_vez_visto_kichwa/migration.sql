-- La referencia del último avistamiento ("En el parque cerca del UPC
-- Beaterio") es texto libre y quedaba siempre en castellano, aunque la ficha
-- entera se mirase en kichwa. Se le da su columna, como ya tiene la
-- descripción, para que su autor pueda escribirla en las dos lenguas.

-- AlterTable
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "ultimaVezVistoKw" TEXT;
