# 3. El enfoque intercultural

> Rúbrica §3: justificar claramente cómo el proyecto incorpora la
> interculturalidad. **No será suficiente mostrar una funcionalidad adicional.**
> La funcionalidad intercultural deberá estar integrada al propósito del
> sistema.

Este es el criterio de mayor peso (3 de 7 puntos) y el que exige una defensa
argumentada, no una demostración. El documento responde en tres partes: qué se
hizo, por qué no es un añadido, y cómo contribuye a cada uno de los seis
efectos que la rúbrica enumera.

---

## 1. Qué se hizo

La plataforma está disponible **completa** en kichwa y castellano, con tres
modos de visualización conmutables en caliente:

| Modo | Qué muestra |
| --- | --- |
| `es` | Solo castellano |
| `kw` | Solo kichwa |
| `both` | **Ambas lenguas simultáneamente**, en formato `kichwa · castellano` |

Cifras verificables:

| Métrica | Valor |
| --- | --- |
| Cadenas traducidas | ~540 pares clave → `[castellano, kichwa]` |
| Archivo de traducción | 1017 líneas ([translations.ts](../../frontend/src/lib/i18n/translations.ts)) |
| Norma ortográfica | Alfabeto Kichwa Unificado (ALKI), Tabacundo 1998 |
| Fuentes lexicográficas | 3 (MinEduc/SEIB, GAD Chimborazo, ALKI) |
| Raíces léxicas inventadas | **0** |
| Documento de respaldo | [docs/TRADUCCION_KICHWA.md](../../docs/TRADUCCION_KICHWA.md) |

---

## 2. Por qué esto no es "una funcionalidad adicional"

La rúbrica advierte explícitamente contra el añadido decorativo. Hay cinco
argumentos concretos, todos verificables en el código, que muestran que la
lengua está en el núcleo del sistema y no encima de él.

### 2.1 No existe un "modo indígena" separado

El selector de idioma está disponible **antes de iniciar sesión**, en la
portada, en el login y en el registro. No hay una versión kichwa de la
aplicación: hay **una** aplicación que habla dos lenguas. Segregar al usuario
kichwahablante en una ruta o una versión aparte habría reproducido exactamente
la exclusión que el proyecto intenta corregir.

### 2.2 La lengua no es un dato de sesión

Cuando el usuario cierra sesión, se borra todo el almacenamiento local **menos
la preferencia de idioma**:

```ts
// frontend/src/lib/i18n/LanguageProvider.tsx
export function clearSessionKeepingLanguage() {
  saved = localStorage.getItem(LANG_STORAGE_KEY);
  localStorage.clear();
  if (saved) localStorage.setItem(LANG_STORAGE_KEY, saved);
}
```

Es una decisión deliberada con una justificación explícita en el comentario del
código: *"la preferencia de lengua no es un dato de sesión"*. La lengua de una
persona no caduca cuando se desconecta.

### 2.3 Los datos ya guardados también se traducen

Tamaño, color y raza se eligen de listas cerradas y se almacenan en castellano.
La función `translateStored()` los traduce **al vuelo, en pantalla**, sin migrar
la base de datos:

```
BD: color = "Negro"            →  pantalla en kichwa: "Yana"
BD: raza  = "Mestizo/Criollo"  →  "Chakrushka / kaypi wiwa"
```

Consecuencia: una mascota registrada **antes** de que existiera la traducción se
muestra igualmente en kichwa. La lengua no es una capa sobre datos nuevos; es
una lente sobre todos los datos del sistema.

### 2.4 El producto final —el cartel PDF— también se rotula en kichwa

El entregable que sale del sistema y circula por la comunidad
([pet-report.ts](../../frontend/src/lib/pet-report.ts)) se genera en el idioma
elegido. Si la traducción fuera decorativa, se habría quedado en la interfaz y
el PDF habría salido en castellano. Un cartel bilingüe pegado en un poste es
precisamente el punto donde la interculturalidad sale de la pantalla.

### 2.5 El respeto al texto del usuario está codificado

Cuando la persona usa la opción "Otro (escribir)" y teclea texto libre, ese
texto **se muestra tal cual, nunca se traduce**. El comentario del código lo
declara: *"nunca se traduce a ciegas lo que escribió un usuario"*. Traducir
automáticamente la voz de alguien es una forma de sobreescribirla.

### 2.6 El modo bilingüe simultáneo

El modo `both` (`kichwa · castellano`) no existe por indecisión técnica.
Responde a la realidad sociolingüística ecuatoriana: la mayoría de
kichwahablantes son **bilingües**, y muchos jóvenes de comunidades kichwas leen
con más soltura en castellano que en su lengua materna. El modo simultáneo
permite usar la aplicación y **aprender el término kichwa al mismo tiempo**.
Convierte la herramienta en un vehículo de recuperación léxica, no solo de
traducción.

