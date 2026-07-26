# Configuración, construcción y despliegue

## Entornos

| Entorno | Propósito | Datos |
| --- | --- | --- |
| Desarrollo | Implementación y depuración. | Datos de prueba identificados. |
| Pruebas | Validación y verificación. | Base aislada y reiniciable. |
| Producción | Uso real. | Datos protegidos, backups y HTTPS. |

## Variables requeridas

### Backend

`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRATION`, `PORT`, `CORS_ORIGIN`, `UPLOAD_DIR` y `MAX_FILE_SIZE`.

### Frontend

`NEXT_PUBLIC_API_URL` y `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

## Construcción reproducible

```text
cd backend
npm install
npm run prisma:generate
npm run build

cd ../frontend
npm install
npm run type-check
npm run build
```

## Inicio local

```text
cd backend
npm run start:dev

cd ../frontend
npm run dev
```

## Checklist de despliegue

- [ ] Variables configuradas sin valores en el repositorio.
- [ ] Migraciones revisadas y aplicadas.
- [ ] Backend y frontend compilados.
- [ ] CORS restringido al dominio esperado.
- [ ] HTTPS activo.
- [ ] Clave Google restringida por dominio y API.
- [ ] Límites de carga y rate limiting configurados.
- [ ] Backup realizado y restauración probada.
- [ ] Casos críticos aprobados.

