# Qué subir en la entrega final

La rúbrica pide cinco entregables. Esta tabla dice qué es cada uno y de dónde
sacarlo.

| # | Entregable | Qué subir | Dónde está |
| --- | --- | --- | --- |
| 1 | Sistema funcional | La URL de la aplicación desplegada | `https://interculturtalidad-proyecto-final.vercel.app` |
| 2 | Código fuente | El enlace al repositorio, o un ZIP del proyecto **sin** `node_modules` | `github.com/Bryan-Quispe/Interculturtalidad-Proyecto-Final` |
| 3 | Presentación | `presentacion.pdf`, exportado desde el HTML | [../Presentacion/](../Presentacion/) |
| 4 | Documentación del proceso | `informe-entrega-final.pdf`, exportado desde el HTML de esta carpeta | esta carpeta |
| 5 | Repositorio | El mismo enlace del punto 2 | — |

---

## El informe

[`informe-entrega-final.html`](informe-entrega-final.html) reúne en un solo
documento todo lo que la rúbrica evalúa del proceso:

| Sección | Contenido |
| --- | --- |
| 1 | Introducción, problemática, justificación intercultural, objetivos y alcance |
| 2 | Especificación de requisitos: 33 funcionales, 12 no funcionales, reglas de negocio |
| 3 | Casos de uso: actores, listado de 15 y tres desarrollados en detalle |
| 4 | Marco Scrum: roles, eventos, definición de preparado y de terminado |
| 5 | Cronograma, los cuatro sprints con su review y retrospectiva, y las adaptaciones |
| 6 | Product Backlog completo, 31 historias, y el backlog futuro |
| 7 | Arquitectura, modelo de datos e interfaz de programación |
| 8 | Plan de calidad y 15 casos de prueba con su resultado |
| 9 | Matriz de trazabilidad |
| 10 | Gestión de riesgos |
| 11 | Conclusiones, limitaciones declaradas y trabajo futuro |
| 12 | Anexos: credenciales, documentación complementaria y estructura del repositorio |

### Generar el PDF

1. Doble clic en `informe-entrega-final.html`.
2. **Ctrl + P**.
3. Ajustar tres valores:

| Campo | Valor |
| --- | --- |
| Destino | **Guardar como PDF** |
| Orientación | **Vertical** |
| Márgenes | **Predeterminados** |
| Gráficos de fondo | **Activado** |

4. Guardar como `informe-entrega-final.pdf` en esta misma carpeta.

> **«Gráficos de fondo» es el que se olvida.** Sin él, las tablas salen sin
> fondo en las cabeceras y el documento pierde legibilidad. En Chrome y Edge
> está dentro de **Más configuraciones**.

El documento ya trae su propia hoja de impresión: A4 vertical, márgenes de
18 mm, y ninguna tabla ni ficha se parte entre dos páginas.

---

## Antes de entregar

- [ ] Rellenar **integrantes**, **NRC** y **carrera** en la portada del informe.
- [ ] Rellenar los mismos datos en la primera diapositiva de la presentación.
- [ ] Exportar los dos PDF y comprobar que ninguna tabla queda cortada.
- [ ] Comprobar que la aplicación desplegada responde. En el plan gratuito el
      servicio se suspende tras 15 minutos de inactividad y la primera carga
      tarda cerca de un minuto.
- [ ] Verificar que el repositorio es accesible para el docente.
- [ ] Confirmar que ningún archivo `.env` viaja en la entrega:
      `git ls-files | grep -i env` solo debe listar los `.env.example`.

---

## Documentación de respaldo

El informe resume el proceso. El detalle completo sigue en el repositorio y no
hace falta imprimirlo, pero conviene tenerlo localizado por si el tribunal
pregunta:

| Contenido | Ubicación |
| --- | --- |
| Documentación Scrum, 15 documentos | [`docs/Documentacion_Scrum_Mascotas3D/`](../../docs/Documentacion_Scrum_Mascotas3D/) |
| Respaldo lingüístico del kichwa | [`docs/TRADUCCION_KICHWA.md`](../../docs/TRADUCCION_KICHWA.md) |
| Arquitectura en capas | [`docs/ARQUITECTURA_MVC.md`](../../docs/ARQUITECTURA_MVC.md) |
| Procedimiento de despliegue | [`docs/DESPLIEGUE.md`](../../docs/DESPLIEGUE.md) |
| Documentos por criterio de la rúbrica | [`../Documentacion/`](../Documentacion/) |
| Guion de la defensa y preguntas previstas | [`../Documentacion/06_DEFENSA_TECNICA.md`](../Documentacion/06_DEFENSA_TECNICA.md) |
| Instrumento de usabilidad y evaluación heurística | [`../`](../) |
