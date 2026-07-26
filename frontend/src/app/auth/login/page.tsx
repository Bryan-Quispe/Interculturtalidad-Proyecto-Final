'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const loginSlides = [
  { src: '/api/animal-images/coco.jpeg', name: 'Coco' },
  { src: '/api/animal-images/oreo.jpeg', name: 'Oreo' },
  { src: '/api/animal-images/conejo.jpeg', name: 'Conejo' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % loginSlides.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { access_token, user } = await api.login(email, password);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      api.setAuthToken(access_token);
      setToken(access_token);
      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.errorLogin'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="hero-glow bg-emerald-500" style={{ top: '-50px', right: '-50px' }} />

      <div className="w-full max-w-6xl relative z-10">
        <div className="mb-6 flex justify-center lg:justify-end">
          <LanguageSwitcher variant="full" />
        </div>
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center">
          <div className="hidden lg:block animate-fade-in-up">
            <div className="card overflow-hidden p-4 aspect-[4/5] shadow-2xl relative">
              {loginSlides.map((slide, index) => (
                <Image
                  key={slide.src}
                  src={slide.src}
                  alt={`${t('af.editFallback')} ${slide.name}`}
                  width={900}
                  height={1100}
                  className={`absolute inset-4 h-[calc(100%-2rem)] w-[calc(100%-2rem)] object-contain bg-[#0f1629] rounded-xl transition-opacity duration-700 ${
                    index === slideIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority={index === 0}
                />
              ))}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {loginSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    onClick={() => setSlideIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === slideIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/30'
                    }`}
                    aria-label={`${t('auth.viewSlide')} ${slide.name}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            {/* Logo */}
            <div className="text-center lg:text-left mb-8 animate-fade-in-up">
              <span className="text-5xl">🐾</span>
              <h1 className="text-3xl font-bold gradient-text mt-4">{t('auth.loginTitle')}</h1>
              <p className="text-gray-400 mt-2">{t('auth.loginSubtitle')}</p>
            </div>

            <div className="card animate-fade-in-up stagger-2" style={{ padding: '2rem' }}>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="input-label">{t('auth.email')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-base"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="input-label">{t('auth.password')}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-base"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('auth.loggingIn')}
                    </span>
                  ) : t('auth.loginTitle')}
                </button>
              </form>
            </div>

            <div className="text-center lg:text-left mt-6 space-y-3 animate-fade-in-up stagger-3">
              <p className="text-gray-400">
                {t('auth.noAccount')}{' '}
                <Link href="/auth/register" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
                  {t('auth.registerHere')}
                </Link>
              </p>
              <Link href="/" className="block text-gray-500 hover:text-gray-300 transition text-sm">
                {t('auth.backHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
