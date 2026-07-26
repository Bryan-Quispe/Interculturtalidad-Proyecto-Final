# Sprint 3 - Búsqueda, ubicación, fotografías y cartel

## Ficha

| Campo | Descripción |
| --- | --- |
| Sprint Goal | Convertir la ficha de mascota en una herramienta útil para búsqueda y difusión. |
| Puntos aceptados | 33 |
| Historias | HU-13 a HU-18 |
| Estado | Completado |

## Historias seleccionadas

- Carga de varias fotografías.
- Selección de último lugar mediante Google Maps.
- Protección de ubicación exacta.
- Catálogo 3D filtrado por especie.
- Visualización 3D interactiva.
- Exportación inicial de cartel PDF.

## Sprint Backlog técnico

| Tarea | Resultado |
| --- | --- |
| Añadir fotos y datos del último avistamiento. | Ficha orientada a búsqueda. |
| Integrar Google Places, mapa y geocodificación. | Selección tipo entrega a domicilio. |
| Restringir autocompletado y validar país `EC`. | Ubicación consistente. |
| Cachear selección geográfica temporalmente. | Menos consultas repetidas. |
| Sincronizar modelos de carpetas por especie. | Catálogo inicial. |
| Cargar GLB, GLTF y OBJ en Three.js. | Referencia 3D visible. |
| Capturar escena y generar PDF A4. | Cartel descargable. |
| Ajustar imágenes con `object-contain`. | Fotografías completas, sin recorte. |

## Criterios de aceptación

- El mapa permite buscar o seleccionar una zona de Ecuador.
- Una ubicación extranjera es rechazada.
- La vista pública y el PDF muestran zona aproximada.
- Un gato no puede seleccionar modelos de perro o conejo.
- Las fotos conservan su proporción.
- El cartel incluye contacto, zona, último avistamiento y referencia 3D.

## Incremento

El producto ya permite registrar evidencia, localizar aproximadamente el evento y generar un documento compartible. Se completa el flujo mínimo viable de búsqueda.

## Review técnica

Demostración sugerida: crear una mascota con dos fotos, seleccionar una zona en Quito, asignar un modelo compatible, acomodar la vista y descargar el PDF.

## Retrospectiva técnica

| Observación | Acción aplicada al Sprint 4 |
| --- | --- |
| Un modelo genérico no siempre representa marcas particulares. | Añadir pintura sobre textura. |
| Rotar mientras se pinta provoca errores. | Separar explícitamente los modos. |
| Exportar directamente ofrece poco control. | Crear editor y vista previa del cartel. |

## Evidencia recomendada

- Mapa con ubicación válida.
- Mensaje al intentar seleccionar otro país.
- Selector de modelos por categoría.
- PDF exportado y captura de la escena 3D.

