# Documento maestro del proyecto Scrum

## 1. Identificación

| Campo | Valor |
| --- | --- |
| Proyecto | Mascotas 3D |
| Producto | Aplicación web para registrar y buscar mascotas perdidas |
| Responsable | Bryan Quispe |
| Enfoque | Desarrollo incremental con Scrum |
| Usuarios | Visitante, propietario autenticado y administrador |
| Plataformas | Navegador web de escritorio y móvil |

## 2. Resumen ejecutivo

Mascotas 3D permite registrar mascotas perdidas, asociarlas con su propietario, cargar fotografías, indicar una zona aproximada del último avistamiento y seleccionar un modelo 3D compatible con la especie. El usuario puede personalizar el modelo sobre su textura, preparar un cartel mediante una vista previa y exportar un PDF con información de contacto, fotografías y una referencia 3D.

El sistema protege la privacidad al diferenciar entre ubicación interna y zona pública aproximada. Un usuario administra sus propias mascotas, mientras que el administrador puede revisar registros globales y filtrar por propietario.

## 3. Objetivo del producto

Facilitar la difusión organizada y visual de mascotas perdidas mediante una ficha digital que combine información verificable, fotografías reales y una referencia tridimensional personalizable.

## 4. Objetivos específicos

1. Gestionar usuarios, roles y sesiones seguras.
2. Asociar cada mascota con un propietario.
3. Registrar características, fotografías, contacto y último avistamiento.
4. Filtrar modelos 3D según perro, gato o conejo.
5. Permitir rotación, zoom y pintura directa sobre la textura 3D.
6. Generar un cartel PDF configurable sin revelar coordenadas exactas.
7. Proporcionar administración y consulta pública controlada.

## 5. Estrategia Scrum

El desarrollo se dividió en cuatro incrementos. Cada sprint produjo una versión demostrable y redujo incertidumbre antes de incorporar funciones más complejas.

| Sprint | Meta | Incremento aceptable |
| --- | --- | --- |
| 1 | Crear la base técnica y el acceso seguro. | Registro, inicio de sesión, roles, API y base de datos. |
| 2 | Gestionar mascotas por propietario. | CRUD, categorías, características y vista administrativa. |
| 3 | Convertir el registro en una herramienta de búsqueda. | Fotos, ubicación aproximada, modelos por especie y PDF. |
| 4 | Mejorar la identificación visual y el cierre del producto. | Pintura UV, modos 3D separados y editor previo del cartel. |

## 6. Incremento actual

El incremento permite ejecutar el flujo completo:

1. Crear una cuenta e iniciar sesión.
2. Registrar una mascota y su información de búsqueda.
3. Seleccionar su categoría y un modelo 3D compatible.
4. Cargar fotografías y ubicar una zona aproximada.
5. Personalizar la textura del modelo con lápiz, pincel o brocha.
6. Abrir la ficha, preparar el cartel, ordenar imágenes y elegir la portada.
7. Exportar un PDF con nombre de mascota, fecha y hora en el archivo.

## 7. Tecnologías principales

| Capa | Tecnologías |
| --- | --- |
| Frontend | Next.js, React, TypeScript, Tailwind CSS, Zustand y Axios |
| Visualización 3D | Three.js, React Three Fiber y Drei |
| Backend | NestJS, TypeScript, Passport, JWT y class-validator |
| Persistencia | PostgreSQL y Prisma ORM |
| Archivos | Recursos locales y configuración para Cloudinary |
| Documentos | jsPDF |

## 8. Resultado

El producto demuestra una evolución incremental: primero resolvió identidad y persistencia, luego gestión del dominio, después difusión de la búsqueda y finalmente personalización visual. La documentación restante de esta carpeta presenta la evidencia técnica y la estructura Scrum que respaldan esa evolución.

