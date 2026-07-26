# Sprint 1: base del sistema

## Objetivo

Construir la estructura inicial del proyecto, configurar frontend, backend, base de datos y autenticacion.

## Alcance

- Crear proyecto backend con NestJS.
- Crear proyecto frontend con Next.js.
- Configurar PostgreSQL.
- Crear esquema inicial con Prisma.
- Implementar usuarios y roles.
- Implementar login y registro.

## Historias de usuario

| Historia | Descripcion | Prioridad |
| --- | --- | --- |
| HU-01 | Como visitante quiero registrarme para usar el sistema. | Alta |
| HU-02 | Como usuario quiero iniciar sesion para acceder a mi panel. | Alta |
| HU-03 | Como sistema quiero diferenciar usuario y administrador. | Alta |

## Entregables

- API NestJS ejecutandose.
- Frontend Next.js ejecutandose.
- Base de datos conectada.
- Modelo `User`.
- Autenticacion JWT.
- Roles `ADMIN` y `USER`.

## Validacion

- Se registra un usuario.
- Se inicia sesion.
- Se recibe token JWT.
- El backend responde en puerto 3333.
- El frontend responde en puerto 3000.

## Resultado

Sprint completado. Se obtuvo una base tecnica sobre la cual se pudo construir la gestion de mascotas.
