# Product Backlog

## 1. Criterio de priorización

Se emplea MoSCoW: `Must` es imprescindible para el objetivo del producto; `Should` agrega valor importante; `Could` es deseable. Los puntos representan complejidad relativa, no horas.

| ID | Historia de usuario resumida | Prioridad | Puntos | Sprint | Estado |
| --- | --- | --- | ---: | ---: | --- |
| HU-01 | Como visitante quiero crear una cuenta para administrar mascotas. | Must | 3 | 1 | Completada |
| HU-02 | Como usuario quiero iniciar sesión de forma segura. | Must | 5 | 1 | Completada |
| HU-03 | Como sistema quiero proteger rutas mediante JWT. | Must | 5 | 1 | Completada |
| HU-04 | Como administrador quiero un rol diferenciado. | Must | 3 | 1 | Completada |
| HU-05 | Como equipo quiero persistencia relacional mediante Prisma. | Must | 5 | 1 | Completada |
| HU-06 | Como usuario quiero una interfaz web adaptable. | Should | 3 | 1 | Completada |
| HU-07 | Como usuario quiero registrar una mascota. | Must | 5 | 2 | Completada |
| HU-08 | Como usuario quiero elegir perro, gato o conejo. | Must | 3 | 2 | Completada |
| HU-09 | Como usuario quiero registrar características de identificación. | Must | 3 | 2 | Completada |
| HU-10 | Como usuario quiero editar y eliminar mis mascotas. | Must | 5 | 2 | Completada |
| HU-11 | Como usuario quiero consultar únicamente mis registros. | Must | 3 | 2 | Completada |
| HU-12 | Como administrador quiero consultar y filtrar todas las mascotas. | Must | 5 | 2 | Completada |
| HU-13 | Como usuario quiero cargar varias fotografías reales. | Must | 5 | 3 | Completada |
| HU-14 | Como usuario quiero seleccionar el último lugar mediante un mapa. | Must | 5 | 3 | Completada |
| HU-15 | Como propietario quiero publicar solo una zona aproximada. | Must | 5 | 3 | Completada |
| HU-16 | Como usuario quiero modelos filtrados según la especie. | Must | 5 | 3 | Completada |
| HU-17 | Como usuario quiero visualizar y acomodar un modelo 3D. | Must | 8 | 3 | Completada |
| HU-18 | Como usuario quiero exportar una ficha PDF de búsqueda. | Must | 5 | 3 | Completada |
| HU-19 | Como usuario quiero modos separados para rotar, acercar y pintar. | Must | 5 | 4 | Completada |
| HU-20 | Como usuario quiero pintar rasgos sobre la textura original. | Must | 8 | 4 | Completada |
| HU-21 | Como usuario quiero distintos tamaños, colores y deshacer. | Should | 5 | 4 | Completada |
| HU-22 | Como usuario quiero decidir si comparto mi modelo. | Should | 3 | 4 | Completada |
| HU-23 | Como usuario quiero editar y previsualizar el cartel. | Must | 8 | 4 | Completada |
| HU-24 | Como usuario quiero elegir portada, orden y formato de fotos. | Must | 5 | 4 | Completada |
| HU-25 | Como usuario quiero un nombre de PDF identificable y seguro. | Should | 3 | 4 | Completada |

## 2. Criterios de aceptación destacados

### HU-14 - Selección mediante mapa

- El formulario muestra un mapa centrado en Quito.
- El usuario puede buscar o seleccionar una zona.
- Solo se aceptan resultados de Ecuador.
- Se guarda una descripción de zona y la referencia geográfica interna.

### HU-20 - Pintura sobre textura

- La textura original permanece visible.
- El trazo se calcula con la intersección de la malla y sus coordenadas UV.
- La pintura no se representa mediante geometría flotante.
- Los trazos guardados reaparecen al abrir el modelo.

### HU-23 y HU-24 - Preparación del cartel

- Los datos se rellenan desde la mascota.
- Los cambios del editor no modifican la ficha guardada.
- El usuario elige imágenes, orden, portada y distribución.
- Existe una vista previa A4 antes de descargar.
- No se exportan coordenadas exactas.

## 3. Backlog futuro

| ID | Mejora | Prioridad sugerida |
| --- | --- | --- |
| BF-01 | Notificaciones de nuevos avistamientos. | Should |
| BF-02 | Estados `PERDIDA`, `ENCONTRADA` y `CERRADA`. | Must |
| BF-03 | Pruebas automatizadas E2E en integración continua. | Must |
| BF-04 | Exportación del modelo personalizado como GLB. | Could |
| BF-05 | Moderación de modelos públicos. | Should |

