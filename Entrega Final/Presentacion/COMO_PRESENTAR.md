# Cómo abrir y presentar las diapositivas

El archivo es [`presentacion.html`](presentacion.html), en esta misma carpeta.

**No necesita internet.** Todo va dentro del archivo: los estilos, la foto y la
navegación. Se puede copiar a una memoria USB y abrir en cualquier computadora
con navegador, aunque el aula no tenga red.

---

## Presentar directamente desde el navegador

Es la mejor opción: los colores se ven tal como se diseñaron.

1. Doble clic en `presentacion.html`.
2. Pulsa **F11** para pantalla completa.
3. Avanza con **→** o la **barra espaciadora**; retrocede con **←**.

| Tecla | Qué hace |
| --- | --- |
| `→` `espacio` `AvPág` | Siguiente diapositiva |
| `←` `RePág` | Diapositiva anterior |
| `Inicio` | Volver a la portada |
| `Fin` | Ir al cierre |
| `F11` | Pantalla completa |

Abajo a la derecha hay un contador (`1 / 17`) y una barra de avance, para saber
cuánto queda sin tener que adivinar.

---

## Exportar a PDF

Útil para entregarlo junto con la documentación, o como respaldo si la
computadora del aula no abre el archivo.

1. Abre `presentacion.html` en el navegador.
2. **Ctrl + P**.
3. Comprueba estos tres valores antes de guardar:

| Campo | Valor |
| --- | --- |
| Destino | **Guardar como PDF** |
| Orientación | **Horizontal** |
| Márgenes | **Ninguno** |
| Gráficos de fondo | **Activado** |

4. Guardar.

> **«Gráficos de fondo» es el que suele olvidarse.** Si queda desactivado, el
> PDF sale sin los recuadros de las tarjetas ni los colores de las tablas, y la
> presentación pierde toda la jerarquía visual. En Chrome y Edge está dentro de
> **Más configuraciones**.

La hoja de impresión ya fuerza fondo blanco y una diapositiva por página, así
que no hay que ajustar nada más.

---

## Antes de exponer

- [ ] Rellenar **integrantes**, **NRC** y **carrera** en la portada
      (diapositiva 1, están como marcador de posición).
- [ ] Confirmar la **fecha de la defensa**.
- [ ] Repartir los bloques entre los integrantes: la rúbrica exige que
      **todos participen**. El reparto sugerido está en
      [06_DEFENSA_TECNICA.md](../Documentacion/06_DEFENSA_TECNICA.md).
- [ ] Copiar el archivo a una memoria USB como respaldo.
- [ ] Abrir la aplicación desplegada **5 minutos antes**: el plan gratuito de
      Render suspende el servicio y la primera carga tarda cerca de un minuto.

---

## Editar el contenido

Es un archivo de texto: se abre con cualquier editor. Cada diapositiva es un
bloque `<section class="slide">` numerado en un comentario. Para cambiar un
texto basta con buscarlo y reemplazarlo; no hace falta tocar nada más.

Si añades o quitas una diapositiva, el contador se actualiza solo.
