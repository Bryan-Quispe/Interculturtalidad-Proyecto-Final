# 📍 REFERENCIA CENTRALIZADA DE MODELOS 3D

## Estructura de Almacenamiento

```
backend/Modelos/
├── Australian_Cattle_Dog_v1_L3.123c9c6a5764-399b-4e86-9897-6bcb08b5e8ed.zip
└── Australian_Cattle_Dog_v1_L3.123c9c6a5764-399b-4e86-9897-6bcb08b5e8ed/
    └── Australian_Cattle_Dog_v1_L3.123c9c6a5764-399b-4e86-9897-6bcb08b5e8ed/
        ├── 13463_Australian_Cattle_Dog_v3.obj
        ├── 13463_Australian_Cattle_Dog_v3.mtl
        ├── Australian_Cattle_Dog_bump.jpg
        └── Australian_Cattle_Dog_dif.jpg
```

> El catálogo actual parte de modelos locales ubicados en `backend/Modelos`. La ruta anterior `src/modelos/almacenamiento` queda como referencia histórica/documental, no como fuente principal de archivos del MVP.

## Propósito del Catálogo

Los modelos 3D complementan la ficha de mascotas urbanas y rurales. Una mascota puede tener fotos reales cargadas por el usuario y un modelo 3D editable para representar rasgos visuales, revisar proporciones o personalizar una versión sin modificar el archivo original.

### Modelo inicial disponible

| Modelo | Formato | Archivos | Uso sugerido |
|---|---|---|---|
| Australian Cattle Dog | OBJ/MTL + JPG | `.obj`, `.mtl`, `bump.jpg`, `dif.jpg` | Mascotas tipo perro, especialmente contexto rural o mixto |

## Configuración en Base de Datos

### Campo `rutaArchivo` en Tabla `archivos_modelos`

```sql
-- Estructura
archivos_modelos {
  id: UUID,
  nombre: VARCHAR,           -- Nombre original (jaguar.glb)
  nombreAlmacenado: VARCHAR, -- Nombre único (modelo_1698765432_jaguar.glb)
  ruta: VARCHAR,             -- Ruta relativa (/modelos/Australian_Cattle_Dog/.../modelo.obj)
  rutaCompleta: VARCHAR,     -- Ruta absoluta (backend/Modelos/...)
  tipo: ENUM('obj','glb','gltf'), -- Tipo de almacenamiento
  archivoMaterial: VARCHAR,  -- Archivo .mtl cuando aplica
  texturas: JSON,            -- Lista de texturas JPG/PNG relacionadas
  mimeType: VARCHAR,         -- text/plain, model/gltf-binary u otro identificador técnico
  tamaño: INT,              -- Bytes
  modeloId: UUID FOREIGN KEY,
  createdAt: TIMESTAMP,
  updatedAt: TIMESTAMP
}
```

## Referenciación en Aplicación

### En Backend (Nest.js)

```typescript
// ARCHIVO: backend/src/modelos/almacenamiento/configuracion-almacenamiento-modelos.ts

class ConfiguracionAlmacenamientoModelos {
  // ✅ Punto centralizado de referencia
  readonly RUTAS_BASE = {
    PRINCIPAL: 'backend/Modelos',
    OBJ: 'backend/Modelos',
    TEXTURAS: 'backend/Modelos',
  };

  // Métodos para obtener rutas
  obtenerRutaCompleta(nombreArchivo: string, tipo: 'obj' | 'glb' | 'gltf')
  obtenerRutaRelativa(nombreArchivo: string, tipo: 'obj' | 'glb' | 'gltf')
  validarExtension(nombreArchivo: string)
  validarTamaño(tamanioBytes: number)
}
```

### Cómo Usar en Servicios

```typescript
// backend/src/modulos/modelos3d/modelos3d.service.ts

@Injectable()
export class Modelos3dService {
  constructor(
    private almacenamiento: ServicioAlmacenamientoModelos,
    private configuracion: ConfiguracionAlmacenamientoModelos,
  ) {}

  async subirModelo(archivo: Express.Multer.File) {
    // Guardar o registrar usando servicio centralizado
    const { nombreArchivo, rutaRelativa, tamaño } =
      await this.almacenamiento.guardarModelo(archivo, 'obj');

    // Guardar en BD con referencia centralizada
    const archivoModelo = await this.prisma.archivoModelo.create({
      data: {
        nombre: archivo.originalname,
        nombreAlmacenado: nombreArchivo,
        ruta: rutaRelativa,                    // ✅ Referencia relativa
        rutaCompleta: this.configuracion
          .obtenerRutaCompleta(nombreArchivo), // ✅ Referencia absoluta
        tipo: 'obj',
        mimeType: archivo.mimetype,
        tamaño: tamaño,
        modeloId: modeloId,
      },
    });

    return archivoModelo;
  }

  async obtenerModelo(nombreArchivo: string) {
    // Obtener desde almacenamiento centralizado
    return this.almacenamiento.obtenerArchivo(nombreArchivo);
  }

  async eliminarModelo(nombreArchivo: string) {
    // Eliminar desde almacenamiento centralizado
    return this.almacenamiento.eliminarModelo(nombreArchivo);
  }
}
```

