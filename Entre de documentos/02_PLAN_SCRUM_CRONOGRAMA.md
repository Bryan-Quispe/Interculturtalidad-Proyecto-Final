# Plan Scrum y cronograma

## 1. Metodología usada

Se usó **Scrum adaptado a un proyecto académico**. La adaptación consiste en mantener los elementos esenciales de Scrum - roles, eventos, artefactos, inspección y adaptación - sin afirmar ceremonias o participantes que no puedan evidenciarse.

## 2. Periodo del proyecto

**Inicio:** domingo 24 de mayo de 2026  
**Cierre:** sábado 25 de julio de 2026  
**Duración:** 9 semanas  
**Organización:** 4 sprints

## 3. Roles Scrum

| Responsabilidad Scrum | Aplicación en el proyecto |
| --- | --- |
| Product Owner | Responsable de visión, priorización y valor del producto. |
| Scrum Master | Gestión del marco Scrum, bitácora, impedimentos y mejora continua. |
| Developers | Diseño, implementación, pruebas, documentación y despliegue. |
| Stakeholders | Docente, evaluadores y usuarios de prueba. |

## 4. Cronograma de sprints

| Sprint | Fechas exactas | Duración | Meta del sprint | Resultado |
| --- | --- | ---: | --- | --- |
| Sprint 1 | 24 de mayo - 6 de junio de 2026 | 2 semanas | Base técnica, autenticación y roles. | Frontend, backend, PostgreSQL, Prisma, JWT, roles `USER` y `ADMIN`. |
| Sprint 2 | 7 de junio - 20 de junio de 2026 | 2 semanas | Gestión de mascotas por propietario. | CRUD de mascotas, características, dashboard y vista administrativa. |
| Sprint 3 | 21 de junio - 11 de julio de 2026 | 3 semanas | Búsqueda, ubicación, fotos, modelos 3D y PDF. | Mapa, Cloudinary, catálogo 3D, visor, cartel PDF y privacidad de zona. |
| Sprint 4 | 12 de julio - 25 de julio de 2026 | 2 semanas | Interculturalidad completa, pintura 3D, cartel y cierre. | Modo bilingüe, glosario, editor de cartel, pintura UV, copias de modelos y documentación. |

## 5. Por qué el Sprint 3 dura 3 semanas

El Sprint 3 agrupó integraciones con mayor incertidumbre técnica:

- Subida de imágenes.
- Mapa y georreferencia.
- Visor 3D.
- Generación de PDF.

Por eso se asignó una semana adicional. Esta decisión redujo el riesgo de terminar el sprint con funcionalidades incompletas.

## 6. Artefactos Scrum

| Artefacto | Evidencia |
| --- | --- |
| Product Backlog | Historias HU-01 a HU-31, prioridades MoSCoW y puntos. |
| Sprint Backlog | Historias seleccionadas por sprint y meta asociada. |
| Incremento | Producto funcional al cierre de cada sprint. |
| Definition of Done | Criterios para declarar terminada una historia. |
| Bitácora | Seguimiento semanal, impedimentos y decisiones. |

## 7. Definition of Ready

Una historia puede entrar a un sprint cuando:

- Tiene actor, necesidad y beneficio.
- Tiene criterios de aceptación.
- Tiene prioridad.
- Tiene estimación.
- No depende de una decisión crítica abierta.
- Puede demostrarse o verificarse al cierre del sprint.

## 8. Definition of Done

Una historia se considera terminada cuando:

- La funcionalidad está integrada.
- El flujo principal fue probado.
- TypeScript compila sin errores conocidos.
- Los permisos y validaciones funcionan.
- La interfaz se revisó en escritorio y móvil.
- No se exponen datos sensibles.
- La documentación relacionada fue actualizada.
- El incremento puede demostrarse en la interfaz.

## 9. Cadencia de eventos

| Evento | Momento | Evidencia esperada |
| --- | --- | --- |
| Sprint Planning | Inicio de cada sprint | Meta, historias seleccionadas y criterios de aceptación. |
| Daily Scrum / seguimiento | Durante el sprint | Avance, bloqueos y siguiente tarea. |
| Sprint Review | Fin del sprint | Incremento demostrado y observaciones. |
| Sprint Retrospective | Fin del sprint | Qué funcionó, qué falló y acción de mejora. |

## 10. Control y evolución

El proceso no se limitó a planificar. También registró adaptaciones:

- Se separó ubicación interna de zona pública para proteger privacidad.
- Se movió Cloudinary al backend para no exponer secretos.
- Se agregó modo bilingüe y traducción de datos guardados.
- Se cambió la pintura 3D a coordenadas UV para evitar trazos desalineados.
- Se creó derivación de modelos para no modificar el catálogo compartido.
- Se documentó la limitación del historial de Git con honestidad académica.

