# Sprint 4 - Edición 3D y cierre del producto

## Ficha

| Campo | Descripción |
| --- | --- |
| Sprint Goal | Personalizar la referencia 3D y ofrecer control completo sobre el cartel final. |
| Puntos aceptados | 37 |
| Historias | HU-19 a HU-25 |
| Estado | Completado |

## Historias seleccionadas

- Modos separados de rotación, zoom y pintura.
- Pintura directa sobre la textura original.
- Lápiz, pincel, brocha, color, deshacer y limpiar.
- Visibilidad pública o privada.
- Edición y previsualización del cartel.
- Selección, orden, portada y distribución de fotografías.
- Nombre seguro del PDF con fecha y hora.

## Sprint Backlog técnico

| Tarea | Resultado |
| --- | --- |
| Sustituir marcas 3D flotantes. | Pintura mediante `CanvasTexture`. |
| Usar raycasting y coordenadas UV. | Trazo adherido a la superficie. |
| Guardar `surfaceId`, UV, color y tamaño. | Reconstrucción persistente. |
| Interpolar puntos del pincel. | Línea continua con movimientos rápidos. |
| Crear modos exclusivos. | Rotar, zoom y pintar sin interferencia. |
| Crear `PetPosterEditor`. | Formulario y vista previa A4. |
| Seleccionar y ordenar imágenes. | Control de portada y galería. |
| Validar teléfono, zona, imagen y límites. | Exportación más segura. |
| Nombrar el archivo con fecha y hora. | Descarga identificable. |

## Criterios de aceptación

- Pintar no rota ni acerca el modelo.
- Rotar y zoom muestran estado activo diferente.
- La pintura modifica el mapa de textura, no una geometría superpuesta.
- La textura original permanece visible.
- El usuario puede deshacer o limpiar trazos.
- El editor del cartel se completa automáticamente.
- Se puede editar texto, elegir portada, ordenar fotos y decidir distribución.
- El PDF no contiene coordenadas exactas.
- El nombre sigue `se-busca-mascota-AAAAMMDD-HHMMSS.pdf`.

## Incremento

El cuarto incremento cierra el flujo con una personalización 3D utilizable y una etapa de preparación antes de descargar. El propietario controla la información y las imágenes que comparte.

## Review técnica

Demostración sugerida: abrir un modelo texturizado, alternar Rotar/Zoom/Pintar, añadir una marca, guardar, reabrir y preparar un PDF seleccionando otra foto como portada.

## Retrospectiva técnica

| Observación | Mejora futura |
| --- | --- |
| Algunos modelos carecen de UV adecuadas. | Validar archivos al cargarlos. |
| Guardar trazos reconstruye la textura, pero no exporta un GLB nuevo. | Evaluar horneado de textura y exportación GLB. |
| El flujo depende de servicios externos. | Añadir pruebas E2E y alternativas controladas. |

## Evidencia recomendada

- Comparación entre textura original y personalizada.
- Capturas de los tres modos activos.
- Vista previa del cartel.
- PDF con nombre, fecha y hora.
- Resultado de `npm run type-check` y `npm run build`.

