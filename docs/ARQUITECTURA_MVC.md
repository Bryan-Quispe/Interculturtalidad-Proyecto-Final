# 🏗️ ARQUITECTURA MVC - GUÍA COMPLETA EN ESPAÑOL

## Índice
1. [Introducción](#introducción)
2. [Patrón MVC](#patrón-mvc)
3. [Estructura de Directorios](#estructura-de-directorios)
4. [Capas de la Aplicación](#capas-de-la-aplicación)
5. [Flujo de Datos](#flujo-de-datos)
6. [Ejemplos Prácticos](#ejemplos-prácticos)

---

## Introducción

Esta aplicación implementa una **arquitectura MVC (Modelo-Vista-Controlador) profesional y escalable** con separación clara de responsabilidades. El flujo actual contempla mascotas urbanas y rurales, fotos reales y modelos 3D locales editables almacenados en `backend/Modelos`.

### Objetivos de la Arquitectura

- ✅ **Mantenibilidad**: Código limpio y fácil de modificar
- ✅ **Escalabilidad**: Manejo de múltiples usuarios simultáneos
- ✅ **Seguridad**: Validación en capas y control de acceso
- ✅ **Rendimiento**: Caché inteligente y optimizaciones
- ✅ **Testabilidad**: Componentes independientes y probables

---

## Patrón MVC

### ¿Qué es MVC?

```
USUARIO → VISTA → CONTROLADOR → MODELO → BASE DE DATOS
```

| Componente | Responsabilidad | Ubicación |
|---|---|---|
| **VISTA** | Interfaz de usuario (HTML/CSS/React) | `frontend/src/` |
| **CONTROLADOR** | Lógica de rutas y solicitudes | `backend/src/modulos/*/controlador.ts` |
| **MODELO** | Lógica de negocio y datos | `backend/src/modulos/*/servicio.ts` |

### Diagrama de Interacción

```
┌─────────────────────────────────────────────────────┐
│           FRONTEND (VISTA)                           │
│  React Components + Next.js Pages                    │
│  ┌─────────────────────────────────────────────┐    │
│  │ • Formularios                               │    │
│  │ • Componentes interactivos                  │    │
│  │ • Gestión de estado (Zustand)               │    │
│  │ • Visor 3D (Canvas)                         │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬────────────────────────────┬─┘
                       │ HTTP REST API              │ WebSocket
                       ↓                             ↓
┌─────────────────────────────────────────────────────┐
│      BACKEND (CONTROLADOR + MODELO)                  │
│            Nest.js Framework                         │
│  ┌─────────────────────────────────────────────┐    │
│  │ CONTROLADOR                                 │    │
│  │ • Recibe solicitudes HTTP                   │    │
│  │ • Valida entrada (DTOs)                     │    │
│  │ • Llama a Servicios                         │    │
│  │ • Retorna respuestas                        │    │
│  └─────────────────────────────────────────────┘    │
│                      ↓                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ SERVICIO (MODELO)                           │    │
│  │ • Lógica de negocio                         │    │
│  │ • Validaciones complejas                    │    │
│  │ • Acceso a caché                            │    │
│  │ • Orquestación de operaciones               │    │
│  └─────────────────────────────────────────────┘    │
│                      ↓                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ INFRAESTRUCTURA                             │    │
│  │ • Prisma ORM (BD)                           │    │
│  │ • Caché en memoria                          │    │
│  │ • Sistema de archivos                       │    │
│  │ • Autenticación JWT                         │    │
│  └─────────────────────────────────────────────┘    │
└──────────────────────┬────────────────────────────┬─┘
                       ↓
┌─────────────────────────────────────────────────────┐
│        ALMACENAMIENTO (BD + ARCHIVOS)                │
│  • PostgreSQL (datos estructurados)                 │
│  • Sistema de archivos (modelos 3D en backend/Modelos) │
│  • Caché en memoria (datos frecuentes)              │
└─────────────────────────────────────────────────────┘
```

---

## Estructura de Directorios

### Backend (Nest.js)

```
backend/
├── src/
│   ├── principal.ts                    # Punto de entrada
│   ├── modulo-principal.ts             # Módulo raíz
│   │
│   ├── infraestructura/                # 🔧 CAPAS DE SOPORTE
│   │   ├── cache/
│   │   │   └── servicio-cache-memoria.ts
│   │   ├── limitador/
│   │   │   └── servicio-limitador-velocidad.ts
│   │   └── infraestructura.modulo.ts
│   │
│   ├── Modelos/                        # 📦 CATÁLOGO LOCAL DE MODELOS 3D
│   │   └── Australian_Cattle_Dog.../   # OBJ, MTL y texturas JPG
│   │
│   ├── src/modelos/                    # 📦 GESTIÓN DE ALMACENAMIENTO
│   │   ├── almacenamiento/
│   │   │   ├── glb/                    # ✅ Referencia futura/optimizada
│   │   │   ├── sketchfab/              # 🔗 Referencias externas
│   │   │   ├── configuracion-almacenamiento-modelos.ts
│   │   │   ├── servicio-almacenamiento-modelos.ts
│   │   │   └── INDICE_MODELOS.md       # 📍 REFERENCIA CENTRALIZADA
│   │   └── modelos.modulo.ts
│   │
│   ├── modulos/                        # 👨‍💼 MÓDULOS DE NEGOCIO
│   │   ├── autenticacion/              # 🔐 Auth Module
│   │   │   ├── controlador-autenticacion.ts
│   │   │   ├── servicio-autenticacion.ts
│   │   │   ├── dto/
│   │   │   │   ├── registrar.dto.ts
│   │   │   │   └── iniciar-sesion.dto.ts
│   │   │   ├── estrategias/
│   │   │   │   └── estrategia-jwt.ts
│   │   │   ├── decoradores/
│   │   │   │   ├── usuario-actual.decorador.ts
│   │   │   │   └── roles.decorador.ts
│   │   │   ├── guardias/
│   │   │   │   ├── guardia-autenticacion-jwt.ts
│   │   │   │   └── guardia-roles.ts
│   │   │   └── autenticacion.modulo.ts
│   │   │
│   │   ├── usuarios/                   # 👤 Users Module
│   │   │   ├── controlador-usuarios.ts
│   │   │   ├── servicio-usuarios.ts
│   │   │   ├── entidad-usuario.ts
│   │   │   ├── dto/
│   │   │   │   ├── crear-usuario.dto.ts
│   │   │   │   └── actualizar-usuario.dto.ts
│   │   │   └── usuarios.modulo.ts
│   │   │
│   │   ├── animales/                   # 🦁 Animals Module
│   │   │   ├── controlador-animales.ts
│   │   │   ├── servicio-animales.ts
│   │   │   ├── entidad-animal.ts
│   │   │   ├── dto/
│   │   │   │   ├── crear-animal.dto.ts
│   │   │   │   ├── actualizar-animal.dto.ts
│   │   │   │   └── listar-animales.dto.ts
│   │   │   └── animales.modulo.ts
│   │   │
│   │   └── modelos3d/                  # 🎨 3D Models Module
│   │       ├── controlador-modelos3d.ts
│   │       ├── servicio-modelos3d.ts
│   │       ├── entidad-modelo3d.ts
│   │       ├── dto/
│   │       │   ├── crear-modelo3d.dto.ts
│   │       │   ├── actualizar-transformaciones.dto.ts
│   │       │   └── subir-modelo.dto.ts
│   │       └── modelos3d.modulo.ts
│   │
│   ├── compartido/                     # 🔄 CÓDIGO COMPARTIDO
│   │   ├── dto/
│   │   │   ├── respuesta-paginada.dto.ts
│   │   │   └── respuesta-error.dto.ts
│   │   ├── filtros/
│   │   │   ├── filtro-excepciones.ts
│   │   │   └── filtro-validacion.ts
│   │   ├── interceptores/
│   │   │   ├── interceptor-transformacion.ts
│   │   │   └── interceptor-manejo-errores.ts
│   │   ├── decoradores/
│   │   │   └── decorador-publico.ts
│   │   ├── enums/
│   │   │   ├── rol.enum.ts
│   │   │   └── tipo-modelo.enum.ts
│   │   └── tipos/
│   │       ├── tipo-usuario.ts
│   │       ├── tipo-animal.ts
│   │       └── tipo-respuesta.ts
│   │
│   └── prisma/                         # 💾 BASE DE DATOS
│       └── schema.prisma               # Esquema de BD
│
├── uploads/                            # 📁 Archivos temporales
├── .env.example                        # Variables de entorno
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── package.json
├── tsconfig.json
└── README.md
```

### Frontend (Next.js)

```
frontend/
├── src/
│   ├── app/                           # 📄 PÁGINAS Y LAYOUTS
│   │   ├── layout.tsx                 # Layout global
│   │   ├── page.tsx                   # Página inicio
│   │   │
│   │   ├── autenticacion/             # 🔐 Auth Pages
│   │   │   ├── iniciar-sesion/
│   │   │   │   └── page.tsx
│   │   │   └── registrarse/
│   │   │       └── page.tsx
│   │   │
│   │   ├── tablero/                   # 📊 Dashboard
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── animales/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── modelos/
│   │   │   │   ├── page.tsx
│   │   │   │   └── subir/
│   │   │   │       └── page.tsx
│   │   │   └── perfil/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                       # 🔌 API Routes
│   │       └── ...rutas-dinámicas...
│   │
│   ├── componentes/                   # 🎨 COMPONENTES REUTILIZABLES
│   │   ├── comun/
│   │   │   ├── encabezado.tsx
│   │   │   ├── pie-pagina.tsx
│   │   │   ├── barra-navegacion.tsx
│   │   │   └── cargador.tsx
│   │   │
│   │   ├── autenticacion/
│   │   │   ├── formulario-login.tsx
│   │   │   ├── formulario-registro.tsx
│   │   │   └── protector-ruta.tsx
│   │   │
│   │   ├── animales/
│   │   │   ├── lista-animales.tsx
│   │   │   ├── tarjeta-animal.tsx
│   │   │   ├── formulario-animal.tsx
│   │   │   └── detalle-animal.tsx
│   │   │
│   │   ├── modelos3d/
│   │   │   ├── visualizador-canvas3d.tsx
│   │   │   ├── formulario-subir-modelo.tsx
│   │   │   ├── controles-transformacion.tsx
│   │   │   └── lista-modelos.tsx
│   │   │
│   │   └── admin/
│   │       ├── panel-admin.tsx
│   │       ├── gestion-usuarios.tsx
│   │       └── estadisticas.tsx
│   │
│   ├── servicios/                     # 🔌 SERVICIOS (Llamadas API)
│   │   ├── cliente-api.ts             # Cliente HTTP centralizado
│   │   ├── autenticacion.servicio.ts
│   │   ├── animales.servicio.ts
│   │   ├── modelos3d.servicio.ts
│   │   └── usuarios.servicio.ts
│   │
│   ├── tiendas/                       # 🗂️ ESTADO GLOBAL (Zustand)
│   │   ├── tienda-autenticacion.ts    # Auth state
│   │   ├── tienda-modelo3d.ts         # 3D model state
│   │   ├── tienda-animales.ts         # Animals state
│   │   └── tienda-interfaz.ts         # UI state
│   │
│   ├── ganchos/                       # 🎣 HOOKS PERSONALIZADOS
│   │   ├── usar-autenticacion.ts
│   │   ├── usar-animales.ts
│   │   ├── usar-modelo3d.ts
│   │   └── usar-cache-local.ts
│   │
│   ├── tipos/                         # 📋 TIPOS TYPESCRIPT
│   │   ├── usuario.ts
│   │   ├── animal.ts
│   │   ├── modelo3d.ts
│   │   └── respuesta-api.ts
│   │
│   ├── constantes/                    # ⚙️ CONFIGURACIÓN
│   │   ├── configuracion.ts
│   │   ├── mensajes.ts
│   │   └── rutas.ts
│   │
│   ├── utilidades/                    # 🛠️ FUNCIONES AUXILIARES
│   │   ├── formato.ts
│   │   ├── validacion.ts
│   │   └── almacenamiento-local.ts
│   │
│   └── estilos/                       # 🎨 ESTILOS
│       ├── estilos-globales.css
│       └── temas.css
│
├── public/                            # 📦 Activos estáticos
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Capas de la Aplicación

### 1. Capa de Presentación (VISTA)

**Ubicación:** `frontend/src/`

**Responsabilidades:**
- Mostrar datos al usuario
- Capturar input del usuario
- Llamar a servicios de API
- Gestionar estado local

**Ejemplo:**

```typescript
// frontend/src/componentes/lista-animales.tsx
export function ListaAnimales() {
  const { animales, cargando, error } = useAnimales();

  if (cargando) return <Cargador />;
  if (error) return <MostrarError error={error} />;

  return (
    <div className="grid grid-cols-3">
      {animales.map((animal) => (
        <TarjetaAnimal key={animal.id} animal={animal} />
      ))}
    </div>
  );
}
```

### 2. Capa de Servicios (CLIENTE HTTP)

**Ubicación:** `frontend/src/servicios/`

**Responsabilidades:**
- Comunicarse con backend
- Manejar solicitudes HTTP
- Transformar datos

**Ejemplo:**

```typescript
// frontend/src/servicios/cliente-api.ts
@Injectable()
export class ClienteAPI {
  constructor(private http: HttpClient) {}

  async obtenerAnimales(): Promise<Animal[]> {
    // Llama a backend
    return this.http.get<Animal[]>('/api/animales').toPromise();
  }

  async crearAnimal(datos: CrearAnimalDto): Promise<Animal> {
    return this.http.post<Animal>('/api/animales', datos).toPromise();
  }
}
```

### 3. Capa de Controlador (CONTROLADOR)

**Ubicación:** `backend/src/modulos/*/controlador-*.ts`

**Responsabilidades:**
- Recibir solicitudes HTTP
- Validar entrada
- Llamar a servicios
- Retornar respuestas

**Ejemplo:**

```typescript
// backend/src/modulos/animales/controlador-animales.ts
@Controller('api/animales')
@UseGuards(JwtAuthGuard)
export class ControladorAnimales {
  constructor(private servicio: ServicioAnimales) {}

  @Get()
  async obtenerTodos(): Promise<Animal[]> {
    return this.servicio.obtenerTodos();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async crear(
    @Body() dto: CrearAnimalDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<Animal> {
    return this.servicio.crear(dto, usuario.id);
  }

  @Get(':id')
  async obtenerPorId(@Param('id') id: string): Promise<Animal> {
    return this.servicio.obtenerPorId(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAnimalDto,
  ): Promise<Animal> {
    return this.servicio.actualizar(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, GuardiaRoles)
  @Roles('ADMIN')
  async eliminar(@Param('id') id: string): Promise<void> {
    await this.servicio.eliminar(id);
  }
}
```

### 4. Capa de Modelo/Servicio (MODELO)

**Ubicación:** `backend/src/modulos/*/servicio-*.ts`

**Responsabilidades:**
- Lógica de negocio
- Validaciones complejas
- Acceso a datos (Prisma)
- Acceso a caché
- Orquestación de operaciones

**Ejemplo:**

```typescript
// backend/src/modulos/animales/servicio-animales.ts
@Injectable()
export class ServicioAnimales {
  constructor(
    private prisma: ServicioPrisma,
    private cache: ServicioCacheMemoria,
  ) {}

  async obtenerTodos(): Promise<Animal[]> {
    // Intentar obtener del caché
    const clave = ESPACIOS_CACHE.ANIMALES + ':todos';
    let animales = await this.cache.obtener<Animal[]>(clave);

    if (!animales) {
      // Si no está en caché, obtener de BD
      animales = await this.prisma.animal.findMany({
        include: { modelo: true, caracteristicas: true },
      });

      // Guardar en caché por 1 hora
      await this.cache.guardar(clave, animales, TIEMPOS_EXPIRACION.LARGO);
    }

    return animales;
  }

  async crear(dto: CrearAnimalDto, usuarioId: string): Promise<Animal> {
    // Validaciones de negocio
    const modeloExiste = await this.prisma.modelo3D.findUnique({
      where: { id: dto.modeloId },
    });

    if (!modeloExiste) {
      throw new NotFoundException('Modelo 3D no encontrado');
    }

    // Crear en BD
    const animal = await this.prisma.animal.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        raza: dto.raza,
        contexto: dto.contexto, // urbano o rural
        modeloId: dto.modeloId,
        usuarioId: usuarioId,
      },
      include: { modelo: true, caracteristicas: true },
    });

    // Invalidar caché
    const clave = ESPACIOS_CACHE.ANIMALES + ':todos';
    await this.cache.eliminar(clave);

    return animal;
  }

  async obtenerPorId(id: string): Promise<Animal> {
    // Caché por animal individual
    const clave = ESPACIOS_CACHE.ANIMALES + ':' + id;
    let animal = await this.cache.obtener<Animal>(clave);

    if (!animal) {
      animal = await this.prisma.animal.findUnique({
        where: { id },
        include: { modelo: true, caracteristicas: true },
      });

      if (!animal) {
        throw new NotFoundException('Animal no encontrado');
      }

      await this.cache.guardar(clave, animal, TIEMPOS_EXPIRACION.LARGO);
    }

    return animal;
  }

  async actualizar(id: string, dto: ActualizarAnimalDto): Promise<Animal> {
    const animal = await this.prisma.animal.update({
      where: { id },
      data: dto,
      include: { modelo: true, caracteristicas: true },
    });

    // Invalidar caché
    await this.cache.eliminar(ESPACIOS_CACHE.ANIMALES + ':' + id);
    await this.cache.eliminar(ESPACIOS_CACHE.ANIMALES + ':todos');

    return animal;
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.animal.delete({
      where: { id },
    });

    // Invalidar caché
    await this.cache.eliminar(ESPACIOS_CACHE.ANIMALES + ':' + id);
    await this.cache.eliminar(ESPACIOS_CACHE.ANIMALES + ':todos');
  }
}
```

### 5. Capa de Infraestructura (ALMACENAMIENTO)

**Ubicación:** `backend/src/infraestructura/`

**Responsabilidades:**
- Acceso a base de datos (Prisma)
- Gestión de caché
- Control de velocidad (Rate Limiting)
- Autenticación

**Ejemplo:**

```typescript
// Usar en servicios
@Injectable()
export class ServicioModelos3D {
  constructor(
    private almacenamiento: ServicioAlmacenamientoModelos,
    private configuracion: ConfiguracionAlmacenamientoModelos,
    private prisma: ServicioPrisma,
  ) {}

  async subirModelo(
    archivo: Express.Multer.File,
    dto: SubirModeloDto,
  ): Promise<Modelo3D> {
    // Validar con configuración centralizada
    if (!this.configuracion.validarExtension(archivo.originalname)) {
      throw new BadRequestException('Extensión no permitida');
    }

    const validacion = this.configuracion.validarTamaño(archivo.size);
    if (!validacion.valido) {
      throw new BadRequestException(validacion.mensaje);
    }

    // Guardar archivo en disco
    const { nombreArchivo, rutaRelativa } =
      await this.almacenamiento.guardarModelo(archivo);

    // Guardar en BD
    const modelo = await this.prisma.modelo3D.create({
      data: {
        nombre: dto.nombre,
        raza: dto.raza,
        color: dto.color,
        usuarioId: dto.usuarioId,
        archivo: {
          create: {
            nombre: archivo.originalname,
            nombreAlmacenado: nombreArchivo,
            ruta: rutaRelativa,
            mimeType: archivo.mimetype,
            tamaño: archivo.size,
          },
        },
        transformaciones: {
          create: {
            escalaX: 1,
            escalaY: 1,
            escalaZ: 1,
          },
        },
      },
      include: { archivo: true, transformaciones: true },
    });

    return modelo;
  }
}
```

---

## Flujo de Datos

### Flujo Completo: Obtener Lista de Animales

```
┌─────────────────────────────────────────────────────────────┐
│ 1. USUARIO EN FRONTEND                                      │
│    Abre página /tablero/animales                            │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 2. COMPONENTE REACT                                         │
│    function ListaAnimales() {                               │
│      const { animales } = useAnimales(); ✨                │
│    }                                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 3. HOOK PERSONALIZADO                                       │
│    export function useAnimales() {                          │
│      const [animales, setAnimales] = useState([]);          │
│      useEffect(() => {                                      │
│        clienteAPI.obtenerAnimales().then(setAnimales)      │
│      })                                                     │
│    }                                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 4. SERVICIO DE API                                          │
│    class ClienteAPI {                                       │
│      obtenerAnimales() {                                    │
│        return axios.get('/api/animales')                    │
│      }                                                      │
│    }                                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP GET /api/animales
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 5. CONTROLADOR (Backend)                                    │
│    @Get()                                                   │
│    async obtenerTodos(): Promise<Animal[]> {               │
│      return this.servicio.obtenerTodos()                   │
│    }                                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 6. SERVICIO (Modelo)                                        │
│    async obtenerTodos(): Promise<Animal[]> {               │
│      // Intentar caché                                      │
│      let animales = await this.cache.obtener(clave)        │
│      if (!animales) {                                       │
│        // Obtener de BD si no está en caché                │
│        animales = await this.prisma.animal.findMany()     │
│        // Guardar en caché                                  │
│        await this.cache.guardar(clave, animales)           │
│      }                                                      │
│      return animales                                        │
│    }                                                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ¿Está en caché?
                     │
         ┌───────────┴──────────┐
         │ SÍ                   │ NO
         ↓                       ↓
    ┌────────────────┐  ┌──────────────────────┐
    │ Caché en       │  │ PostgreSQL BD        │
    │ Memoria        │  │ SELECT * FROM        │
    │ (rápido)       │  │ animales             │
    └────────┬───────┘  └──────────┬───────────┘
             │                      │
             └──────────┬───────────┘
                        ↓
┌────────────────────────────────────────────────────────────┐
│ 7. RESPUESTA JSON                                          │
│ [                                                          │
│   {                                                        │
│     "id": "uuid",                                          │
│     "nombre": "Jaguar",                                    │
│     "descripcion": "...",                                  │
│     "modelo": { ... },                                     │
│     "caracteristicas": { ... }                             │
│   },                                                       │
│   ...                                                      │
│ ]                                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP 200 OK
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 8. FRONTEND RECIBE DATOS                                    │
│    axios.get('/api/animales')                              │
│    .then(res => setAnimales(res.data))                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 9. COMPONENTE SE RENDERIZA                                  │
│    <div className="grid">                                   │
│      {animales.map(animal => (                             │
│        <TarjetaAnimal key={animal.id} animal={animal} />   │
│      ))}                                                    │
│    </div>                                                   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│ 10. USUARIO VE LISTA DE ANIMALES EN EL NAVEGADOR           │
└────────────────────────────────────────────────────────────┘
```

---

## Ejemplos Prácticos

### Ejemplo 1: Crear un Nuevo Animal

**1. Frontend - Componente:**

```typescript
// frontend/src/componentes/formulario-animal.tsx
import { useState } from 'react';
import { clienteAPI } from '@/servicios/cliente-api';

export function FormularioAnimal() {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      // Llamar al servicio
      const nuevoAnimal = await clienteAPI.crearAnimal({
        nombre,
        descripcion,
        raza: 'Panthera onca',
        modeloId: 'uuid-del-modelo',
      });

      alert('¡Animal creado exitosamente!');
      // Limpiar formulario
      setNombre('');
      setDescripcion('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarSubmit}>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del animal"
        required
      />
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Descripción"
      />
      <button type="submit" disabled={cargando}>
        {cargando ? 'Creando...' : 'Crear Animal'}
      </button>
    </form>
  );
}
```

**2. Frontend - Servicio:**

```typescript
// frontend/src/servicios/cliente-api.ts
export class ClienteAPI {
  async crearAnimal(datos: CrearAnimalDto): Promise<Animal> {
    const respuesta = await axios.post('/api/animales', datos);
    return respuesta.data;
  }
}
```

**3. Backend - Controlador:**

```typescript
// backend/src/modulos/animales/controlador-animales.ts
@Controller('api/animales')
export class ControladorAnimales {
  constructor(private servicio: ServicioAnimales) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async crear(
    @Body() dto: CrearAnimalDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<Animal> {
    return this.servicio.crear(dto, usuario.id);
  }
}
```

**4. Backend - Servicio:**

```typescript
// backend/src/modulos/animales/servicio-animales.ts
@Injectable()
export class ServicioAnimales {
  constructor(
    private prisma: ServicioPrisma,
    private cache: ServicioCacheMemoria,
  ) {}

  async crear(dto: CrearAnimalDto, usuarioId: string): Promise<Animal> {
    // Validar modelo existe
    const modelo = await this.prisma.modelo3D.findUnique({
      where: { id: dto.modeloId },
    });

    if (!modelo) {
      throw new NotFoundException('Modelo no encontrado');
    }

    // Crear animal
    const animal = await this.prisma.animal.create({
      data: {
        nombre: dto.nombre,
        descripcion: dto.descripcion,
        raza: dto.raza,
        modeloId: dto.modeloId,
        usuarioId: usuarioId,
      },
      include: { modelo: true, caracteristicas: true },
    });

    // Invalidar caché
    await this.cache.eliminar('animales:todos');

    return animal;
  }
}
```

**5. Base de Datos:**

```sql
-- Resultado en BD
INSERT INTO animales (id, nombre, descripcion, raza, modeloId, usuarioId, createdAt)
VALUES (
  'uuid-nuevo',
  'Jaguar',
  'Un felino hermoso',
  'Panthera onca',
  'uuid-modelo',
  'uuid-usuario',
  NOW()
);
```

### Ejemplo 2: Registrar y Editar Modelo 3D

El MVP usa modelos locales desde `backend/Modelos`. El modelo inicial disponible es Australian Cattle Dog con archivo `.obj`, `.mtl` y texturas `.jpg`. Las ediciones de usuario deben guardarse como transformaciones asociadas a la mascota, sin sobrescribir el archivo original.

**1. Frontend - Formulario:**

```typescript
// frontend/src/componentes/formulario-subir-modelo.tsx
export function FormularioSubirModelo() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombre, setNombre] = useState('');
  const [cargando, setCargando] = useState(false);

  const manejarSubida = async (e) => {
    e.preventDefault();
    if (!archivo) return;

    setCargando(true);

    try {
      const formData = new FormData();
      formData.append('file', archivo);
      formData.append('nombre', nombre);
      formData.append('raza', 'Panthera onca');
      formData.append('color', '#FF6B6B');

      // Llamar servicio
      await clienteAPI.subirModelo(formData);

      alert('¡Modelo subido exitosamente!');
      setArchivo(null);
      setNombre('');
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={manejarSubida}>
      <input
        type="file"
        accept=".obj,.mtl,.glb,.gltf"
        onChange={(e) => setArchivo(e.target.files?.[0] || null)}
        required
      />
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre del modelo"
        required
      />
      <button type="submit" disabled={cargando || !archivo}>
        {cargando ? 'Subiendo...' : 'Subir Modelo'}
      </button>
    </form>
  );
}
```

**2. Backend - Controlador:**

```typescript
// backend/src/modulos/modelos3d/controlador-modelos3d.ts
@Controller('api/modelos3d')
export class ControladorModelos3D {
  constructor(private servicio: ServicioModelos3D) {}

  @Post('subir')
  @UseGuards(JwtAuthGuard, GuardiaRoles)
  @Roles('ADMIN')  // ✅ Solo admin
  @UseInterceptors(FileInterceptor('file'))
  async subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: SubirModeloDto,
    @UsuarioActual() usuario: Usuario,
  ): Promise<Modelo3D> {
    return this.servicio.subirModelo(archivo, dto, usuario.id);
  }
}
```

**3. Backend - Servicio:**

```typescript
// backend/src/modulos/modelos3d/servicio-modelos3d.ts
@Injectable()
export class ServicioModelos3D {
  constructor(
    private almacenamiento: ServicioAlmacenamientoModelos,
    private configuracion: ConfiguracionAlmacenamientoModelos,
    private prisma: ServicioPrisma,
  ) {}

  async subirModelo(
    archivo: Express.Multer.File,
    dto: SubirModeloDto,
    usuarioId: string,
  ): Promise<Modelo3D> {
    // Validar con configuración centralizada
    if (!this.configuracion.validarExtension(archivo.originalname)) {
      throw new BadRequestException('Extensión no permitida');
    }

    const validacion = this.configuracion.validarTamaño(archivo.size);
    if (!validacion.valido) {
      throw new BadRequestException(validacion.mensaje);
    }

    // Guardar archivo (con nombre único) o registrar archivo local en backend/Modelos
    const { nombreArchivo, rutaRelativa } =
      await this.almacenamiento.guardarModelo(archivo, 'obj');

    // Crear registro en BD
    const modelo = await this.prisma.modelo3D.create({
      data: {
        nombre: dto.nombre,
        raza: dto.raza,
        contextoRecomendado: dto.contextoRecomendado,
        color: dto.color,
        usuarioId: usuarioId,
        archivo: {
          create: {
            nombre: archivo.originalname,
            nombreAlmacenado: nombreArchivo,  // ✅ Nombre único
            ruta: rutaRelativa,                // ✅ Ruta relativa
            mimeType: archivo.mimetype,
            formato: 'OBJ',
            tamaño: archivo.size,
          },
        },
        transformaciones: {
          create: {
            escalaX: 1,
            escalaY: 1,
            escalaZ: 1,
            rotacionX: 0,
            rotacionY: 0,
            rotacionZ: 0,
            posicionX: 0,
            posicionY: 0,
            posicionZ: 0,
          },
        },
      },
      include: { archivo: true, transformaciones: true },
    });

    // Invalidar caché
    await this.cache.eliminar('modelos3d:todos');

    return modelo;
  }
}
```

---

## Conclusión

Esta arquitectura MVC proporciona:

✅ **Separación clara de responsabilidades**
✅ **Escalabilidad para múltiples usuarios**
✅ **Caché inteligente para optimizar**
✅ **Almacenamiento centralizado de modelos**
✅ **Control de seguridad en capas**
✅ **Fácil de mantener y extender**

---

**Última actualización:** Abril 2026
**Versión:** 1.0
