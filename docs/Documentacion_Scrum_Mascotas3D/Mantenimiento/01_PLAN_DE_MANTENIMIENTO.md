# Plan de mantenimiento

## 1. Objetivos

- Mantener disponibilidad e integridad de información.
- Corregir defectos sin introducir regresiones.
- Adaptar dependencias y servicios externos.
- Mejorar usabilidad, rendimiento y seguridad.
- Conservar documentación y trazabilidad.

## 2. Clasificación

| Tipo | Disparador | Ejemplo |
| --- | --- | --- |
| Correctivo | Defecto confirmado. | PDF no carga una imagen válida. |
| Adaptativo | Cambio externo. | Nueva versión de Google Maps o Node.js. |
| Perfectivo | Mejora priorizada. | Exportar modelo personalizado como GLB. |
| Preventivo | Riesgo técnico. | Actualizar dependencias o probar backups. |

## 3. Ciclo de mantenimiento

1. Registrar solicitud o incidente.
2. Clasificar severidad, tipo y alcance.
3. Analizar impacto en requisitos, datos y seguridad.
4. Priorizar en Product Backlog.
5. Implementar en rama o entorno controlado.
6. Ejecutar pruebas de regresión.
7. Actualizar documentación y versión.
8. Desplegar con plan de reversión.
9. Monitorear resultado.

## 4. Frecuencia sugerida

| Actividad | Frecuencia |
| --- | --- |
| Revisar logs y disponibilidad | Diaria en producción. |
| Verificar backups | Diaria o según criticidad. |
| Probar restauración | Mensual. |
| Revisar dependencias | Mensual y antes de release. |
| Revisar claves y accesos | Trimestral o tras exposición. |
| Ejecutar regresión completa | Antes de cada despliegue. |
| Revisar documentación | En cada cambio aceptado. |

## 5. Prioridad

1. Vulnerabilidad o exposición de datos.
2. Pérdida o corrupción de datos.
3. Autenticación y permisos.
4. Flujo de registro y cartel.
5. Integraciones externas.
6. Rendimiento y experiencia visual.

## 6. Indicadores

- Incidentes por severidad.
- Tiempo medio de recuperación.
- Porcentaje de cambios con prueba de regresión.
- Éxito de backups y restauraciones.
- Dependencias con vulnerabilidades conocidas.
- Defectos reabiertos.

