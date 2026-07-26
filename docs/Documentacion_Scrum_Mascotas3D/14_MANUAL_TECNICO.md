# Manual técnico de instalación y verificación

## 1. Requisitos

- Node.js compatible con las dependencias del proyecto.
- npm.
- PostgreSQL o Docker Desktop con un contenedor PostgreSQL.
- Navegador con WebGL.
- Clave habilitada de Google Maps para Maps JavaScript y Places.

## 2. Variables de entorno

### Backend

| Variable | Uso |
| --- | --- |
| `DATABASE_URL` | Conexión PostgreSQL. |
| `JWT_SECRET` | Firma de tokens; debe ser robusta y privada. |
| `JWT_EXPIRATION` | Vigencia de sesión. |
| `PORT` | Puerto de la API, normalmente 3333. |
| `CORS_ORIGIN` | Origen permitido del frontend. |
| `UPLOAD_DIR` | Directorio de archivos. |
| `MAX_FILE_SIZE` | Límite de carga. |

### Frontend

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL base de la API. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Clave pública restringida por dominio. |

No colocar valores reales en documentación, capturas ni repositorios públicos.

## 3. Preparar backend

```text
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

La API debe iniciar en `http://localhost:3333` según configuración.

## 4. Preparar frontend

```text
cd frontend
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## 5. Verificación de entrega

```text
cd backend
npm run build

cd ../frontend
npm run type-check
npm run build
```

## 6. Diagnóstico rápido

| Problema | Revisión |
| --- | --- |
| API no inicia | PostgreSQL, `DATABASE_URL`, migraciones y puerto. |
| Error 401 | Token vencido, `JWT_SECRET` o sesión almacenada. |
| Mapa no aparece | Clave, APIs habilitadas, restricción de dominio y consola. |
| Modelo no carga | Ruta, CORS, formato y recursos MTL/textura. |
| No se puede pintar | El modelo debe contener UV utilizables. |
| Imagen no entra al PDF | URL accesible, CORS, tipo de imagen y límite de 12 MB. |

## 7. Criterio de despliegue

Antes de producción deben existir HTTPS, secretos rotados, backups, migraciones controladas, límites de carga, rate limiting, monitoreo y pruebas automatizadas del flujo principal.

