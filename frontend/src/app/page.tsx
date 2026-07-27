'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { getCachedZone, setCachedZone } from '@/lib/location-cache';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { clearSessionKeepingLanguage, useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';
import MapLocationInput from '@/components/MapLocationInput';

/** El texto alternativo se arma con el idioma activo, no se escribe fijo. */
const featureAnimals = [
  { src: '/animales/coco.jpeg', label: 'Coco' },
  { src: '/animales/oreo.jpeg', label: 'Oreo' },
  { src: '/animales/conejo.jpeg', label: 'Conejo' },
  { src: '/animales/gatito.jpeg', label: 'Gatito' },
  { src: '/animales/gato-griton.jpeg', label: 'Gato Gritón' },
  { src: '/animales/perrita-uwu.jpeg', label: 'Perrita' },
];

/** Radio de la busqueda por cercania. Cubre un sector y sus colindantes. */
const RADIO_BUSQUEDA_KM = 8;

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [ubicacion, setUbicacion] = useState('');
  /**
   * Coordenadas del punto elegido. El nombre del barrio solo sirve para
   * mostrarlo: el filtro real va por distancia, porque dos vecinos del mismo
   * sector rara vez lo escriben igual y el mapa no cartografia todos.
   */
  const [punto, setPunto] = useState<{ lat: number; lng: number } | null>(null);
  const [mostrarMapa, setMostrarMapa] = useState(false);
  const [publicAnimals, setPublicAnimals] = useState<any[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState('');

  /**
   * Toma la posicion del dispositivo y la convierte en el nombre del sector.
   * Antes se mostraban las coordenadas en crudo y se enviaban como filtro de
   * texto contra el campo de zona, que guarda nombres: no coincidia nunca.
   */
  const usarMiUbicacion = () => {
    if (!navigator.geolocation) {
      setErrorUbicacion(t('home.noGeo'));
      return;
    }
    setErrorUbicacion('');
    setBuscandoUbicacion(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setPunto({ lat: latitude, lng: longitude });

        // El nombre es solo para mostrar; si la consulta falla, la busqueda
        // por cercania funciona igual porque ya tiene las coordenadas.
        let nombre = '';
        try {
          const respuesta = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1&accept-language=es`,
          );
          if (respuesta.ok) {
            const datos = await respuesta.json();
            const d = datos?.address ?? {};
            const barrio = d.neighbourhood || d.suburb || d.quarter || d.city_district || '';
            const ciudad = d.city || d.town || d.municipality || d.county || '';
            nombre = [barrio, ciudad].filter(Boolean).join(', ');
          }
        } catch {
          // Sin conexion con el servicio de mapas se conserva el filtro por
          // coordenadas, que es el que realmente busca.
        }

        const etiqueta = nombre || t('home.currentLocation');
        setUbicacion(etiqueta);
        setCachedZone({ zone: etiqueta, lat: latitude, lng: longitude, cachedAt: Date.now() });
        setBuscandoUbicacion(false);
      },
      () => {
        setErrorUbicacion(t('home.geoDenied'));
        setBuscandoUbicacion(false);
      },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  };

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      useAuthStore.setState({
        token,
        user: JSON.parse(userData),
        isAuthenticated: true,
      });
    }
  }, []);

  // La zona guardada se recupera una sola vez, no en cada busqueda.
  useEffect(() => {
    const cached = getCachedZone();
    if (cached?.zone) setUbicacion(cached.zone);
    if (cached?.lat !== undefined && cached?.lng !== undefined) {
      setPunto({ lat: cached.lat, lng: cached.lng });
    }
  }, []);

  useEffect(() => {
    const loadAnimals = async () => {
      setLoadingAnimals(true);
      try {
        const data = await api.getPublicAnimals(
          punto
            ? { lat: punto.lat, lng: punto.lng, radioKm: RADIO_BUSQUEDA_KM }
            : ubicacion
              ? { zona: ubicacion }
              : undefined,
        );
        setPublicAnimals(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        setPublicAnimals([]);
      } finally {
        setLoadingAnimals(false);
      }
    };

    loadAnimals();
  }, [ubicacion, punto]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background Decorations */}
      <div className="hero-glow bg-emerald-500" style={{ top: '-100px', left: '-100px' }} />
      <div className="hero-glow bg-amber-500" style={{ bottom: '-100px', right: '-100px' }} />

      {/* Navbar */}
      <nav className="glass-strong sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐾</span>
            <h1 className="text-2xl font-bold gradient-text">{t('app.name')}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* El idioma se elige desde el inicio, sin necesidad de sesión. */}
            <LanguageSwitcher />
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <button className="btn-primary">{t('nav.dashboard')}</button>
                </Link>
                <button
                  onClick={() => {
                    clearSessionKeepingLanguage();
                    useAuthStore.setState({
                      user: null,
                      token: null,
                      isAuthenticated: false,
                    });
                    window.location.href = '/';
                  }}
                  className="btn-danger"
                >
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <button className="btn-primary">{t('nav.login')}</button>
                </Link>
                <Link href="/auth/register">
                  <button className="btn-secondary">{t('nav.register')}</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid xl:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm text-emerald-400 font-medium">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              {t('home.badge')}
            </div>
            <div className="mb-6 max-w-xl">
              <div className="flex flex-wrap items-center gap-3">
                {/*
                  Es un boton y no un campo de texto: escribir el nombre del
                  barrio no encuentra nada, porque cada vecino lo escribe de una
                  forma. Al pulsarlo se abre el mapa y se marca el punto.
                */}
                <button
                  type="button"
                  onClick={() => setMostrarMapa(true)}
                  className="input-base max-w-md flex-1 text-left"
                >
                  {ubicacion || (
                    <span className="text-gray-500">{t('home.searchPlaceholder')}</span>
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={buscandoUbicacion}
                  onClick={usarMiUbicacion}
                >
                  {buscandoUbicacion ? t('home.locating') : t('home.useLocation')}
                </button>
                {punto && (
                  <button
                    type="button"
                    className="text-sm text-gray-400 underline underline-offset-4 hover:text-gray-200"
                    onClick={() => {
                      setPunto(null);
                      setUbicacion('');
                    }}
                  >
                    {t('home.clearZone')}
                  </button>
                )}
              </div>

              {mostrarMapa && (
                <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
                  <MapLocationInput
                    value={ubicacion}
                    onChange={(location) => {
                      if (!location.zone) return;
                      setUbicacion(location.zone);
                      if (location.lat !== undefined && location.lng !== undefined) {
                        setPunto({ lat: location.lat, lng: location.lng });
                        setCachedZone({
                          zone: location.zone,
                          lat: location.lat,
                          lng: location.lng,
                          cachedAt: Date.now(),
                        });
                      }
                      setMostrarMapa(false);
                    }}
                    placeholder={t('home.searchPlaceholder')}
                  />
                </div>
              )}

              {errorUbicacion && (
                <p className="mt-2 text-sm text-amber-300/90">{errorUbicacion}</p>
              )}
            </div>
            <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t('home.titleA')}
              <span className="gradient-text">{t('home.titleB')}</span>
              <br />{t('home.titleC')}
            </h2>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl leading-relaxed">
              {t('home.subtitle')}
            </p>

            {!isAuthenticated && (
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/login">
                  <button className="btn-primary text-lg px-8 py-4 animate-pulse-glow">{t('home.ctaStart')}</button>
                </Link>
                <Link href="/auth/register">
                  <button className="btn-neutral text-lg px-8 py-4">{t('home.ctaCreate')}</button>
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in-up stagger-2">
            {featureAnimals.map((animal, index) => (
              <div key={animal.label} className="card overflow-hidden p-0 aspect-[4/5] bg-[#0f1629]">
                <Image
                  src={animal.src}
                  alt={`${t('af.editFallback')} ${animal.label}`}
                  width={800}
                  height={1000}
                  className="h-full w-full object-contain p-3"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-8 relative z-10">
        <div className="card">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white">{t('home.zoneTitle')}</h3>
              <p className="text-gray-400">{t('home.zoneSubtitle')}</p>
            </div>
            <span className="text-sm text-emerald-400">
              {loadingAnimals ? t('home.searching') : ubicacion || t('home.noZone')}
            </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {publicAnimals.map((animal) => (
              <div key={animal.id} className="rounded-2xl border border-white/10 bg-[#0f1629] p-4">
                {/* La categoría llega como enum en mayúsculas y se traduce aquí. */}
                <div className="text-sm text-emerald-400 mb-1">
                  {t(`cat.${animal.categoria}` as TranslationKey)}
                </div>
                <div className="font-semibold text-white mb-2">{animal.nombre}</div>
                <div className="text-sm text-gray-400 mb-3">{animal.zona || t('home.zoneUnknown')}</div>
                <div className="text-xs text-gray-500">
                  {t('home.owner')} {animal.usuario?.name || t('home.unavailable')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card animate-fade-in-up stagger-1">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-bold text-emerald-400 mb-3">{t('home.f1.title')}</h3>
            <p className="text-gray-400 leading-relaxed">{t('home.f1.body')}</p>
          </div>
          <div className="card animate-fade-in-up stagger-2">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-amber-400 mb-3">{t('home.f2.title')}</h3>
            <p className="text-gray-400 leading-relaxed">{t('home.f2.body')}</p>
          </div>
          <div className="card animate-fade-in-up stagger-3">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="text-xl font-bold text-blue-400 mb-3">{t('home.f3.title')}</h3>
            <p className="text-gray-400 leading-relaxed">{t('home.f3.body')}</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-strong py-8 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-3">
          <p className="text-gray-500 text-sm">{t('home.footer')}</p>
          <p className="text-gray-600 text-xs max-w-2xl mx-auto">{t('home.interculturalNote')}</p>
          <div className="flex justify-center pt-2">
            <LanguageSwitcher variant="full" />
          </div>
        </div>
      </footer>
    </main>
  );
}
