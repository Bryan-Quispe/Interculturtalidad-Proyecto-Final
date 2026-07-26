# Operación, respaldo y recuperación

## 1. Inicio del servicio

1. Confirmar PostgreSQL disponible.
2. Validar variables sin mostrar secretos.
3. Iniciar backend y revisar conexión Prisma.
4. Iniciar frontend y comprobar API configurada.
5. Probar login, consulta y una operación de lectura.

## 2. Monitoreo mínimo

- Estado HTTP del frontend y API.
- Errores 5xx y aumentos de 401/403.
- Conexiones a PostgreSQL.
- Espacio de almacenamiento.
- Tiempo de respuesta de consultas públicas.
- Fallos al cargar imágenes o modelos.
- Cuota y errores de Google Maps.

## 3. Backup

### Base de datos

- Backup lógico de PostgreSQL.
- Archivo cifrado y con acceso restringido.
- Retención definida por política.
- Copia separada del servidor principal.

### Archivos

- Copiar modelos, texturas y cargas.
- Conservar correspondencia con `ArchivoModelo`.
- Verificar tamaño, checksum y fecha.

### Configuración

- Respaldar nombres de variables y procedimiento, no secretos en texto plano.
- Mantener secretos en un gestor apropiado.

## 4. Prueba de restauración

1. Crear entorno aislado.
2. Restaurar PostgreSQL.
3. Restaurar archivos.
4. Ejecutar migraciones pendientes.
5. Iniciar API y frontend.
6. Validar usuario, mascota, fotos y modelo.
7. Generar un PDF.
8. Registrar duración y problemas.

## 5. Reversión de despliegue

- Mantener versión anterior identificada.
- No revertir una migración destructiva sin respaldo validado.
- Restaurar aplicación antes que datos cuando sea suficiente.
- Informar impacto y registrar causa.

## 6. Checklist operativo

- [ ] Servicios disponibles.
- [ ] Sin errores críticos en logs.
- [ ] Backup reciente confirmado.
- [ ] Espacio suficiente.
- [ ] Claves vigentes y restringidas.
- [ ] Flujo básico aprobado.

