# 6. Presentación y defensa técnica

> Rúbrica §6: **todos los integrantes deberán participar** en la exposición. El
> equipo deberá justificar las decisiones tomadas durante el desarrollo y
> responder las preguntas del docente.

La rúbrica premia explícitamente la participación de todos y la capacidad de
**justificar decisiones**. Un integrante que solo lee diapositivas baja la
calificación del grupo entero.

---

## 1. Estructura de la exposición

Duración estimada: **20 minutos** de exposición + preguntas. Ajustar
proporcionalmente si el tiempo asignado es otro.

| # | Bloque | Min | Contenido | Responsable |
| --- | --- | ---: | --- | --- |
| 1 | Problemática | 3 | Necesidad, usuarios, por qué no bastaba lo existente | _(asignar)_ |
| 2 | Enfoque intercultural | 5 | Por qué no es un añadido; rigor de la traducción | _(asignar)_ |
| 3 | Demostración en vivo | 6 | Los 8 pasos del guion | _(asignar)_ |
| 4 | Arquitectura y decisiones técnicas | 3 | Separación cliente/servidor, seguridad, pintura UV | _(asignar)_ |
| 5 | Proceso de desarrollo | 2 | Cronograma, sprints, adaptaciones registradas | _(asignar)_ |
| 6 | Calidad y cierre | 1 | Validaciones, accesibilidad, límites declarados | _(asignar)_ |

> **Regla de reparto:** cada integrante toma un bloque completo y **la ronda de
> preguntas de su bloque**. Repartir por diapositivas en lugar de por temas
> hace que nadie domine nada y se nota de inmediato.

**Al bloque 2 se le asignan 5 minutos deliberadamente:** vale 3 de los 7 puntos
y es el único criterio donde la rúbrica advierte que no basta con mostrar una
funcionalidad. Es el bloque que debe llevar el integrante más sólido
argumentando.

## 2. Guion de la demostración

