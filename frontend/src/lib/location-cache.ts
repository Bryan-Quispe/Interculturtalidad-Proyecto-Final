type CachedZone = {
  zone: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  cachedAt: number;
};

const KEY = 'mascotas3d-location-cache';
const TTL = 1000 * 60 * 60 * 24;

export function getCachedZone() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedZone;
    if (!parsed?.cachedAt || Date.now() - parsed.cachedAt > TTL) {
      localStorage.removeItem(KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setCachedZone(zone: CachedZone) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(zone));
}
