# Componentes implementados y evidencia de código

## Frontend

| Capacidad | Archivo principal | Evidencia |
| --- | --- | --- |
| Dashboard y permisos visuales | `frontend/src/app/dashboard/page.tsx` | Selección de datos según rol y gestión del flujo. |
| Alta y edición de mascotas | `frontend/src/components/AddAnimalForm.tsx` | Formulario, categorías, fotos y características. |
| Ubicación | `frontend/src/components/GoogleLocationInput.tsx` | Mapa, Places, geocodificación, país `EC` y caché. |
| Selección 3D | `frontend/src/components/ModelSelector.tsx` | Catálogo compatible con la especie. |
| Visualización y pintura | `frontend/src/components/Canvas3DViewer.tsx` | GLTF/OBJ, cámara, raycasting, UV y `CanvasTexture`. |
| Herramientas 3D | `frontend/src/components/EditModelForm.tsx` | Rotar, zoom, pintar, paleta y visibilidad. |
| Preparación del cartel | `frontend/src/components/PetPosterEditor.tsx` | Edición, selección, orden y vista previa. |
| Generación PDF | `frontend/src/lib/pet-report.ts` | A4, imágenes, privacidad y nombre fechado. |

## Backend

| Capacidad | Módulo | Evidencia |
| --- | --- | --- |
| Identidad y sesión | `backend/src/modules/auth` | Registro, login, JWT y bcrypt. |
| Perfil | `backend/src/modules/users` | Datos del usuario autenticado. |
| Mascotas | `backend/src/modules/animales` | CRUD, propiedad, consulta pública y administración. |
| Modelos 3D | `backend/src/modules/modelos3d` | Catálogo, carga, categoría, edición y visibilidad. |
| Autorización | `backend/src/common/guards` | JWT y roles. |
| Persistencia | `backend/prisma/schema.prisma` | Entidades y relaciones. |

## Persistencia

| Entidad | Finalidad |
| --- | --- |
| `User` | Identidad, rol y relaciones. |
| `Animal` | Registro de búsqueda y propietario. |
| `CaracteristicasAnimal` | Rasgos descriptivos. |
| `Modelo3D` | Categoría, trazos y visibilidad. |
| `ArchivoModelo` | Metadatos del recurso 3D. |
| `TransformacionesModelo` | Escala, rotación y posición. |

## Evidencia de implementación

- Backend compilado el 19 de julio de 2026 con código de salida 0.
- Frontend compilado el 19 de julio de 2026 con código de salida 0.
- Comprobación TypeScript del frontend con código de salida 0.
- Veinticinco requisitos funcionales vinculados con componentes.

