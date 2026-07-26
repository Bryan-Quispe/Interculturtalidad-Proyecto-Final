# Sprint 2 - Gestión de mascotas y administración

## Ficha

| Campo | Descripción |
| --- | --- |
| Sprint Goal | Permitir que cada usuario gestione sus mascotas y que el administrador supervise el conjunto. |
| Puntos aceptados | 24 |
| Historias | HU-07 a HU-12 |
| Estado | Completado |

## Historias seleccionadas

- Registrar mascotas.
- Seleccionar categoría controlada.
- Registrar características.
- Editar y eliminar registros propios.
- Consultar mascotas del usuario.
- Consultar y filtrar como administrador.

## Sprint Backlog técnico

| Tarea | Resultado |
| --- | --- |
| Definir `Animal` y `CaracteristicasAnimal`. | Dominio persistente. |
| Relacionar mascota y usuario. | Propiedad verificable. |
| Crear DTO de alta y actualización. | Entrada validada. |
| Implementar CRUD REST. | Gestión completa. |
| Crear formulario de mascota. | Registro desde la interfaz. |
| Crear tarjetas y ficha de detalle. | Consulta clara. |
| Añadir vista y filtro administrativo. | Supervisión global. |

## Criterios de aceptación

- La categoría solo acepta perro, gato o conejo.
- El registro queda asociado al usuario autenticado.
- El usuario normal consulta sus mascotas.
- El administrador consulta todas y filtra por propietario.
- Editar conserva identidad y relaciones.
- Eliminar requiere confirmación y permiso.

## Incremento

El sistema pasó de administrar cuentas a administrar el objeto central del negocio. El dashboard ofrece separación entre datos propios y datos globales según el rol.

## Review técnica

Demostración sugerida: iniciar sesión con dos cuentas, crear mascotas diferentes y comprobar que cada propietario ve las suyas; luego ingresar como administrador y filtrar ambos usuarios.

## Retrospectiva técnica

| Observación | Acción aplicada al Sprint 3 |
| --- | --- |
| El texto libre de categoría generaba inconsistencias. | Utilizar `select` y enum. |
| Una ficha sin fotos o ubicación tenía poco valor para buscar. | Priorizar evidencia y último avistamiento. |
| El administrador necesitaba conocer el propietario. | Incluir datos mínimos del usuario en consultas autorizadas. |

## Evidencia recomendada

- Formulario de nueva mascota.
- Tarjetas del propietario.
- Dashboard administrativo con filtro.
- Registros relacionados en Prisma Studio.

