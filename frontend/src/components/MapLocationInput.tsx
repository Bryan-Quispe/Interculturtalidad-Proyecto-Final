'use client';

import dynamic from 'next/dynamic';
import type { LocationValue, MapLocationInputProps } from './MapLocationInputClient';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export type { LocationValue };

/** Marcador de carga; es un componente para poder traducir sus textos. */
function MapLoading() {
  const { t } = useLanguage();
  return (
    <div className="space-y-3">
      <div className="input-base text-gray-500">{t('map.loadingSearch')}</div>
      <div className="flex h-64 w-full items-center justify-center rounded-xl border border-white/10 bg-slate-900 text-sm text-gray-500">
        {t('map.loading')}
      </div>
    </div>
  );
}

/**
 * Leaflet toca `window` al importarse, así que el mapa nunca debe renderizarse
 * en el servidor. `ssr: false` garantiza que el módulo solo se cargue en el
 * navegador y evita el ChunkLoadError al montar el componente.
 */
const MapLocationInputClient = dynamic(() => import('./MapLocationInputClient'), {
  ssr: false,
  loading: MapLoading,
});

export default function MapLocationInput(props: MapLocationInputProps) {
  return <MapLocationInputClient {...props} />;
}
