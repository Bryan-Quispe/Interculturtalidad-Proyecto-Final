# Casos de prueba técnicos

| ID | Área | Procedimiento resumido | Resultado esperado |
| --- | --- | --- | --- |
| VT-01 | Backend | Ejecutar `npm run build`. | Código 0 y carpeta `dist`. |
| VT-02 | Frontend | Ejecutar `npm run type-check`. | Cero errores TypeScript. |
| VT-03 | Frontend | Ejecutar `npm run build`. | Compilación y páginas generadas. |
| VT-04 | Auth | Solicitar ruta privada sin JWT. | HTTP 401. |
| VT-05 | Propiedad | Usuario intenta editar mascota ajena. | HTTP 403 o recurso no accesible. |
| VT-06 | Roles | Usuario normal intenta función administrativa. | Operación rechazada. |
| VT-07 | Categoría | Consultar catálogo para `GATO`. | Solo modelos de gato. |
| VT-08 | Mapa | Seleccionar resultado fuera de Ecuador. | Rechazo y zona vacía. |
| VT-09 | Pintura | Trazar sobre malla con UV y guardar. | JSON contiene UV, superficie, color y tamaño. |
| VT-10 | Persistencia 3D | Reabrir modelo personalizado. | Textura reconstruida con trazos. |
| VT-11 | PDF | Elegir segunda foto como portada. | Portada del PDF usa esa foto. |
| VT-12 | PDF | Exportar con texto largo. | Texto ajustado sin desbordar A4. |
| VT-13 | Privacidad | Inspeccionar texto del PDF. | No aparecen latitud ni longitud. |
| VT-14 | Archivo | Usar nombre con símbolos. | Nombre descargado queda normalizado. |
| VT-15 | Imagen | Intentar recurso no imagen o mayor a 12 MB. | Imagen rechazada u omitida de forma controlada. |

## Registro recomendado

Para cada caso completar la plantilla `plantillas/PLANTILLA_CASO_DE_PRUEBA.md` y guardar captura, salida o PDF en `evidencias`.

