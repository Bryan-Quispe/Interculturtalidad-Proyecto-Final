# 7. Entregables y checklist de cierre

> Rúbrica — Entregables: sistema funcional, código fuente, presentación
> utilizada, documentación que evidencie el proceso, y repositorio del proyecto.

---

## 1. Estado de los entregables

| # | Entregable exigido | Estado | Ubicación |
| --- | --- | --- | --- |
| 1 | **Sistema funcional** | ⚠️ Pendiente de desplegar | Render + Vercel — ver [docs/DESPLIEGUE.md](../../docs/DESPLIEGUE.md) |
| 2 | **Código fuente** | ✅ Completo | [backend/](../../backend/) · [frontend/](../../frontend/) |
| 3 | **Presentación de la exposición** | ❌ Por elaborar | Estructura sugerida en [06_DEFENSA_TECNICA.md](06_DEFENSA_TECNICA.md#1-estructura-de-la-exposición) |
| 4 | **Documentación del proceso** | ✅ Completa | [docs/](../../docs/) + esta carpeta |
| 5 | **Repositorio** | ✅ Publicado | https://github.com/Bryan-Quispe/Interculturtalidad-Proyecto-Final |

## 2. Inventario de documentación

### Esta carpeta — mapeada a la rúbrica

| Documento | Cubre |
| --- | --- |
| [00_INDICE.md](00_INDICE.md) | Portada, mapa rúbrica → documento, advertencias |
| [01_PROBLEMATICA.md](01_PROBLEMATICA.md) | Rúbrica §1 |
| [02_SOLUCION_TECNOLOGICA.md](02_SOLUCION_TECNOLOGICA.md) | Rúbrica §2 |
| [03_ENFOQUE_INTERCULTURAL.md](03_ENFOQUE_INTERCULTURAL.md) | Rúbrica §3 — criterio de 3 puntos |
| [04_PROCESO_DE_DESARROLLO.md](04_PROCESO_DE_DESARROLLO.md) | Rúbrica §4 — criterio de 2 puntos |
| [05_CALIDAD_TECNICA.md](05_CALIDAD_TECNICA.md) | Rúbrica §5 — criterio de 1 punto |
| [06_DEFENSA_TECNICA.md](06_DEFENSA_TECNICA.md) | Rúbrica §6 — criterio de 1 punto |
| [07_ENTREGABLES.md](07_ENTREGABLES.md) | Este documento |

### Documentación de respaldo existente

| Categoría | Cantidad | Ubicación |
| --- | ---: | --- |
| Documentos Scrum en Markdown | 15 | [docs/Documentacion_Scrum_Mascotas3D/](../../docs/Documentacion_Scrum_Mascotas3D/) |
| Fuentes LaTeX de artefactos Scrum | 14 | [docs/scrum/](../../docs/scrum/) |
| Artefactos Scrum en PDF | 8 | [docs/](../../docs/) |
| Documentos de ingeniería (ERS, casos de uso, MER) | 5 | [docs/](../../docs/) |
| Respaldo lingüístico kichwa | 1 | [docs/TRADUCCION_KICHWA.md](../../docs/TRADUCCION_KICHWA.md) |
| Arquitectura y escalabilidad | 2 | [docs/](../../docs/) |
| Guía de despliegue | 1 | [docs/DESPLIEGUE.md](../../docs/DESPLIEGUE.md) |
| Informe de usabilidad UX | 2 (docx + pdf) | [Entrega Final/](../) |
| Instrumento de evaluación heurística | 4 (xlsx) | [Entrega Final/](../) |
| Datos UEQ / PSSUQ | 2 (csv) | [Entrega Final/](../) |

## 3. Trabajo pendiente, en orden de prioridad

Ordenado por relación entre puntos en juego y esfuerzo requerido.

### Prioridad 1 — bloquea la calificación

- [ ] **Desplegar el sistema.** Sin sistema funcional el criterio de calidad
      técnica (1 punto) no se puede evaluar y la demostración del criterio
      principal (3 puntos) queda en riesgo. Procedimiento en
      [docs/DESPLIEGUE.md](../../docs/DESPLIEGUE.md). Estimado: 1–2 horas.
- [ ] **Ensayar la demostración completa sobre el entorno desplegado**, no solo
      en local.
- [ ] **Grabar un video de respaldo** de los 8 pasos, por si falla la red.

### Prioridad 2 — evidencia que la rúbrica pide explícitamente

- [ ] **Capturar las 13 evidencias** del checklist. Lista abajo.
- [ ] **Elaborar la presentación** de la exposición.
- [ ] **Asignar los bloques** de exposición a cada integrante y ensayar el
      reparto de preguntas.
- [ ] **Completar los datos de portada**: integrantes, NRC, carrera, fecha.

### Prioridad 3 — eleva la calificación si hay tiempo

- [ ] **Ejecutar el estudio de usabilidad de verdad** con 5–8 participantes
      (~20 min cada uno). Convierte los datos de plantilla en evidencia real.
      Ver [05_CALIDAD_TECNICA.md](05_CALIDAD_TECNICA.md#6-métricas-de-usabilidad-estado-real-de-la-evidencia).
- [ ] **Someter el glosario kichwa a revisión** de un hablante nativo o de un
      docente del SEIB. Aunque sea de una parte, convierte la limitación
      declarada en una validación parcial.

## 4. Capturas de evidencia pendientes

Del checklist en
[docs/Documentacion_Scrum_Mascotas3D/12_CHECKLIST_DE_EVIDENCIAS.md](../../docs/Documentacion_Scrum_Mascotas3D/12_CHECKLIST_DE_EVIDENCIAS.md).
Guardar en `docs/Documentacion_Scrum_Mascotas3D/evidencias/`.

- [ ] `E01_login.png` — registro e inicio de sesión
- [ ] `E02_dashboard_usuario.png` — panel con mascotas propias
- [ ] `E03_admin_filtro.png` — panel administrador con filtro por propietario
- [ ] `E04_formulario_mascota.png` — formulario con categoría
- [ ] `E05_mapa_zona.png` — mapa y zona válida
- [ ] `E06_selector_3d.png` — catálogo filtrado por especie
- [ ] `E07_modelo_pintura_uv.png` — pintura sobre la textura
- [ ] `E08_editor_cartel.png` — editor y vista previa
- [ ] `E09_cartel_exportado.pdf` — PDF generado
- [ ] `E10_build_frontend.txt` — salida de compilación
- [ ] `E11_build_backend.txt` — salida de compilación
- [ ] **`E12_interfaz_kichwa.png`** — la misma pantalla en kichwa
- [ ] **`E13_modo_bilingue.png`** — modo `kichwa · castellano`
- [ ] **`E14_pdf_kichwa.pdf`** — cartel exportado en kichwa

> Las cuatro últimas no estaban en el checklist original. Son las que evidencian
> el criterio de 3 puntos, así que son las **más importantes** de toda la lista.

## 5. Verificación antes de entregar

### Seguridad

- [ ] Ningún archivo `.env` incluido en la entrega. Verificar con
      `git ls-files | grep -i env` — solo deben aparecer los `.env.example`.
- [ ] Ningún token, clave o contraseña visible en las capturas.
- [ ] Rotar las credenciales de Cloudinary si alguna vez se compartieron.
- [ ] Datos de prueba que no expongan personas reales sin permiso.
- [ ] Ninguna captura muestra una dirección exacta real.

### Consistencia documental

- [ ] Los datos de portada están completos en [00_INDICE.md](00_INDICE.md).
- [ ] Las fechas de los sprints coinciden en todos los documentos
      (24 may – 25 jul 2026).
- [ ] La URL del sistema desplegado está anotada donde corresponde.
- [ ] Nadie presenta los datos UEQ/PSSUQ como reales si el estudio no se ejecutó.

### Repositorio

- [ ] El `README.md` explica cómo levantar el proyecto.
- [ ] El repositorio es accesible para el docente.
- [ ] La última versión del código está publicada.
