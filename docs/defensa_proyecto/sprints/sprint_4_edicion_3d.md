# Sprint 4: edicion visual de modelos 3D

## Objetivo

Permitir que el usuario personalice un modelo 3D para representar rasgos especificos de su mascota.

## Alcance

- Abrir modelo 3D asociado a una mascota.
- Permitir edicion de nombre y descripcion del modelo.
- Permitir seleccion de color.
- Permitir guardar el modelo como publico o privado.
- Preparar almacenamiento de pinturas o trazos.

## Historias de usuario

| Historia | Descripcion | Prioridad |
| --- | --- | --- |
| HU-11 | Como usuario quiero editar el modelo 3D de mi mascota. | Alta |
| HU-12 | Como usuario quiero marcar colores caracteristicos sobre el modelo. | Alta |
| HU-13 | Como usuario quiero decidir si comparto mi modelo editado. | Media |
| HU-14 | Como usuario quiero que el modelo conserve su textura original. | Alta |

## Entregables actuales

- Modal o vista de edicion de modelo.
- Campos editables de nombre y descripcion.
- Paleta de colores.
- Opcion de publicacion.
- Base de datos preparada para guardar pinturas en JSON.

## Pendiente tecnico

- Pintura directa sobre textura original.
- Herramientas: lapiz, pincel y brocha.
- Modo de edicion sin rotacion automatica.
- Guardado de trazos sobre coordenadas del modelo.
- Recuperacion de trazos al volver a abrir el modelo.

## Criterios de aceptacion futuros

- El usuario puede pintar detalles sin reemplazar la textura base.
- El modelo no rota solo mientras se pinta.
- El usuario puede rotar o hacer zoom manualmente.
- Los cambios persisten despues de guardar.
- El usuario decide si el modelo editado es publico o privado.

## Resultado

Sprint en evolucion. La base de edicion existe, pero la personalizacion tipo paint sobre textura original se considera la mejora principal pendiente.
