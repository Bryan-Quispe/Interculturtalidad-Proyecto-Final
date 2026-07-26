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
  raza?: string;
  categoria: 'PERRO' | 'GATO' | 'CONEJO';
  zona?: string;
  googlePlaceId?: string;
  latitud?: number;
  longitud?: number;
  telefonoContacto?: string;
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