### En Frontend (Next.js)

```typescript
// frontend/src/servicios/cliente-api.ts

class ClienteAPI {
  async obtenerModelo(idModelo: string) {
    // Endpoint retorna URL completa
    const respuesta = await axios.get(
      `${this.baseURL}/modelos3d/${idModelo}`
    );

    // Datos retornados
    return {
      ...respuesta.data,
      archivo: {
        nombre: 'modelo_1698765432_jaguar.glb',
        ruta: '/modelos/glb/modelo_1698765432_jaguar.glb',      // ✅ Relativa
        rutaCompleta: '/api/modelos3d/descargar/modelo_1698765432_jaguar.glb' // ✅ Endpoint
      }
    };
  }
}

// frontend/src/componentes/VisualizadorCanvas3D.tsx

function VisualizadorCanvas3D({ modelo }) {
  useEffect(() => {
    // Cargar desde endpoint seguro
    const cargarModelo = async () => {
      const respuesta = await fetch(modelo.archivo.rutaCompleta);
      const arrayBuffer = await respuesta.arrayBuffer();

      // Cargar con Three.js GLTFLoader
      const loader = new GLTFLoader();
      loader.parse(arrayBuffer, '', (gltf) => {
        scene.add(gltf.scene);
      });
    };

    cargarModelo();
  }, [modelo]);

  return <canvas ref={refCanvas} />;
}
```

## Flujo Completo de Almacenamiento

```
1. ADMIN REGISTRA O SUBE MODELO
   └─> 13463_Australian_Cattle_Dog_v3.obj
   └─> 13463_Australian_Cattle_Dog_v3.mtl
   └─> Australian_Cattle_Dog_bump.jpg / Australian_Cattle_Dog_dif.jpg

2. BACKEND RECIBE
   └─> Valida: extensión ✓, tamaño ✓, relación OBJ/MTL/texturas ✓

3. SERVICIO DE ALMACENAMIENTO
   └─> Ruta completa: backend/Modelos/.../13463_Australian_Cattle_Dog_v3.obj
   └─> Ruta relativa: /modelos/Australian_Cattle_Dog/.../13463_Australian_Cattle_Dog_v3.obj

4. GUARDAR EN DISCO
   └─> fs.writeFileSync(rutaCompleta, buffer) o registrar archivo ya existente

5. REGISTRAR EN BASE DE DATOS
   archivos_modelos {
     nombre: "13463_Australian_Cattle_Dog_v3.obj",
     nombreAlmacenado: "13463_Australian_Cattle_Dog_v3.obj",
     ruta: "/modelos/Australian_Cattle_Dog/.../13463_Australian_Cattle_Dog_v3.obj",
     tipo: "obj",
     archivoMaterial: "13463_Australian_Cattle_Dog_v3.mtl",
     texturas: ["Australian_Cattle_Dog_bump.jpg", "Australian_Cattle_Dog_dif.jpg"],
     tamaño: 5478421,
     modeloId: "uuid-del-modelo"
   }

6. RESPUESTA AL FRONTEND
   {
     id: "uuid",
     nombre: "Jaguar",
     archivo: {
       nombre: "13463_Australian_Cattle_Dog_v3.obj",
       ruta: "/modelos/Australian_Cattle_Dog/.../13463_Australian_Cattle_Dog_v3.obj",
       rutaCompleta: "/api/modelos3d/descargar/13463_Australian_Cattle_Dog_v3.obj",
       material: "/api/modelos3d/descargar/13463_Australian_Cattle_Dog_v3.mtl",
       texturas: [...],
       tamaño: 5478421
     },
     transformaciones: { ... }
   }

7. FRONTEND CARGA MODELO
   └─> fetch("/api/modelos3d/descargar/13463_Australian_Cattle_Dog_v3.obj")
   └─> Parsea con OBJLoader + MTLLoader o GLTFLoader cuando el formato sea GLB/GLTF
   └─> Renderiza en Canvas3D

8. USUARIO EDITA (opcional)
   └─> Ajusta escala, rotación, posición, color/metadatos
   └─> Endpoint: PATCH /api/modelos3d/:id/transformaciones
   └─> Guarda cambios sin sobrescribir archivos originales
```

