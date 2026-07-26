# Matriz de trazabilidad

## 1. Requisito, historia, sprint y evidencia técnica

| Requisito | Historia | Sprint | Componente o evidencia |
| --- | --- | ---: | --- |
| RF-01, RF-02 | HU-01, HU-02 | 1 | `auth.controller`, `auth.service`, login y registro |
| RF-03 | HU-03, HU-04 | 1 | `JwtAuthGuard`, `RolesGuard`, enum `Role` |
| RF-04, RF-05 | HU-07, HU-10, HU-11 | 2 | módulo `animales`, relación `Animal.usuarioId` |
| RF-06 | HU-08 | 2 | enum `CategoriaAnimal` y selector controlado |
| RF-07 | HU-09 | 2 | `CaracteristicasAnimal` y `AddAnimalForm` |
| RF-08, RF-09 | HU-13 | 3 | `fotos`, `telefonoContacto`, `fechaVisto` |
| RF-10, RF-11 | HU-14, HU-15 | 3 | `GoogleLocationInput`, validación `EC` y caché |
| RF-12 | HU-15 | 3 | endpoint `/animales/publicos` |
| RF-13, RF-14 | HU-12 | 2 | vista admin, `getAnimals` y filtro de propietario |
| RF-15, RF-16 | HU-16 | 3 | `Modelos3DService`, catálogo por categoría |
| RF-17 | HU-17 | 3 | `Canvas3DViewer`, loaders GLTF/OBJ/MTL |
| RF-18 | HU-19 | 4 | `ViewerInteractionMode` |
| RF-19, RF-21 | HU-20 | 4 | `CanvasTexture`, UV, `surfaceId`, campo `pinturas` |
| RF-20 | HU-21 | 4 | `EditModelForm`, tamaños y paleta |
| RF-22 | HU-22 | 4 | `isPublico` y confirmación de publicación |
| RF-23 | HU-23 | 4 | `PetPosterEditor` |
| RF-24 | HU-24 | 4 | selección, orden, portada y `galleryLayout` |
| RF-25 | HU-25 | 4 | `pet-report.ts`, `safeFileName`, `fileTimestamp` |

## 2. Cobertura

- Requisitos funcionales documentados: 25.
- Requisitos relacionados con historias: 25.
- Historias asignadas a sprint: 25.
- Historias marcadas como completadas: 25.

La cobertura documental indica que cada requisito tiene una ruta de implementación identificable. No reemplaza la ejecución de casos de prueba.

## 3. Control de cambios

Cuando cambie un requisito deben revisarse, como mínimo:

1. Historia y criterios de aceptación.
2. Sprint o backlog futuro.
3. Componente relacionado.
4. Caso de prueba.
5. Riesgo de seguridad o privacidad.
6. Manual y guía de defensa.

