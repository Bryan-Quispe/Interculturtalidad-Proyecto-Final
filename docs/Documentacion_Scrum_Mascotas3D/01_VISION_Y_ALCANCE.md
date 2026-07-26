# Visión, alcance y contexto del producto

## 1. Problema

Cuando una mascota se pierde, la información suele difundirse en mensajes o imágenes sin estructura. Esto dificulta comparar fotografías, conocer la zona del último avistamiento y mantener un contacto confiable. Además, publicar una dirección exacta puede poner en riesgo al propietario.

## 2. Declaración de visión

Para propietarios y ciudadanos que participan en la búsqueda de mascotas perdidas, Mascotas 3D es una aplicación web que centraliza información, fotografías y referencias visuales tridimensionales. A diferencia de una publicación informal, genera un cartel consistente, configurable y respetuoso con la privacidad.

## 3. Actores

| Actor | Necesidad principal |
| --- | --- |
| Visitante | Consultar mascotas públicas por categoría o zona aproximada. |
| Usuario | Registrar y administrar sus mascotas y carteles. |
| Administrador | Supervisar mascotas y modelos de todos los usuarios. |
| Comunidad | Usar referencias públicas para apoyar la identificación. |

## 4. Alcance incluido

- Registro e inicio de sesión.
- Autorización con roles `USER` y `ADMIN`.
- Mascotas asociadas con su propietario.
- Categorías perro, gato y conejo.
- Fotografías, características y teléfono de contacto.
- Último avistamiento y zona aproximada.
- Catálogo 3D filtrado por especie.
- Visualización, rotación, zoom y personalización de textura.
- Publicación pública o privada de modelos editados.
- Preparación y exportación de cartel PDF.
- Administración global y filtro por propietario.

## 5. Fuera del alcance actual

- Reconocimiento automático de mascotas mediante inteligencia artificial.
- Rastreo GPS en tiempo real.
- Aplicación móvil nativa.
- Mensajería interna entre usuarios.
- Verificación gubernamental de identidad.
- Impresión física o servicio de reparto de carteles.

## 6. Restricciones

- La calidad del modelo depende de que el archivo tenga geometría y coordenadas UV válidas.
- Google Maps requiere una clave configurada en el entorno del frontend.
- La carga externa de imágenes depende de disponibilidad y permisos CORS.
- La ubicación pública debe mantenerse aproximada.
- Los archivos 3D de gran tamaño pueden afectar dispositivos con recursos limitados.

## 7. Criterios de éxito

- El propietario completa el registro sin ingresar datos incompatibles.
- Solo se ofrecen modelos de la categoría seleccionada.
- La personalización conserva la textura original.
- El cartel se previsualiza y exporta sin desbordamiento de texto.
- El PDF no incluye latitud ni longitud exactas.
- Un usuario no puede administrar mascotas de otra cuenta.