## Migración a Producción (Nube)

### Opción 1: AWS S3

```typescript
// Cambiar punto de referencia
class ConfiguracionAlmacenamientoModelos {
  readonly RUTAS_BASE = {
    PRINCIPAL: 'https://mi-bucket-s3.amazonaws.com/modelos',
    GLB: 'https://mi-bucket-s3.amazonaws.com/modelos/glb',
    SKETCHFAB: 'https://mi-bucket-s3.amazonaws.com/modelos/sketchfab',
  };
}
```

### Opción 2: Cloudinary

```typescript
class ConfiguracionAlmacenamientoModelos {
  readonly RUTAS_BASE = {
    PRINCIPAL: 'https://res.cloudinary.com/tu-cuenta/image/upload/modelos',
    GLB: 'https://res.cloudinary.com/tu-cuenta/image/upload/modelos/glb',
  };
}
```

### Opción 3: Almacenamiento Local + CDN

```typescript
// Mantener estructura local
// Servir a través de CDN (Cloudflare, Akamai, etc.)
// CDN cachea archivos automáticamente
```

## Optimizaciones de Caché

### Para Modelos Frecuentes

```typescript
// backend/src/infraestructura/cache/servicio-cache-memoria.ts

@Injectable()
export class ServicioCacheMemoria {
  async obtenerModeloEnCache(idModelo: string) {
    // Clave: modelo:id-modelo
    const clave = `modelo:${idModelo}`;
    
    // Intentar obtener del caché
    const modeloEnCache = await this.obtener<Modelo3D>(clave);
    if (modeloEnCache) return modeloEnCache;

    // Si no está, obtener de BD
    const modeloEnBD = await this.prisma.modelo3D.findUnique({
      where: { id: idModelo },
      include: { archivo: true, transformaciones: true }
    });

    // Guardar en caché por 1 hora
    await this.guardar(clave, modeloEnBD, TIEMPOS_EXPIRACION.LARGO);
    
    return modeloEnBD;
  }
}
```

## Casos de Uso Prácticos

### Cargar un modelo OBJ/MTL en Canvas3D

```typescript
// 1. Obtener modelo desde API
const modelo = await ClienteAPI.obtenerModelo(idModelo);

// 2. Acceder a rutas
console.log(modelo.archivo.nombre);           // "13463_Australian_Cattle_Dog_v3.obj"
console.log(modelo.archivo.ruta);             // "/modelos/Australian_Cattle_Dog/.../13463_Australian_Cattle_Dog_v3.obj"
console.log(modelo.archivo.rutaCompleta);     // "/api/modelos3d/descargar/..."

// 3. Descargar archivo
const respuesta = await fetch(modelo.archivo.rutaCompleta);
const arrayBuffer = await respuesta.arrayBuffer();

// 4. Parsear con Three.js
const materiales = await new MTLLoader().loadAsync(modelo.archivo.material);
materiales.preload();

const loader = new OBJLoader();
loader.setMaterials(materiales);
loader.load(modelo.archivo.rutaCompleta, (obj) => {
  scene.add(obj);
});
```

### Guardar una edición no destructiva

```typescript
await ClienteAPI.actualizarTransformaciones(modelo.id, {
  escala: { x: 1.05, y: 1.05, z: 1.05 },
  rotacion: { x: 0, y: 30, z: 0 },
  posicion: { x: 0, y: 0, z: 0 },
  nombreVisible: 'Mi mascota rural',
});
```

## Archivos Relacionados

- `backend/src/infraestructura/` - Caché y limitador
- `backend/Modelos/` - Archivos reales del catálogo 3D local
- `backend/src/modelos/almacenamiento/` - Gestión de archivos
- `backend/src/modulos/modelos3d/` - Lógica de negocio
- `backend/prisma/schema.prisma` - Estructura de BD
- `frontend/src/servicios/cliente-api.ts` - Cliente HTTP
- `frontend/src/componentes/VisualizadorCanvas3D.tsx` - Renderizador 3D

---

**Última actualización:** Junio 2026
**Responsable:** Sistema de Almacenamiento Centralizado
