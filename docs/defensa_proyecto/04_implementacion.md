# Implementacion

## Tecnologias utilizadas

| Capa | Tecnologia | Funcion |
| --- | --- | --- |
| Frontend | Next.js, React, Tailwind CSS | Interfaz web, formularios, dashboard y visualizacion. |
| 3D | Three.js, React Three Fiber, Drei | Carga, visualizacion y captura de modelos 3D. |
| PDF | jsPDF | Generacion de ficha o cartel exportable. |
| Backend | NestJS | API REST, seguridad y logica del sistema. |
| Base de datos | PostgreSQL | Persistencia de usuarios, mascotas y modelos. |
| ORM | Prisma | Modelado y acceso tipado a datos. |
| Seguridad | JWT, bcrypt, guards | Autenticacion, contrasenas y autorizacion. |

## Implementacion del backend

El backend se organizo por modulos para separar responsabilidades:

- `AuthModule`: registro e inicio de sesion.
- `UsersModule`: gestion del perfil del usuario.
- `AnimalesModule`: gestion de mascotas.
- `Modelos3DModule`: carga, catalogo y edicion de modelos 3D.
- `PrismaModule`: conexion a base de datos.

## Implementacion del frontend

El frontend implementa:

- Pagina de inicio orientada a busqueda de mascotas perdidas.
- Login y registro.
- Dashboard del usuario.
- Vista administrativa.
- Modal de nueva mascota.
- Selector de categoria.
- Carga de imagenes.
- Mapa o seleccion de zona aproximada.
- Visualizador 3D.
- Vista de ficha y exportacion PDF.

## Gestion de mascotas

Cada mascota se guarda asociada a un usuario mediante `usuarioId`. Esto permite que:

- El usuario vea sus propios registros.
- El administrador vea todos los registros.
- La informacion se mantenga organizada por propietario.

Campos importantes:

- Nombre.
- Categoria.
- Raza o especie.
- Descripcion.
- Caracteristicas.
- Fotos.
- Zona aproximada.
- Fecha y referencia de ultimo avistamiento.
- Telefono de contacto.
- Modelo 3D asociado.

## Gestion de modelos 3D

Los modelos 3D se clasifican por categoria:

- `PERRO`
- `GATO`
- `CONEJO`

Esta clasificacion evita que el usuario seleccione un modelo incorrecto. Por ejemplo, si registra un gato, el sistema solo debe mostrar modelos de gato.

## Exportacion PDF

La exportacion PDF es una funcionalidad clave porque convierte la informacion ingresada en un documento util para difusion.

El PDF incluye:

- Titulo de alerta.
- Nombre de la mascota.
- Categoria.
- Zona aproximada.
- Fecha o referencia de ultimo avistamiento.
- Telefono de contacto.
- Descripcion.
- Caracteristicas.
- Fotografias subidas.
- Captura del modelo 3D.

## Edicion 3D

La edicion 3D se plantea como una herramienta para acercar el modelo generico a la apariencia real de la mascota.

Implementado:

- Visualizacion del modelo.
- Edicion de nombre y descripcion.
- Seleccion de color.
- Opcion de guardar como publico o privado.
- Estructura para almacenar pinturas en formato JSON.

Pendiente de evolucion:

- Pintar sobre la textura original del modelo.
- Agregar herramientas de lapiz, pincel y brocha.
- Controlar rotacion manual durante edicion.
- Guardar trazos por coordenadas de superficie.

## Implementacion de privacidad

La ubicacion de la mascota se trata como zona aproximada. Esto es importante porque publicar una direccion exacta podria ser inseguro. Por eso el sistema debe priorizar barrio, sector o referencia general.

## Resultado

La implementacion logro un sistema funcional para registrar mascotas perdidas, asociarlas con duenos, agregar imagenes, usar modelos 3D y generar documentos exportables.
