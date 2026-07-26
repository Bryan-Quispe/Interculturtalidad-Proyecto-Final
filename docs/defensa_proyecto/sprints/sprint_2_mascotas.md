# Sprint 2: gestion de mascotas

## Objetivo

Permitir que cada usuario registre y gestione sus mascotas, manteniendo relacion directa con el propietario.

## Alcance

- Crear entidad `Animal`.
- Relacionar mascota con `User`.
- Crear CRUD de mascotas.
- Crear dashboard de usuario.
- Crear vista administrativa inicial.

## Historias de usuario

| Historia | Descripcion | Prioridad |
| --- | --- | --- |
| HU-04 | Como usuario quiero registrar una mascota para guardar su informacion. | Alta |
| HU-05 | Como usuario quiero ver mis mascotas para administrarlas. | Alta |
| HU-06 | Como administrador quiero ver todas las mascotas registradas. | Alta |

## Entregables

- Endpoints de animales.
- Formulario de nueva mascota.
- Listado de mascotas.
- Asociacion mascota-dueno.
- Acceso diferenciado por rol.

## Validacion

- La mascota queda guardada con `usuarioId`.
- El usuario ve sus registros.
- El administrador puede ver registros generales.
- La categoria se almacena como perro, gato o conejo.

## Resultado

Sprint completado. El sistema paso de ser una base de autenticacion a una aplicacion con gestion real de mascotas.
