export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
  zona?: string;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Animal {
  id: string;
  nombre: string;
  descripcion?: string;
  /**
   * La misma descripción escrita por su autor en kichwa. Va aparte porque el
   * texto libre no se traduce solo: solo quien lo escribió puede decir lo
   * mismo en la otra lengua.
   */
  descripcionKw?: string;
  /**
   * Identificadores de rasgos de lista cerrada. A diferencia de la
   * descripcion, estos si se muestran en cualquiera de las dos lenguas.
   */
  rasgos?: string[];
  raza?: string;
  categoria: 'PERRO' | 'GATO' | 'CONEJO';
  zona?: string;
  /**
   * Referencia a pie de calle del avistamiento: vía, número si lo hay, barrio
   * y ciudad. La zona nombra el barrio y no orienta a quien lee el cartel.
   */
  direccion?: string;
  googlePlaceId?: string;
  latitud?: number;
  longitud?: number;
  telefonoContacto?: string;
  /** Numeros adicionales; el primero sigue en telefonoContacto. */
  telefonos?: string[];
  ultimaVezVisto?: string;
  fechaVisto?: string;
  fotos?: string[];
  caracteristicas?: {
    id: string;
    tamano?: string;
    color?: string;
    habitat?: string;
  };
  modeloId?: string;
  modelo?: Modelo3D;
  imagen?: string;
  slug: string;
  usuarioId: string;
  usuario: { id: string; name: string; email?: string; avatar?: string; zona?: string };
  createdAt: string;
  updatedAt: string;
}

export interface Transformaciones {
  id: string;
  escalaX: number;
  escalaY: number;
  escalaZ: number;
  rotacionX: number;
  rotacionY: number;
  rotacionZ: number;
  posicionX: number;
  posicionY: number;
  posicionZ: number;
}

export interface PaintStroke {
  position?: { x: number; y: number; z: number };
  normal?: { x: number; y: number; z: number };
  uv?: { x: number; y: number };
  surfaceId?: string;
  color: string;
  size: number;
  /**
   * Trazada a la que pertenece: todo lo pintado entre apoyar y levantar el
   * dedo comparte número. Un arrastre genera cientos de muestras, así que sin
   * esto deshacer borraría una mota invisible en lugar de la línea trazada.
   * Las pinturas guardadas antes de existir este campo no lo tienen y cuentan
   * como una sola trazada.
   */
  group?: number;
}

export interface Modelo3D {
  id: string;
  nombre: string;
  categoria: 'PERRO' | 'GATO' | 'CONEJO';
  raza?: string;
  descripcion?: string;
  archivo: {
    id: string;
    filename: string;
    path: string;
    mimetype: string;
    tamaño: number;
  };
  transformaciones: Transformaciones;
  color: string;
  pinturas?: PaintStroke[];
  /** Si es una versión personalizada, apunta al modelo original. */
  derivadoDeId?: string | null;
  isPublico: boolean;
  slug: string;
  descargas: number;
  usuarioId: string;
  usuario: { id: string; name: string; email?: string; avatar?: string; zona?: string };
  createdAt: string;
  updatedAt: string;
}
