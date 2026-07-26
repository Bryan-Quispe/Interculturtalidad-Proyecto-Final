# Despliegue: Render (API + PostgreSQL) y Vercel (frontend)

El proyecto se parte en dos servicios porque cada plataforma hace bien una cosa
distinta: Render corre un proceso Node de larga vida con una base de datos al
lado, y Vercel sirve el Next.js desde su CDN.

```
Navegador  ──►  Vercel (Next.js)  ──►  Render (NestJS /api)  ──►  Render PostgreSQL
                                              │
                                              └──►  Cloudinary (fotos de mascotas)
```

## Orden de los pasos

Hay una dependencia circular entre las dos plataformas: el frontend necesita la
URL del backend, y el backend necesita la URL del frontend para el CORS. Se
rompe desplegando primero Render y rellenando `CORS_ORIGIN` al final.

1. Render: base de datos + API.
2. Vercel: frontend, apuntando a la URL de Render.
3. Volver a Render y poner `CORS_ORIGIN` con el dominio de Vercel.

---

## 1. Render

El repositorio incluye [`render.yaml`](../render.yaml), que define la base de
datos y el servicio web de una sola vez.

**New → Blueprint → seleccionar este repositorio.** Render lee el YAML y crea:

- `mascotas3d-db`: PostgreSQL, plan free.
- `mascotas3d-api`: servicio web Node con `rootDir: backend`.

Las variables marcadas `sync: false` en el YAML las pide Render durante la
creación; se rellenan a mano porque son secretos o dependen del paso 2:

| Variable | Valor |
| --- | --- |
| `CLOUDINARY_CLOUD_NAME` | del panel de Cloudinary |
| `CLOUDINARY_API_KEY` | del panel de Cloudinary |
| `CLOUDINARY_API_SECRET` | del panel de Cloudinary |
| `CORS_ORIGIN` | por ahora `http://localhost:3000`; se corrige en el paso 3 |

`DATABASE_URL` y `JWT_SECRET` no se tocan: la primera la conecta Render desde la
base de datos creada, y la segunda la genera Render con `generateValue: true`.

El build corre `npm ci && npx prisma migrate deploy && npm run build`. Se usa
`migrate deploy` y no `migrate dev` porque el primero solo aplica las
migraciones ya versionadas en `backend/prisma/migrations`, sin generar ninguna
nueva ni pedir confirmación.

Cuando termine, comprobar el health check:

```bash
curl https://mascotas3d-api.onrender.com/api/health
# {"status":"ok","uptime":12}
```

Ese endpoint consulta la base de datos a propósito: si responde, la conexión
Prisma ↔ PostgreSQL está viva.

### Cargar los datos iniciales

El seed no corre solo. Desde la Shell del servicio en Render:

```bash
node prisma/seed.js
```

---

## 2. Vercel

**Add New → Project → importar el repositorio.** La única configuración que no
detecta solo:

| Campo | Valor |
| --- | --- |
| Root Directory | `frontend` |
| Framework Preset | Next.js (automático) |

Variable de entorno (Production, Preview y Development):

```
NEXT_PUBLIC_API_URL = https://mascotas3d-api.onrender.com/api
```

El `/api` final es obligatorio: el backend monta todo bajo ese prefijo
(`setGlobalPrefix('api')`). El frontend deriva de esa misma variable el origen
sin prefijo para pedir los archivos estáticos, así que basta con esta.

---

## 3. Cerrar el CORS

Con el dominio de Vercel ya asignado, volver a Render → `mascotas3d-api` →
Environment y poner:

```
CORS_ORIGIN = https://mascotas3d.vercel.app
```

Acepta varios dominios separados por comas. Los despliegues de preview de Vercel
(`https://mascotas3d-git-rama-usuario.vercel.app`) ya están permitidos por el
patrón `*.vercel.app` del backend, no hace falta listarlos.

---

## Limitaciones del plan gratuito

Son propias del plan, no defectos del proyecto, pero conviene tenerlas presentes
en la demostración:

- **El servicio se duerme.** Render apaga el servicio web free tras 15 minutos
  sin tráfico; la siguiente petición tarda ~50 segundos en despertarlo. Si hay
  una defensa en vivo, conviene abrir la página unos minutos antes.
- **La base de datos free caduca.** Render la elimina a los 30 días de creada.
  Exportar con `pg_dump` si los datos deben sobrevivir.
- **`uploads/` es efímero.** El disco de Render se borra en cada despliegue y en
  cada reinicio. Los modelos 3D que suba un usuario se guardan con multer en
  `backend/uploads` y **se perderán**. Las fotos de mascotas no tienen este
  problema porque van a Cloudinary. Para que las subidas de modelos persistan
  hace falta un disco de Render (plan de pago) o mover ese almacenamiento
  también a Cloudinary como archivo `raw`.
- **Los modelos precargados sí persisten**, porque `backend/Modelos` (150 MB)
  está versionado en el repositorio y se clona en cada despliegue. Eso también
  hace que el build sea lento.
