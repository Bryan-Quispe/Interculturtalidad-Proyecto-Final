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

/** El texto alternativo se arma con el idioma activo, no se escribe fijo. */
const featureAnimals = [
  { src: '/animales/coco.jpeg', label: 'Coco' },
  { src: '/animales/oreo.jpeg', label: 'Oreo' },
  { src: '/animales/conejo.jpeg', label: 'Conejo' },
  { src: '/animales/gatito.jpeg', label: 'Gatito' },
  { src: '/animales/gato-griton.jpeg', label: 'Gato Gritón' },
  { src: '/animales/perrita-uwu.jpeg', label: 'Perrita' },
];

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [ubicacion, setUbicacion] = useState('');
  const [publicAnimals, setPublicAnimals] = useState<any[]>([]);
  const [loadingAnimals, setLoadingAnimals] = useState(false);

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

  useEffect(() => {
    const cached = getCachedZone();
    if (cached?.zone) setUbicacion(cached.zone);

    const loadAnimals = async () => {
      setLoadingAnimals(true);
      try {
        const data = await api.getPublicAnimals(ubicacion ? { zona: ubicacion } : undefined);
        setPublicAnimals(Array.isArray(data) ? data.slice(0, 3) : []);
      } catch {
        setPublicAnimals([]);
      } finally {
        setLoadingAnimals(false);
      }
    };

    loadAnimals();
  }, [ubicacion]);

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
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <input
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder={t('home.searchPlaceholder')}
                className="input-base max-w-md"
              />
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  if (!navigator.geolocation) return;
                  navigator.geolocation.getCurrentPosition(
                    async (position) => {
                      const coarse = `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`;
                      setUbicacion(coarse);
                      setCachedZone({
                        zone: coarse,
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        cachedAt: Date.now(),
                      });
                    },
                    () => {},
                    { enableHighAccuracy: false, timeout: 8000 },
                  );
                }}
              >
                {t('home.useLocation')}
              </button>
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
