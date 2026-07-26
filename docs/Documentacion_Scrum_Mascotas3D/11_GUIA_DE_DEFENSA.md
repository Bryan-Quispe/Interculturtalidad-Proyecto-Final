# Guía de defensa del proyecto

## Exposición de 8 a 10 minutos

### 1. Problema y visión - 1 minuto

“Mascotas 3D organiza la búsqueda de mascotas perdidas. Centraliza propietario, fotografías, zona aproximada y una guía 3D, y genera un cartel sin revelar coordenadas exactas.”

### 2. Por qué Scrum - 1 minuto

“El producto tenía incertidumbre técnica en mapas, archivos 3D y PDF. Scrum permitió entregar primero identidad y datos, después gestión, luego búsqueda y finalmente personalización.”

### 3. Evolución de sprints - 2 minutos

- Sprint 1: autenticación, roles y PostgreSQL.
- Sprint 2: mascotas por propietario y administración.
- Sprint 3: fotos, mapa, catálogo 3D y PDF.
- Sprint 4: pintura UV y editor previo del cartel.

### 4. Demostración - 3 minutos

1. Iniciar sesión.
2. Abrir una mascota existente.
3. Mostrar propietario, fotografías y zona.
4. Abrir el modelo y alternar Rotar, Zoom y Pintar.
5. Pintar un detalle y explicar las coordenadas UV.
6. Preparar el cartel, elegir portada y orden.
7. Descargar el PDF y revisar nombre, fecha y hora.

### 5. Calidad y seguridad - 1 minuto

“La API aplica JWT, roles y propiedad de registros. Google Maps restringe Ecuador. El PDF no exporta coordenadas, limita imágenes y normaliza el nombre del archivo. El frontend pasa TypeScript y build.”

### 6. Cierre - 1 minuto

“El incremento cumple el flujo principal. Las mejoras futuras son estados de búsqueda, notificaciones, validación automática de UV, pruebas E2E y moderación.”

## Preguntas frecuentes

### ¿Por qué usar un modelo 3D si existen fotografías?

El modelo no reemplaza la fotografía. Sirve para destacar marcas, colores o zonas del cuerpo y observar la referencia desde varios ángulos.

### ¿La pintura es una capa flotante?

No. El raycasting obtiene el punto de la malla y sus coordenadas UV; el trazo se dibuja en un `CanvasTexture` asociado al material.

### ¿Por qué guardar trazos y no modificar el GLB original?

Para conservar el recurso base, permitir deshacer y reconstruir personalizaciones sin duplicar binarios pesados.

### ¿Cómo se protege la ubicación?

La aplicación valida Ecuador y utiliza una zona aproximada para la publicación. El cartel omite latitud y longitud.

### ¿Qué significa que una historia está Done?

Está integrada, compila, cumple criterios de aceptación, respeta permisos y puede demostrarse.

### ¿Qué adaptación de Scrum se utilizó?

Un proyecto académico con responsable principal. Las responsabilidades Scrum se aplican, pero las actas y participantes solo se registran cuando existen evidencias reales.

