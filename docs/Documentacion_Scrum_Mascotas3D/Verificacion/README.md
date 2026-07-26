# Expediente de verificación

## Propósito

Este expediente aporta evidencia reproducible de que el software está construido de acuerdo con contratos, tipos, reglas y arquitectura definidas.

## Contenido

| Documento | Evidencia que aporta |
| --- | --- |
| [Plan de verificación](01_PLAN_DE_VERIFICACION.md) | Niveles, técnicas y criterios de salida. |
| [Casos técnicos](02_CASOS_DE_PRUEBA_TECNICOS.md) | Procedimientos verificables. |
| [Registro de ejecución](03_REGISTRO_DE_EJECUCION.md) | Resultados reales de compilación. |
| [Matriz requisito-prueba](04_MATRIZ_REQUISITO_PRUEBA.md) | Cobertura técnica y estado. |

## Estado actual

El 19 de julio de 2026 se ejecutaron correctamente:

- `backend: npm run build`.
- `frontend: npm run build`.
- `frontend: npm run type-check`.

Las pruebas que requieren PostgreSQL, credenciales de mapas o interacción de navegador deben ejecutarse en el ambiente integrado y adjuntar su evidencia.

