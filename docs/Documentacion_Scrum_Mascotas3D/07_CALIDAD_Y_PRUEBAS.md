# Plan de calidad, validación y verificación

## 1. Objetivo

Comprobar que el incremento satisface requisitos, protege datos y mantiene una experiencia comprensible. La verificación pregunta si el software fue construido correctamente; la validación pregunta si resuelve la necesidad del usuario.

## 2. Estrategia

| Nivel | Propósito | Técnica |
| --- | --- | --- |
| Estático | Detectar errores de tipos y estructura. | `tsc --noEmit`, lint y revisión de código. |
| Compilación | Confirmar que ambos proyectos generan artefactos. | `npm run build`. |
| API | Verificar respuestas, permisos y persistencia. | Pruebas de endpoints y códigos HTTP. |
| Integración | Confirmar flujo frontend-API-base de datos. | Registro, login, CRUD y asociación 3D. |
| Interfaz | Detectar desbordamientos y estados confusos. | Revisión en escritorio y móvil. |
| Aceptación | Confirmar valor del producto. | Escenarios completos con usuario. |

## 3. Casos críticos

| ID | Escenario | Resultado esperado |
| --- | --- | --- |
| CP-01 | Registro con correo nuevo. | Cuenta creada y contraseña almacenada como hash. |
| CP-02 | Login válido e inválido. | Token en caso válido; rechazo controlado en caso inválido. |
| CP-03 | Usuario consulta mascotas propias. | No recibe registros ajenos. |
| CP-04 | Admin consulta y filtra propietarios. | Visualiza todos los registros autorizados. |
| CP-05 | Crear gato y abrir selector 3D. | Solo aparecen modelos de gato. |
| CP-06 | Seleccionar punto fuera de Ecuador. | Mensaje de país o zona no válida. |
| CP-07 | Cambiar a modo Pintar. | El arrastre pinta y no rota ni hace zoom. |
| CP-08 | Cerrar y reabrir modelo pintado. | Los trazos UV reaparecen sobre la textura. |
| CP-09 | Preparar cartel sin teléfono. | Se bloquea la descarga y se informa el campo requerido. |
| CP-10 | Elegir portada y ordenar fotos. | Vista previa y PDF respetan la configuración. |
| CP-11 | Exportar PDF. | A4 legible, imágenes completas y nombre con fecha/hora. |
| CP-12 | Revisar privacidad del PDF. | No contiene latitud ni longitud. |

## 4. Evidencia técnica actual

- Frontend: `npm run type-check` completado.
- Frontend: `npm run build` completado.
- Backend: compilación NestJS disponible mediante `npm run build`.
- Prisma: conexión y esquema relacional definidos.
- Exportador: controla texto, proporción de imágenes, cantidad y tamaño.

La carpeta `evidencias` debe contener capturas y resultados fechados cuando se ejecute la validación formal.

## 5. Criterios de salida

- Cero errores de compilación.
- Cero defectos críticos de autorización o privacidad conocidos.
- Casos CP-01 a CP-12 aprobados o con incidencia documentada.
- Incremento demostrable con base de datos limpia o datos de prueba identificados.
- Documentación y backlog actualizados.

## 6. Gestión de defectos

| Severidad | Definición | Acción |
| --- | --- | --- |
| Crítica | Exposición de datos, pérdida de información o flujo principal inutilizable. | Corregir antes de aceptar el incremento. |
| Alta | Función principal falla sin alternativa razonable. | Priorizar en el sprint actual. |
| Media | Existe alternativa, pero afecta claridad o eficiencia. | Incluir en backlog cercano. |
| Baja | Mejora visual o de conveniencia. | Priorizar según valor. |

