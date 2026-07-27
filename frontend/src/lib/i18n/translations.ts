/**
 * Tabla de traducciones Español (es) <-> Kichwa (kw).
 *
 * El kichwa usado sigue el ALFABETO KICHWA UNIFICADO (ALKI, acuerdo de
 * Tabacundo 1998), oficializado por el Ministerio de Educación del Ecuador
 * para la Educación Intercultural Bilingüe: 18 grafías y solo tres vocales
 * (a, i, u). Por eso se escribe `allku` y no `alcu`, `shuti` y no `shuti`,
 * `kichwa` y no `quichua`.
 *
 * Cada término está documentado en `docs/TRADUCCION_KICHWA.md` con su fuente.
 * Las fuentes usadas son:
 *   [MinEduc] Ministerio de Educación del Ecuador, Kichwa Yachakukkunapa
 *             Shimiyuk Kamu / textos del Sistema de Educación Intercultural
 *             Bilingüe (SEIB).
 *   [GADCH]   GAD Provincial de Chimborazo, "Ñucanchik Shimiyuk Panka —
 *             Nuestro diccionario de palabras, Kichwa–Castellano".
 *   [ALKI]    Academia de la Lengua Kichwa / alfabeto unificado.
 *   [comp.]   Compuesto formado con raíces atestiguadas en las fuentes
 *             anteriores (se indica la composición en el glosario).
 *
 * NO se inventan raíces. Cuando un concepto técnico no tiene término
 * documentado (PDF, 3D, email), se conserva el préstamo o se usa un
 * compuesto explicado en el glosario.
 */

export type Lang = 'es' | 'kw' | 'both';

/** Un par de cadenas: castellano y kichwa. */
type Pair = readonly [es: string, kw: string];

export const LANGUAGES: { code: Lang; label: string; short: string }[] = [
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'kw', label: 'Kichwa', short: 'KW' },
  { code: 'both', label: 'Kichwa · Español', short: 'KW·ES' },
];

