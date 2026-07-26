# Guia rapida para exponer el proyecto

## 1. Presentacion del problema

"El problema es que cuando una mascota se pierde, la informacion suele compartirse de forma desordenada: fotos sueltas, datos incompletos y ubicaciones poco claras. Ademas, publicar una direccion exacta puede ser inseguro."

## 2. Presentacion de la solucion

"Mascotas 3D es una aplicacion web que permite registrar mascotas perdidas, asociarlas a un dueno, subir fotos, marcar una zona aproximada y usar modelos 3D como apoyo visual para generar una ficha PDF de busqueda."

## 3. Explicacion del proceso por sprints

- **Sprint 1:** base tecnica, login, registro, roles y base de datos.
- **Sprint 2:** gestion de mascotas por usuario y vista administrativa.
- **Sprint 3:** fotos, ubicacion aproximada, modelos 3D y exportacion PDF.
- **Sprint 4:** edicion visual de modelos 3D y publicacion opcional de modelos editados.

## 4. Explicacion tecnica

"El frontend fue desarrollado con Next.js y React. El backend usa NestJS. La base de datos es PostgreSQL con Prisma. Para los modelos 3D se usa Three.js mediante React Three Fiber. Para exportar el cartel se usa jsPDF."

## 5. Explicacion de privacidad

"La aplicacion no debe mostrar una direccion exacta. Usa zona o barrio aproximado, porque la finalidad es ayudar a encontrar la mascota sin exponer la seguridad del dueno."

## 6. Demostracion recomendada

1. Entrar a la pagina principal.
2. Iniciar sesion.
3. Mostrar el dashboard.
4. Crear o abrir una mascota.
5. Mostrar fotos cargadas.
6. Mostrar categoria y modelo 3D compatible.
7. Abrir la ficha.
8. Exportar PDF.
9. Mostrar el PDF generado.
10. Mostrar vista de administrador.

## 7. Como defender el uso de 3D

"El modelo 3D no reemplaza las fotos reales. Funciona como guia visual complementaria. Ayuda a representar rasgos generales o personalizados de la mascota y permite generar una ficha mas completa."

## 8. Como defender la ubicacion aproximada

"Se usa una zona aproximada porque el objetivo es orientar la busqueda, no revelar una direccion exacta. Esto reduce riesgos de privacidad y mal uso de la informacion."

## 9. Como defender las metricas de evaluacion

"Para usabilidad se uso PSSUQ, porque mide facilidad de uso, claridad, errores, eficiencia y satisfaccion. Para experiencia de usuario se uso UEQ, porque mide percepcion emocional y cualidades como atractivo, claridad, confianza e innovacion."

## 10. Cierre

"El proyecto demuestra un flujo completo para registrar una mascota perdida, documentarla visualmente y exportar una ficha util. La mejora futura principal es completar la edicion tipo paint sobre la textura original del modelo 3D."
