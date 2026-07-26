# Sprint 1 - Base técnica y autenticación

## Ficha

| Campo | Descripción |
| --- | --- |
| Sprint Goal | Disponer de una base cliente-servidor segura y persistente. |
| Puntos aceptados | 24 |
| Historias | HU-01 a HU-06 |
| Estado | Completado |

## Historias seleccionadas

- Registro de usuario.
- Inicio de sesión.
- Protección JWT.
- Roles de usuario y administrador.
- Persistencia mediante Prisma y PostgreSQL.
- Interfaz web adaptable inicial.

## Sprint Backlog técnico

| Tarea | Resultado |
| --- | --- |
| Crear proyecto NestJS modular. | API organizada por módulos. |
| Crear proyecto Next.js con TypeScript. | Frontend ejecutable. |
| Definir entidad `User` y enum `Role`. | Persistencia y permisos base. |
| Implementar hash de contraseña. | Credenciales protegidas con bcrypt. |
| Implementar login y emisión JWT. | Sesión autenticada. |
| Crear guard y estrategia Passport. | Rutas privadas protegidas. |
| Crear pantallas de registro y acceso. | Flujo visible para usuario. |

## Criterios de aceptación

- Un correo nuevo puede registrarse.
- Una contraseña válida permite iniciar sesión.
- Las credenciales incorrectas son rechazadas.
- Una ruta privada sin token responde con acceso no autorizado.
- El perfil devuelve rol e identidad del usuario autenticado.
- Frontend y backend compilan.

## Incremento

El incremento estableció la arquitectura base, la conexión con PostgreSQL y la identidad necesaria para que las funciones posteriores puedan asociarse con una persona.

## Review técnica

Demostración sugerida: crear una cuenta, iniciar sesión, consultar el perfil y mostrar que el dashboard no se abre sin token.

## Retrospectiva técnica

| Observación | Acción aplicada al Sprint 2 |
| --- | --- |
| La propiedad de datos debía controlarse en backend. | Asociar mascota con `usuarioId` desde la sesión. |
| Los roles debían existir desde la base. | Incorporar `USER` y `ADMIN` en Prisma y guards. |
| Los errores de sesión requerían respuesta uniforme. | Centralizar token en el cliente API y limpiar sesiones inválidas. |

## Evidencia recomendada

- Captura de registro e inicio de sesión.
- Log de API iniciada.
- Esquema Prisma de usuario.
- Respuesta 401 sin token y respuesta exitosa con token.

