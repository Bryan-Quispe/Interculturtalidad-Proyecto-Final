# Informe final del proyecto

## 1. Nombre del proyecto

**Mascotas 3D - Wasi Wiwakuna 3D**

Plataforma web bilingüe kichwa-castellano para apoyar la búsqueda de mascotas perdidas mediante fotografías, ubicación aproximada, carteles PDF y modelos 3D personalizables.

## 2. Problemática identificada

Cuando una mascota se pierde, muchas familias dependen de carteles físicos o publicaciones dispersas en redes sociales. Esta práctica tiene limitaciones:

- Una fotografía puede no mostrar marcas, manchas o rasgos visibles desde otros ángulos.
- Los datos suelen estar incompletos o poco ordenados.
- La ubicación puede exponer información sensible si se publica con demasiada exactitud.
- El cartel generalmente está solo en castellano, lo que reduce su alcance en comunidades kichwahablantes.

## 3. Usuarios

| Usuario | Necesidad |
| --- | --- |
| Propietario de mascota perdida | Registrar información, fotos, zona aproximada, contacto y generar un cartel. |
| Vecino o visitante | Revisar mascotas perdidas cercanas y reconocer características. |
| Administrador | Revisar registros, modelos 3D, usuarios y contenido del sistema. |
| Comunidad kichwahablante | Acceder a la búsqueda y al cartel en su lengua o en modo bilingüe. |

## 4. Solución tecnológica desarrollada

El sistema permite:

- Crear cuenta e iniciar sesión.
- Registrar mascotas con nombre, especie, raza, tamaño, color, señas y descripción.
- Subir fotografías reales.
- Seleccionar una zona aproximada en mapa.
- Elegir un modelo 3D de perro, gato o conejo.
- Pintar rasgos visuales en el modelo para destacar manchas o marcas.
- Generar un cartel PDF con datos, fotos, contacto y texto en castellano, kichwa o bilingüe.
- Consultar mascotas públicas sin iniciar sesión.

## 5. Enfoque intercultural

El enfoque intercultural no se limita a traducir una pantalla. El sistema incorpora la lengua kichwa en:

- Interfaz pública.
- Registro e inicio de sesión.
- Panel de usuario.
- Listas cerradas de datos ya guardados.
- Editor de cartel.
- PDF final de búsqueda.
- Glosario documentado con fuentes.

La decisión de incluir modo bilingüe responde a una necesidad práctica: un cartel puede estar dirigido a una comunidad diversa, por lo que debe poder leerse en kichwa y castellano. En el modo bilingüe, el kichwa aparece primero para evitar tratarlo como idioma secundario.

## 6. Stack técnico

| Capa | Tecnología |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Backend | NestJS 10, TypeScript |
| Base de datos | PostgreSQL, Prisma ORM |
| Autenticación | JWT, bcrypt |
| Imágenes | Cloudinary desde backend |
| Mapas | Leaflet, OpenStreetMap |
| 3D | Three.js |
| PDF | jsPDF |

## 7. Arquitectura general

El proyecto se separa en frontend, backend y base de datos:

- **Frontend:** vistas, formularios, panel, internacionalización, editor 3D y generación de cartel.
- **Backend:** autenticación, usuarios, mascotas, modelos 3D, subida de imágenes y reglas de acceso.
- **Base de datos:** usuarios, mascotas, características, modelos, relación con propietario y derivación de modelos editados.

## 8. Seguridad y privacidad

Las principales decisiones de privacidad fueron:

- El cartel no exporta latitud ni longitud.
- El usuario publica solo una zona aproximada.
- Las credenciales de Cloudinary no llegan al navegador.
- Las rutas privadas usan JWT.
- Los usuarios solo gestionan sus propios registros.
- El administrador tiene acceso diferenciado.

## 9. Resultado final

El incremento final cubre el flujo principal de búsqueda:

1. El propietario registra la mascota.
2. Agrega características, fotos y zona.
3. Selecciona o personaliza un modelo 3D.
4. Prepara un cartel.
5. Exporta PDF en castellano, kichwa o bilingüe.
6. La comunidad puede revisar registros públicos y apoyar la búsqueda.

## 10. Limitaciones reconocidas

- El historial de Git se formalizó al final del proyecto y no refleja la cronología completa.
- La traducción kichwa se respaldó con fuentes, pero debería validarse con hablantes nativos o docentes del área.
- Las pruebas automatizadas E2E quedan como mejora futura.
- La moderación de modelos públicos puede fortalecerse.

## 11. Conclusión

Mascotas 3D - Wasi Wiwakuna 3D responde a una necesidad real y la conecta con un enfoque intercultural práctico. La solución ayuda a difundir búsquedas de mascotas perdidas de forma más clara, segura e inclusiva. El proceso Scrum documentado demuestra planificación, seguimiento, inspección, adaptación y cierre del proyecto.

