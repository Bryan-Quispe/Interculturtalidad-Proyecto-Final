import axios, { AxiosError, AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333/api';

/**
 * Origen del backend sin el sufijo `/api`. Los archivos estáticos (modelos 3D
 * en `/modelos/...` y subidas en `/uploads/...`) cuelgan de la raíz del
 * servidor, no del prefijo de la API, así que no se pueden pedir con API_URL.
 */
export const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

/** Convierte una ruta servida por el backend (`/uploads/x.glb`) en URL absoluta. */
export function urlDelBackend(ruta: string): string {
  if (/^https?:\/\//i.test(ruta)) return ruta;
  // Varios modelos tienen espacios en el nombre ("Perro Husky.glb"). encodeURI
  // los escapa y deja intactos los `%` de una ruta ya codificada, así que es
  // seguro aplicarlo en ambos casos.
  const rutaSegura = encodeURI(ruta.startsWith('/') ? ruta : `/${ruta}`);
  return `${API_ORIGIN}${rutaSegura}`;
}

class ApiClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Agregar token JWT a cada petición
    this.client.interceptors.request.use((config) => {
      const token =
        this.authToken ||
        (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (token) {
        if (config.headers && typeof (config.headers as any).set === 'function') {
          (config.headers as any).set('Authorization', `Bearer ${token}`);
        } else {
          config.headers = config.headers || {};
          (config.headers as any).Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.clearAuthToken();
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }

        return Promise.reject(error);
      },
    );
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  // Auth endpoints
  async register(email: string, password: string, name: string) {
    const res = await this.client.post('/auth/register', {
      email,
      password,
      name,
    });
    return res.data;
  }

  async login(email: string, password: string) {
    const res = await this.client.post('/auth/login', {
      email,
      password,
    });
    return res.data;
  }

  // Users endpoints
  async getUserProfile() {
    const res = await this.client.get('/users/profile');
    return res.data;
  }

  // Animales endpoints
  async getAnimals() {
    const res = await this.client.get('/animales');
    return res.data;
  }

  async getMyAnimals() {
    const res = await this.client.get('/animales/mios');
    return res.data;
  }

  async getPublicAnimals(params?: { categoria?: string; zona?: string }) {
    const res = await this.client.get('/animales/publicos', { params });
    return res.data;
  }

  async getAnimal(id: string) {
    const res = await this.client.get(`/animales/${id}`);
    return res.data;
  }

  async createAnimal(data: any) {
    const res = await this.client.post('/animales', data);
    return res.data;
  }

  async updateAnimal(id: string, data: any) {
    const res = await this.client.put(`/animales/${id}`, data);
    return res.data;
  }

  async deleteAnimal(id: string) {
    const res = await this.client.delete(`/animales/${id}`);
    return res.data;
  }

  async assignModelToAnimal(animalId: string, modeloId: string) {
    const res = await this.client.put(`/animales/${animalId}`, { modeloId });
    return res.data;
  }

  // Modelos 3D endpoints
  async getModelos() {
    const res = await this.client.get('/modelos3d');
    return res.data;
  }

  async getModelosPorCategoria(categoria: string) {
    const res = await this.client.get(`/modelos3d/catalogo/${categoria}`);
    return res.data;
  }

  async getModelo(id: string) {
    const res = await this.client.get(`/modelos3d/${id}`);
    return res.data;
  }

  async uploadModelo(formData: FormData) {
    const res = await this.client.post('/modelos3d/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  }

  async updateModeloTransformaciones(id: string, data: any) {
    const res = await this.client.put(`/modelos3d/${id}`, data);
    return res.data;
  }

  /**
   * Guarda una versión personalizada del modelo sin tocar el original, que es
   * compartido. Devuelve el modelo nuevo, ya propiedad del usuario.
   */
  async derivarModelo(
    baseId: string,
    data: { nombre?: string; descripcion?: string; pinturas?: any; isPublico?: boolean },
  ) {
    const res = await this.client.post(`/modelos3d/${baseId}/derivar`, data);
    return res.data;
  }

  async deleteModelo(id: string) {
    const res = await this.client.delete(`/modelos3d/${id}`);
    return res.data;
  }

  /**
   * Sube una foto a Cloudinary a través del backend y devuelve su URL pública.
   * El envío pasa por el servidor porque el API secret nunca debe llegar al
   * navegador.
   */
  async uploadImagenAnimal(file: File): Promise<{ url: string; publicId: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await this.client.post('/uploads/imagen', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
}

export const api = new ApiClient();
