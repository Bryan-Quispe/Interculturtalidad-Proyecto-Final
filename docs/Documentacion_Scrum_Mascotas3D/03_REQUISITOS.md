# Especificación resumida de requisitos

## 1. Requisitos funcionales

| Código | Requisito | Prioridad | Estado |
| --- | --- | --- | --- |
| RF-01 | Registrar usuarios con nombre, correo y contraseña. | Must | Completado |
| RF-02 | Autenticar usuarios y emitir una sesión JWT. | Must | Completado |
| RF-03 | Diferenciar permisos de usuario y administrador. | Must | Completado |
| RF-04 | Crear, consultar, editar y eliminar mascotas. | Must | Completado |
| RF-05 | Asociar cada mascota con su propietario autenticado. | Must | Completado |
| RF-06 | Permitir categorías perro, gato y conejo mediante selección controlada. | Must | Completado |
| RF-07 | Registrar raza, descripción, tamaño, color y otras características. | Must | Completado |
| RF-08 | Cargar y mostrar varias fotografías de la mascota. | Must | Completado |
| RF-09 | Registrar teléfono y fecha del último avistamiento. | Must | Completado |
| RF-10 | Seleccionar zona o barrio con Google Maps. | Must | Completado |
| RF-11 | Rechazar ubicaciones que no pertenezcan a Ecuador. | Must | Completado |
| RF-12 | Consultar mascotas públicas por zona o categoría. | Should | Completado |
| RF-13 | Mostrar al administrador mascotas de todos los usuarios. | Must | Completado |
| RF-14 | Filtrar registros administrativos por propietario. | Should | Completado |
| RF-15 | Cargar y catalogar modelos 3D por especie. | Must | Completado |
| RF-16 | Ofrecer únicamente modelos compatibles con la categoría. | Must | Completado |
| RF-17 | Visualizar modelos GLB, GLTF u OBJ. | Must | Completado |
| RF-18 | Separar modos de rotación, zoom y pintura. | Must | Completado |
| RF-19 | Pintar sobre la textura original mediante coordenadas UV. | Must | Completado |
| RF-20 | Usar lápiz, pincel, brocha, color, deshacer y limpiar. | Should | Completado |
| RF-21 | Guardar trazos y reconstruir la personalización. | Must | Completado |
| RF-22 | Elegir visibilidad pública o privada del modelo editado. | Should | Completado |
| RF-23 | Previsualizar y editar el contenido del cartel antes de exportarlo. | Must | Completado |
| RF-24 | Seleccionar, ordenar y escoger la imagen principal del PDF. | Must | Completado |
| RF-25 | Exportar el cartel con nombre, fecha y hora en el archivo. | Must | Completado |

## 2. Requisitos no funcionales

| Código | Requisito | Medida o criterio |
| --- | --- | --- |
| RNF-01 | Seguridad | Rutas privadas protegidas con JWT y autorización por rol o propiedad. |
| RNF-02 | Privacidad | Las vistas públicas y el PDF no muestran coordenadas exactas. |
| RNF-03 | Integridad | DTO y formularios validan campos obligatorios y categorías. |
| RNF-04 | Usabilidad | Los flujos principales tienen etiquetas, estados y retroalimentación. |
| RNF-05 | Responsividad | La interfaz evita desbordamientos en móvil y escritorio. |
| RNF-06 | Rendimiento | Texturas e imágenes se limitan o reducen antes de procesarse. |
| RNF-07 | Compatibilidad | Navegador moderno con WebGL y JavaScript habilitado. |
| RNF-08 | Mantenibilidad | Frontend, backend, persistencia y documentación están separados. |
| RNF-09 | Trazabilidad | Cada requisito se relaciona con una historia, sprint y componente. |
| RNF-10 | Exportabilidad | PDF A4 legible, con imágenes sin recorte y texto controlado. |

## 3. Reglas de negocio

1. Una mascota pertenece exactamente a un usuario.
2. Un usuario gestiona sus registros; el administrador supervisa todos.
3. La categoría determina los modelos 3D disponibles.
4. La ubicación pública es aproximada y debe pertenecer a Ecuador.
5. El teléfono es obligatorio para descargar un cartel de búsqueda.
6. La personalización se guarda sin destruir el archivo base compartido.
7. Un modelo personalizado puede ser privado o compartido.
8. La vista 3D es referencia; las fotografías siguen siendo la evidencia principal.
9. El PDF admite hasta ocho fotografías seleccionadas y limita imágenes excesivas.

## 4. Supuestos y dependencias

- PostgreSQL y la API deben estar disponibles.
- La clave de Google Maps debe existir en `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
- Los modelos deben tener formato compatible y, para pintura precisa, coordenadas UV.
- Las imágenes externas deben permitir su descarga desde el navegador.

