# 5. Calidad técnica del software

> Rúbrica §5: se evaluará navegación adecuada, interfaces consistentes,
> estabilidad, facilidad de uso, criterios básicos de accesibilidad,
> validaciones y funcionamiento correcto durante la demostración.

Los siete aspectos se responden en orden, con evidencia verificable en el
código.

---

## 1. Navegación

La aplicación tiene una estructura plana y corta: ninguna tarea principal
requiere más de tres niveles de profundidad.

```
/                     Portada pública · catálogo de mascotas · selector de idioma
├── /auth/login       Inicio de sesión
├── /auth/register    Registro
└── /dashboard        Panel del usuario
                      ├── Registrar mascota
                      ├── Selector y visor 3D
                      ├── Editor de cartel
                      └── Vista de administración (solo rol ADMIN)
```

Decisiones de navegación defendibles:

- **El catálogo público no exige sesión.** Quien encontró un animal puede
  consultar sin registrarse; obligar a crear cuenta habría añadido una barrera
  justo donde más urgencia hay.
- **El selector de idioma está en la portada, el login y el registro**, no
  escondido en un perfil que requiere autenticarse.
- **La vista de administración no es una ruta distinta** sino una capacidad
  adicional del panel, condicionada al rol. El servidor decide, no el cliente.

## 2. Consistencia de la interfaz

| Mecanismo | Cómo se garantiza |
| --- | --- |
| Sistema visual único | Tailwind CSS con configuración compartida ([tailwind.config.ts](../../frontend/tailwind.config.ts)) |
| Componentes reutilizados | 11 componentes en [frontend/src/components/](../../frontend/src/components/), sin duplicar diálogos ni formularios |
| Texto centralizado | Un único diccionario tipado; ninguna cadena visible está escrita en el JSX |
| Confirmación destructiva homogénea | `ConfirmHoldDialog` — todas las eliminaciones usan el mismo patrón de confirmación sostenida |

La centralización del texto tiene un efecto de consistencia que conviene
señalar: **es imposible que dos pantallas llamen distinto a la misma cosa**,
porque ambas leen la misma clave del diccionario.

## 3. Estabilidad

### Compilación limpia

Ambos proyectos compilan sin errores de TypeScript. Verificado el 26 de julio de
2026:

```
backend$  npm run build
  > nest build                              ✓ sin errores

frontend$ npm run build
  ✓ Compiled successfully
  ✓ Generating static pages (5/5)
  Route (app)                    Size     First Load JS
  ○ /                            3.59 kB         144 kB
  ○ /auth/login                  4.05 kB         145 kB
  ○ /auth/register               4.7  kB         145 kB
  ○ /dashboard                    166 kB         293 kB
```

Compilar sin errores es parte de la **Definition of Done**, no una comprobación
final.

### Manejo de fallos previstos

| Riesgo | Tratamiento en el código |
| --- | --- |
| Modelo 3D sin geometría o inaccesible | `addFallbackCube()` — el visor muestra una figura de respaldo en lugar de quedar en blanco |
| Almacenamiento local bloqueado por el navegador | La conmutación de idioma sigue funcionando en la pestaña actual |
| Recursos WebGL al desmontar | Geometrías y materiales se liberan explícitamente para evitar fugas de memoria |
| Base de datos caída | `GET /api/health` ejecuta `SELECT 1`; un proceso vivo con la conexión rota no se reporta sano |
| Error de validación en la API | Respuesta estructurada campo a campo, no un mensaje genérico |

## 4. Validaciones

### En el servidor

Validación declarativa con `class-validator` y un `ValidationPipe` global
configurado en modo estricto ([main.ts](../../backend/src/main.ts)):

```ts
new ValidationPipe({
  whitelist: true,              // descarta propiedades no declaradas
  forbidNonWhitelisted: true,   // y rechaza la petición si llegan
  transform: true,
  exceptionFactory: /* devuelve { field, messages[] } por cada error */
})
```

`forbidNonWhitelisted: true` es una decisión de seguridad, no de comodidad: un
cliente no puede inyectar campos que el DTO no declara —por ejemplo `role:
"ADMIN"` en el registro.

Validadores en uso: 52 `@IsOptional`, 36 `@IsString`, 13 `@IsNumber`,
3 `@MaxLength`, 3 `@IsBoolean`, 2 `@MinLength`, 1 `@IsEmail`, 1 `@Matches`.

### Reglas de negocio verificadas en el servidor

- Un usuario **solo** puede editar o eliminar sus propias mascotas.
- El catálogo 3D **solo** devuelve modelos de la categoría solicitada.
- El rol `ADMIN` es lo único que habilita `GET /api/animales`.
- La contraseña se almacena cifrada con bcrypt, nunca en claro.
- El JWT se valida en cada petición protegida mediante guard de Passport.

Ninguna de estas reglas se aplica únicamente en el frontend. Es el punto que
conviene subrayar si preguntan por seguridad: **la validación de cliente es
comodidad; la de servidor es la que protege.**

### En el cliente

Validación inmediata en formularios, con `aria-invalid` y `aria-describedby`
para que el mensaje de error quede asociado al campo también para lectores de
pantalla.

## 5. Accesibilidad

Criterios básicos aplicados, verificables con `grep` sobre el código:

| Atributo | Ocurrencias | Uso |
| --- | ---: | --- |
| `aria-label` | 11 | Controles sin texto visible (iconos, botones del visor 3D) |
| `aria-describedby` | 10 | Vinculación de mensajes de error y ayudas al campo |
| `role` | 9 | Semántica de diálogos y regiones |
| `aria-invalid` | 8 | Campos con error de validación |
| `aria-pressed` | 3 | Estado del selector de idioma y de los modos del visor |
| `aria-valuenow/min/max` | 3 | Control deslizante del grosor de pincel |
| `aria-modal`, `aria-labelledby` | 2 | Diálogo de confirmación |

Además, y esto es específico de este proyecto: **el atributo `lang` del
documento se actualiza dinámicamente** a `es` o `qu` (código ISO 639-1 de la
familia quechua) según el idioma mostrado, de modo que un lector de pantalla
aplique la pronunciación correcta.

```ts
document.documentElement.lang = lang === 'es' ? 'es' : 'qu';
```

**Limitación declarada:** no se ha realizado una auditoría formal WCAG 2.1 ni
pruebas con usuarios que utilicen tecnología de asistencia. Lo aplicado son
criterios básicos, no una certificación de conformidad.

## 6. Métricas de usabilidad: estado real de la evidencia

> **Advertencia de integridad académica. Leer antes de presentar estos
> números.**

La carpeta [Entrega Final/](../) contiene un instrumento de evaluación
heurística y de usabilidad con datos de **8 participantes**. Sin embargo, la
portada del propio archivo `Evaluacion_Heuristica_Mascotas3D.xlsx` declara
literalmente:

> *"Los participantes de ejemplo están marcados como tales para evitar
> presentar evidencia falsa. Puedes reemplazarlos por nombres reales solo si
> realizaste la evaluación de forma auténtica."*

Es decir: **los datos son de plantilla, no de un estudio con usuarios reales.**
Presentarlos como resultados empíricos sería falsear evidencia, y una sola
pregunta del tribunal sobre el protocolo de la prueba lo dejaría al descubierto.

### Valores actuales del instrumento

Calculados sobre los CSV existentes. Se documentan como **estructura del
instrumento**, no como hallazgos:

**UEQ** (escala −3 a +3; n=8 simulados)

| Dimensión | Media |
| --- | ---: |
| Atractivo | 1.74 |
| Claridad | 1.35 |
| Eficiencia | 1.20 |
| Control | 1.18 |
| Estimulación | 1.88 |
| Novedad | 1.95 |

**PSSUQ** (escala 1 = mejor a 7 = peor; n=8 simulados)

| Subescala | Media |
| --- | ---: |
| Utilidad del sistema (I1–I6) | 1.79 |
| Calidad de la información (I7–I12) | 2.40 |
| Calidad de la interfaz (I13–I15) | 2.00 |
| **Global (I1–I16)** | **2.06** |

### Las dos opciones honestas

**Opción A — ejecutar la evaluación de verdad (recomendada).** Se necesitan de 5
a 8 personas y aproximadamente 20 minutos por participante. Bastan compañeros de
clase, con la condición de declarar el perfil real de la muestra. El protocolo:
cada participante ejecuta los ocho pasos del guion de demostración
([documento 02](02_SOLUCION_TECNOLOGICA.md#5-guion-de-demostración)) y después
responde los cuestionarios UEQ y PSSUQ ya preparados. Con eso los números pasan
a ser evidencia real y la evaluación heurística cobra pleno valor.

**Opción B — presentarlos como instrumento diseñado.** Decir explícitamente:
*"diseñamos el instrumento de evaluación con UEQ y PSSUQ, y lo dejamos listo
para aplicar; los valores que se ven son de la plantilla, no de un estudio
ejecutado."* Se pierde el crédito de la evidencia empírica pero se conserva el
del diseño del instrumento, y no hay riesgo de integridad.

Con dos días de margen, la Opción A es alcanzable y es la que más aporta al
criterio de calidad técnica.

## 7. Marco de evaluación heurística

El instrumento se apoya en **Bastien y Scapin** como heurística complementaria a
Nielsen, con PSSUQ como métrica de usabilidad percibida y UEQ como métrica de
experiencia. Documento: `Informe_metricas_usabilidad_UX_Mascotas_3D.pdf`.

## 8. Funcionamiento correcto durante la demostración

La rúbrica califica que el sistema **funcione en el momento de exponer**. Riesgos
identificados y su mitigación:

| Riesgo | Probabilidad | Mitigación |
| --- | --- | --- |
| El servicio de Render está dormido y la primera carga tarda ~50 s | **Alta** | Abrir la aplicación 5 minutos antes de empezar |
| Falla la red del aula | Media | Tener el entorno local levantado en paralelo y un video de respaldo de la demo completa |
| La base de datos gratuita de Render caducó (30 días) | Baja | Verificar el día anterior; conservar un respaldo `pg_dump` |
| Un modelo 3D pesado tarda en cargar | Media | Precargar la ficha que se va a demostrar antes de exponer |
| Se demuestra con una sesión que ya tenía datos | Media | Ensayar desde una sesión limpia, como pide el checklist de evidencias |

**Recomendación:** ensayar la demostración completa de principio a fin al menos
una vez sobre el entorno desplegado, no solo en local. El punto A8 del registro
de adaptaciones ([documento 04](04_PROCESO_DE_DESARROLLO.md#6-evolución-del-producto-adaptaciones-registradas))
muestra que el despliegue expuso supuestos que en local no se veían.
