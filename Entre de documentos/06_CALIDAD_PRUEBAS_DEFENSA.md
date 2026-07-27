# Calidad, pruebas y defensa técnica

## 1. Objetivo

Demostrar que el sistema no solo funciona durante la exposición, sino que fue revisado con criterios de calidad, seguridad, privacidad, usabilidad y accesibilidad básica.

## 2. Estrategia de calidad

| Nivel | Qué verifica | Evidencia |
| --- | --- | --- |
| Estático | Tipos y estructura del código. | TypeScript y revisión de componentes. |
| Backend | Rutas, permisos, persistencia y validaciones. | API NestJS, JWT, roles y Prisma. |
| Frontend | Navegación, formularios, errores y estados. | Next.js, validaciones por paso y dashboard. |
| Integración | Flujo completo frontend-backend-base. | Registro, login, mascota, fotos, mapa, 3D y PDF. |
| Seguridad | Protección de datos y secretos. | Cloudinary en backend, JWT y zona aproximada. |
| Aceptación | Valor para usuarios. | Cartel final y experiencia bilingüe. |

## 3. Casos de prueba críticos

| ID | Escenario | Resultado esperado |
| --- | --- | --- |
| CP-01 | Registro con correo nuevo. | Cuenta creada y contraseña guardada como hash. |
| CP-02 | Login válido. | Devuelve token y permite acceso al dashboard. |
| CP-03 | Login inválido. | Rechazo controlado sin revelar información sensible. |
| CP-04 | Usuario consulta mascotas propias. | No ve registros de otros usuarios. |
| CP-05 | Administrador consulta registros. | Accede a vista global autorizada. |
| CP-06 | Crear mascota con datos mínimos válidos. | Registro persistido correctamente. |
| CP-07 | Subir fotos. | Imágenes almacenadas desde backend. |
| CP-08 | Seleccionar punto fuera de Ecuador. | El sistema impide o advierte la selección. |
| CP-09 | Generar cartel sin teléfono. | Se solicita completar dato de contacto. |
| CP-10 | Exportar PDF. | El cartel es legible y no contiene latitud ni longitud. |
| CP-11 | Cambiar a kichwa. | La interfaz muestra textos en kichwa. |
| CP-12 | Cambiar a modo bilingüe. | Se muestra `kichwa - castellano`, con kichwa primero. |
| CP-13 | Pintar modelo 3D. | El trazo se aplica sin rotar accidentalmente. |
| CP-14 | Guardar modelo editado. | Se crea copia propia y no se altera el modelo base. |

## 4. Criterios de aceptación de calidad

El incremento final se considera defendible cuando:

- El flujo principal se completa sin fallos críticos.
- Las rutas privadas no son accesibles sin sesión.
- El usuario no administra mascotas ajenas.
- El cartel final se genera correctamente.
- La ubicación pública no expone coordenadas exactas.
- La interfaz mantiene consistencia visual.
- El modo kichwa y bilingüe aparece en el flujo principal.
- La documentación permite explicar decisiones técnicas.

## 5. Accesibilidad básica

Se revisaron criterios básicos:

- Textos legibles.
- Contraste suficiente en botones y paneles.
- Formularios con etiquetas y mensajes.
- Navegación clara entre pasos.
- Uso de idioma del documento según preferencia.
- Cartel PDF con estructura visual simple para lectura rápida.

## 6. Defensa técnica - guion de 8 a 10 minutos

### Minuto 1 - Problema

Explicar que la búsqueda de mascotas perdidas depende de carteles y publicaciones poco estructuradas. La foto no siempre muestra rasgos suficientes y muchas veces el cartel solo está en castellano.

### Minuto 2 - Solución

Presentar Mascotas 3D como una plataforma que centraliza mascota, fotos, zona, contacto, modelo 3D y cartel PDF.

### Minuto 3 - Interculturalidad

Mostrar modo kichwa, castellano y bilingüe. Explicar que el cartel puede imprimirse en idioma distinto al de navegación y que las traducciones tienen glosario con fuentes.

### Minutos 4 a 6 - Demostración

1. Iniciar sesión.
2. Abrir o registrar mascota.
3. Mostrar fotos y zona.
4. Abrir modelo 3D.
5. Pintar rasgo visible.
6. Preparar cartel.
7. Descargar PDF.

### Minuto 7 - Scrum

Mostrar el cronograma de 4 sprints:

- Sprint 1: base y autenticación.
- Sprint 2: mascotas.
- Sprint 3: búsqueda, mapa, 3D y PDF.
- Sprint 4: interculturalidad, pintura, cartel y cierre.

### Minuto 8 - Calidad

Explicar JWT, roles, privacidad de ubicación, Cloudinary desde backend, pruebas críticas y validaciones.

### Minuto 9 - Cierre

Reconocer limitaciones y mejoras futuras: Git desde el día 1, validación lingüística con hablantes, pruebas E2E y moderación.

## 7. Preguntas frecuentes para defensa

**¿Por qué usar modelos 3D si ya hay fotos?**  
Porque el modelo 3D complementa la foto y permite marcar rasgos desde varios ángulos.

**¿Dónde está la interculturalidad?**  
En la interfaz, el cartel, los datos traducibles, el modo bilingüe y el glosario con fuentes.

**¿Por qué no traducir texto libre automáticamente?**  
Porque podría alterar lo escrito por el usuario y producir traducciones no verificadas.

**¿Cómo protegen ubicación?**  
Se guarda referencia interna, pero el cartel muestra solo zona aproximada.

**¿Qué evidencia el proceso Scrum?**  
Cronograma, backlog, sprint backlogs, bitácora, reviews, retrospectivas, incrementos y documentación.

**¿Qué limitación reconocen?**  
El historial Git fue formalizado al final; por eso la evidencia principal del proceso es la documentación Scrum.