---

## 3. Rigor de la traducción

Este es el punto que distingue el proyecto de un volcado a un traductor
automático, y conviene poder sostenerlo si el tribunal pregunta.

### 3.1 Norma ortográfica

Se adoptó el **Alfabeto Kichwa Unificado (ALKI)**, acordado en el taller de
Tabacundo (1998) y adoptado por el Ministerio de Educación para el Sistema de
Educación Intercultural Bilingüe.

| Rasgo de la norma | Efecto en el código |
| --- | --- |
| Solo tres vocales `a i u` | `kichwa`, no *quichua*; `shimi`; `runa` |
| `k` sustituye a `c`/`qu` | `killka`, no *quillca* |
| `w` sustituye a `hu` | `wasi`, no *huasi*; `wawa`, no *huahua* |
| `h` sustituye a `j` | `hatun`, no *jatun* |
| Plural con `-kuna` | `wiwakuna`, `shuyukuna` |

**Por qué importa:** escribir kichwa con ortografía castellanizada (*huahua*,
*jatun*, *quichua*) es exactamente la práctica que la política lingüística
ecuatoriana busca corregir. Un proyecto que se declara intercultural no debería
reproducirla. La elección ortográfica es, en sí misma, una postura.

### 3.2 Fuentes

| Sigla | Fuente |
| --- | --- |
| `[MinEduc]` | Ministerio de Educación del Ecuador, SEIB/DINEIB — *Kichwa Yachakukkunapa Shimiyuk Kamu* |
| `[GADCH]` | GAD Provincial de Chimborazo — *Ñucanchik Shimiyuk Panka* |
| `[ALKI]` | Alfabeto Kichwa Unificado / Academia de la Lengua Kichwa |
| `[comp.]` | Compuesto formado con raíces documentadas en las fuentes anteriores |

### 3.3 Declaración de honestidad

**No se inventó ninguna raíz léxica.** Cuando un concepto técnico no tiene
equivalente documentado, se hizo una de dos cosas:

1. **Conservar el préstamo:** `PDF`, `3D`, `JWT`, `Cloudinary`, `MB`, `latitud`.
2. **Construir un compuesto transparente**, marcado como `[comp.]` y con su
   composición declarada. Esto no es inventar: es aplicar la morfología
   aglutinante del kichwa a raíces atestiguadas.

Ejemplos de compuestos, con su descomposición:

| Concepto | Kichwa | Composición |
| --- | --- | --- |
| correo electrónico | `llikachaski` | `llika` red + `chaski` mensajero (el chasqui del Tawantinsuyu) |
| contraseña | `pakalla shimi` | `pakalla` oculto + `shimi` palabra |
| teléfono | `karu rimay` | `karu` lejos + `rimay` habla |
| usuario | `mutsurik` | `mutsuna` necesitar/usar + agentivo `-k` |
| administrador | `kamak` | `kamana` cuidar/gobernar + agentivo `-k` |
| cartel de búsqueda | `maskana panka` | `maskana` buscar + `panka` hoja |

`llikachaski` para "correo electrónico" merece señalarse en la defensa: recupera
`chaski`, el mensajero del sistema de comunicaciones incaico, para nombrar el
correo digital. Es continuidad conceptual, no calco del castellano.

### 3.4 Qué no se tradujo, y por qué

Los nombres de raza son en su mayoría **nombres propios** (Labrador, Siamés,
Rottweiler, Mini Lop) y no se traducen en ninguna lengua. Solo se tradujeron los
descriptivos: *Cabeza de león* → `Puma uma`, *Salchicha* → `Suni kurku`
(`suni` largo + `kurku` cuerpo), *Esfinge* → `Sphynx (millma illak)`
(`millma` pelo + `illak` sin).

Saber **qué no traducir** es parte del rigor. Traducir "Labrador" habría sido
tan incorrecto como traducir "Quito".

---

## 4. Contribución a cada efecto que pide la rúbrica

La rúbrica enumera seis efectos. El proyecto responde a los seis, con evidencia
concreta en cada caso.

### 4.1 Promover la inclusión

La aplicación no exige dominio del castellano para completar el flujo principal.
Una persona kichwahablante puede registrarse, describir su mascota, marcar la
zona, pintar las señas y exportar el cartel **sin salir de su lengua**. El
selector está disponible desde antes del login, de modo que la barrera no
aparece en el primer paso.

