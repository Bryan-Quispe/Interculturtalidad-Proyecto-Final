-- Números de contacto adicionales.
--
-- Buscar una mascota perdida no lo hace una sola persona: participan la
-- familia, los vecinos y a veces la directiva del barrio. Con un único número,
-- si quien contesta está trabajando o se queda sin batería, el aviso de alguien
-- que vio al animal se pierde. El primer número sigue en telefonoContacto para
-- no romper las fichas ya registradas.

-- AlterTable
ALTER TABLE "animales" ADD COLUMN IF NOT EXISTS "telefonos" JSONB;
