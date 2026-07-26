# Plan de verificación

## 1. Objetivo

Detectar defectos en contratos, compilación, autorización, persistencia, visualización y exportación antes de aceptar un incremento.

## 2. Niveles

| Nivel | Elemento | Técnica |
| --- | --- | --- |
| Estático | TypeScript | `tsc --noEmit`. |
| Construcción | Frontend y backend | `next build` y `nest build`. |
| Unidad | Servicios, validadores y utilidades | Jest. |
| Integración | API, Prisma y PostgreSQL | Peticiones con datos aislados. |
| Sistema | Flujo completo | Navegador y API en ejecución. |
| Seguridad | Roles, propiedad y privacidad | Casos positivos y negativos. |

## 3. Ambiente de prueba

- PostgreSQL disponible.
- Esquema Prisma actualizado.
- Usuario normal y administrador de prueba.
- Un modelo por categoría.
- Fotografías de prueba autorizadas.
- Google Maps habilitado para el dominio local.

## 4. Criterios de entrada

- Historia y criterios de aceptación definidos.
- Dependencias instaladas.
- Variables configuradas sin exponer valores.
- Base de prueba disponible.
- Datos y resultados esperados identificados.

## 5. Criterios de salida

- Compilaciones con código 0.
- Cero errores TypeScript.
- Cero defectos críticos de autenticación, propiedad o privacidad.
- Casos críticos aprobados o incidencias registradas.
- Evidencia almacenada con fecha y versión.

## 6. Prioridad

1. Seguridad y privacidad.
2. Integridad de datos.
3. Flujo de registro y cartel.
4. Modelos 3D y archivos.
5. Presentación visual y mejoras.

