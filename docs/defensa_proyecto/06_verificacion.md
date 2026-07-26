# Verificacion

La verificacion responde a la pregunta: **el sistema funciona tecnicamente segun lo implementado?**

## Objetivo de verificacion

Comprobar que el backend, frontend, base de datos, visualizacion 3D y exportacion PDF funcionan sin errores criticos.

## Verificaciones realizadas o recomendadas

| Verificacion | Comando o accion | Resultado esperado |
| --- | --- | --- |
| Compilar backend | `npm run build` en `backend` | Sin errores TypeScript. |
| Compilar frontend | `npm run build` en `frontend` | Build exitoso. |
| Verificar tipos frontend | `npm run type-check` | Sin errores de tipado. |
| Ejecutar backend | `npm run start:dev` | API activa en puerto 3333. |
| Ejecutar frontend | `npm run dev` | Web activa en puerto 3000. |
| Probar API publica | GET `/api/animales/publicos` | Respuesta 200. |
| Probar login | POST `/api/auth/login` | Retorna token JWT. |
| Probar dashboard | Abrir `/dashboard` autenticado | Carga mascotas del usuario. |
| Probar PDF | Click en exportar ficha | Descarga PDF completo. |
| Probar modelo 3D | Abrir ficha con modelo | Canvas no queda en blanco. |

## Checklist tecnico

- [x] Backend estructurado por modulos.
- [x] Prisma conectado a PostgreSQL.
- [x] Autenticacion con JWT.
- [x] Mascotas asociadas a usuarios.
- [x] Admin con acceso general.
- [x] Modelos 3D categorizados.
- [x] PDF con imagenes y captura 3D.
- [x] Validacion basica de formularios.
- [ ] Pruebas automatizadas completas de extremo a extremo.
- [ ] Pintura 3D avanzada sobre textura original.

## Riesgos tecnicos

| Riesgo | Impacto | Mitigacion |
| --- | --- | --- |
| Modelos 3D muy pesados | Carga lenta o bloqueo visual. | Optimizar archivos y limitar tamano. |
| Imagenes demasiado grandes | PDF pesado o lento. | Comprimir imagenes antes de exportar. |
| API de mapas sin clave valida | No se puede seleccionar zona con precision. | Configurar `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`. |
| Ubicacion exacta expuesta | Riesgo de privacidad. | Mostrar solo zona aproximada. |
| Diferencias entre navegador y PDF | PDF incompleto. | Verificar visualmente cada exportacion. |

## Evidencias sugeridas

Guardar en `docs/defensa_proyecto/evidencias`:

- Captura de login.
- Captura del dashboard.
- Captura del formulario de nueva mascota.
- Captura del selector de modelos por categoria.
- Captura de la ficha antes de exportar.
- PDF generado de ejemplo.
- Captura de vista administrativa.

## Conclusion de verificacion

La verificacion confirma que el producto puede ejecutarse localmente, compilarse y demostrar sus flujos principales. Para una entrega mas robusta se recomienda agregar pruebas automatizadas y pruebas especificas de carga para imagenes y modelos 3D.