export const dict = {
  // ---------- Marca y navegación ----------
  'app.name': ['Mascotas 3D', 'Wasi Wiwakuna 3D'],
  'app.tagline': [
    'Plataforma de Modelos Tridimensionales',
    'Kimsa uyay rikchakkunapa panka',
  ],
  'nav.dashboard': ['Dashboard', 'Kamana panka'],
  'nav.logout': ['Salir', 'Llukshina'],
  'nav.login': ['Iniciar Sesión', 'Yaykuna'],
  'nav.register': ['Regístrate', 'Killkarina'],
  'nav.home': ['Inicio', 'Kallari'],

  // ---------- Selector de idioma ----------
  'lang.label': ['Idioma', 'Shimi'],
  'lang.choose': ['Elige el idioma', 'Shimita akllay'],
  'lang.es': ['Español', 'Kastilla shimi'],
  'lang.kw': ['Kichwa', 'Kichwa shimi'],
  'lang.both': ['Kichwa y Español', 'Kichwa, Kastilla shimipash'],
  'lang.note': [
    'Puedes cambiar el idioma en cualquier momento.',
    'Ima pachapipash shimita tikrachi ushanki.',
  ],

  // ---------- Portada pública ----------
  'home.badge': [
    'Búsqueda de mascotas perdidas con apoyo 3D',
    'Chinkashka wasi wiwakunata 3D yanapaywan maskana',
  ],
  'home.searchPlaceholder': [
    'Busca tu barrio o zona para ver publicaciones cercanas',
    'Kikinpak kitita maskay, kuchulla willaykunata rikunkapak',
  ],
  'home.useLocation': ['Usar mi ubicación', 'Ñuka kuskata rikuchina'],
  'home.title': [
    'Encuentra mascotas perdidas con guía visual 3D',
    'Chinkashka wasi wiwakunata 3D rikchakwan tari',
  ],
  'home.titleA': ['Encuentra', 'Tari'],
  'home.titleB': [' mascotas perdidas', ' chinkashka wasi wiwakunata'],
  'home.titleC': ['con guía visual 3D', '3D rikuchikwan'],
  'home.subtitle': [
    'Sube fotos, publica o revisa mascotas perdidas, compáralas con modelos 3D locales y usa la guía visual para ayudar a reconocerlas más rápido.',
    'Shuyukunata apachi, chinkashka wasi wiwakunata willachi, rikuypash; kaypak 3D rikchakkunawan tinkuchishpa utka riksinkapak yanapan.',
  ],
  'home.ctaStart': ['Comenzar Ahora', 'Kunan kallarina'],
  'home.ctaCreate': ['Crear Cuenta', 'Killkarina'],
  'home.zoneTitle': ['Animales en tu zona', 'Kikinpak kitipi wiwakuna'],
  'home.zoneSubtitle': [
    'Publicaciones visibles sin iniciar sesión.',
    'Mana yaykushpapash rikuypak willaykuna.',
  ],
  'home.searching': ['Buscando...', 'Maskakun...'],
  'home.noZone': ['Sin zona', 'Kiti illak'],
  'home.zoneUnknown': ['Zona no indicada', 'Kiti mana willashka'],
  'home.owner': ['Dueño:', 'Amu:'],
  'home.unavailable': ['No disponible', 'Mana tiyan'],
  'home.empty': [
    'Todavía no hay publicaciones en esta zona.',
    'Kay kitipika manarak willaykuna tiyanchu.',
  ],
  'home.f1.title': ['Ficha de Búsqueda', 'Maskana panka'],
  'home.f1.body': [
    'Cada registro combina fotos, contexto y un modelo 3D para reconocer mejor una mascota perdida.',
    'Sapan killkaypika shuyukuna, willaykuna, shuk 3D rikchakpash tantarin, chinkashka wasi wiwata alli riksinkapak.',
  ],
  'home.f2.title': ['Publicar y Buscar', 'Willachina, Maskanapash'],
  'home.f2.body': [
    'Publica mascotas perdidas, filtra por tipo y contexto, y encuentra coincidencias más rápido.',
    'Chinkashka wasi wiwakunata willachi, rakiypi akllay, utkalla tinkuchishkakunata tari.',
  ],
  'home.f3.title': ['Seguimiento Seguro', 'Alli katichina'],
  'home.f3.body': [
    'Autenticación JWT, Prisma ORM y PostgreSQL para conservar reportes, fotos y coincidencias.',
    'JWT, Prisma ORM, PostgreSQL nishkakunawan willaykuna, shuyukuna, tinkuchishkakunapash allimi wakarin.',
  ],
  'home.footer': [
    '© 2026 Mascotas 3D — Plataforma de Modelos Tridimensionales',
    '© 2026 Wasi Wiwakuna 3D — Kimsa uyay rikchakkunapa panka',
  ],
  'home.interculturalNote': [
    'Plataforma bilingüe kichwa–castellano, en aporte a la interculturalidad del Ecuador.',
    'Kichwa, kastilla shimipi panka; Ecuador mamallaktapak tawka kawsaypura yanapaywan.',
  ],

  // ---------- Autenticación ----------
  'auth.loginTitle': ['Iniciar Sesión', 'Yaykuna'],
  'auth.loginSubtitle': [
    'Accede a tu cuenta de mascotas',
    'Kikinpak wiwakunaman yaykuy',
  ],
  'auth.registerTitle': ['Crear Cuenta', 'Killkarina'],
  'auth.registerSubtitle': [
    'Únete a la comunidad de mascotas domésticas',
    'Wasi wiwakunapak ayllullaktaman yaykuy',
  ],
  'auth.email': ['Correo Electrónico', 'Llikachaski'],
  'auth.password': ['Contraseña', 'Pakalla shimi'],
  'auth.emailRequired': ['Escribe tu correo electrónico.', 'Kikinpak llikachaskita killkay.'],
  'auth.passwordRequired': ['Escribe tu contraseña.', 'Kikinpak pakalla shimita killkay.'],
  'auth.name': ['Nombre Completo', 'Tukuy shuti'],
  'auth.namePlaceholder': ['Tu nombre completo', 'Kikinpak tukuy shuti'],
  'auth.passwordHint': ['Mínimo 6 caracteres', 'Sukta killkamanta yalli'],
  'auth.loggingIn': ['Ingresando...', 'Yaykukun...'],
  'auth.creating': ['Creando cuenta...', 'Killkarikun...'],
  'auth.noAccount': ['¿No tienes cuenta?', '¿Manarak killkarishkankichu?'],
  'auth.registerHere': ['Regístrate aquí', 'Kaypi killkari'],
  'auth.hasAccount': ['¿Ya tienes cuenta?', '¿Ñami killkarishkankichu?'],
  'auth.loginHere': ['Inicia sesión', 'Yaykuy'],
  'auth.backHome': ['← Volver al inicio', '← Kallariman kutina'],
  'auth.errorLogin': ['Error al iniciar sesión', 'Yaykunapi pantay'],
  'auth.errorRegister': ['Error al registrarse', 'Killkarinapi pantay'],
  'auth.viewSlide': ['Ver', 'Rikuna'],
  'auth.captchaTitle': ['Verificación', 'Rikuchiy'],
  'auth.captchaHint': [
    'Resuelve la operación para confirmar que no eres un robot.',
    'Mana robot kashkata rikuchinkapak kay yupayta paktachi.',
  ],
  'auth.captchaQuestion': ['¿Cuánto es {a} + {b}?', '¿{a} yapa {b}, mashnatak?'],
  'auth.captchaRequired': ['Responde la operación.', 'Yupayta kutichi.'],
  'auth.captchaWrong': [
    'La respuesta no es correcta. Prueba con la nueva operación.',
    'Kutichiyka mana allichu. Mushuk yupaywan ruray.',
  ],
  'auth.captchaNew': ['Cambiar operación', 'Shuk yupayta mañana'],
  'auth.fixLoginErrors': [
    'Revisa el correo, la contraseña y la verificación antes de continuar.',
    'Katishpa, llikachaski, pakalla shimi, wakichiyta allichi.',
  ],

  // ---------- Validación del registro ----------
  'reg.nameRequired': ['Escribe tu nombre.', 'Kikinpak shutita killkay.'],
  'reg.nameTooShort': [
    'El nombre debe tener al menos 2 letras.',
    'Shutika ishkay killkamanta yalli charina kan.',
  ],
  'reg.nameTooLong': [
    'El nombre no puede superar los 60 caracteres.',
    'Shutika sukta chunka killkata mana yalliy ushanchu.',
  ],
  'reg.nameInvalid': [
    'El nombre solo puede tener letras y espacios, sin números ni símbolos.',
    'Shutipika killkakuna, chushak kuskakunallami tiyay ushan; yupaykuna, unanchakunapash mana.',
  ],
  'reg.emailRequired': ['Escribe tu correo electrónico.', 'Kikinpak llikachaskita killkay.'],
  'reg.emailInvalid': [
    'El correo no es válido. Debe tener la forma nombre@dominio.com',
    'Llikachaskika mana allichu. Kayshina kana kan: shuti@dominio.com',
  ],
  'reg.passwordRequired': ['Escribe una contraseña.', 'Shuk pakalla shimita killkay.'],
  'reg.passwordTooShort': [
    'La contraseña debe tener al menos 6 caracteres.',
    'Pakalla shimika sukta killkamanta yalli charina kan.',
  ],
  'reg.confirmLabel': ['Repite la contraseña', 'Pakalla shimita kutin killkay'],
  'reg.confirmRequired': ['Repite la contraseña.', 'Pakalla shimita kutin killkay.'],
  'reg.confirmMismatch': [
    'Las contraseñas no coinciden.',
    'Pakalla shimikunaka mana chayllatakchu.',
  ],
  'reg.showPassword': ['Mostrar contraseña', 'Pakalla shimita rikuchina'],
  'reg.hidePassword': ['Ocultar contraseña', 'Pakalla shimita pakana'],
  'reg.captchaTitle': ['Verificación', 'Rikuchiy'],
  'reg.captchaHint': [
    'Resuelve la operación para confirmar que no eres un robot.',
    'Mana robot kashkata rikuchinkapak kay yupayta paktachi.',
  ],
  'reg.captchaQuestion': ['¿Cuánto es {a} + {b}?', '¿{a} yapa {b}, mashnatak?'],
  'reg.captchaRequired': ['Responde la operación.', 'Yupayta kutichi.'],
  'reg.captchaWrong': [
    'La respuesta no es correcta. Prueba con la nueva operación.',
    'Kutichiyka mana allichu. Mushuk yupaywan ruray.',
  ],
  'reg.captchaNew': ['Cambiar operación', 'Shuk yupayta mañana'],
  'reg.fixErrors': [
    'Revisa los campos marcados antes de continuar.',
    'Manarak katishpa unanchashka kuskakunata allichi.',
  ],

  // ---------- Panel / dashboard ----------
  'dash.title': ['Panel de Mascotas Domésticas', 'Wasi wiwakunata kamana panka'],
  'dash.admin': ['Admin', 'Kamak'],
  'dash.user': ['Usuario', 'Mutsurik'],
  'dash.redirecting': ['Redirigiendo...', 'Pushakun...'],
  'dash.myPets': ['Mis Mascotas Domésticas', 'Ñuka wasi wiwakuna'],
  'dash.myPetsSubtitle': [
    'Explora y gestiona tu colección de mascotas',
    'Kikinpak wiwakunata riku, kamapash',
  ],
  'dash.uploadModel': ['📦 Subir Modelo 3D', '📦 3D rikchakta apachina'],
  'dash.newPet': ['+ Nueva Mascota', '+ Mushuk wiwa'],
  'dash.searchPet': ['Buscar mascota o dueño', 'Wiwata, amutapash maskana'],
  'dash.searchPetPlaceholder': [
    'Nombre, raza, dueño o correo',
    'Shuti, kasta, amu, llikachaskipash',
  ],
  'dash.filterUser': ['Filtrar por usuario', 'Mutsurikpak akllana'],
  'dash.allUsers': ['Todos los usuarios', 'Tukuy mutsurikkuna'],
  'dash.modelsAvailable': ['modelos 3D disponibles', '3D rikchakkuna tiyan'],
  'dash.modelAvailable': ['modelo 3D disponible', '3D rikchak tiyan'],
  'dash.modelsHint': [
    'Los usuarios pueden asignarlos a sus mascotas',
    'Mutsurikkunaka paykunapak wiwakunaman churay ushan',
  ],
  'dash.loadingPets': ['Cargando mascotas...', 'Wiwakuna chaskikun...'],
  'dash.noPets': ['No hay mascotas aún', 'Manarak wiwakuna tiyanchu'],
  'dash.noPetsHint': [
    'Crea tu primera mascota para comenzar',
    'Kallarinkapak shukniki wiwata rurashun',
  ],
  'dash.createFirst': ['Crear Primera Mascota', 'Shukniki wiwata rurana'],
  'dash.noMatches': ['No hay coincidencias', 'Mana tarirkachu'],
  'dash.noMatchesHint': [
    'Prueba con otro usuario o con un nombre distinto.',
    'Shuk mutsurikwan, shuk shutiwanpash maskay.',
  ],
  'dash.backToList': ['← Volver a la lista', '← Katikman kutina'],
  'dash.preparing': ['Preparando...', 'Allichikun...'],
  'dash.preparePdf': ['Preparar cartel PDF', 'Willachik pankata (PDF) rurana'],
  'dash.visual3d': ['Referencia visual 3D', '3D rikuchik'],
  'dash.visual3dHint': [
    'Acomoda la vista antes de exportar; esa posición aparecerá en el PDF.',
    'Manarak llukchishpa rikuchikta allichi; chay kuskami PDF ukupi rikurinka.',
  ],
  'dash.edit3d': ['🎨 Editar modelo 3D', '🎨 3D rikchakta allichina'],
  'dash.reassign': ['Reasignar modelo', 'Shuk rikchakta churana'],
  'dash.reassignShort': ['Reasignar', 'Tikrachina'],
  'dash.edit3dShort': ['🎨 Editar 3D', '🎨 3D allichina'],
  'dash.noModel': [
    'Esta mascota aún no tiene modelo 3D',
    'Kay wiwaka manarak 3D rikchakta charinchu',
  ],
  'dash.noModelHint': [
    'Puedes exportar sus datos y fotos ahora o asignar un modelo de la misma categoría.',
    'Kunanllatak willaykunata, shuyukunatapash llukchi ushanki; mana kashpaka chay kikin rakiymanta shuk rikchakta churay.',
  ],
  'dash.assignModel': ['Asignar modelo 3D', '3D rikchakta churana'],
  'dash.photos': ['Fotografías registradas', 'Killkashka shuyukuna'],
  'dash.photosHint': [
    'El PDF conserva la imagen completa, sin recortarla.',
    'PDF ukupika tukuy shuyumi wakarin, mana kuchushkachu.',
  ],
  'dash.photo': ['Fotografía', 'Shuyu'],
  'dash.photoOne': ['foto', 'shuyu'],
  'dash.photoMany': ['fotos', 'shuyukuna'],
  'dash.noPhotos': [
    'No hay fotografías registradas. Edita la mascota para agregarlas.',
    'Manarak shuyukuna killkashkachu. Wiwata allichishpa churay.',
  ],
  'dash.searchData': ['Datos de búsqueda', 'Maskana willaykuna'],
  'dash.owner': ['Dueño:', 'Amu:'],
  'dash.contact': ['Contacto:', 'Rimanakuy:'],
  'dash.zone': ['Zona aproximada:', 'Kiti:'],
  'dash.address': ['Calles:', 'Ñankuna:'],
  'dash.date': ['Fecha:', 'Puncha:'],
  'dash.lastSeen': ['Último avistamiento:', 'Puchukay rikushka:'],
  'dash.notRegisteredM': ['No registrado', 'Mana killkashka'],
  'dash.notRegisteredF': ['No registrada', 'Mana killkashka'],
  'dash.noReference': ['Sin referencia adicional', 'Shuk willay illak'],
  'dash.description': ['Descripción', 'Willay'],
  'dash.features': ['Características', 'Imashina kay'],
  'dash.size': ['Tamaño:', 'Sayay:'],
  'dash.color': ['Color:', 'Tullpu:'],
  'dash.habitat': ['Hábitat:', 'Kawsana kuska:'],
  'dash.model3d': ['Modelo 3D', '3D rikchak'],
  'dash.editInfo': ['Editar informacion', 'Willayta allichina'],
  'dash.viewSheet': ['Ver ficha y exportar', 'Pankata rikuna, llukchinapash'],
  'dash.edit': ['✏️ Editar', '✏️ Allichina'],
  'dash.delete': ['🗑️ Eliminar', '🗑️ Anchuchina'],
  'dash.models': ['Modelos 3D', '3D rikchakkuna'],
  'dash.modelsSubtitle': [
    'Edita transformaciones, color y visibilidad pública.',
    'Tikray, tullpu, tukuypak rikuypash allichina.',
  ],
  'dash.model': ['modelo', 'rikchak'],
  'dash.modelsPlural': ['modelos', 'rikchakkuna'],
  'dash.noModels': [
    'Todavía no hay modelos 3D cargados.',
    'Manarak 3D rikchakkuna apachishkachu.',
  ],
  'dash.filterSpecies': ['Filtrar por especie', 'Layapi akllana'],
  'dash.allSpecies': ['Todas', 'Tukuy'],
  'dash.noModelsInSpecies': [
    'No hay modelos 3D de esta especie.',
    'Kay layapak 3D rikchakkuna illan.',
  ],
  'dash.showAllSpecies': ['Ver todas las especies', 'Tukuy layakunata rikuna'],
  'dash.public': ['Público', 'Tukuypak'],
  'dash.private': ['Privado', 'Ñukapaklla'],
  'dash.editModel': ['Editar modelo', 'Rikchakta allichina'],
  'dash.confirmDelete': [
    '¿Eliminar {name}? Esta acción no se puede deshacer.',
    '¿{name} anchuchinkichu? Kaytaka mana kutin tikrachi ushankichu.',
  ],
  'dash.deleteError': [
    'No se pudo eliminar la mascota. Intenta otra vez.',
    'Wiwata mana anchuchi usharkachu. Kutin ruray.',
  ],
  'dash.assignError': [
    'Se guardó tu versión, pero no se pudo asignar a la mascota.',
    'Kikinpak rurayka wakarirka, shinapash wiwaman mana churay usharkachu.',
  ],
  'dash.loadingPoster': [
    'Cargando la información para preparar el cartel...',
    'Willachik pankata rurankapak willaykuna chaskikun...',
  ],
  'dash.posterError': [
    'No se pudo preparar el cartel. Actualiza la ficha e intenta nuevamente.',
    'Willachik pankata mana rura usharkachu. Pankata mushukyachishpa kutin ruray.',
  ],
  'dash.pdfOk': ['PDF descargado correctamente:', 'PDF allimi uriyarka:'],
  'dash.with3d': ['vista 3D incluida', '3D rikuchikwan'],
  'dash.without3d': ['sin captura 3D', '3D rikuchik illak'],
  'dash.omitted': ['omitidas', 'sakishka'],

  // ---------- Categorías ----------
  'cat.PERRO': ['Perro', 'Allku'],
  'cat.GATO': ['Gato', 'Misi'],
  'cat.CONEJO': ['Conejo', 'Wallinku'],

  // ---------- Confirmación por pulsación sostenida ----------
  'confirm.holdHint': [
    'Mantén pulsado el botón 2 segundos para confirmar. Suelta para cancelar.',
    'Ari ninkapak ishkay sikundu kama ñitishpa charini. Kacharishpaka sakirin.',
  ],
  'confirm.keepHolding': ['Sigue pulsando...', 'Ñitikushpa katiy...'],
  'confirm.deleting': ['Eliminando...', 'Anchuchikun...'],
  'confirm.deleteModelTitle': ['Eliminar modelo 3D', '3D rikchakta anchuchina'],
  'confirm.deleteModelMessage': [
    'Se eliminará "{name}" de forma permanente. Esta acción no se puede deshacer.',
    '"{name}" nishkaka wiñaypakmi anchurinka. Kaytaka mana kutin tikrachi ushankichu.',
  ],
  'confirm.deleteModelWarningPets': [
    'Hay {n} mascota(s) usando este modelo: quedarán sin referencia 3D, pero sus fichas y fotos no se tocan.',
    '{n} wasi wiwakunami kay rikchakta mutsun: 3D rikuchik illak sakirinka, shinapash paykunapak pankakuna, shuyukunapash mana tikranchu.',
  ],
  'confirm.deleteModelWarningCopies': [
    'Las versiones personalizadas que partieron de este modelo se conservan.',
    'Kay rikchakmanta rurashka sapan rurashkakunaka wakarinllami.',
  ],
  'confirm.deleteModelAction': ['Mantén pulsado para eliminar', 'Anchuchinkapak ñitishpa charini'],
  'confirm.deleteModelError': [
    'No se pudo eliminar el modelo. Intenta otra vez.',
    'Rikchakta mana anchuchi usharkachu. Kutin ruray.',
  ],
  'confirm.deleteModelOk': ['Modelo eliminado correctamente.', 'Rikchak allimi anchurirka.'],

  // ---------- Formularios comunes ----------
  'form.save': ['Guardar', 'Wakaychina'],
  'form.saving': ['Guardando...', 'Wakaychikun...'],
  'form.cancel': ['Cancelar', 'Sakina'],
  'form.close': ['Cerrar', 'Wichkana'],
  'form.accept': ['Aceptar', 'Ari nina'],
  'form.next': ['Siguiente', 'Katik'],
  'form.back': ['Atrás', 'Washaman'],
  'form.required': ['Obligatorio', 'Mutsurishka'],
  'form.optional': ['Opcional', 'Munashkalla'],
  'form.select': ['Selecciona', 'Akllay'],
  'form.loading': ['Cargando...', 'Chaskikun...'],
  'form.error': ['Ocurrió un error', 'Shuk pantay tiyarka'],

  // ---------- Mascota / ficha ----------
  'pet.name': ['Nombre', 'Shuti'],
  'pet.breed': ['Raza', 'Kasta'],
  'pet.category': ['Categoría', 'Rakiy'],
  'pet.zone': ['Zona', 'Kiti'],
  'pet.zoneApprox': ['Zona aproximada', 'Kuchulla kiti'],
  'pet.phone': ['Teléfono de contacto', 'Karu rimay yupay'],
  'pet.lastSeen': ['Última vez visto', 'Puchukay kutin rikushka'],
  'pet.date': ['Fecha', 'Puncha'],
  'pet.description': ['Descripción', 'Willay'],
  'pet.photos': ['Fotografías', 'Shuyukuna'],
  'pet.owner': ['Propietario', 'Amu'],
  'pet.contact': ['Contacto', 'Rimanakuy'],
  'pet.noPhoto': ['Sin foto', 'Shuyu illak'],
  'pet.noPhone': ['Sin teléfono', 'Karu rimay illak'],
  'pet.noDescription': ['Sin descripción', 'Willay illak'],
  'pet.howToRecognize': ['Cómo reconocerla', 'Imashina riksina'],

  // ---------- Cartel ----------
  'poster.wanted': ['SE BUSCA', 'MASKANAKUN'],
  'poster.lost': ['MASCOTA PERDIDA', 'CHINKASHKA WASI WIWA'],
  'poster.contact': ['CONTACTO', 'RIMANAKUY'],
  'poster.ownerLabel': ['PROPIETARIO', 'AMU'],
  'poster.category': ['CATEGORÍA', 'RAKIY'],
  'poster.zoneApprox': ['ZONA APROXIMADA', 'KUCHULLA KITI'],
  'poster.zone': ['ZONA', 'KITI'],
  'poster.lastSeenLong': ['VISTA POR ÚLTIMA VEZ', 'PUCHUKAY KUTIN RIKUSHKA'],
  'poster.lastSeen': ['ÚLTIMA VEZ', 'PUCHUKAY KUTIN'],
  'poster.recognize': ['CÓMO RECONOCERLA', 'IMASHINA RIKSINA'],
  'poster.preview': ['Vista previa del cartel', 'Willachik pankapak ñawpa rikuy'],

  // ---------- Textos del PDF ----------
  'pdf.footer': ['Mascotas 3D - Ficha de búsqueda', 'Wasi Wiwakuna 3D - Maskana panka'],
  'pdf.page': ['Página', 'Panka'],
  'pdf.notRegisteredM': ['No registrado', 'Mana killkashka'],
  'pdf.notRegisteredF': ['No registrada', 'Mana killkashka'],
  'pdf.noPhoto': ['Sin fotografía', 'Shuyu illak'],
  'pdf.helpUs': ['AYÚDANOS A ENCONTRARLA', 'TARINKAPAK YANAPAWAY'],
  'pdf.shareHelps': ['COMPARTIR ES AYUDAR', 'RAKINAKA YANAPANAMI'],
  'pdf.continuation': ['(CONTINUACIÓN)', '(KATIKMI)'],
  'pdf.noBreed': ['Raza no registrada', 'Kasta mana killkashka'],
  'pdf.ownerRegistered': ['Propietario registrado', 'Killkashka amu'],
  'pdf.noExtraDesc': ['Sin descripción adicional.', 'Shuk willay illak.'],
  'pdf.noReference': ['Sin referencia adicional', 'Shuk unancha illak'],
  'pdf.colorPrefix': ['Color:', 'Tullpu:'],
  'pdf.sizePrefix': ['Tamaño:', 'Sayay:'],
  'pdf.fullSheet': ['Ficha completa:', 'Tukuy willay panka:'],
  'pdf.fullSheetSub': [
    'Información preparada para la búsqueda',
    'Maskankapak allichishka willay',
  ],
  'pdf.continuationSub': ['Continuación de la información', 'Willaypak katik'],
  'pdf.owner': ['Propietario', 'Amu'],
  'pdf.phone': ['Teléfono de contacto', 'Rimanakunapak karu rimay yupay'],
  'pdf.categoryBreed': ['Categoría y raza', 'Rakiy, kastapash'],
  'pdf.zoneApprox': ['Zona aproximada', 'Kuchulla kiti'],
  'pdf.lastSeenDate': ['Fecha vista por última vez', 'Puchukay kutin rikushka puncha'],
  'pdf.lastSeenRef': ['Referencia del último avistamiento', 'Puchukay rikushkapak unancha'],
  'pdf.recognition': ['Descripción para reconocerla', 'Riksinkapak willay'],
  'pdf.model3d': ['Modelo 3D asociado', 'Tinkishka 3D rikchak'],
  'pdf.noModel': ['No asignado', 'Mana churashka'],
  'pdf.modelSupport': [
    'Modelo de apoyo para reconocer rasgos y marcas de la mascota',
    'Wasi wiwapak unanchakunata riksinkapak yanapak rikchak',
  ],
  'pdf.modelAssociated': ['MODELO ASOCIADO', 'TINKISHKA RIKCHAK'],
  'pdf.modelDisclaimer': [
    'Esta representación es una guía visual y debe compararse con las fotografías reales.',
    'Kay rikchakka rikuchiklla; chikan shuyukunawanmi tinkuchina kan.',
  ],

  // ---------- Modelos 3D ----------
  'model.paint': ['Pintar', 'Tullpuna'],
  'model.color': ['Color', 'Tullpu'],
  'model.brushSize': ['Tamaño del pincel', 'Tullpunapak sayay'],
  'model.undo': ['Deshacer', 'Kutin anchuchina'],
  'model.clear': ['Limpiar', 'Pichana'],
  'model.rotate': ['Rotar', 'Muyuchina'],
  'model.scale': ['Escala', 'Sayay'],
  'model.position': ['Posición', 'Kuska'],
  'model.saveAsMine': ['Guardar como mía', 'Ñukapak wakaychina'],
  'model.saveAsCommunity': ['Guardar para la comunidad', 'Ayllullaktapak wakaychina'],
  'model.selectModel': ['Selecciona un modelo', 'Shuk rikchakta akllay'],
  'model.assign': ['Asignar', 'Churana'],
  'model.upload': ['Subir modelo', 'Rikchakta apachina'],
  'model.uploading': ['Subiendo...', 'Apachikun...'],

  // ---------- Selector de modelo ----------
  'sel.reassignTitle': ['Reasignar modelo 3D', '3D rikchakta tikrachina'],
  'sel.assignTitle': ['Asignar modelo 3D', '3D rikchakta churana'],
  'sel.for': ['Para:', 'Kaypak:'],
  'sel.categoryLabel': ['Categoría:', 'Rakiy:'],
  'sel.assignError': ['Error al asignar modelo', 'Rikchakta churanapi pantay'],
  'sel.emptyTitle': [
    'No hay modelos 3D para esta categoría.',
    'Kay rakiypakka 3D rikchakkuna illan.',
  ],
  'sel.emptyHint': [
    'Revisa que exista una carpeta para este tipo.',
    'Kay laya rikchakpak kipu tiyakta rikuy.',
  ],
  'sel.previewHint': [
    'Selecciona un modelo para ver la vista previa',
    'Ñawpa rikuyta rikunkapak shuk rikchakta akllay',
  ],
  'sel.reassignAction': ['Reasignar modelo', 'Rikchakta tikrachina'],
  'sel.assignAction': ['Asignar modelo', 'Rikchakta churana'],

  // ---------- Subir modelo 3D ----------
  'up.title': ['Subir Modelo 3D', '3D rikchakta apachina'],
  'up.adminOnly': ['Solo administradores', 'Kamakkunallapak'],
  'up.needFile': [
    'Debes seleccionar un archivo 3D',
    'Shuk 3D willaykiputa akllana kanki',
  ],
  'up.confirmPublic': [
    'Vas a publicar este modelo para que otras personas lo usen. ¿Deseas continuar?',
    'Kay rikchakta shuk runakuna mutsuchunmi willachinki. ¿Katinkichu?',
  ],
  'up.error': ['Error al subir el modelo', 'Rikchakta apachinapi pantay'],
  'up.changeFile': ['Clic para cambiar archivo', 'Willaykiputa tikrachinkapak ñitiy'],
  'up.dropHere': ['Arrastra tu modelo 3D aquí', 'Kikinpak 3D rikchakta kayman aysay'],
  'up.orClick': ['o haz clic para seleccionar', 'mana kashpaka akllankapak ñitiy'],
  'up.formats': ['Formatos: .glb, .gltf, .obj', 'Layakuna: .glb, .gltf, .obj'],
  'up.modelName': ['Nombre del Modelo *', 'Rikchakpak shuti *'],
  'up.modelNamePlaceholder': [
    'Ej: Pastor Alemán, Gato Persa...',
    'Shina: Pastor Alemán, Gato Persa...',
  ],
  'up.categoryRequired': ['Categoría *', 'Rakiy *'],
  'up.categoryHint': [
    'La categoría define qué mascotas pueden usar este modelo 3D.',
    'Rakiymi willan mayken wiwakuna kay 3D rikchakta mutsuy ushanata.',
  ],
  'up.breed': ['Raza / Especie', 'Kasta / Laya'],
  'up.breedPlaceholder': ['Ej: Labrador', 'Shina: Labrador'],
  'up.refColor': ['Color de referencia', 'Rikuchik tullpu'],
  'up.descriptionPlaceholder': [
    'Describe brevemente el modelo...',
    'Rikchakmanta ashalla willay...',
  ],
  'up.publishTitle': ['Publicar este modelo', 'Kay rikchakta willachina'],
  'up.publishHint': [
    'Si lo activas, otras personas podrán usarlo como guía.',
    'Kayta hapichishpaka, shuk runakunapash pushakta shina mutsuy ushanka.',
  ],
  'up.submit': ['Subir Modelo', 'Rikchakta apachina'],

  // ---------- Editor de modelo 3D ----------
  'ed.customizeTitle': ['Personalizar modelo 3D', '3D rikchakta ñukapakyachina'],
  'ed.editTitle': ['Editar modelo 3D', '3D rikchakta allichina'],
  'ed.customizeHint': [
    'Pinta sobre "{name}" y guarda tu propia versión. El modelo original no se modifica.',
    '"{name}" nishka rikchakpi tullpushpa kikinpak rurayta wakaychi. Kallari rikchakka mana tikranchu.',
  ],
  'ed.editHint': [
    'Conserva la textura original y pinta detalles encima del animal.',
    'Kallari karata wakaychishpa, wiwa hawapi uchilla shuyukunata tullpuy.',
  ],
  'ed.confirmClear': [
    '¿Quieres borrar toda la pintura agregada sobre este modelo?',
    '¿Kay rikchakpi churashka tukuy tullputa pichankichu?',
  ],
  'ed.needName': [
    'Escribe un nombre para esta versión.',
    'Kay rurayman shuk shutita killkay.',
  ],
  'ed.saveError': ['Error al guardar el modelo', 'Rikchakta wakaychinapi pantay'],
  'ed.interactionMode': ['Modo de interacción', 'Imashina rurana'],
  'ed.modeView': ['Ver', 'Rikuna'],
  'ed.modeViewHint': ['Arrastra para rotar', 'Muyuchinkapak aysay'],
  'ed.modePaint': ['Pintar', 'Tullpuna'],
  'ed.modePaintHint': ['Arrastra el pincel', 'Tullpunata aysay'],
  'ed.zoomHint': [
    'La rueda del ratón hace zoom en cualquier momento, incluso mientras pintas.',
    'Ukucha muyuwan ima pachapipash hatunyachi ushanki, tullpukushpapash.',
  ],
  'ed.toolPencil': ['Lápiz', 'Killkana'],
  'ed.toolPencilHint': ['Detalle fino', 'Ñañu shuyu'],
  'ed.toolBrush': ['Pincel', 'Tullpuna'],
  'ed.toolBrushHint': ['Trazo medio', 'Chawpi shuyu'],
  'ed.toolBroad': ['Brocha', 'Hatun tullpuna'],
  'ed.toolBroadHint': ['Área amplia', 'Hatun pampa'],
  'ed.paintColor': ['Color de pintura', 'Tullpupak tullpu'],
  'ed.colorAria': ['Color', 'Tullpu'],
  // Cuentagotas. `hapina` = agarrar, tomar [GADCH]; `tullpu` = color.
  'ed.pickColor': ['Copiar un color del modelo', 'Tullputa hapina'],
  'ed.pickColorActive': ['Toca el animal para tomar su color', 'Wiwata llamkay tullputa hapinkapak'],
  'ed.pickColorHint': [
    'Pinta con el mismo color que ya tiene su pelaje.',
    'Millmapa tullpuwanllatak tullpuy.',
  ],
  'ed.undo': ['Deshacer trazo', 'Kutin anchuchina'],
  'ed.clearPaint': ['Limpiar pintura', 'Tullputa pichana'],
  'ed.whereSave': ['¿Dónde guardas tu versión?', '¿Maypi kikinpak rurayta wakaychinki?'],
  'ed.visibility': ['Visibilidad', 'Rikurina'],
  'ed.onlyMe': ['🔒 Solo para mí', '🔒 Ñukapaklla'],
  'ed.onlyMeFromPet': [
    'Se asigna a tu mascota y nadie más la ve.',
    'Kikinpak wiwaman churarin, pipash mana rikunchu.',
  ],
  'ed.onlyMeHint': [
    'Queda únicamente en tu cuenta.',
    'Kikinpak yaykunallapimi sakirin.',
  ],
  'ed.shareCommunity': ['🌎 Compartir con la comunidad', '🌎 Ayllullaktawan rakina'],
  'ed.shareCommunityHint': [
    'Otras personas podrán partir de tu versión en vez de pintar desde cero.',
    'Shuk runakunaka kikinpak ruraymanta kallariy ushanka, mana tukuyta mushukmanta tullpushpa.',
  ],
  'ed.deriveNoticeA': ['Se creará una copia con tu pintura.', 'Kikinpak tullpuwan shuk kikin ruranka.'],
  'ed.deriveNoticeB': ['no se modifica', 'mana tikranchu'],
  'ed.deriveNoticeC': [
    'así que el resto de mascotas que lo usan siguen igual.',
    'chaymanta chayta mutsuk shuk wiwakunaka shinallatak sakirin.',
  ],
  'ed.saveMine': ['Guardar mi versión', 'Ñuka rurayta wakaychina'],
  'ed.saveChanges': ['Guardar cambios', 'Tikrashkakunata wakaychina'],

  // ---------- Razas con traducción posible ----------
  // Las razas con nombre propio (Labrador, Siamés, Mini Lop...) no se traducen
  // en ninguna lengua. Solo se traducen las descriptivas.
  'breed.Mestizo / Criollo': ['Mestizo / Criollo', 'Chakrushka / kaypi wiwa'],
  // Variantes sueltas que quedaron guardadas antes de fijar la lista cerrada,
  // o escritas a mano en "Otra". Sin ellas la ficha se quedaba en castellano.
  'breed.Mestizo': ['Mestizo', 'Chakrushka'],
  'breed.Criollo': ['Criollo', 'Kaypi wiwa'],
  'breed.Doméstico': ['Doméstico', 'Wasi wiwa'],
  'breed.Cabeza de león': ['Cabeza de león', 'Puma uma'],
  'breed.Enano holandés': ['Enano holandés', 'Holanda uchilla'],
  'breed.Belier (orejas caídas)': ['Belier (orejas caídas)', 'Belier (warkurishka rinri)'],
  'breed.Británico de pelo corto': ['Británico de pelo corto', 'Británico kuru millma'],
  'breed.Esfinge (Sphynx)': ['Esfinge (Sphynx)', 'Sphynx (millma illak)'],
  'breed.Azul Ruso': ['Azul Ruso', 'Rusia ankas'],
  'breed.Carey (Calicó)': ['Carey (Calicó)', 'Muru misi'],
  'breed.Gigante de Flandes': ['Gigante de Flandes', 'Flandes hatun'],
  'breed.Salchicha (Dachshund)': ['Salchicha (Dachshund)', 'Suni kurku (Dachshund)'],
  'breed.Poodle (Caniche)': ['Poodle (Caniche)', 'Poodle (kaspa millma)'],
  'breed.Husky Siberiano': ['Husky Siberiano', 'Siberia Husky'],
  'breed.Pastor Alemán': ['Pastor Alemán', 'Alemania michik'],

  // ---------- Tamaños (valor guardado en castellano, etiqueta traducida) ----------
  'size.Muy pequeño': ['Muy pequeño', 'Ancha uchilla'],
  'size.Pequeño': ['Pequeño', 'Uchilla'],
  'size.Mediano': ['Mediano', 'Chawpi'],
  'size.Grande': ['Grande', 'Hatun'],
  'size.Muy grande': ['Muy grande', 'Ancha hatun'],

  // ---------- Colores ----------
  'color.Negro': ['Negro', 'Yana'],
  'color.Blanco': ['Blanco', 'Yurak'],
  'color.Café / Marrón': ['Café / Marrón', 'Paku'],
  'color.Dorado': ['Dorado', 'Kuri niki'],
  'color.Crema / Beige': ['Crema / Beige', 'Killu yurak'],
  'color.Gris': ['Gris', 'Uchpa'],
  'color.Naranja': ['Naranja', 'Killu puka'],
  'color.Atigrado': ['Atigrado', 'Chikta chikta'],
  'color.Negro con blanco': ['Negro con blanco', 'Yana yurakwan'],
  'color.Café con blanco': ['Café con blanco', 'Paku yurakwan'],
  'color.Manchado (dos colores)': ['Manchado (dos colores)', 'Muru (ishkay tullpu)'],
  'color.Tricolor': ['Tricolor', 'Kimsa tullpu'],

  // ---------- Formulario de mascota ----------
  'af.step0': ['La mascota', 'Wasi wiwa'],
  'af.step0Hint': ['Nombre, tipo y raza', 'Shuti, laya, kastapash'],
  'af.step1': ['Cómo es', 'Imashina kan'],
  'af.step1Hint': ['Señas para reconocerla', 'Riksinapak unanchakuna'],
  'af.step2': ['Dónde se perdió', 'Maypi chinkarka'],
  'af.step2Hint': ['Zona y fecha', 'Kiti, punchapash'],
  'af.step3': ['Contacto', 'Rimanakuy'],
  'af.step3Hint': ['Para que te avisen', 'Kikinman willachunkuna'],
  'af.step4': ['Fotos', 'Shuyukuna'],
  'af.step4Hint': ['Hasta 3 imágenes', 'Kimsa shuyukama'],
  'af.other': ['Otro (escribir)', 'Shuktak (killkana)'],
  'af.badFormat': [
    'Formato no permitido. Solo se aceptan JPG, JPEG, PNG o WEBP (los GIF no se admiten porque son animados).',
    'Kay laya mana chaskirinchu. JPG, JPEG, PNG, WEBP nishkakunallami chaskirin (GIF nishkaka kuyurik kashkamanta mana chaskirinchu).',
  ],
  'af.tooManyPhotos': [
    'Solo puedes tener {max} fotos. Te quedan {free} espacios.',
    '{max} shuyukunallatami charina ushanki. {free} kuskakunami sakirin.',
  ],
  'af.tooHeavy': [
    '"{name}" pesa más de 8 MB. Usa una imagen más liviana.',
    '"{name}" nishkaka 8 MB yallimi llashan. Ashtawan pankalla shuyuta mutsuy.',
  ],
  'af.uploadFail': [
    'No se pudo subir la imagen. Intenta nuevamente.',
    'Shuyuta mana apachi usharkachu. Kutin ruray.',
  ],
  'af.maxReached': [
    'Ya tienes el máximo de {max} fotos.',
    'Ñami {max} shuyukunata charinki.',
  ],
  'af.badUrl': [
    'El enlace debe empezar con http:// o https://',
    'Tinkika http:// mana kashpaka https:// nishkawanmi kallarina kan',
  ],
  'af.duplicatePhoto': ['Esa foto ya está en la lista.', 'Chay shuyuka ñami katikpi tiyan.'],
  'af.needName': [
    'Escribe el nombre de la mascota.',
    'Wasi wiwapak shutita killkay.',
  ],
  'af.needZone': [
    'Busca la zona en el mapa o haz clic sobre el punto donde se perdió.',
    'Kitita rikuchikpi maskay, mana kashpaka maypi chinkashkata ñitiy.',
  ],
  'af.needPhone': [
    'Escribe un teléfono de contacto.',
    'Rimanakunkapak karu rimay yupayta killkay.',
  ],
  'af.badPhone': [
    'El teléfono solo puede tener números, espacios, guiones o paréntesis.',
    'Karu rimay yupaypika yupaykuna, chushak kuskakuna, siklla, wichkanakunallami tiyay ushan.',
  ],
  'af.saveError': ['Error al guardar la mascota', 'Wasi wiwata wakaychinapi pantay'],
  'af.savedTitle': ['{name} se registró correctamente', '{name} allimi killkarirka'],
  'af.savedHint': [
    'Ya puedes generar el cartel de búsqueda en PDF con sus fotos y tus datos de contacto.',
    'Kunanka shuyukunawan, rimanakuy willaywanpash maskana pankata (PDF) rurana ushankimi.',
  ],
  'af.preparePoster': ['Preparar cartel de búsqueda', 'Maskana pankata rurana'],
  'af.editTitle': ['Editar {name}', '{name} allichina'],
  'af.editFallback': ['mascota', 'wasi wiwa'],
  'af.createTitle': ['Registrar mascota perdida', 'Chinkashka wasi wiwata killkana'],
  'af.editHint': [
    'Toda la información en una sola vista. Cambia lo que necesites y guarda.',
    'Tukuy willay shuk rikuypi. Mutsurishkata tikrachishpa wakaychi.',
  ],
  'af.stepOf': ['Paso {n} de {total}:', '{total} ñikimanta {n} ñiki:'],
  'af.petName': ['Nombre de la mascota *', 'Wasi wiwapak shuti *'],
  'af.petNamePlaceholder': ['Ej: Toby, Luna, Mishi...', 'Shina: Toby, Luna, Mishi...'],
  'af.whichAnimal': ['¿Qué animal es? *', '¿Ima laya wiwa kan? *'],
  'af.breedSelect': ['Selecciona una raza...', 'Kastata akllay...'],
  'af.breedOther': ['Escribe la raza', 'Kastata killkay'],
  'af.recognizeHint': [
    'Estos datos aparecen en el cartel como "cómo reconocerla".',
    'Kay willaykunaka pankapi "imashina riksina" nishkapimi rikurin.',
  ],
  'af.size': ['Tamaño', 'Sayay'],
  'af.sizeSelect': ['Selecciona un tamaño...', 'Sayayta akllay...'],
  'af.sizeOther': ['Escribe el tamaño', 'Sayayta killkay'],
  'af.colorSelect': ['Selecciona un color...', 'Tullputa akllay...'],
  'af.colorOther': ['Escribe el color', 'Tullputa killkay'],
  'af.marks': ['Señas particulares', 'Sapan unanchakuna'],
  'af.marksPlaceholder': [
    'Ej: tiene una mancha blanca en el pecho, collar rojo, cojea de la pata trasera...',
    'Shina: kunkapi yurak muruta charin, puka kunka watana, washa chakipi hankan...',
  ],
  'af.marksHint': [
    'Lo que la distingue de otras mascotas parecidas.',
    'Shuk rikchak wiwakunamanta imawan chikanyarin.',
  ],
  // ── Rasgos de lista cerrada ──
  // A diferencia de la descripción libre, estos sí se muestran en las dos
  // lenguas: son datos, no prosa. Ver frontend/src/lib/rasgos.ts.
  'traits.title': ['¿Cómo es la mascota?', '¿Imashina kan wiwa?'],
  'traits.hint': [
    'Marca lo que corresponda. Esto sí se muestra en kichwa y en castellano.',
    'Imalla kashkata akllay. Kaymi ishkantin shimipi rikurin.',
  ],
  'traits.character': ['Carácter', 'Kawsay'],
  'traits.coat': ['Pelaje', 'Millma'],
  'traits.marks': ['Señas y accesorios', 'Unanchakuna'],
  'traits.none': ['Sin rasgos marcados', 'Mana unanchakuna akllashka'],

  'trait.carinoso': ['Cariñoso', 'Kuyak'],
  'trait.asustadizo': ['Asustadizo', 'Manchak'],
  'trait.tranquilo': ['Tranquilo', 'Kasilla'],
  'trait.jugueton': ['Juguetón', 'Pukllak'],
  'trait.buenoConNinos': ['Bueno con los niños', 'Wawakunawan alli'],
  'trait.noConOtrosAnimales': ['No se lleva con otros animales', 'Shuk wiwakunawan mana alli'],

  'trait.manchado': ['Manchado, dos colores', 'Muru'],
  'trait.peloLargo': ['Pelo largo', 'Suni millma'],
  'trait.peloCorto': ['Pelo corto', 'Kuru millma'],
  'trait.peloRizado': ['Pelo rizado', 'Kaspa millma'],
  'trait.sinPelo': ['Sin pelo', 'Millma illak'],

  'trait.cojea': ['Cojea', 'Hankan'],
  'trait.orejasCaidas': ['Orejas caídas', 'Warkurishka rinri'],
  'trait.colaLarga': ['Cola larga', 'Suni chupa'],
  'trait.colaCorta': ['Cola corta', 'Kuru chupa'],
  'trait.faltaUnOjo': ['Le falta un ojo', 'Shuk ñawi illak'],
  'trait.llevaCollar': ['Lleva collar', 'Kunka watanata charin'],

  'af.marksKw': ['Señas particulares en kichwa (opcional)', 'Sapan unanchakuna kichwapi (munashpa)'],
  'af.marksKwPlaceholder': [
    'Lo mismo, escrito por ti en kichwa.',
    'Chaykillpitak, kikin kichwapi killkashka.',
  ],
  'af.marksKwHint': [
    'Este texto no se traduce solo: si lo escribes, el cartel y la ficha en kichwa lo usarán.',
    'Kay killkaka mana paylla tikrachinchu: killkakpika, kichwa pankapi rikurinka.',
  ],
  'af.whereLost': ['¿En qué zona se perdió? *', '¿Ima kitipi chinkarka? *'],
  'af.address': ['Calles de referencia', 'Ñankuna riksinkapak'],
  'af.addressPlaceholder': [
    'Ej: Av. Maldonado y Calle S57, frente al parque',
    'Shina: Maldonado hatun ñan, S57 ñanwan, pukllana pampa ñawpakpi',
  ],
  'af.addressHint': [
    'Se completa sola al marcar el punto en el mapa. Corrígela si conoces mejor el sitio: la esquina orienta más que el nombre del barrio.',
    'Mapapi churakpi paylla huntarin. Alli riksishpaka allichiy: ñan kuchuka kitipa shutimanta yalli riksichin.',
  ],
  'af.zonePlaceholder': [
    'Escribe tu barrio o sector y selecciónalo',
    'Kikinpak kitita killkashpa akllay',
  ],
  'af.whenSeen': ['¿Cuándo la viste por última vez?', '¿Puchukay kutin ima punchapi rikurkanki?'],
  'af.placeReference': ['Referencia del lugar', 'Kuskapak unancha'],
  'af.placeReferencePlaceholder': [
    'Ej: cerca del parque, frente a la tienda...',
    'Shina: pukllana pampa kuchupi, katuna wasi ñawpakpi...',
  ],
  'af.privacyNote': [
    'Por seguridad, el cartel muestra solo la zona aproximada. Nunca se publican la latitud, la longitud ni tu dirección exacta.',
    'Alli kachun, pankapika kuchulla kitillami rikurin. Latitud, longitud, kikinpak wasi ñanpash mana willachirinchu.',
  ],
  'af.phone': ['Teléfono de contacto *', 'Rimanakunapak karu rimay yupay *'],
  'af.phonePlaceholder': ['Ej: 0991234567', 'Shina: 0991234567'],
  'af.phoneHint': [
    'Es el número que aparecerá en grande en el cartel de búsqueda.',
    'Kay yupaymi maskana pankapi hatunta rikurinka.',
  ],
  'af.petPhotos': ['Fotos de la mascota', 'Wasi wiwapak shuyukuna'],
  'af.of': ['de', 'manta'],
  'af.photoAlt': ['Foto {n} de la mascota', 'Wasi wiwapak {n} ñiki shuyu'],
  'af.cover': ['PORTADA', 'ÑAWPA PANKA'],
  'af.removePhoto': ['Quitar foto {n}', '{n} ñiki shuyuta anchuchina'],
  'af.uploadPhoto': ['Subir foto', 'Shuyuta apachina'],
  'af.photoRules': [
    'Formatos permitidos: JPG, JPEG, PNG y WEBP. Máximo 8 MB por foto. No se aceptan GIF. La primera foto es la portada del cartel.',
    'Chaskishka layakuna: JPG, JPEG, PNG, WEBP. Sapan shuyuka 8 MB kama. GIF mana chaskirinchu. Kallari shuyumi pankapak ñawpa panka kanka.',
  ],
  'af.pasteLink': ['O pega el enlace de una imagen', 'Mana kashpaka shuyupak tinkita churay'],
  'af.add': ['Añadir', 'Yapana'],
  'af.linkHint': [
    'Las fotos que subes se guardan en Cloudinary y siempre salen en el PDF. Un enlace externo puede fallar si el sitio no permite descargarlo.',
    'Kikin apachishka shuyukunaka Cloudinary ukupimi wakarin, PDF ukupipash punchallami rikurin. Kanchamanta tinkika chay panka mana uriyachi sakikpi pantay ushan.',
  ],
  'af.continue': ['Continuar', 'Katina'],
  'af.create': ['Crear mascota', 'Wasi wiwata rurana'],

  // ---------- Editor del cartel ----------
  'pe.title': ['Preparar cartel de búsqueda', 'Maskana pankata rurana'],
  'pe.subtitle': [
    'Edita únicamente el contenido del PDF y revisa la portada antes de descargar.',
    'PDF ukupak willaykunallata allichishpa, manarak uriyachishpa ñawpa pankata rikuy.',
  ],
  'pe.closeEditor': ['Cerrar editor', 'Allichinata wichkana'],
  'pe.posterLang': ['Idioma del cartel', 'Pankapak shimi'],
  'pe.posterLangHint': [
    'El PDF puede salir en otro idioma distinto al de la aplicación.',
    'PDF ukuka pankapak shimimanta chikan shimipipash llukshiy ushan.',
  ],
  'pe.posterLangDiffers': [
    'El cartel saldrá en un idioma distinto al que estás usando ahora.',
    'Kay pankaka kunan mutsukushka shimimanta chikan shimipimi llukshinka.',
  ],
  'pe.s1': ['1. Información del cartel', '1. Pankapak willay'],
  'pe.s1Hint': [
    'Estos cambios no modifican la mascota guardada.',
    'Kay tikraykunaka wakaychishka wiwata mana tikrachinchu.',
  ],
  'pe.headline': ['Encabezado', 'Uma killka'],
  'pe.petName': ['Nombre de la mascota', 'Wasi wiwapak shuti'],
  'pe.ownerName': ['Nombre del propietario', 'Amupak shuti'],
  'pe.lastSeenDate': ['Fecha del último avistamiento', 'Puchukay rikushka puncha'],
  'pe.lastSeenRef': ['Referencia del último avistamiento', 'Puchukay rikushka unancha'],
  'pe.recognition': ['Cómo reconocer a la mascota', 'Imashina wasi wiwata riksina'],
  'pe.s2': ['2. Fotografías y posición', '2. Shuyukuna, kuskapash'],
  'pe.s2Hint': [
    'Marca las imágenes que aparecerán, elige la portada y cambia su orden.',
    'Mayken shuyukuna rikurinata unanchay, ñawpa pankata akllay, katita tikrachipash.',
  ],
  'pe.view3d': ['VISTA 3D', '3D RIKUCHIK'],
  'pe.includeInPdf': ['Incluir en el PDF', 'PDF ukupi churana'],
  'pe.isMain': [
    '★ Es la imagen principal (clic para quitar)',
    '★ Kaymi ñawpa shuyu (anchuchinkapak ñitiy)',
  ],
  'pe.useAsMain': ['Usar como imagen principal', 'Ñawpa shuyuta shina mutsuna'],
  'pe.order': ['Orden', 'Kati'],
  'pe.moveBefore': ['Mover antes', 'Ñawpakman apana'],
  'pe.moveAfter': ['Mover después', 'Washaman apana'],
  'pe.noImages': ['No hay imágenes disponibles.', 'Shuyukuna mana tiyanchu.'],
  'pe.mosaicHintA': [
    'La vista 3D cuenta como una imagen más: puedes combinarla con las fotos reales.',
    '3D rikuchikpash shuk shuyu shinami yupan: chikan shuyukunawan tantachi ushanki.',
  ],
  'pe.mosaicHintB': ['Con el diseño', 'Kay rurashkawan'],
  'pe.mosaicHintC': ['entran tres en la portada.', 'ñawpa pankapi kimsa yaykun.'],
  'pe.s3': ['3. Diseño del cartel', '3. Pankapak rurashka'],
  'pe.s3Hint': [
    'La vista previa de la derecha cambia al instante.',
    'Alli maki ladopi ñawpa rikuyka kunanllatak tikran.',
  ],
  'pe.extraSize': [
    'Tamaño de las fotos extra ({n} no entran en la portada)',
    'Yapa shuyukunapak sayay ({n} shuyu ñawpa pankapi mana yaykun)',
  ],
  'pe.detailPage': ['Incluir ficha detallada', 'Tukuy willay pankata churana'],
  'pe.detailPageHint': [
    'Agrega una hoja con los datos completos.',
    'Tukuy willaywan shuk pankata yapan.',
  ],
  'pe.modelPage': ['Incluir página del modelo 3D', '3D rikchakpak pankata churana'],
  'pe.modelPageHint': [
    'Se usa como referencia visual, no como fotografía real.',
    'Rikuchik shinallami mutsurin, mana chikan shuyu shinachu.',
  ],
  'pe.privacy': [
    'Por seguridad, el PDF muestra solamente la zona aproximada. No se exportan latitud, longitud ni ubicación exacta.',
    'Alli kachun, PDF ukupika kuchulla kitillami rikurin. Latitud, longitud, chiqan kuskapash mana llukchirinchu.',
  ],
  'pe.preview': ['Vista previa', 'Ñawpa rikuy'],
  'pe.page': ['página', 'panka'],
  'pe.pages': ['páginas', 'pankakuna'],
  'pe.tooManyPagesA': [
    'El cartel tendrá {n} páginas.',
    'Pankaka {n} pankakunatami charinka.',
  ],
  'pe.tooManyPagesB': [
    'No es lo recomendable: un cartel de búsqueda se pega en la calle y con una sola hoja suele bastar. Quien lo vea de paso no va a leer las hojas extra.',
    'Mana allichu: maskana pankaka ñanpimi llutarin, shuk pankallawanmi pakta. Purishpa rikukka yapa pankakunata mana killkakatinkachu.',
  ],
  'pe.reduceToOne': ['Dejarlo en una sola hoja', 'Shuk pankallapi sakina'],
  'pe.a4Note': [
    'El PDF conserva proporciones A4 y texto legible.',
    'PDF ukuka A4 tupuwan, killkakatiypak killkawanpash wakarin.',
  ],
  'pe.generating': ['Generando PDF...', 'PDF rurarikun...'],
  'pe.download': ['Descargar PDF', 'PDF uriyachina'],
  'pe.errNeedName': ['Escribe el nombre de la mascota.', 'Wasi wiwapak shutita killkay.'],
  'pe.errNeedContact': [
    'Escribe un teléfono de contacto para el cartel.',
    'Pankapak rimanakuy karu rimay yupayta killkay.',
  ],
  'pe.errBadPhone': [
    'El teléfono contiene caracteres no válidos.',
    'Karu rimay yupaypika mana alli killkakunami tiyan.',
  ],
  'pe.errNeedZone': ['Escribe una zona aproximada.', 'Kuchulla kitita killkay.'],
  'pe.errNeedPhoto': [
    'Selecciona al menos una imagen: una foto o la vista 3D.',
    'Shuk shuyutapash akllay: shuk shuyu, mana kashpaka 3D rikuchik.',
  ],
  'pe.errNeedMain': [
    'Marca cuál será la imagen principal del cartel.',
    'Mayken shuyu pankapak ñawpa shuyu kanata unanchay.',
  ],
  'pe.errChunk': [
    'La página quedó desactualizada en el navegador. Recárgala con Ctrl+Shift+R y vuelve a intentarlo.',
    'Pankaka rikuchikpi mawka sakirirka. Ctrl+Shift+R nishkawan kutin apachishpa kutin ruray.',
  ],
  'pe.errPdf': [
    'No se pudo crear el PDF. Revisa las imágenes seleccionadas e intenta nuevamente.',
    'PDF mana rurari usharkachu. Akllashka shuyukunata rikushpa kutin ruray.',
  ],

  // ---------- Plantillas del cartel ----------
  'tpl.clasico': ['Clásico', 'Ñawpa laya'],
  'tpl.clasico.desc': [
    'Foto y datos de contacto lado a lado. Equilibrado y fácil de leer.',
    'Shuyu, rimanakuy willaypash kinraylla. Paktalla, killkakatinkapak hawalla.',
  ],
  'tpl.foto-grande': ['Foto grande', 'Hatun shuyu'],
  'tpl.foto-grande.desc': [
    'Una foto enorme y el teléfono destacado. Se reconoce de lejos.',
    'Shuk ancha hatun shuyu, karu rimay yupaypash sinchi. Karumantapash riksirin.',
  ],
  'tpl.mosaico': ['Mosaico', 'Tantachishka'],
  'tpl.mosaico.desc': [
    'Tres imágenes juntas en la portada.',
    'Ñawpa pankapi kimsa shuyukuna tantalla.',
  ],
  'psize.compacta': ['Compacta', 'Kichkilla'],
  'psize.compacta.det': ['6 por página', 'Sapan pankapi sukta'],
  'psize.media': ['Media', 'Chawpi'],
  'psize.media.det': ['4 por página', 'Sapan pankapi chusku'],
  'psize.grande': ['Grande', 'Hatun'],
  'psize.grande.det': ['2 por página', 'Sapan pankapi ishkay'],

  // ---------- Mapa ----------
  'map.searching': ['Buscando...', 'Maskakun...'],
  'map.hint': [
    'Busca tu zona o haz clic en el mapa. Debe estar dentro de Ecuador.',
    'Kikinpak kitita maskay, mana kashpaka mapapi ñitiy. Ecuador ukupimi kana kan.',
  ],
  'map.zoneSelected': ['Zona seleccionada', 'Kiti akllashka'],
  'map.outsideEcuador': [
    'Ese punto está fuera de Ecuador. Elige otro.',
    'Chay kuskaka Ecuador kanchapimi. Shuktakta akllay.',
  ],
  'map.queryError': [
    'No se pudo consultar el mapa. Revisa tu conexión e intenta otra vez.',
    'Mapata mana tapuy usharkachu. Kikinpak tinkita rikushpa kutin ruray.',
  ],
  'map.searchError': [
    'No se pudo buscar la zona. Revisa tu conexión.',
    'Kitita mana maskay usharkachu. Kikinpak tinkita rikuy.',
  ],
  'map.loading': ['Cargando mapa...', 'Mapa chaskikun...'],
  'map.loadingSearch': ['Cargando buscador de zona...', 'Kiti maskak chaskikun...'],
  'map.ready': ['Mapa listo', 'Mapa allichishka'],
  'map.searchingZone': ['Buscando la zona...', 'Kitita maskakun...'],
  'map.defaultHint': [
    'Escribe tu barrio, sector o ciudad',
    'Kikinpak kitita, llaktatapash killkay',
  ],
  'map.unknownZone': [
    'No se pudo identificar la zona. Prueba con otro punto.',
    'Kitita mana riksiy usharkachu. Shuk kuskawan ruray.',
  ],

  // ---------- Visor 3D ----------
  'viewer.paintHint': [
    'Pintar: arrastra el pincel sobre el animal. La rueda sigue haciendo zoom.',
    'Tullpuna: tullpunata wiwa hawapi aysay. Ukucha muyuka hatunyachinllami.',
  ],
  'viewer.rotateHint': [
    'Arrastra para rotar y usa la rueda del ratón para acercar o alejar',
    'Muyuchinkapak aysay; kuchuyachinkapak, karuyachinkapakpash ukucha muyuta mutsuy',
  ],
} as const satisfies Record<string, Pair>;

