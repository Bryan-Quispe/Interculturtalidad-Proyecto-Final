# Desarrollo por sprints

El proyecto se organizo de manera incremental. Cada sprint agrego una parte funcional del sistema hasta llegar a una aplicacion orientada a la busqueda de mascotas perdidas con soporte de modelos 3D.

## Resumen general

| Sprint | Objetivo | Resultado |
| --- | --- | --- |
| Sprint 1 | Construir la base del sistema: autenticacion, estructura frontend/backend y modelo de datos inicial. | Proyecto base funcional con usuarios, roles y conexion a base de datos. |
| Sprint 2 | Implementar gestion de mascotas por usuario y panel administrativo. | Mascotas asociadas a dueno, CRUD y vista de administracion. |
| Sprint 3 | Integrar fotos, ubicacion aproximada, modelos 3D por categoria y exportacion PDF. | Ficha de busqueda exportable con datos, imagenes y captura del modelo. |
| Sprint 4 | Mejorar edicion visual de modelos 3D tipo paint y publicacion comunitaria de modelos editados. | En progreso; base de edicion y publicacion implementada, pintura avanzada sobre textura queda como mejora. |

## Sprint 1: base del sistema

**Objetivo:** crear la arquitectura inicial y permitir que el sistema tenga usuarios autenticados.

**Historias principales:**

- Como usuario, quiero registrarme para acceder a mis mascotas.
- Como usuario, quiero iniciar sesion para gestionar mis registros.
- Como administrador, quiero tener un rol diferenciado para acceder a informacion general.

**Entregables:**

- Backend con NestJS.
- Frontend con Next.js.
- Base de datos PostgreSQL gestionada con Prisma.
- Autenticacion con JWT.
- Roles `USER` y `ADMIN`.

**Criterio de terminado:**

- El usuario puede registrarse e iniciar sesion.
- La API responde correctamente.
- La base de datos almacena usuarios.

## Sprint 2: gestion de mascotas

**Objetivo:** permitir que cada usuario registre sus mascotas y que el administrador pueda consultar registros generales.

**Historias principales:**

- Como usuario, quiero agregar una mascota con nombre, categoria y caracteristicas.
- Como usuario, quiero ver solo mis mascotas.
- Como administrador, quiero ver mascotas de todos los usuarios.

**Entregables:**

- CRUD de mascotas.
- Relacion entre mascota y usuario.
- Panel de dashboard.
- Vista administrativa.
- Campos de categoria, raza, descripcion y caracteristicas.

**Criterio de terminado:**

- Cada mascota queda asociada a un usuario.
- El administrador puede revisar registros generales.
- El usuario comun no administra registros ajenos.

## Sprint 3: busqueda, fotos, modelos 3D y PDF

**Objetivo:** convertir el registro de mascota en una ficha util para busqueda.

**Historias principales:**

- Como usuario, quiero subir fotos reales de mi mascota.
- Como usuario, quiero seleccionar una zona aproximada donde fue vista por ultima vez.
- Como usuario, quiero seleccionar un modelo 3D compatible con la categoria de la mascota.
- Como usuario, quiero exportar un cartel PDF para difundir la busqueda.

**Entregables:**

- Carga y visualizacion de imagenes.
- Modelos 3D organizados por categoria: perro, gato y conejo.
- Filtro de modelos 3D segun especie.
- Captura del modelo 3D dentro del PDF.
- Ficha exportable con datos, fotos, zona aproximada y telefono de contacto.
- Validacion de privacidad para no publicar coordenadas exactas.

**Criterio de terminado:**

- El PDF se genera con informacion completa.
- Las fotos no se cortan.
- El modelo 3D se incluye como captura visual.
- La ubicacion se maneja como zona aproximada.

## Sprint 4: edicion de modelos 3D

**Objetivo:** permitir personalizar modelos 3D para representar mejor los rasgos de la mascota.

**Historias principales:**

- Como usuario, quiero editar el modelo 3D de mi mascota.
- Como usuario, quiero usar una paleta de colores para marcar rasgos.
- Como usuario, quiero decidir si mi modelo editado sera publico o privado.
- Como visitante, quiero usar modelos publicos como referencia.

**Entregables actuales:**

- Selector de modelo 3D.
- Edicion de nombre, descripcion y color.
- Guardado publico o privado.
- Base para almacenar pinturas o trazos del modelo.

**Trabajo pendiente:**

- Pintura directa sobre la textura original del modelo.
- Herramientas tipo lapiz, pincel y brocha.
- Modo de edicion sin rotacion automatica.
- Guardado de trazos por superficie del modelo.

**Criterio de terminado propuesto:**

- El usuario puede pintar detalles sobre el modelo sin perder su textura original.
- El sistema guarda la personalizacion y la muestra nuevamente al abrir la mascota.
- El usuario decide si comparte el modelo editado con la comunidad.

## Conclusion de sprints

El desarrollo avanzo desde una base tecnica hasta una aplicacion funcional. Los tres primeros sprints cubren el producto minimo viable y el cuarto sprint se enfoca en mejorar la diferenciacion visual de las mascotas mediante edicion 3D.