Los ocho pasos, con la frase clave que conviene decir en cada uno. Detalle
completo en [02_SOLUCION_TECNOLOGICA.md](02_SOLUCION_TECNOLOGICA.md#5-guion-de-demostración).

| # | Acción | Qué decir mientras se hace |
| --- | --- | --- |
| 1 | Cambiar idioma: castellano → kichwa → bilingüe | *"El selector está antes del login: no hay que autenticarse para tener derecho a la propia lengua."* |
| 2 | Registrarse e iniciar sesión | *"La contraseña se cifra con bcrypt; la sesión viaja como JWT y el servidor la valida en cada petición."* |
| 3 | Registrar una mascota | *"El formulario obliga a lo indispensable. Esto es lo que un mensaje de WhatsApp no garantiza."* |
| 4 | Elegir modelo 3D | *"El catálogo solo ofrece modelos de la especie elegida, y el filtro lo aplica el servidor."* |
| 5 | Pintar las señas | *"La pintura va sobre coordenadas UV de la textura, por eso queda pegada al modelo al rotar. La primera versión pintaba en pantalla y el trazo flotaba."* |
| 6 | Marcar la zona en el mapa | *"Se guarda la zona aproximada, no la dirección. Publicar el domicilio convierte un cartel de búsqueda en un riesgo."* |
| 7 | Exportar el PDF | *"El cartel sale en el idioma elegido y no contiene latitud ni longitud."* |
| 8 | Cerrar sesión y ver el catálogo público | *"Se borró la sesión pero se conservó el idioma: la lengua no es un dato de sesión."* |

## 3. Preguntas probables y respuestas preparadas

Ordenadas por probabilidad de que las hagan.

### Sobre el enfoque intercultural

**"¿Por qué esto no es simplemente una traducción, que cualquier aplicación
tiene?"**
> Por cuatro razones verificables en el código. Primero, el selector está antes
> del login: no hay un "modo indígena" aparte. Segundo, la preferencia de idioma
> sobrevive al cierre de sesión, deliberadamente. Tercero, los datos ya
> guardados en la base se traducen en pantalla, así que las mascotas registradas
> antes de existir la traducción también se ven en kichwa. Y cuarto, el PDF que
> sale del sistema y se pega en un poste también está en kichwa. Si fuera
> decorativo se habría quedado en los botones.

**"¿Usaron un traductor automático?"**
> No. Cada término tiene su fuente documentada en `docs/TRADUCCION_KICHWA.md`:
> el diccionario escolar del Ministerio de Educación, el diccionario del GAD de
> Chimborazo y la norma ALKI. No inventamos ninguna raíz léxica. Cuando un
> concepto técnico no tenía equivalente, o conservamos el préstamo —PDF, 3D,
> JWT— o construimos un compuesto con raíces documentadas, marcado como
> `[comp.]` y con la composición declarada.

**"¿Por qué escriben 'kichwa' y no 'quichua'?"**
> Porque adoptamos el Alfabeto Kichwa Unificado, acordado en Tabacundo en 1998 y
> usado por el Ministerio de Educación en el Sistema de Educación Intercultural
> Bilingüe. Tiene solo tres vocales y no usa `c` ni `qu`. Escribir con
> ortografía castellanizada —*quichua*, *huahua*, *jatun*— es justamente la
> práctica que la política lingüística ecuatoriana busca corregir.

**"¿Validaron la traducción con hablantes nativos?"** ← *la pregunta difícil*
> No, y es la limitación principal del proyecto. Está construida sobre fuentes
> lexicográficas oficiales y aplica correctamente la norma ALKI, pero eso no
> sustituye la revisión de un hablante. Es la primera línea de trabajo futuro:
> someter el glosario a un docente del SEIB o a la Academia de la Lengua Kichwa.

**"¿Por qué mascotas y no un tema más 'cultural'?"**
> Porque el animal de crianza no es un accesorio afectivo en la economía
> familiar andina: cuida el ganado, controla plagas, es sustento. Perderlo es
> una pérdida material. Y porque la interculturalidad no debería limitarse a los
> temas patrimoniales: que el kichwa sirva para un trámite doméstico y
> tecnológico corriente es precisamente lo que comunica que es una lengua viva.

### Sobre la técnica

**"¿Por qué NestJS y Next.js separados en lugar de una sola aplicación?"**
> Porque tienen ciclos de vida distintos. El frontend es contenido estático que
> se sirve desde una CDN; el backend es un proceso de larga vida junto a la base
> de datos. Separarlos permitió desplegar el frontend en Vercel y el backend en
> Render, cada uno donde rinde mejor. También obliga a que toda regla de negocio
> viva en el servidor, que es donde debe estar.

**"¿Cómo protegen que un usuario no edite las mascotas de otro?"**
> En el servidor. Hay endpoints distintos: `/animales/mios` devuelve solo las
> propias y `/animales` está reservado al rol ADMIN. Las operaciones de edición
> y borrado verifican la propiedad antes de ejecutar. No filtramos en el
> frontend, porque eso significaría enviar al navegador datos que el usuario no
> debe tener.

**"¿Dónde guardan las claves de Cloudinary?"**
> Solo en el backend, en variables de entorno. La subida de imágenes pasa por
> `POST /api/uploads/imagen` justamente por eso: si la clave estuviera en el
> frontend como `NEXT_PUBLIC_*`, viajaría al navegador en texto plano y
> cualquiera podría leerla.

**"¿Qué pasa si un usuario pinta un modelo del catálogo? ¿Lo daña para los
demás?"**
> No. Al editar se crea un modelo derivado que pertenece al usuario, mediante
> `POST /modelos3d/:id/derivar`. El original queda intacto. Fue una corrección
> del Sprint 4: la primera versión sí modificaba el modelo compartido.

**"¿Cómo funciona la pintura sobre el modelo?"**
> Se proyecta el punto donde el usuario hace clic a las coordenadas UV de la
> malla y se pinta sobre la textura, no sobre la pantalla. Por eso el trazo
> queda pegado a la superficie al rotar y se conserva al guardar. La primera
> implementación pintaba en espacio de pantalla y el trazo flotaba desalineado.

**"¿Hicieron pruebas automatizadas?"**
> Hay infraestructura de pruebas configurada con Jest, pero la cobertura
> automatizada es la deuda técnica principal del proyecto. La verificación fue
> manual, guiada por los criterios de aceptación de cada historia y por la
> Definition of Done, que exige compilación limpia y prueba del flujo principal.
> No vamos a presentarlo como más de lo que es.

### Sobre el proceso

**"¿Por qué todos los commits son del mismo día?"** ← *casi segura si abren el repo*
> Porque el repositorio se creó al final: trabajamos en local durante los dos
> meses y publicamos de una vez. Reconocemos que el historial de Git no
> evidencia el proceso en este proyecto; el seguimiento está en la documentación
> Scrum, que sí está organizada por sprint. La lección es que el control de
> versiones debe empezar el día uno, no solo por evidencia sino porque durante
> dos meses no tuvimos respaldo ni forma de revertir un cambio.

**"¿Qué cambiaron durante el desarrollo y por qué?"**
> Hay ocho adaptaciones registradas. Las tres más significativas: reemplazamos
> la pintura flotante por pintura UV; hicimos los modos del visor mutuamente
> excluyentes porque rotar y pintar a la vez producía trazos accidentales; e
> introdujimos los modelos derivados para que editar no degradara el catálogo
> compartido. La tabla completa está en el documento 04.

**"¿Cuál fue el mayor error del proyecto?"**
> Dos. Adoptar Git al final. Y no haber incluido la capa intercultural en el
> backlog original, siendo el componente de mayor peso de la evaluación: la
> incorporamos como épica transversal, pero debió estar desde la primera
> planificación. La lección es derivar el backlog también de la rúbrica, no solo
> de la visión del producto.

### Sobre calidad

**"¿Los datos de usabilidad son de usuarios reales?"** ← *responder con la verdad*
> _(Si NO se ejecutó el estudio):_ No. Diseñamos el instrumento con UEQ y PSSUQ
> y lo dejamos listo para aplicar, pero los valores que aparecen son de la
> plantilla. El propio archivo lo declara para no presentar evidencia falsa.
> _(Si SÍ se ejecutó):_ Sí, con N participantes de este perfil, siguiendo este
> protocolo.

**"¿Es accesible?"**
> Aplicamos criterios básicos: etiquetas ARIA en controles sin texto, mensajes
> de error asociados al campo con `aria-describedby` y `aria-invalid`, estados
> con `aria-pressed`. Y algo propio del proyecto: el atributo `lang` del
> documento cambia a `qu` cuando se muestra kichwa, para que un lector de
> pantalla lo pronuncie correctamente. No hicimos auditoría formal WCAG ni
> pruebas con tecnología de asistencia; son criterios básicos, no una
> certificación.

## 4. Reglas para la sesión de preguntas

1. **Responde quien llevó el bloque.** Si otro integrante quiere añadir, que lo
   haga después, no encima.
2. **No inventar.** "No lo verificamos" y "es una limitación que reconocemos"
   suman más que una respuesta improvisada que el docente puede desmontar con
   una repregunta.
3. **Toda afirmación debe poder señalarse en pantalla.** Si se dice que la
   validación está en el servidor, hay que poder abrir el DTO.
4. **Los límites declarados son una fortaleza.** Decir de antemano que la
   traducción no fue validada por nativos y que no hay pruebas automatizadas
   demuestra criterio y desactiva la pregunta trampa.

## 5. Antes de entrar

- [ ] Aplicación abierta y **despierta** desde 5 minutos antes (Render duerme).
- [ ] Sesión limpia, sin datos de ensayos previos.
- [ ] Una mascota de ejemplo ya creada, por si falla el registro en vivo.
- [ ] PDF de ejemplo ya exportado y abierto en otra pestaña.
- [ ] Entorno local levantado en paralelo como respaldo.
- [ ] Video de la demo completa, por si cae la red.
- [ ] `docs/TRADUCCION_KICHWA.md` abierto en una pestaña, listo para mostrar.
- [ ] Repositorio abierto en otra pestaña.
- [ ] Cada integrante sabe qué bloque lleva y qué preguntas le tocan.
