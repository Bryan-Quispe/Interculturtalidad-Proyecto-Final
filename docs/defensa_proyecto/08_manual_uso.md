# Manual breve de uso

## Iniciar el proyecto

### Backend

```bash
cd backend
npm install
npm run prisma:generate
npm run prisma:push
npm run start:dev
```

El backend debe quedar en:

```text
http://localhost:3333/api
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend debe quedar en:

```text
http://localhost:3000
```

## Flujo de usuario

1. Abrir la aplicacion.
2. Registrarse o iniciar sesion.
3. Entrar al dashboard.
4. Crear una nueva mascota.
5. Seleccionar categoria: perro, gato o conejo.
6. Subir fotos reales de la mascota.
7. Seleccionar zona o barrio aproximado.
8. Ingresar telefono de contacto.
9. Seleccionar un modelo 3D compatible.
10. Guardar la mascota.
11. Abrir la ficha.
12. Exportar el cartel PDF.

## Flujo de administrador

1. Iniciar sesion como administrador.
2. Entrar al dashboard.
3. Revisar mascotas de todos los usuarios.
4. Filtrar o identificar registros por usuario.
5. Revisar modelos 3D cargados.
6. Gestionar modelos publicos o privados.

## Funcion de PDF

El PDF se usa para difundir la busqueda de la mascota.

Incluye:

- Nombre de la mascota.
- Fotos reales.
- Caracteristicas.
- Zona aproximada.
- Telefono de contacto.
- Captura del modelo 3D.

## Recomendacion de privacidad

En la exposicion se debe indicar que el sistema no busca publicar la direccion exacta del dueno ni del avistamiento. La ubicacion se usa como zona aproximada para proteger a las personas y evitar mal uso de la informacion.
