# Plan de implementación

## 1. Objetivo

Construir Mascotas 3D en incrementos utilizables, manteniendo separación entre presentación, API, dominio y persistencia.

## 2. Estrategia incremental

| Etapa | Dependencia | Resultado |
| --- | --- | --- |
| Sprint 1 | Ninguna | Identidad, roles, API y PostgreSQL. |
| Sprint 2 | Sesión y persistencia | Mascotas asociadas con propietario. |
| Sprint 3 | Dominio de mascotas | Fotos, mapa, modelos y PDF. |
| Sprint 4 | Flujo de búsqueda | Pintura UV y editor de cartel. |

## 3. Flujo de desarrollo

1. Refinar historia y criterios de aceptación.
2. Identificar cambios en datos, API e interfaz.
3. Implementar primero contrato y reglas del backend cuando corresponda.
4. Integrar el frontend con estados de carga, éxito y error.
5. Ejecutar tipos y compilación.
6. Probar el escenario principal y permisos.
7. Actualizar documentación y trazabilidad.
8. Presentar el incremento en la Sprint Review.

## 4. Estándares aplicados

- TypeScript en frontend y backend.
- Componentes React con responsabilidad identificable.
- Módulos NestJS por dominio.
- DTO para validar entradas.
- Prisma como contrato persistente.
- Variables de entorno para configuración.
- Nombres de requisitos, historias y pruebas trazables.
- Protección de rutas y propiedad en servidor.

## 5. Criterios técnicos de terminado

- El código compila.
- No existen errores TypeScript conocidos.
- El flujo está conectado a la API cuando corresponde.
- Los datos se guardan con relaciones válidas.
- La interfaz presenta retroalimentación.
- Se revisaron seguridad y privacidad.
- Existe evidencia o caso de prueba asociado.

## 6. Gestión de configuración

Las claves y conexiones se mantienen fuera del código. Los valores reales no deben incorporarse a este expediente. Los cambios de esquema requieren generación de Prisma y migración controlada.

