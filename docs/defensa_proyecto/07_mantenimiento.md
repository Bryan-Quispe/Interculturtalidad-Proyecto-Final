# Mantenimiento

El mantenimiento define como se conservara y mejorara el sistema despues de la entrega.

## Mantenimiento correctivo

Corrige errores detectados durante el uso.

Ejemplos:

- Arreglar fallos de autenticacion.
- Corregir errores de visualizacion en formularios.
- Solucionar problemas al exportar PDF.
- Corregir modelos 3D que no cargan.
- Ajustar selectores con bajo contraste visual.

## Mantenimiento adaptativo

Ajusta el sistema cuando cambian dependencias, servicios o requisitos externos.

Ejemplos:

- Actualizar Next.js, NestJS o Prisma.
- Cambiar configuracion de Cloudinary.
- Actualizar clave de Google Maps.
- Adaptar el sistema a nuevas categorias de animales.
- Cambiar reglas de privacidad por nuevas politicas institucionales.

## Mantenimiento preventivo

Evita que aparezcan problemas futuros.

Ejemplos:

- Revisar vulnerabilidades con `npm audit`.
- Optimizar imagenes y modelos 3D.
- Mantener `.env.example` actualizado.
- Documentar endpoints nuevos.
- Validar tamanos maximos de archivos.
- Respaldar la base de datos.

## Mantenimiento perfectivo

Mejora el sistema aunque no exista un error.

Ejemplos:

- Agregar pintura real sobre textura original del modelo 3D.
- Mejorar busqueda por zona.
- Agregar filtros publicos por especie.
- Agregar estados de mascota: perdida, encontrada, en seguimiento.
- Mejorar plantilla visual del PDF.
- Agregar notificaciones.

## Plan de mantenimiento sugerido

| Frecuencia | Actividad |
| --- | --- |
| Semanal | Revisar errores reportados y validar flujo de registro. |
| Quincenal | Revisar dependencias y vulnerabilidades. |
| Mensual | Respaldar base de datos y revisar rendimiento. |
| Por entrega | Compilar frontend/backend y validar PDF con datos reales. |

## Indicadores de mantenimiento

- Numero de errores reportados.
- Tiempo promedio para corregir defectos.
- Cantidad de PDFs generados correctamente.
- Tiempo de carga de modelos 3D.
- Porcentaje de mascotas con informacion completa.

## Recomendaciones

- No guardar claves sensibles en el codigo fuente.
- Mantener variables de entorno en archivos `.env`.
- Controlar el tamano maximo de imagenes y modelos.
- Separar claramente datos privados y datos publicos.
- Documentar cada cambio importante por sprint o version.
