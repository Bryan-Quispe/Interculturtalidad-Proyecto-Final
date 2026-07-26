# Arquitectura y diseño técnico

## 1. Vista de contexto

```mermaid
flowchart LR
    V["Visitante"] --> WEB["Frontend Next.js"]
    U["Usuario"] --> WEB
    A["Administrador"] --> WEB
    WEB --> API["API REST NestJS"]
    API --> ORM["Prisma ORM"]
    ORM --> DB["PostgreSQL"]
    WEB --> MAPS["Google Maps"]
    WEB --> PDF["jsPDF"]
    WEB --> THREE["Three.js / WebGL"]
    API --> FILES["Archivos e imágenes"]
```

## 2. Capas

| Capa | Responsabilidad | Componentes principales |
| --- | --- | --- |
| Presentación | Interacción, formularios, mapa, 3D y vista previa. | Next.js, React, Tailwind y Zustand |
| Comunicación | Consumo tipado de endpoints. | Axios y cliente `api.ts` |
| Aplicación | Casos de uso, permisos y validación. | Módulos NestJS |
| Dominio | Usuarios, mascotas, características y modelos. | Servicios y DTO |
| Persistencia | Relaciones y consultas. | Prisma y PostgreSQL |

## 3. Módulos backend

- `auth`: registro, login, bcrypt y JWT.
- `users`: perfil del usuario.
- `animales`: CRUD, propiedad, consulta pública y administración.
- `modelos3d`: catálogo, categoría, archivo, edición y visibilidad.
- `common`: Prisma, guards, decoradores y configuración transversal.

## 4. Componentes frontend relevantes

| Componente | Responsabilidad |
| --- | --- |
| `AddAnimalForm` | Registro y actualización de mascota. |
| `GoogleLocationInput` | Búsqueda, mapa, geocodificación y validación de Ecuador. |
| `ModelSelector` | Filtrado de modelos por categoría. |
| `Canvas3DViewer` | Carga de modelos, cámara, raycasting y pintura UV. |
| `EditModelForm` | Modos 3D, herramientas y publicación. |
| `PetPosterEditor` | Edición, selección de imágenes y vista previa A4. |
| `pet-report.ts` | Composición y descarga segura del PDF. |

## 5. Modelo de datos

```mermaid
erDiagram
    User ||--o{ Animal : posee
    User ||--o{ Modelo3D : crea
    Animal ||--o| CaracteristicasAnimal : describe
    Modelo3D ||--o| ArchivoModelo : contiene
    Modelo3D ||--o| TransformacionesModelo : configura
    Modelo3D ||--o{ Animal : referencia
```

## 6. Flujo de cartel

```mermaid
sequenceDiagram
    actor Usuario
    participant Ficha
    participant API
    participant Editor
    participant PDF
    Usuario->>Ficha: Abrir mascota
    Ficha->>API: Solicitar datos actualizados
    API-->>Ficha: Mascota, fotos y modelo
    Ficha->>Editor: Abrir configuración automática
    Usuario->>Editor: Editar texto, fotos, orden y portada
    Editor->>PDF: Confirmar borrador validado
    PDF-->>Usuario: Descargar archivo con fecha y hora
```

## 7. Decisiones técnicas

- La pintura se guarda como trazos UV para conservar el modelo base.
- Los modos de cámara y pintura son mutuamente excluyentes para evitar acciones accidentales.
- El PDF se genera en el navegador para ofrecer previsualización inmediata.
- El servidor conserva autorización y propiedad; la interfaz no es la única barrera.
- La ubicación exacta puede apoyar lógica interna, pero no se imprime en el cartel.