A esto se suma un mecanismo de inclusión que no es lingüístico: **la pintura
sobre el modelo 3D no requiere escribir**. Señalar un color y marcar una mancha
sobre la figura del animal es una vía de descripción accesible para quien tiene
dificultades de lectoescritura o no domina el vocabulario descriptivo formal en
ninguna de las dos lenguas.

### 4.2 Fortalecer la identidad cultural

Usar la lengua propia en un contexto técnico —una aplicación web, no una clase
de lengua ni un acto folclórico— comunica que el kichwa **sirve para el mundo
digital contemporáneo**. La ausencia de kichwa en el software cotidiano
transmite lo contrario: que es una lengua del pasado o del ámbito doméstico.

El modo bilingüe simultáneo refuerza esto: hace visible el kichwa incluso a
quien opera en castellano.

### 4.3 Facilitar el acceso a servicios

El servicio concreto es la difusión organizada de una búsqueda. Antes de la
aplicación, ese servicio existía solo en castellano y en canales informales.
Ahora existe en kichwa, es estructurado y produce un artefacto difundible.

### 4.4 Preservar conocimientos o patrimonio cultural

Tres formas concretas, más allá de la declaración:

1. **El glosario es un artefacto reutilizable.** [docs/TRADUCCION_KICHWA.md](../../docs/TRADUCCION_KICHWA.md)
   documenta ~540 términos con fuente, incluyendo terminología informática en
   kichwa que escasea. Sirve a otros proyectos.
2. **Se aplica la norma ALKI**, contribuyendo a consolidar la estandarización
   ortográfica en vez de fragmentarla.
3. **Se recuperan raíces con carga histórica** para conceptos modernos
   (`chaski` → correo electrónico), en lugar de importar el préstamo castellano.

### 4.5 Atender comunidades históricamente poco representadas

El kichwa es la lengua indígena con más hablantes del Ecuador y lengua oficial
de relación intercultural según el artículo 2 de la Constitución de 2008. Pese a
ello, la oferta de software cotidiano en kichwa es casi inexistente. El proyecto
atiende a esa población en un caso de uso doméstico y concreto.

El dominio elegido no es casual: el animal de crianza (`wiwa`) es parte de la
economía familiar andina —cuidado del ganado, control de plagas, sustento—, no
un accesorio afectivo. Perder uno es una pérdida material.

### 4.6 Eliminar barreras culturales o lingüísticas

Además de la traducción, dos decisiones eliminan barreras:

- **La zona en lugar de la dirección exacta** respeta modelos de organización
  territorial comunitaria, donde la referencia habitual es el sector o la
  comunidad, no una nomenclatura de calle y número que en muchas zonas rurales
  simplemente no existe.
- **El atributo `lang` del documento se ajusta a `qu`** (código ISO 639-1 de la
  familia quechua) cuando se muestra kichwa, de modo que los lectores de
  pantalla y las herramientas de accesibilidad reciban la información correcta.

---

## 5. Cómo demostrarlo en tres minutos

Si el tribunal da poco tiempo, este es el recorrido de mayor densidad
argumentativa:

1. **Portada en castellano → conmutar a kichwa → conmutar a bilingüe.** Toda la
   interfaz cambia sin recargar. *"El selector está aquí, antes del login: no
   hay que autenticarse para tener derecho a la propia lengua."*
2. **Abrir una ficha de mascota registrada antes de la traducción.** El color y
   la raza aparecen en kichwa. *"Esto no está guardado en kichwa en la base de
   datos: se traduce en pantalla. La lengua alcanza también a los datos
   antiguos."*
3. **Exportar el PDF en kichwa.** *"El cartel que se pega en el poste también
   está en kichwa. La interculturalidad sale del sistema."*
4. **Abrir [docs/TRADUCCION_KICHWA.md](../../docs/TRADUCCION_KICHWA.md).**
   *"Cada término tiene su fuente. No hay ninguna raíz inventada. Los
   compuestos están marcados y descompuestos."*
5. **Cerrar sesión.** El idioma se conserva.

---

## 6. Límite declarado

Por honestidad metodológica, y porque es la pregunta más probable del tribunal:

**La traducción no ha sido validada por hablantes nativos de kichwa.** Está
construida sobre fuentes lexicográficas oficiales y aplica correctamente la
norma ALKI, pero eso no sustituye la revisión de un hablante ni de un docente
del Sistema de Educación Intercultural Bilingüe.

Es la limitación principal del componente intercultural y la primera línea de
trabajo futuro: someter el glosario a revisión por hablantes nativos y por la
Academia de la Lengua Kichwa, y ajustar los compuestos `[comp.]` que no resulten
transparentes para un usuario real.

Declararlo es preferible a que el tribunal lo descubra preguntando.
