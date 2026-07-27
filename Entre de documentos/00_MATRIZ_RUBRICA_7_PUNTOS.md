# Matriz de rúbrica - 7 puntos

## Objetivo

Esta matriz traduce la rúbrica de la evaluación final en evidencias concretas del proyecto **Mascotas 3D - Wasi Wiwakuna 3D**. La meta es que, durante la entrega, cada criterio tenga un documento, una demostración y una respuesta técnica asociada.

## Resumen de criterios

| Criterio | Puntaje | Evidencia preparada | Cómo defenderlo |
| --- | ---: | --- | --- |
| Solución tecnológica con enfoque intercultural | 3.00 | Plataforma bilingüe kichwa-castellano, cartel PDF bilingüe, glosario con fuentes, modelos 3D pintables. | Explicar que la lengua kichwa no es una pantalla extra: atraviesa interfaz, datos guardados, cartel y experiencia de búsqueda. |
| Proceso de desarrollo e Ingeniería de Software | 2.00 | Scrum del 24 de mayo al 25 de julio de 2026, 4 sprints, backlog, bitácora, reviews, retrospectivas, Definition of Done. | Mostrar planificación, seguimiento, control, evolución y decisiones tomadas por inspección del incremento. |
| Calidad técnica de la solución | 1.00 | Arquitectura Next.js + NestJS + PostgreSQL, JWT, roles, Cloudinary desde backend, privacidad de ubicación, validaciones, pruebas críticas. | Demostrar flujo completo y explicar decisiones de seguridad, accesibilidad básica, estabilidad y privacidad. |
| Presentación y defensa técnica | 1.00 | Guion de exposición, preguntas frecuentes, checklist de demo, participación y explicación técnica. | Responder qué problema resuelve, por qué Scrum, qué cambió en cada sprint y cómo funciona lo técnico. |

## Criterio 1 - Solución tecnológica con enfoque intercultural (3 puntos)

**Evidencias principales:**

- Interfaz en castellano, kichwa y modo bilingüe.
- Preferencia de idioma persistente.
- Cartel PDF generado en el idioma seleccionado.
- Traducción de listas cerradas de color, tamaño, raza, especie y rasgos.
- Glosario kichwa con fuentes y norma ALKI.
- Respeto al texto libre escrito por el usuario: no se traduce automáticamente.
- Modelos 3D pintables para representar señas visibles de la mascota.

**Argumento para nivel excelente:**

La interculturalidad está integrada al propósito del sistema porque ayuda a que una búsqueda de mascota perdida pueda difundirse en comunidades donde el castellano no siempre es la lengua principal. El sistema no solo traduce etiquetas: permite producir el cartel de búsqueda en kichwa o bilingüe y prioriza la lengua originaria en el modo `kichwa - castellano`.

## Criterio 2 - Proceso de desarrollo e Ingeniería de Software (2 puntos)

**Evidencias principales:**

- Cronograma de 9 semanas.
- 4 sprints con metas, historias, entregables y Definition of Done.
- Product Backlog con prioridad MoSCoW.
- Sprint Backlogs por incremento.
- Bitácora de seguimiento.
- Sprint Reviews y Sprint Retrospectives.
- Registro de impedimentos y adaptaciones.
- Nota honesta sobre Git: el historial fue incorporado al cierre y no se usa como evidencia cronológica principal.

**Argumento para nivel excelente:**

El proceso evidencia planificación, seguimiento, control y evolución. Se pueden mostrar cambios concretos nacidos de inspección: separación entre zona pública y coordenadas internas, traslado de Cloudinary al backend, traducción de datos ya guardados sin migrar la base, y creación de copias propias de modelos editados para no dañar el catálogo común.

## Criterio 3 - Calidad técnica de la solución (1 punto)

**Evidencias principales:**

- Arquitectura separada: frontend Next.js, backend NestJS, base PostgreSQL con Prisma.
- API REST con autenticación JWT.
- Roles `USER` y `ADMIN`.
- Validaciones por formulario.
- Flujo de fotos con Cloudinary desde el servidor.
- Mapa restringido a Ecuador y publicación solo de zona aproximada.
- Editor de cartel con vista previa A4.
- PDF sin latitud ni longitud.
- TypeScript y builds como verificación técnica.

**Argumento para nivel excelente:**

La calidad se defiende demostrando un flujo completo: registro, inicio de sesión, creación de mascota, fotos, ubicación, modelo 3D, pintura de rasgos, edición del cartel y descarga del PDF. Además, se explica que la privacidad fue una decisión de diseño y no un parche final.

## Criterio 4 - Presentación y defensa técnica (1 punto)

**Evidencias principales:**

- Guion de exposición de 8 a 10 minutos.
- Preguntas frecuentes y respuestas.
- Checklist de demostración.
- Documentación de decisiones técnicas y evolución por sprint.

**Argumento para nivel excelente:**

La exposición debe conectar cuatro ideas: problema real, solución funcional, valor intercultural y proceso Scrum. Cada integrante, si aplica, debe dominar al menos una parte: producto, interculturalidad, backend, frontend, pruebas o Scrum.

## Orden recomendado para subir

1. Código fuente del proyecto.
2. Presentación.
3. `DOCUMENTACION_COMPLETA_MASCOTAS_3D_SCRUM.pdf`.
4. Anexos Scrum y calidad.
5. Repositorio o enlace de despliegue, si aplica.

