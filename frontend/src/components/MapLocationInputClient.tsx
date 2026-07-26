'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';

/**
 * Selector de zona con Leaflet + OpenStreetMap.
 * No necesita clave de API: la búsqueda y la geocodificación inversa usan
 * Nominatim, el servicio público de OSM.
 *
 * Este archivo importa Leaflet de forma estática (accede a `window` al
 * cargarse), por eso solo debe montarse desde MapLocationInput, que lo carga
 * con `next/dynamic` y `ssr: false`.
 */

export type LocationValue = {
  zone: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  countryCode?: string;
  error?: string;
};

export interface MapLocationInputProps {
  value: string;
  onChange: (value: LocationValue) => void;
  placeholder?: string;
}

const CACHE_KEY = 'mascotas3d-map-location';
const CACHE_TTL = 1000 * 60 * 60 * 24;
const QUITO_CENTER: [number, number] = [-0.180653, -78.467834];
const NOMINATIM = 'https://nominatim.openstreetmap.org';

interface Suggestion {
  id: string;
  label: string;
  zone: string;
  lat: number;
  lng: number;
  countryCode: string;
}

/** Toma la referencia más específica disponible: barrio > sector > ciudad. */
function zoneFromAddress(address: Record<string, string> | undefined, fallback: string) {
  if (!address) return fallback;
  const priority = [
    'neighbourhood',
    'suburb',
    'quarter',
    'city_district',
    'village',
    'town',
    'city',
    'county',
    'state',
  ];
  for (const key of priority) {
    if (address[key]) return address[key];
  }
  return fallback;
}

/** Añade la ciudad/provincia para distinguir barrios con el mismo nombre. */
function zoneWithContext(address: Record<string, string> | undefined, zone: string) {
  if (!address) return zone;
  const city = address.city || address.town || address.municipality || address.county || '';
  if (city && city !== zone) return `${zone}, ${city}`;
  const state = address.state || '';
  if (state && state !== zone) return `${zone}, ${state}`;
  return zone;
}

function shortLabel(displayName: string) {
  return displayName.split(',').slice(0, 4).join(',').trim();
}

function readCache(): (LocationValue & { cachedAt: number }) | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as LocationValue & { cachedAt: number };
    if (!parsed.cachedAt || Date.now() - parsed.cachedAt > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(value: LocationValue) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...value, cachedAt: Date.now() }));
  } catch {
    /* almacenamiento no disponible */
  }
}

/** Icono en SVG: evita las imágenes por defecto de Leaflet, que el bundler no resuelve. */
const markerIcon = L.divIcon({
  className: '',
  iconSize: [26, 36],
  iconAnchor: [13, 34],
  html: `<svg width="26" height="36" viewBox="0 0 26 36" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 0C5.8 0 0 5.8 0 13c0 9.6 13 23 13 23s13-13.4 13-23C26 5.8 20.2 0 13 0z" fill="#10b981"/>
    <circle cx="13" cy="13" r="5" fill="#04121c"/>
  </svg>`,
});

