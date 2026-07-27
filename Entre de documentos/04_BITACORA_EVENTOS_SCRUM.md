# Bitácora y eventos Scrum

## 1. Propósito

Esta bitácora evidencia seguimiento, control y evolución del proyecto durante el periodo **24 de mayo de 2026 al 25 de julio de 2026**. En un proyecto académico, el Daily Scrum se documentó como seguimiento breve de avance, impedimentos y siguiente acción.

## 2. Resumen semanal

| Semana | Fechas | Foco | Avance registrado | Riesgo o impedimento | Acción tomada |
| --- | --- | --- | --- | --- | --- |
| 1 | 24 - 30 mayo | Inicio y arquitectura | Estructura frontend/backend y base de datos inicial. | Definir stack estable. | Se eligió Next.js, NestJS, PostgreSQL y Prisma. |
| 2 | 31 mayo - 6 junio | Autenticación | Registro, login, JWT y roles. | Control de rutas privadas. | Guards y validación por rol. |
| 3 | 7 - 13 junio | Mascotas | CRUD inicial y relación con propietario. | Evitar acceso a registros ajenos. | Consultas filtradas por usuario autenticado. |
| 4 | 14 - 20 junio | Administración | Dashboard, filtros y características. | Organizar datos de especie, raza, color y tamaño. | Listas cerradas para datos traducibles. |
| 5 | 21 - 27 junio | Fotos y mapa | Subida de imágenes y selección de zona. | No exponer ubicación exacta. | Zona pública aproximada y coordenadas internas. |
| 6 | 28 junio - 4 julio | Modelos 3D | Catálogo por especie y visor. | Carga y visualización de recursos 3D. | Filtro por categoría y controles de visor. |
| 7 | 5 - 11 julio | PDF | Cartel con fotos, datos y vista 3D. | PDF con imágenes cortadas o datos sensibles. | Ajuste de proporciones y exclusión de latitud/longitud. |
| 8 | 12 - 18 julio | Interculturalidad | Modo kichwa, castellano y bilingüe. | Traducir datos ya existentes. | `translateStored()` para listas cerradas. |
| 9 | 19 - 25 julio | Cierre | Pintura 3D, editor de cartel, pruebas y documentación. | Pintura desalineada y evidencia del proceso. | Pintura por UV, copias de modelos y documentación final. |

## 3. Sprint Planning

| Sprint | Decisión principal | Criterio de entrada |
| --- | --- | --- |
| 1 | Comenzar por identidad, base y seguridad. | Sin autenticación no había control de usuarios ni propiedad de datos. |
| 2 | Implementar gestión de mascotas antes de búsqueda pública. | El producto necesita datos propios antes de difundirlos. |
| 3 | Concentrar integraciones: fotos, mapa, 3D y PDF. | Es el núcleo funcional de la búsqueda. |
| 4 | Cerrar con diferenciador intercultural y mejora visual. | La rúbrica exige justificar valor intercultural y calidad final. |

## 4. Seguimiento tipo Daily Scrum

Las preguntas usadas fueron:

1. ¿Qué se terminó desde el último seguimiento?
2. ¿Qué se hará ahora?
3. ¿Qué bloquea o amenaza el sprint?

Ejemplos de seguimiento documentado:

| Fecha referencial | Avance | Siguiente paso | Bloqueo |
| --- | --- | --- | --- |
| 26 mayo 2026 | Proyecto base y estructura de módulos. | Configurar autenticación. | Ninguno crítico. |
| 3 junio 2026 | Login y JWT en progreso. | Proteger rutas. | Validar expiración de token. |
| 11 junio 2026 | CRUD de mascota conectado. | Asociar mascota al usuario. | Evitar acceso a registros ajenos. |
| 18 junio 2026 | Dashboard y características. | Preparar filtros y vistas. | Datos deben ser traducibles después. |
| 25 junio 2026 | Subida de fotos y mapa inicial. | Generar zona pública. | Privacidad de coordenadas. |
| 3 julio 2026 | Visor 3D operativo. | Integrar captura o referencia al PDF. | Rendimiento y carga de modelos. |
| 10 julio 2026 | PDF funcional. | Mejorar proporciones y nombre. | Evitar datos sensibles. |
| 17 julio 2026 | Modo bilingüe y glosario. | Integrar cartel por idioma. | Validación lingüística pendiente. |
| 24 julio 2026 | Pintura y editor de cartel. | Cierre de documentación. | Git no refleja todo el periodo. |

## 5. Sprint Reviews

| Sprint | Incremento demostrado | Observación recibida o detectada |
| --- | --- | --- |
| 1 | Registro, login y roles. | La base permite avanzar, pero aún no resuelve la búsqueda. |
| 2 | Mascotas por usuario y panel. | Los datos deben prepararse para traducción. |
| 3 | Fotos, mapa, modelo 3D y cartel. | El cartel debe cuidar privacidad y legibilidad. |
| 4 | Interculturalidad, pintura, PDF final y documentación. | La defensa debe explicar el proceso y no depender de Git. |

## 6. Sprint Retrospectives

| Sprint | Qué funcionó | Qué se mejoró |
| --- | --- | --- |
| 1 | Separar frontend y backend desde el inicio. | Documentar antes los criterios de terminado. |
| 2 | Asociar datos al propietario redujo riesgos de acceso. | Preparar listas cerradas para futuras traducciones. |
| 3 | El flujo de búsqueda empezó a ser demostrable. | Distribuir integraciones externas con más margen. |
| 4 | La interculturalidad quedó integrada al flujo central. | Iniciar Git desde el día 1 en próximos proyectos. |

## 7. Evidencia de control

La bitácora demuestra que el equipo no solo programó, sino que inspeccionó y adaptó:

- Ajustó la duración del Sprint 3 por riesgo técnico.
- Priorizó privacidad de ubicación.
- Registró limitaciones reales.
- Convirtió la capa intercultural en una épica transversal.
- Cerró con documentos vinculados a rúbrica.

