# Checklist de entrega y defensa

## Documentacion

- [x] Resumen ejecutivo.
- [x] Desarrollo por sprints.
- [x] Requisitos funcionales y no funcionales.
- [x] Arquitectura del sistema.
- [x] Implementacion.
- [x] Validacion.
- [x] Verificacion.
- [x] Mantenimiento.
- [x] Manual breve de uso.
- [x] Guia rapida de exposicion.

## Producto

- [ ] Backend ejecutandose en `http://localhost:3333/api`.
- [ ] Frontend ejecutandose en `http://localhost:3000`.
- [ ] Base de datos PostgreSQL activa.
- [ ] Usuario normal creado.
- [ ] Usuario administrador creado.
- [ ] Al menos una mascota registrada con fotos.
- [ ] Al menos un modelo 3D asociado por categoria.
- [ ] Ficha PDF exportada correctamente.
- [ ] Capturas guardadas en `evidencias`.

## Puntos clave para defender

- El sistema no es solo un catalogo de mascotas: esta orientado a busqueda de mascotas perdidas.
- Cada mascota pertenece a un dueno.
- El administrador puede revisar la informacion general.
- La categoria controla los modelos 3D disponibles.
- Las fotos reales son la evidencia principal.
- El modelo 3D es una guia visual complementaria.
- La ubicacion debe ser aproximada por privacidad.
- El PDF es el entregable final para difusion.
- El Sprint 4 mejora la personalizacion visual del modelo 3D.

## Riesgos que se pueden mencionar honestamente

- La pintura avanzada sobre textura original aun requiere mayor desarrollo.
- El uso de Google Maps depende de una API key valida.
- La calidad de los modelos 3D depende del peso y formato del archivo.
- Para produccion se debe reforzar almacenamiento, auditoria y pruebas automatizadas.