export type TranslationKey = keyof typeof dict;

/**
 * Devuelve el texto en el idioma pedido. En modo `both` se muestran las dos
 * lenguas: primero el kichwa, para que la lengua originaria no quede
 * subordinada a la de mayor uso.
 */
export function translate(key: TranslationKey, lang: Lang): string {
  const pair = dict[key] as Pair | undefined;
  if (!pair) return key;
  return joinPair(pair, lang);
}

function joinPair([es, kw]: Pair, lang: Lang): string {
  if (lang === 'es') return es;
  if (lang === 'kw') return kw;
  return kw === es ? es : `${kw} · ${es}`;
}

/** Reemplaza los marcadores `{nombre}` de una cadena ya traducida. */
export function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  let result = text;
  for (const [name, replacement] of Object.entries(vars)) {
    result = result.split(`{${name}}`).join(String(replacement));
  }
  return result;
}

export type Translator = (
  key: TranslationKey,
  vars?: Record<string, string | number>,
) => string;

/** Traductor independiente del contexto de React, útil para el PDF. */
export function createTranslator(lang: Lang): Translator {
  return (key, vars) => interpolate(translate(key, lang), vars);
}

/** Campos de la base de datos cuyos valores provienen de listas cerradas. */
export type StoredField = 'size' | 'color' | 'breed';

/**
 * Traduce un valor **ya guardado en la base de datos**.
 *
 * Los campos tamaño, color y raza se eligen de listas cerradas y se almacenan
 * en castellano, así que sus valores antiguos también pueden mostrarse en
 * kichwa. Si la persona escribió texto libre (opción "Otro") no habrá entrada
 * en la tabla y se devuelve tal cual: nunca se traduce a ciegas lo que escribió
 * un usuario.
 */
export function translateStored(field: StoredField, value: string, lang: Lang): string {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  const pair = dict[`${field}.${trimmed}` as TranslationKey] as Pair | undefined;
  return pair ? joinPair(pair, lang) : trimmed;
}
