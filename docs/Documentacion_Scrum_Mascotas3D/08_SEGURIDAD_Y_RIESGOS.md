# Seguridad, privacidad y gestión de riesgos

## 1. Controles implementados

| Riesgo | Control |
| --- | --- |
| Acceso no autorizado | JWT, Passport y guards de NestJS. |
| Administración indebida | Roles `USER` y `ADMIN`. |
| Manipulación de registros ajenos | Verificación de propietario en servicios. |
| Contraseñas expuestas | Hash mediante bcrypt. |
| Datos inválidos | DTO con class-validator y validación de formularios. |
| Ubicación fuera del país | Restricción y validación de código `EC`. |
| Exposición de domicilio | Publicación de zona aproximada; PDF sin coordenadas. |
| Abuso de imágenes | Verificación de tipo, protocolo, cantidad y tamaño en exportación. |
| Nombre de archivo malicioso | Normalización del nombre antes de descargar. |
| Acción accidental en 3D | Modos exclusivos de rotar, zoom y pintar. |

## 2. Gestión de secretos

- Las claves deben almacenarse en `.env` o `.env.local`.
- No se deben versionar secretos de Cloudinary, Google Maps, JWT o base de datos.
- Un secreto compartido por mensajes o capturas debe rotarse.
- El frontend solo puede contener claves diseñadas para uso público y restringidas por dominio.

## 3. Matriz de riesgos

| ID | Riesgo | Prob. | Impacto | Respuesta |
| --- | --- | --- | --- | --- |
| R-01 | Modelo sin UV no admite pintura precisa. | Media | Alta | Validar modelo y mostrar advertencia. |
| R-02 | Modelo o textura demasiado pesada. | Media | Alta | Limitar tamaño, reducir resolución y probar en móvil. |
| R-03 | Google Maps no carga por clave o cuota. | Media | Alta | Mensaje claro, caché temporal y configuración documentada. |
| R-04 | Imagen externa bloqueada por CORS. | Media | Media | Registrar omisión y priorizar almacenamiento controlado. |
| R-05 | Token expirado durante una operación. | Media | Media | Limpiar sesión y redirigir al login. |
| R-06 | Usuario publica información demasiado precisa. | Baja | Alta | Instrucciones, zona aproximada y revisión del PDF. |
| R-07 | Pérdida de base de datos. | Baja | Crítica | Backups, migraciones y prueba de restauración. |
| R-08 | Modelo público contiene contenido inapropiado. | Media | Media | Moderación administrativa futura. |

## 4. Privacidad por diseño

El principio aplicado es minimizar la información publicada. La ubicación exacta sirve para producir una zona comprensible, pero no se incluye en el cartel. Las fotografías y el teléfono son seleccionados por el propietario dentro del editor previo.

## 5. Recomendaciones antes de producción

1. Rotar todas las credenciales que hayan sido compartidas fuera del gestor de secretos.
2. Configurar HTTPS y cookies seguras o almacenamiento de sesión reforzado.
3. Aplicar rate limiting a login, carga y consultas públicas.
4. Validar contenido real del archivo, no solo extensión o MIME declarado.
5. Incorporar antivirus para archivos subidos.
6. Añadir logs de auditoría y política de retención.
7. Implementar backups cifrados y restauración periódica.

