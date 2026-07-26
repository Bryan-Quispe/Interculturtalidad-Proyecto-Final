# Plan de mantenimiento y operación

## 1. Tipos de mantenimiento

| Tipo | Ejemplo en Mascotas 3D |
| --- | --- |
| Correctivo | Resolver una carga fallida o un permiso incorrecto. |
| Adaptativo | Actualizar Next.js, NestJS, Prisma o Google Maps. |
| Perfectivo | Mejorar el pincel, PDF o experiencia móvil. |
| Preventivo | Actualizar dependencias, backups y pruebas. |

## 2. Inicio local

1. Encender PostgreSQL o el contenedor correspondiente.
2. Configurar variables del backend.
3. Ejecutar `npm run start:dev` dentro de `backend`.
4. Configurar `NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
5. Ejecutar `npm run dev` dentro de `frontend`.
6. Abrir `http://localhost:3000`.

## 3. Verificación antes de entregar

```text
Backend:
  npm run build

Frontend:
  npm run type-check
  npm run build
```

## 4. Base de datos

- Mantener el esquema Prisma como fuente de verdad.
- Aplicar migraciones versionadas en ambientes compartidos.
- Respaldar antes de cambios destructivos.
- Probar restauración, no solo creación del backup.
- No ejecutar `prisma db push` sin revisar diferencias en producción.

## 5. Archivos y modelos

- Conservar relación entre archivo y modelo en la base.
- Validar extensión, tamaño, MIME y contenido.
- Mantener carpetas `Perro`, `Gato` y `Conejos` coherentes con el enum.
- Revisar UV y textura antes de publicar un modelo.
- Evitar eliminar archivos compartidos por mascotas existentes.

## 6. Dependencias

Frecuencia sugerida: revisión mensual durante desarrollo y antes de cada release. Toda actualización debe pasar compilación, casos críticos y revisión visual 3D/PDF.

## 7. Incidentes

1. Registrar fecha, impacto y alcance.
2. Preservar logs sin incluir secretos.
3. Contener el problema.
4. Corregir y verificar.
5. Documentar causa raíz.
6. Añadir una prueba o control preventivo.
7. Informar al Product Owner y actualizar el backlog.

## 8. Backlog de mantenimiento sugerido

- Pruebas unitarias de servicios y DTO.
- Pruebas E2E del flujo de cartel.
- Validación de UV al cargar modelos.
- Rate limiting y auditoría.
- Moderación de contenido público.
- Backups automatizados y restauración ensayada.

