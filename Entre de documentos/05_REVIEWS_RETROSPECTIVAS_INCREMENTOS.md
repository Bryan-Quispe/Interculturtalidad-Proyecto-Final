# Reviews, retrospectivas e incrementos

## 1. Objetivo

Este documento muestra la evolución del producto al cierre de cada sprint. Sirve para evidenciar inspección, adaptación y mejora continua, que son elementos centrales de Scrum.

## 2. Incremento por sprint

| Sprint | Incremento | Valor entregado |
| --- | --- | --- |
| Sprint 1 | Base técnica con autenticación. | El sistema ya distingue usuarios, sesiones y roles. |
| Sprint 2 | Gestión de mascotas. | El usuario registra mascotas propias y el administrador puede revisar registros. |
| Sprint 3 | Búsqueda con fotos, mapa, 3D y PDF. | El registro se transforma en un cartel útil para difusión. |
| Sprint 4 | Interculturalidad, pintura 3D y cierre. | El producto queda alineado con la rúbrica y con usuarios kichwahablantes. |

## 3. Sprint Review 1

**Fechas:** 24 de mayo - 6 de junio de 2026  
**Meta:** base técnica y acceso seguro.

**Demostración:**

- Crear cuenta.
- Iniciar sesión.
- Validar token.
- Diferenciar usuario y administrador.

**Resultado:** incremento aceptado como base del sistema.

**Aprendizaje:** antes de construir funciones de búsqueda, era necesario asegurar identidad y propiedad de datos.

## 4. Sprint Review 2

**Fechas:** 7 de junio - 20 de junio de 2026  
**Meta:** gestión de mascotas por propietario.

**Demostración:**

- Crear mascota.
- Ver mascotas propias.
- Editar información.
- Revisar vista administrativa.

**Resultado:** incremento aceptado como base del dominio.

**Aprendizaje:** los campos como especie, color, raza y tamaño debían mantenerse como listas cerradas para poder traducirse de forma confiable.

## 5. Sprint Review 3

**Fechas:** 21 de junio - 11 de julio de 2026  
**Meta:** búsqueda, fotos, ubicación, 3D y PDF.

**Demostración:**

- Subir fotos.
- Elegir zona en mapa.
- Seleccionar modelo 3D.
- Generar cartel PDF.

**Resultado:** incremento funcional para la necesidad principal.

**Aprendizaje:** la privacidad era parte del producto. Por eso el cartel no debía contener coordenadas exactas.

## 6. Sprint Review 4

**Fechas:** 12 de julio - 25 de julio de 2026  
**Meta:** enfoque intercultural, pintura 3D, editor de cartel y documentación.

**Demostración:**

- Cambiar idioma de la interfaz.
- Ver modo bilingüe.
- Traducir datos guardados.
- Generar cartel en idioma elegido.
- Pintar rasgos sobre modelo.
- Elegir portada y orden de fotos.

**Resultado:** incremento final listo para defensa.

**Aprendizaje:** la interculturalidad debía explicarse como parte del núcleo del sistema, no como decoración.

## 7. Adaptaciones importantes

| Código | Situación detectada | Decisión | Valor |
| --- | --- | --- | --- |
| A1 | Publicar coordenadas exactas exponía al propietario. | Separar ubicación interna y zona pública. | Privacidad y seguridad. |
| A2 | El secreto de Cloudinary no podía estar en frontend. | Subida de imágenes desde backend. | Protección de credenciales. |
| A3 | Datos anteriores quedaban solo en castellano. | Traducir listas cerradas al mostrar. | Inclusión sin migrar base. |
| A4 | El modelo compartido podía dañarse al editar. | Crear copia derivada para edición. | Conserva catálogo común. |
| A5 | Pintar y rotar al mismo tiempo causaba errores. | Modos separados: rotar, zoom, pintar. | Mejor usabilidad. |
| A6 | La pintura flotante no seguía la superficie. | Pintura con coordenadas UV. | Representación visual más fiel. |
| A7 | El componente intercultural estaba subestimado al inicio. | Crear épica transversal EP-INT. | Alineación con rúbrica. |
| A8 | Git no evidenciaba el proceso real. | Documentar Scrum como evidencia principal. | Honestidad académica. |

## 8. Retrospectiva final

| Qué funcionó | Qué no funcionó | Acción de mejora |
| --- | --- | --- |
| Dividir el producto en incrementos demostrables. | Control de versiones iniciado tarde. | Crear repositorio desde el primer día. |
| Documentar traducción con fuentes. | Falta validación con hablantes nativos. | Revisar glosario con docente o comunidad kichwahablante. |
| Separar privacidad desde el diseño. | Sprint 3 concentró muchas integraciones. | Repartir integraciones externas en sprints distintos. |
| Usar modelos 3D para reforzar identificación visual. | Pruebas E2E automatizadas quedaron pendientes. | Agregarlas al backlog futuro. |
| Preparar documentación según rúbrica. | Parte de la documentación se consolidó al final. | Documentar avances al cierre de cada sprint. |

## 9. Conclusión Scrum

El proceso muestra un ciclo completo de Scrum académico: planificación, construcción, revisión, retrospectiva y adaptación. La evidencia más fuerte no es solo que el sistema exista, sino que evolucionó por decisiones justificadas durante el desarrollo.

