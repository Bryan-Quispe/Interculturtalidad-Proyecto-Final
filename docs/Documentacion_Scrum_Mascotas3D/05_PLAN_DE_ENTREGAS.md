# Plan de entregas y métricas Scrum

## 1. Horizonte de entrega

El proyecto se organizó en cuatro sprints académicos. La duración exacta debe completarse con el calendario real; para la defensa se recomienda presentar cada sprint como una iteración de duración fija.

| Sprint | Meta | Puntos aceptados | Entrega principal |
| --- | --- | ---: | --- |
| 1 | Disponer de una base segura y persistente. | 24 | Autenticación, roles y arquitectura inicial. |
| 2 | Gestionar mascotas por propietario. | 24 | CRUD, categorías, características y administración. |
| 3 | Apoyar la búsqueda y difusión. | 33 | Fotos, mapa, catálogo 3D y PDF inicial. |
| 4 | Mejorar identificación y experiencia de exportación. | 37 | Pintura UV y editor completo de cartel. |

> Los puntos corresponden a estimación relativa aceptada según el backlog actual. No representan horas ni sustituyen registros reales de esfuerzo.

## 2. Release Goal

Entregar una aplicación web demostrable que permita a un propietario registrar una mascota perdida, asociar evidencia visual, proteger su ubicación exacta y producir un cartel listo para difusión.

## 3. Dependencias principales

```mermaid
flowchart LR
    S1["Sprint 1: identidad y persistencia"] --> S2["Sprint 2: mascotas"]
    S2 --> S3["Sprint 3: búsqueda, mapa y PDF"]
    S3 --> S4["Sprint 4: edición 3D y cierre"]
```

## 4. Seguimiento

Para cada sprint se recomienda registrar:

- Puntos comprometidos y aceptados.
- Historias terminadas y trasladadas.
- Defectos encontrados antes y después de la Review.
- Impedimentos y tiempo de resolución.
- Acción de mejora acordada en la retrospectiva.

## 5. Interpretación de velocidad

La velocidad no debe utilizarse para comparar personas. Su valor es ayudar a prever cuánto trabajo similar puede aceptar el equipo. El crecimiento de los sprints 3 y 4 se explica por la incorporación de integraciones y por una división más detallada del backlog; no prueba por sí solo un aumento de productividad.

