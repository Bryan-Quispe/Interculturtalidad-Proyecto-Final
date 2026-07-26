'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/hooks/useAuth';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { TranslationKey } from '@/lib/i18n/translations';

const loginSlides = [
  { src: '/animales/coco.jpeg', name: 'Coco' },
  { src: '/animales/oreo.jpeg', name: 'Oreo' },
  { src: '/animales/conejo.jpeg', name: 'Conejo' },
];

type Campo = 'email' | 'password' | 'captcha';
type Errores = Partial<Record<Campo, TranslationKey>>;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaRespuesta, setCaptchaRespuesta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState<Errores>({});
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [slideIndex, setSlideIndex] = useState(0);
  const [captcha, setCaptcha] = useState<{ a: number; b: number } | null>(null);

  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { t } = useLanguage();

  const nuevoCaptcha = useCallback(() => {
    setCaptcha({
      a: Math.floor(Math.random() * 9) + 1,
      b: Math.floor(Math.random() * 9) + 1,
    });
    setCaptchaRespuesta('');
  }, []);

  useEffect(() => {
    nuevoCaptcha();

    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % loginSlides.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, [nuevoCaptcha]);

  const validar = useCallback(
    (campo: Campo): TranslationKey | undefined => {
      switch (campo) {
        case 'email':
          if (!email.trim()) return 'auth.emailRequired';
          return undefined;
        case 'password':
          if (!password) return 'auth.passwordRequired';
          return undefined;
        case 'captcha':
          if (!captchaRespuesta.trim()) return 'auth.captchaRequired';
          if (!captcha || Number(captchaRespuesta) !== captcha.a + captcha.b) {
            return 'auth.captchaWrong';
          }
          return undefined;
      }
    },
    [email, password, captchaRespuesta, captcha],
  );

  const revalidar = (campo: Campo) => {
    if (!tocados[campo]) return;
    setErrores((actuales) => ({ ...actuales, [campo]: validar(campo) }));
  };

  const marcarTocado = (campo: Campo) => {
    setTocados((actuales) => ({ ...actuales, [campo]: true }));
    setErrores((actuales) => ({ ...actuales, [campo]: validar(campo) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const campos: Campo[] = ['email', 'password', 'captcha'];
    const encontrados: Errores = {};

    for (const campo of campos) {
      const fallo = validar(campo);
      if (fallo) encontrados[campo] = fallo;
    }

    setTocados({ email: true, password: true, captcha: true });
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      setError(t('auth.fixLoginErrors'));
      if (encontrados.captcha) nuevoCaptcha();
      return;
    }

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
      nuevoCaptcha();
    } finally {
      setLoading(false);
    }
  };

  const claseInput = (campo: Campo) =>
    `input-base ${errores[campo] ? 'border-red-500/60 focus:border-red-500' : ''}`;

  const MensajeError = ({ campo }: { campo: Campo }) =>
    errores[campo] ? (
      <p id={`${campo}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
        {t(errores[campo]!)}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
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

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="login-email" className="input-label">
                    {t('auth.email')}
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (tocados.email) {
                        setErrores((actuales) => ({ ...actuales, email: undefined }));
                      }
                    }}
                    onBlur={() => marcarTocado('email')}
                    className={claseInput('email')}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    aria-invalid={Boolean(errores.email)}
                    aria-describedby={errores.email ? 'email-error' : undefined}
                  />
                  <MensajeError campo="email" />
                </div>

                <div>
                  <label htmlFor="login-password" className="input-label">
                    {t('auth.password')}
                  </label>
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      revalidar('password');
                    }}
                    onBlur={() => marcarTocado('password')}
                    className={claseInput('password')}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-invalid={Boolean(errores.password)}
                    aria-describedby={errores.password ? 'password-error' : undefined}
                  />
                  <MensajeError campo="password" />
                </div>

                <fieldset className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                  <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {t('auth.captchaTitle')}
                  </legend>
                  <p className="text-xs text-gray-400">{t('auth.captchaHint')}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label htmlFor="login-captcha" className="font-mono text-lg text-gray-100">
                      {captcha ? t('auth.captchaQuestion', { a: captcha.a, b: captcha.b }) : '…'}
                    </label>
                    <input
                      id="login-captcha"
                      type="text"
                      value={captchaRespuesta}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setCaptchaRespuesta(valor);
                        if (tocados.captcha) {
                          setErrores((actuales) => ({ ...actuales, captcha: undefined }));
                        }
                      }}
                      onBlur={() => marcarTocado('captcha')}
                      className={`input-base w-20 text-center ${errores.captcha ? 'border-red-500/60' : ''}`}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-invalid={Boolean(errores.captcha)}
                      aria-describedby={errores.captcha ? 'captcha-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        nuevoCaptcha();
                        setErrores((actuales) => ({ ...actuales, captcha: undefined }));
                      }}
                      className="text-xs text-emerald-400 underline-offset-2 transition hover:text-emerald-300 hover:underline"
                    >
                      {t('auth.captchaNew')}
                    </button>
                  </div>
                  <MensajeError campo="captcha" />
                </fieldset>

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
