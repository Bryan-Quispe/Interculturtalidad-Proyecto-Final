# Requisitos del sistema

## Requisitos funcionales

| Codigo | Requisito | Prioridad | Estado |
| --- | --- | --- | --- |
| RF-01 | Registrar usuarios con correo, nombre y contrasena. | Alta | Implementado |
| RF-02 | Iniciar sesion mediante credenciales. | Alta | Implementado |
| RF-03 | Diferenciar roles de usuario y administrador. | Alta | Implementado |
| RF-04 | Registrar mascotas asociadas al usuario autenticado. | Alta | Implementado |
| RF-05 | Permitir categorias perro, gato y conejo. | Alta | Implementado |
| RF-06 | Registrar caracteristicas de la mascota. | Alta | Implementado |
| RF-07 | Subir fotos reales de la mascota. | Alta | Implementado |
| RF-08 | Registrar zona o barrio aproximado donde fue vista. | Alta | Implementado |
| RF-09 | Validar que la ubicacion pertenezca a Ecuador. | Media | Parcial |
| RF-10 | Asociar modelos 3D segun categoria de mascota. | Alta | Implementado |
| RF-11 | Visualizar modelo 3D en el navegador. | Alta | Implementado |
| RF-12 | Exportar ficha PDF con fotos, datos y modelo 3D. | Alta | Implementado |
| RF-13 | Permitir que el administrador vea todas las mascotas. | Alta | Implementado |
| RF-14 | Permitir busqueda publica de mascotas por zona. | Media | Implementado base |
| RF-15 | Editar visualmente el modelo 3D. | Alta | En progreso |
| RF-16 | Guardar modelo editado como publico o privado. | Media | Implementado base |

## Requisitos no funcionales

| Codigo | Requisito | Justificacion |
| --- | --- | --- |
| RNF-01 | Seguridad mediante autenticacion JWT. | Protege informacion de usuarios y mascotas. |
| RNF-02 | Privacidad de ubicacion. | Se muestra zona aproximada, no direccion exacta. |
| RNF-03 | Validacion de datos de entrada. | Evita registros incompletos o inconsistentes. |
| RNF-04 | Responsividad. | Permite uso en computadora y movil. |
| RNF-05 | Rendimiento aceptable en visualizacion 3D. | Los modelos deben cargarse sin bloquear la interfaz. |
| RNF-06 | Mantenibilidad. | El sistema esta separado en frontend, backend y base de datos. |
| RNF-07 | Escalabilidad funcional. | El diseno permite agregar mas categorias o estados de mascota. |
| RNF-08 | Exportabilidad. | La informacion debe poder transformarse en PDF para difusion. |

## Reglas de negocio

- Una mascota siempre pertenece a un usuario.
- El administrador puede revisar mascotas de todos los usuarios.
- Un usuario normal debe gestionar solo sus propias mascotas.
- La categoria de la mascota controla que modelos 3D puede seleccionar.
- La ubicacion publica debe ser aproximada por seguridad.
- El telefono de contacto se solicita para exportar el cartel PDF.
- Un modelo 3D editado puede mantenerse privado o publicarse para ayudar a otros usuarios.

## Criterios de aceptacion principales

| Caso | Criterio |
| --- | --- |
| Registro de mascota | El formulario guarda nombre, categoria, descripcion, fotos, zona y contacto. |
| Asociacion 3D | Si la mascota es gato, solo se muestran modelos de gato; igual para perro y conejo. |
| Exportacion PDF | El PDF incluye datos del animal, fotos subidas y captura del modelo 3D. |
| Privacidad | El PDF y la vista publica muestran zona aproximada, no coordenadas exactas. |
| Administracion | El admin puede ver registros de otros usuarios y filtrarlos. |
