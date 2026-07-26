# Gestión de incidentes y continuidad

## 1. Severidad

| Nivel | Definición | Ejemplo | Respuesta objetivo sugerida |
| --- | --- | --- | --- |
| S1 Crítica | Exposición, pérdida de datos o sistema indisponible. | Acceso a mascotas ajenas. | Inmediata. |
| S2 Alta | Flujo principal bloqueado. | No se pueden registrar mascotas. | Mismo día. |
| S3 Media | Función degradada con alternativa. | Vista 3D no carga un formato. | Próximo ciclo. |
| S4 Baja | Defecto visual o mejora. | Espaciado inconsistente. | Backlog. |

## 2. Procedimiento

1. Detectar y asignar identificador.
2. Registrar impacto sin copiar secretos.
3. Contener el problema.
4. Preservar logs y evidencia.
5. Diagnosticar causa raíz.
6. Corregir y probar regresión.
7. Desplegar o revertir.
8. Comunicar estado.
9. Documentar aprendizaje y acción preventiva.

## 3. Formato de incidente

| Campo | Registro |
| --- | --- |
| ID | INC-AAAA-NNN |
| Inicio y detección | |
| Severidad | |
| Servicios afectados | |
| Usuarios afectados | |
| Descripción | |
| Contención | |
| Causa raíz | |
| Corrección | |
| Evidencia de verificación | |
| Cierre | |

## 4. Escenarios de continuidad

| Evento | Contingencia |
| --- | --- |
| PostgreSQL no disponible | Detener escrituras, restaurar servicio y validar integridad. |
| Google Maps no disponible | Informar indisponibilidad sin aceptar texto ambiguo como ubicación validada. |
| Almacenamiento de imágenes falla | Conservar datos y permitir reintento controlado. |
| Clave expuesta | Revocar, rotar, revisar logs y actualizar entornos. |
| Release defectuoso | Revertir aplicación y revisar migraciones antes de tocar datos. |

## 5. Postmortem

El análisis debe ser sin culpabilización y responder: qué ocurrió, por qué los controles no lo evitaron, cómo se recuperó el sistema y qué cambio verificable reduce la repetición.