export default function MapLocationInputClient({ value, onChange, placeholder }: MapLocationInputProps) {
  const mapNodeRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onChangeRef = useRef(onChange);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  // Se guarda la clave, no el texto: así el estado sigue al cambio de idioma.
  const [statusKey, setStatusKey] = useState<TranslationKey>('map.loading');
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searching, setSearching] = useState(false);
  const [confirmed, setConfirmed] = useState(Boolean(value));

  const hint = useMemo(() => placeholder || t('map.defaultHint'), [placeholder, t]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setQuery(value);
    setConfirmed(Boolean(value));
  }, [value]);

  const acceptLocation = (location: LocationValue) => {
    setError('');
    setConfirmed(true);
    setQuery(location.zone);
    setSuggestions([]);
    onChangeRef.current(location);
    writeCache(location);
  };

  const rejectLocation = (message: string) => {
    setError(message);
    setConfirmed(false);
    onChangeRef.current({ zone: '', error: message });
  };

  const moveMarker = (lat: number, lng: number, zoom?: number) => {
    const map = mapRef.current;
    if (!map) return;
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
    }
    map.setView([lat, lng], zoom ?? Math.max(map.getZoom(), 15));
  };

  /** Geocodificación inversa al hacer clic: valida que el punto esté en Ecuador. */
  const resolvePoint = async (lat: number, lng: number) => {
    setStatusKey('map.searchingZone');
    try {
      const response = await fetch(
        `${NOMINATIM}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=es`,
      );
      if (!response.ok) throw new Error('respuesta no válida');
      const data = await response.json();
      const countryCode = (data?.address?.country_code || '').toUpperCase();

      if (countryCode && countryCode !== 'EC') {
        rejectLocation(t('map.outsideEcuador'));
        return;
      }

      const base = zoneFromAddress(data?.address, data?.name || '');
      if (!base) {
        rejectLocation(t('map.unknownZone'));
        return;
      }

      acceptLocation({
        zone: zoneWithContext(data?.address, base),
        placeId: data?.osm_id ? `osm:${data.osm_type}:${data.osm_id}` : undefined,
        lat,
        lng,
        countryCode: countryCode || 'EC',
      });
    } catch {
      rejectLocation(t('map.queryError'));
    } finally {
      setStatusKey('map.ready');
    }
  };

  useEffect(() => {
    if (!mapNodeRef.current || mapRef.current) return;

    const map = L.map(mapNodeRef.current, {
      center: QUITO_CENTER,
      zoom: 12,
      scrollWheelZoom: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; colaboradores de OpenStreetMap',
    }).addTo(map);

    map.on('click', (event: L.LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      moveMarker(lat, lng, map.getZoom());
      void resolvePoint(lat, lng);
    });

    mapRef.current = map;
    setReady(true);
    setStatusKey('map.ready');

    const cached = readCache();
    if (cached?.zone && cached.lat !== undefined && cached.lng !== undefined && !value) {
      setQuery(cached.zone);
      setConfirmed(true);
      moveMarker(cached.lat, cached.lng);
      onChangeRef.current({
        zone: cached.zone,
        placeId: cached.placeId,
        lat: cached.lat,
        lng: cached.lng,
      });
    }

    // El mapa vive dentro de un modal por pasos: si el contenedor cambia de
    // tamaño o estaba oculto, Leaflet dibuja los tiles en gris sin esto.
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(mapNodeRef.current);
    const timer = setTimeout(() => map.invalidateSize(), 250);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Búsqueda con retardo: Nominatim admite como máximo una consulta por segundo.
  useEffect(() => {
    const term = query.trim();
    if (!ready || confirmed || term.length < 3) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `${NOMINATIM}/search?format=jsonv2&countrycodes=ec&addressdetails=1&limit=6&accept-language=es&q=${encodeURIComponent(term)}`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('respuesta no válida');
        const data = await response.json();
        setSuggestions(
          (Array.isArray(data) ? data : [])
            .map((item: any) => {
              const base = zoneFromAddress(item.address, item.name || '');
              return {
                id: `${item.osm_type}:${item.osm_id}`,
                label: shortLabel(item.display_name || ''),
                zone: zoneWithContext(item.address, base),
                lat: Number(item.lat),
                lng: Number(item.lon),
                countryCode: (item.address?.country_code || 'ec').toUpperCase(),
              };
            })
            .filter((item: Suggestion) => item.zone && Number.isFinite(item.lat)),
        );
        setError('');
      } catch (searchError) {
        if ((searchError as Error).name !== 'AbortError') {
          setError(t('map.searchError'));
        }
      } finally {
        setSearching(false);
      }
    }, 650);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, ready, confirmed]);

  const pickSuggestion = (item: Suggestion) => {
    moveMarker(item.lat, item.lng, 16);
    acceptLocation({
      zone: item.zone,
      placeId: `osm:${item.id}`,
      lat: item.lat,
      lng: item.lng,
      countryCode: item.countryCode,
    });
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setConfirmed(false);
          }}
          placeholder={hint}
          className="input-base"
          autoComplete="off"
        />

        {suggestions.length > 0 && (
          <ul className="absolute z-[1200] mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-white/10 bg-slate-950 shadow-2xl">
            {suggestions.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => pickSuggestion(item)}
                  className="block w-full px-4 py-3 text-left text-sm transition hover:bg-emerald-500/15"
                >
                  <span className="block font-semibold text-emerald-300">{item.zone}</span>
                  <span className="block text-xs text-gray-400">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        ref={mapNodeRef}
        className="h-64 w-full overflow-hidden rounded-xl border border-white/10 bg-slate-900"
      />

      <div className="flex items-center justify-between gap-3 text-xs text-gray-500">
        <span>{t('map.hint')}</span>
        {error ? (
          <span className="text-amber-400">{error}</span>
        ) : (
          <span className={confirmed ? 'text-emerald-400' : ''}>
            {searching ? t('map.searching') : confirmed ? t('map.zoneSelected') : t(statusKey)}
          </span>
        )}
      </div>
    </div>
  );
}
