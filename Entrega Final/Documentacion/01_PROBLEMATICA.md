# 1. La problemática identificada

> Rúbrica §1: explicar la necesidad detectada, quiénes son los usuarios y por
> qué era necesario desarrollar la solución.

---

## 1. La necesidad detectada

Cuando una mascota se pierde, la búsqueda ocurre casi siempre en canales
informales: grupos de WhatsApp del barrio, publicaciones sueltas en Facebook,
carteles impresos a mano y pegados en postes. Ese circuito falla por cuatro
razones concretas, no por falta de voluntad:

**La información llega incompleta y sin estructura.** Un mensaje reenviado
pierde la foto, o llega la foto sin el teléfono, o el teléfono sin la zona. No
hay un formato mínimo que obligue a incluir lo indispensable, así que cada
publicación omite algo distinto y quien quiere ayudar no sabe qué le falta.

**Una fotografía sola no siempre basta para identificar al animal.** Las fotos
de mascotas se toman de noche, de espaldas, movidas o con el animal echado.
Muchos perros mestizos negros medianos se parecen entre sí en una foto de
celular. Quien cree haber visto al animal no tiene contra qué contrastar la
seña que recuerda: el color de una oreja, una mancha en el lomo.

**Publicar la dirección exacta expone al propietario.** El impulso natural al
buscar es dar todos los datos posibles, incluida la dirección de casa. Eso
convierte un cartel de búsqueda en información útil para terceros
malintencionados, un riesgo documentado en casos de extorsión con supuesta
recuperación de mascotas.

**La información se dispersa y no se puede consultar después.** Un mensaje de
WhatsApp de hace tres semanas es irrecuperable en la práctica. No existe un
lugar donde alguien que encontró un animal pueda ir a mirar quién lo está
buscando.

### La dimensión que casi siempre se omite

A las cuatro anteriores se suma una quinta, que es la que da sentido
intercultural al proyecto: **todo ese circuito informal ocurre en castellano**.

En Ecuador el kichwa es lengua oficial de relación intercultural según el
artículo 2 de la Constitución de 2008, y el kichwa es la lengua indígena con
más hablantes del país. Sin embargo, prácticamente ningún servicio digital
cotidiano —y desde luego ninguna plataforma de mascotas perdidas— ofrece una
interfaz en kichwa. Una familia kichwahablante que pierde un animal debe
operar en una lengua que no es la propia para realizar un trámite doméstico
elemental.

El animal doméstico, además, no es un objeto marginal en la economía y la vida
familiar rural andina: `allku`, `misi` y `wallinku` (perro, gato y conejo) son
parte del `wasi` —la casa entendida como unidad doméstica—, con funciones de
cuidado del ganado, control de plagas y sustento. Perder uno es una pérdida
material, no solo afectiva.

Este punto se desarrolla en
[03_ENFOQUE_INTERCULTURAL.md](03_ENFOQUE_INTERCULTURAL.md).

---

## 2. Quiénes son los usuarios

| Actor | Quién es | Qué necesita |
| --- | --- | --- |
| **Propietario** | Persona que perdió a su mascota. Puede ser hispanohablante o kichwahablante. | Publicar una ficha completa y un cartel difundible, sin exponer su domicilio. |
| **Visitante / comunidad** | Vecino que vio un animal o quiere ayudar a buscar. No necesita cuenta. | Consultar mascotas públicas por especie y zona, y contrastar lo que vio. |
| **Administrador** | Responsable de la plataforma. | Supervisar registros de todos los usuarios y filtrar por propietario. |

El usuario kichwahablante no es un actor separado: es el mismo propietario o
visitante, operando la aplicación en su lengua. Esa decisión de diseño es
deliberada y se justifica en el documento de enfoque intercultural — separar al
usuario indígena en un "modo especial" habría reproducido la segregación que el
proyecto intenta corregir.

---

## 3. Por qué era necesario desarrollar la solución

No bastaba con usar las herramientas existentes, por razones que se pueden
verificar:

**Las redes sociales generales no imponen estructura.** Facebook no obliga a
declarar especie, color, zona ni contacto, y no permite filtrar por esos
campos. La aplicación sí: el registro es un formulario con validación, y el
catálogo se filtra por categoría y zona.

**Las plataformas de mascotas existentes no manejan la privacidad de la
ubicación.** El sistema distingue entre la ubicación interna que el propietario
registra y la **zona aproximada** que se publica. El PDF exportado nunca
contiene latitud ni longitud exactas — es un criterio de aceptación verificable,
no una promesa.

**Ninguna ofrece interfaz en kichwa.** Es la brecha central que justifica el
proyecto en el marco de la asignatura.

**Ninguna resuelve el problema de identificación visual.** Aquí está la
contribución más específica del producto: además de las fotografías reales, el
propietario elige un **modelo 3D** de la especie correspondiente y **pinta sobre
su textura** las señas particulares del animal — la mancha, el parche de color,
la oreja distinta. El resultado es una referencia visual que se puede rotar y
mirar desde cualquier ángulo, algo que una fotografía fija no permite.

Esta última capacidad tiene además un valor concreto para el usuario con
dificultades de lectoescritura o que no domina el vocabulario descriptivo en
castellano: **señalar y pintar un color sobre un modelo no requiere escribir**.

---

## 4. Objetivo del producto

> Facilitar la difusión organizada y visual de mascotas perdidas mediante una
> ficha digital que combine información verificable, fotografías reales y una
> referencia tridimensional personalizable, accesible tanto en castellano como
> en kichwa y respetuosa con la privacidad del propietario.

### Objetivos específicos

1. Gestionar usuarios, roles y sesiones seguras.
2. Asociar cada mascota con un propietario responsable.
3. Registrar características, fotografías, contacto y último avistamiento.
4. Filtrar el catálogo de modelos 3D según especie (perro, gato o conejo).
5. Permitir rotación, zoom y pintura directa sobre la textura del modelo.
6. Generar un cartel PDF configurable sin revelar coordenadas exactas.
7. Ofrecer la interfaz completa en kichwa y castellano, conmutable en caliente.
8. Proporcionar administración y consulta pública controlada.

---

## 5. Trazabilidad problema → solución

Cada problema declarado arriba tiene una función del sistema que lo responde.
Esta tabla es la que conviene tener a mano en la defensa, porque la rúbrica
verifica exactamente esto: *"que las funcionalidades principales respondan a la
problemática inicialmente planteada"*.

| # | Problema | Función que lo resuelve | Dónde se demuestra |
| --- | --- | --- | --- |
| P1 | Información incompleta y sin estructura | Formulario de registro con campos obligatorios y validación en cliente y servidor | Demo paso 2 |
| P2 | La foto no basta para identificar | Modelo 3D por especie + pintura UV de señas particulares | Demo pasos 4–5 |
| P3 | Publicar la dirección expone al propietario | Separación ubicación interna / zona pública; PDF sin coordenadas | Demo paso 6 |
| P4 | La información se dispersa | Catálogo público consultable, filtrado por especie y zona | Demo paso 7 |
| P5 | Todo el circuito opera solo en castellano | Interfaz bilingüe kichwa–castellano con norma ALKI | Transversal a toda la demo |

El guion de demostración numerado está en
[02_SOLUCION_TECNOLOGICA.md](02_SOLUCION_TECNOLOGICA.md#5-guion-de-demostración).
