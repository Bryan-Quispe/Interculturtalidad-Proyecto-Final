# Documentos de la entrega final

Seis documentos independientes. Cada uno se abre con doble clic y se exporta a
PDF por separado.

| Archivo | Contenido |
| --- | --- |
| [`01-especificacion-de-requisitos.html`](01-especificacion-de-requisitos.html) | Problemática, justificación intercultural, objetivos, alcance, 33 requisitos funcionales, 12 no funcionales y reglas de negocio |
| [`02-casos-de-uso.html`](02-casos-de-uso.html) | Actores, 15 casos de uso y tres desarrollados con flujos alternos |
| [`03-proceso-scrum.html`](03-proceso-scrum.html) | Roles, eventos, definición de terminado, cronograma, los cuatro sprints con review y retrospectiva, y el Product Backlog de 31 historias |
| [`04-arquitectura.html`](04-arquitectura.html) | Capas, modelo de datos y puntos de acceso de la interfaz de programación |
| [`05-calidad-y-pruebas.html`](05-calidad-y-pruebas.html) | Estrategia de pruebas, 15 casos con su resultado y matriz de trazabilidad |
| [`06-riesgos-y-cierre.html`](06-riesgos-y-cierre.html) | Ocho riesgos con su mitigación, conclusiones, limitaciones declaradas, trabajo futuro y anexos |

---

## Generar los PDF

Para cada documento:

1. Doble clic en el archivo.
2. **Ctrl + P**.
3. Ajustar:

| Campo | Valor |
| --- | --- |
| Destino | **Guardar como PDF** |
| Orientación | **Vertical** |
| Márgenes | **Predeterminados** |
| Gráficos de fondo | **Activado** |

4. Guardar con el mismo nombre y extensión `.pdf`.

> **«Gráficos de fondo» es el que se olvida.** Sin él las cabeceras de las
> tablas salen sin fondo y el documento pierde legibilidad. En Chrome y Edge
> está dentro de **Más configuraciones**.

Cada archivo trae su propia hoja de impresión: A4 vertical, márgenes de 18 mm,
y ninguna tabla ni ficha se corta entre dos páginas.

---

## Qué subir

La rúbrica pide cinco entregables:

| # | Entregable | Qué subir |
| --- | --- | --- |
| 1 | Sistema funcional | `https://interculturtalidad-proyecto-final.vercel.app` |
| 2 | Código fuente | Enlace al repositorio, o un ZIP **sin** `node_modules` |
| 3 | Presentación | `presentacion.pdf`, desde [`../Presentacion/`](../Presentacion/) |
| 4 | Documentación del proceso | Los seis PDF de esta carpeta |
| 5 | Repositorio | `github.com/Bryan-Quispe/Interculturtalidad-Proyecto-Final` |

### Antes de entregar

- [ ] Exportar los seis PDF y revisar que ninguna tabla quede cortada.
- [ ] Exportar la presentación.
- [ ] Comprobar que la aplicación desplegada responde. En el plan gratuito el
      servicio se suspende tras 15 minutos sin uso y la primera carga tarda
      cerca de un minuto.
- [ ] Verificar que el repositorio es accesible para el docente.
- [ ] Confirmar que ningún `.env` viaja en la entrega:
      `git ls-files | grep -i env` solo debe listar los `.env.example`.

---

## Modificar los documentos

Los seis se generan desde un contenido común para que no se descuadren entre
sí. Si hay que corregir algo:

1. Editar `_contenido.html`, que es el documento maestro.
2. Ejecutar `node generar-documentos.js` en esta carpeta.

No conviene editar los archivos numerados a mano: la siguiente ejecución del
generador los sobrescribe.

Para cambiar el reparto de secciones, el nombre del autor o el de la materia,
se ajusta la cabecera de `generar-documentos.js`.

---

## Documentación de respaldo

No hace falta imprimirla, pero conviene tenerla localizada por si el tribunal
pregunta:

| Contenido | Ubicación |
| --- | --- |
| Documentación Scrum, 15 documentos | [`docs/Documentacion_Scrum_Mascotas3D/`](../../docs/Documentacion_Scrum_Mascotas3D/) |
| Respaldo lingüístico del kichwa | [`docs/TRADUCCION_KICHWA.md`](../../docs/TRADUCCION_KICHWA.md) |
| Arquitectura en capas | [`docs/ARQUITECTURA_MVC.md`](../../docs/ARQUITECTURA_MVC.md) |
| Procedimiento de despliegue | [`docs/DESPLIEGUE.md`](../../docs/DESPLIEGUE.md) |
| Documentos por criterio de la rúbrica | [`../Documentacion/`](../Documentacion/) |
| Guion de la defensa y preguntas previstas | [`../Documentacion/06_DEFENSA_TECNICA.md`](../Documentacion/06_DEFENSA_TECNICA.md) |
