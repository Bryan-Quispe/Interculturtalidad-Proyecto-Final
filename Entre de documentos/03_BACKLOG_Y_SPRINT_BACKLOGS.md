# Product Backlog y Sprint Backlogs

## 1. Priorización

Se aplicó MoSCoW:

- **Must:** indispensable para cumplir el objetivo.
- **Should:** importante, pero no bloquea el MVP si falta.
- **Could:** deseable para evolución futura.

Los puntos representan complejidad relativa, no horas.

## 2. Product Backlog funcional

| ID | Historia resumida | Prioridad | Sprint | Estado |
| --- | --- | --- | ---: | --- |
| HU-01 | Crear cuenta para administrar mascotas. | Must | 1 | Completada |
| HU-02 | Iniciar sesión de forma segura. | Must | 1 | Completada |
| HU-03 | Proteger rutas mediante JWT. | Must | 1 | Completada |
| HU-04 | Diferenciar rol de administrador. | Must | 1 | Completada |
| HU-05 | Persistir datos con Prisma y PostgreSQL. | Must | 1 | Completada |
| HU-06 | Interfaz web adaptable. | Should | 1 | Completada |
| HU-07 | Registrar mascota. | Must | 2 | Completada |
| HU-08 | Elegir especie: perro, gato o conejo. | Must | 2 | Completada |
| HU-09 | Registrar características de identificación. | Must | 2 | Completada |
| HU-10 | Editar y eliminar mascotas propias. | Must | 2 | Completada |
| HU-11 | Consultar solo registros propios. | Must | 2 | Completada |
| HU-12 | Administrar y filtrar registros. | Must | 2 | Completada |
| HU-13 | Cargar varias fotografías reales. | Must | 3 | Completada |
| HU-14 | Seleccionar último lugar mediante mapa. | Must | 3 | Completada |
| HU-15 | Publicar solo zona aproximada. | Must | 3 | Completada |
| HU-16 | Filtrar modelos 3D por especie. | Must | 3 | Completada |
| HU-17 | Visualizar y acomodar modelo 3D. | Must | 3 | Completada |
| HU-18 | Exportar ficha PDF de búsqueda. | Must | 3 | Completada |
| HU-19 | Separar modos rotar, zoom y pintar. | Must | 4 | Completada |
| HU-20 | Pintar rasgos sobre textura original. | Must | 4 | Completada |
| HU-21 | Usar tamaños, colores y deshacer. | Should | 4 | Completada |
| HU-22 | Decidir si se comparte un modelo editado. | Should | 4 | Completada |
| HU-23 | Editar y previsualizar cartel. | Must | 4 | Completada |
| HU-24 | Elegir portada, orden y formato de fotos. | Must | 4 | Completada |
| HU-25 | Generar nombre de PDF identificable y seguro. | Should | 4 | Completada |

## 3. Épica transversal intercultural

La capa intercultural se incorporó como épica transversal porque atraviesa toda la solución y responde al criterio de mayor peso de la rúbrica.

| ID | Historia resumida | Prioridad | Sprint relacionado | Estado |
| --- | --- | --- | ---: | --- |
| HU-26 | Arquitectura de traducción tipada. | Must | 2 | Completada |
| HU-27 | Cambiar idioma antes de iniciar sesión. | Must | 2 | Completada |
| HU-28 | Traducir datos ya guardados de listas cerradas. | Must | 3 | Completada |
| HU-29 | Modo bilingüe kichwa-castellano. | Should | 4 | Completada |
| HU-30 | Generar cartel PDF en idioma elegido. | Must | 4 | Completada |
| HU-31 | Documentar cada término con fuente. | Must | 4 | Completada |

## 4. Sprint Backlog 1 - Base técnica y autenticación

**Fechas:** 24 de mayo - 6 de junio de 2026  
**Meta:** crear la base ejecutable del sistema.

**Historias:** HU-01 a HU-06.

**Entregables:**

- Proyecto frontend y backend.
- Base PostgreSQL con Prisma.
- Registro e inicio de sesión.
- JWT.
- Roles.
- Estructura visual inicial.

**Criterio de aceptación del sprint:** un usuario puede registrarse, iniciar sesión y acceder a una interfaz protegida.

## 5. Sprint Backlog 2 - Gestión de mascotas

**Fechas:** 7 de junio - 20 de junio de 2026  
**Meta:** permitir que el usuario registre y gestione sus mascotas.

**Historias:** HU-07 a HU-12 y base de HU-26/HU-27.

**Entregables:**

- CRUD de mascotas.
- Relación mascota-propietario.
- Dashboard.
- Vista administrativa.
- Primeras estructuras de traducción.

**Criterio de aceptación del sprint:** cada usuario gestiona sus registros y el administrador accede a la vista global.

## 6. Sprint Backlog 3 - Búsqueda, fotos, mapa, 3D y PDF

**Fechas:** 21 de junio - 11 de julio de 2026  
**Meta:** convertir el registro en una herramienta real de búsqueda.

**Historias:** HU-13 a HU-18 y HU-28.

**Entregables:**

- Fotos reales.
- Mapa y zona aproximada.
- Catálogo 3D por especie.
- Visor 3D.
- Cartel PDF.
- Traducción de datos guardados de listas cerradas.

**Criterio de aceptación del sprint:** el usuario puede generar un cartel legible y seguro sin publicar coordenadas exactas.

## 7. Sprint Backlog 4 - Interculturalidad, pintura 3D y cierre

**Fechas:** 12 de julio - 25 de julio de 2026  
**Meta:** cerrar el producto con valor intercultural, mejora visual y documentación de entrega.

**Historias:** HU-19 a HU-25 y HU-29 a HU-31.

**Entregables:**

- Modo bilingüe.
- Cartel PDF por idioma.
- Glosario kichwa con fuentes.
- Pintura sobre modelo.
- Publicación privada o comunitaria de modelos editados.
- Documentación final.

**Criterio de aceptación del sprint:** el incremento puede demostrarse completo y el enfoque intercultural queda integrado al flujo central.

## 8. Backlog futuro

| ID | Mejora | Prioridad sugerida |
| --- | --- | --- |
| BF-01 | Estados de búsqueda: perdida, encontrada y cerrada. | Must |
| BF-02 | Notificaciones de avistamientos. | Should |
| BF-03 | Pruebas E2E automatizadas. | Must |
| BF-04 | Moderación de modelos públicos. | Should |
| BF-05 | Validación del glosario con hablantes nativos. | Must |

