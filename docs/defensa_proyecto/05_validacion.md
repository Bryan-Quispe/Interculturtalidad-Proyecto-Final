# Validacion

La validacion responde a la pregunta: **el sistema construido satisface la necesidad real del usuario?**

## Objetivo de validacion

Comprobar que la aplicacion permite registrar y difundir informacion util para encontrar una mascota perdida, manteniendo privacidad y claridad visual.

## Validacion funcional

| Elemento validado | Criterio | Resultado esperado |
| --- | --- | --- |
| Registro de usuario | El usuario puede crear cuenta e iniciar sesion. | Acceso correcto al dashboard. |
| Registro de mascota | El formulario guarda datos minimos obligatorios. | Mascota asociada al usuario. |
| Categoria | Solo permite perro, gato o conejo. | Datos normalizados. |
| Modelos 3D | Se filtran por categoria. | No se asigna un modelo de otra especie. |
| Fotos | Se muestran sin recorte agresivo. | Evidencia visual clara. |
| Ubicacion | Se registra zona aproximada. | Se evita exponer direccion exacta. |
| PDF | Exporta informacion completa. | Cartel util para difusion. |
| Administrador | Puede revisar registros generales. | Control y seguimiento del sistema. |

## Validacion con criterios de aceptacion

### Caso 1: registrar mascota perdida

**Dado** que el usuario inicio sesion,  
**cuando** llena el formulario de nueva mascota,  
**entonces** el sistema debe crear la mascota asociada a su cuenta.

### Caso 2: seleccionar modelo 3D

**Dado** que la mascota tiene categoria gato, perro o conejo,  
**cuando** el usuario abre el selector de modelos,  
**entonces** solo deben aparecer modelos de la misma categoria.

### Caso 3: exportar cartel

**Dado** que la mascota tiene informacion, fotos y modelo,  
**cuando** el usuario exporta el PDF,  
**entonces** el documento debe incluir datos de contacto, imagenes y captura 3D.

### Caso 4: proteger ubicacion

**Dado** que la mascota fue vista en una zona,  
**cuando** se muestra publicamente,  
**entonces** debe aparecer zona aproximada y no una direccion exacta.

## Validacion de UX y usabilidad

Para defender la calidad del sistema se usaron instrumentos complementarios:

| Instrumento | Tipo | Que evalua |
| --- | --- | --- |
| PSSUQ | Usabilidad | Facilidad de uso, claridad, eficiencia, errores y satisfaccion. |
| UEQ | Experiencia de usuario | Atractivo, claridad, eficiencia, innovacion, confianza y agrado. |
| Heuristicas de Bastien y Scapin | Evaluacion experta | Carga de trabajo, control, homogeneidad, feedback y gestion de errores. |

## Oportunidades de mejora detectadas

- Reducir carga visual en formularios largos.
- Mejorar el selector visual de categoria.
- Reforzar mensajes de exito al subir fotos o guardar cambios.
- Hacer mas clara la diferencia entre rotar el modelo y pintarlo.
- Mejorar la edicion avanzada del modelo 3D con herramientas tipo paint.

## Conclusion de validacion

El sistema cubre la necesidad principal: organizar informacion de mascotas perdidas y generar una ficha de busqueda. La validacion tambien muestra que la mayor oportunidad de mejora esta en hacer mas intuitiva la edicion 3D y reducir la complejidad del formulario.
