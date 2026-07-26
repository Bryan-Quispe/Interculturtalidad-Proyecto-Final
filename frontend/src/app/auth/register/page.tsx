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

const registerSlides = [
  { src: '/animales/oreo.jpeg', name: 'Oreo' },
  { src: '/animales/conejo.jpeg', name: 'Conejo' },
  { src: '/animales/coco.jpeg', name: 'Coco' },
];

/**
 * Letras de cualquier alfabeto, espacios y los signos de apellidos reales
 * ("Núñez-García", "O'Brien"). Sin dígitos ni símbolos, y debe empezar por
 * letra. Es la misma regla que aplica el backend en RegisterDto.
 */
const NOMBRE_PERSONA = /^\p{L}[\p{L}\s'’-]*$/u;

/** Comprobación de correo del lado del cliente; el servidor vuelve a validarlo. */
const CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

const MIN_PASSWORD = 6;

type Campo = 'name' | 'email' | 'password' | 'confirm' | 'captcha';
type Errores = Partial<Record<Campo, TranslationKey>>;

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [captchaRespuesta, setCaptchaRespuesta] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const [errores, setErrores] = useState<Errores>({});
  /** Un campo solo muestra su error cuando ya se ha usado o tras enviar. */
  const [tocados, setTocados] = useState<Partial<Record<Campo, boolean>>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [slideIndex, setSlideIndex] = useState(0);

  /**
   * Operación aritmética contra bots automáticos. Se genera en el cliente tras
   * montar: hacerlo durante el renderizado del servidor daría un número distinto
   * al hidratar. No sustituye a un límite de peticiones en el servidor, pero
   * detiene el envío automático de formularios.
   */
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
  }, [nuevoCaptcha]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % registerSlides.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  /** Devuelve la clave del error, o undefined si el campo es válido. */
  const validar = useCallback(
    (campo: Campo, valores?: { password?: string; confirm?: string }): TranslationKey | undefined => {
      const passwordActual = valores?.password ?? password;
      const confirmActual = valores?.confirm ?? confirm;

      switch (campo) {
        case 'name': {
          const limpio = name.trim().replace(/\s+/g, ' ');
          if (!limpio) return 'reg.nameRequired';
          if (limpio.length > 60) return 'reg.nameTooLong';
          if (!NOMBRE_PERSONA.test(limpio)) return 'reg.nameInvalid';
          // Se cuentan letras, no caracteres: "A-" no es un nombre de 2 letras.
          if ((limpio.match(/\p{L}/gu) || []).length < 2) return 'reg.nameTooShort';
          return undefined;
        }
        case 'email': {
          const limpio = email.trim();
          if (!limpio) return 'reg.emailRequired';
          if (limpio.length > 254 || !CORREO.test(limpio)) return 'reg.emailInvalid';
          return undefined;
        }
        case 'password': {
          if (!passwordActual) return 'reg.passwordRequired';
          if (passwordActual.length < MIN_PASSWORD) return 'reg.passwordTooShort';
          return undefined;
        }
        case 'confirm': {
          if (!confirmActual) return 'reg.confirmRequired';
          if (confirmActual !== passwordActual) return 'reg.confirmMismatch';
          return undefined;
        }
        case 'captcha': {
          if (!captchaRespuesta.trim()) return 'reg.captchaRequired';
          if (!captcha || Number(captchaRespuesta) !== captcha.a + captcha.b) {
            return 'reg.captchaWrong';
          }
          return undefined;
        }
      }
    },
    [name, email, password, confirm, captchaRespuesta, captcha],
  );

  /** Revalida un campo ya tocado mientras se escribe, para que el error se vaya solo. */
  const revalidar = (campo: Campo, extra?: { password?: string; confirm?: string }) => {
    if (!tocados[campo]) return;
    setErrores((actuales) => ({ ...actuales, [campo]: validar(campo, extra) }));
  };

  const marcarTocado = (campo: Campo) => {
    setTocados((actuales) => ({ ...actuales, [campo]: true }));
    setErrores((actuales) => ({ ...actuales, [campo]: validar(campo) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const campos: Campo[] = ['name', 'email', 'password', 'confirm', 'captcha'];
    const encontrados: Errores = {};
    for (const campo of campos) {
      const fallo = validar(campo);
      if (fallo) encontrados[campo] = fallo;
    }

    setTocados({ name: true, email: true, password: true, confirm: true, captcha: true });
    setErrores(encontrados);

    if (Object.keys(encontrados).length > 0) {
      setError(t('reg.fixErrors'));
      // Una operación fallada no se reutiliza: evita el reintento automático.
      if (encontrados.captcha) nuevoCaptcha();
      return;
    }

    setLoading(true);
    try {
      const limpio = name.trim().replace(/\s+/g, ' ');
      const { access_token, user } = await api.register(email.trim().toLowerCase(), password, limpio);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      api.setAuthToken(access_token);
      setToken(access_token);
      setUser(user);
      router.push('/dashboard');
    } catch (err: any) {
      const mensaje = err.response?.data?.message;
      // El backend puede devolver un arreglo de errores de validación.
      setError(Array.isArray(mensaje) ? mensaje[0] : mensaje || t('auth.errorRegister'));
      nuevoCaptcha();
    } finally {
      setLoading(false);
    }
  };

  /** Clase del input según tenga error visible o no. */
  const claseInput = (campo: Campo) =>
    `input-base ${errores[campo] ? 'border-red-500/60 focus:border-red-500' : ''}`;

  /** Mensaje de error bajo el campo, anunciado por el lector de pantalla. */
  const MensajeError = ({ campo }: { campo: Campo }) =>
    errores[campo] ? (
      <p id={`${campo}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
        {t(errores[campo]!)}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="hero-glow bg-amber-500" style={{ top: '-50px', left: '-50px' }} />

      <div className="w-full max-w-6xl relative z-10">
        <div className="mb-6 flex justify-center lg:justify-start">
          <LanguageSwitcher variant="full" />
        </div>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
          <div className="order-2 lg:order-1">
            {/* Logo */}
            <div className="text-center lg:text-left mb-8 animate-fade-in-up">
              <span className="text-5xl">🐾</span>
              <h1 className="text-3xl font-bold gradient-text mt-4">{t('auth.registerTitle')}</h1>
              <p className="text-gray-400 mt-2">{t('auth.registerSubtitle')}</p>
            </div>

            <div className="card animate-fade-in-up stagger-2" style={{ padding: '2rem' }}>
              {error && (
                <div
                  role="alert"
                  className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm"
                >
                  {error}
                </div>
              )}

              {/* noValidate: los mensajes los controlamos nosotros y así salen traducidos. */}
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="reg-name" className="input-label">
                    {t('auth.name')}
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (tocados.name) {
                        setErrores((a) => ({ ...a, name: undefined }));
                      }
                    }}
                    onBlur={() => marcarTocado('name')}
                    className={claseInput('name')}
                    placeholder={t('auth.namePlaceholder')}
                    maxLength={60}
                    autoComplete="name"
                    aria-invalid={Boolean(errores.name)}
                    aria-describedby={errores.name ? 'name-error' : undefined}
                  />
                  <MensajeError campo="name" />
                </div>

                <div>
                  <label htmlFor="reg-email" className="input-label">
                    {t('auth.email')}
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (tocados.email) {
                        setErrores((a) => ({ ...a, email: undefined }));
                      }
                    }}
                    onBlur={() => marcarTocado('email')}
                    className={claseInput('email')}
                    placeholder="tu@email.com"
                    maxLength={254}
                    autoComplete="email"
                    inputMode="email"
                    aria-invalid={Boolean(errores.email)}
                    aria-describedby={errores.email ? 'email-error' : undefined}
                  />
                  <MensajeError campo="email" />
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <label htmlFor="reg-password" className="input-label">
                      {t('auth.password')}
                    </label>
                    <button
                      type="button"
                      onClick={() => setVerPassword((v) => !v)}
                      className="mb-1.5 text-xs text-emerald-400 transition hover:text-emerald-300"
                    >
                      {verPassword ? t('reg.hidePassword') : t('reg.showPassword')}
                    </button>
                  </div>
                  <input
                    id="reg-password"
                    type={verPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setPassword(valor);
                      revalidar('password', { password: valor });
                      // Al cambiar la contraseña, la repetición puede dejar de coincidir.
                      revalidar('confirm', { password: valor });
                    }}
                    onBlur={() => marcarTocado('password')}
                    className={claseInput('password')}
                    placeholder="••••••••"
                    maxLength={72}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errores.password)}
                    aria-describedby={errores.password ? 'password-error' : 'password-hint'}
                  />
                  <MensajeError campo="password" />
                  {!errores.password && (
                    <p id="password-hint" className="text-xs text-gray-500 mt-1.5">
                      {t('auth.passwordHint')}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="reg-confirm" className="input-label">
                    {t('reg.confirmLabel')}
                  </label>
                  <input
                    id="reg-confirm"
                    type={verPassword ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => {
                      const valor = e.target.value;
                      setConfirm(valor);
                      revalidar('confirm', { confirm: valor });
                    }}
                    onBlur={() => marcarTocado('confirm')}
                    className={claseInput('confirm')}
                    placeholder="••••••••"
                    maxLength={72}
                    autoComplete="new-password"
                    aria-invalid={Boolean(errores.confirm)}
                    aria-describedby={errores.confirm ? 'confirm-error' : undefined}
                  />
                  <MensajeError campo="confirm" />
                </div>

                {/* Verificación anti-bot */}
                <fieldset className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4">
                  <legend className="px-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    {t('reg.captchaTitle')}
                  </legend>
                  <p className="text-xs text-gray-400">{t('reg.captchaHint')}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <label htmlFor="reg-captcha" className="font-mono text-lg text-gray-100">
                      {captcha
                        ? t('reg.captchaQuestion', { a: captcha.a, b: captcha.b })
                        : '…'}
                    </label>
                    <input
                      id="reg-captcha"
                      type="text"
                      value={captchaRespuesta}
                      onChange={(e) => {
                        // Solo dígitos: evita que se cuele texto por error.
                        const valor = e.target.value.replace(/\D/g, '').slice(0, 2);
                        setCaptchaRespuesta(valor);
                        if (tocados.captcha) {
                          setErrores((a) => ({ ...a, captcha: undefined }));
                        }
                      }}
                      onBlur={() => marcarTocado('captcha')}
                      className={`input-base w-20 text-center ${
                        errores.captcha ? 'border-red-500/60' : ''
                      }`}
                      inputMode="numeric"
                      autoComplete="off"
                      aria-invalid={Boolean(errores.captcha)}
                      aria-describedby={errores.captcha ? 'captcha-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        nuevoCaptcha();
                        setErrores((a) => ({ ...a, captcha: undefined }));
                      }}
                      className="text-xs text-emerald-400 underline-offset-2 transition hover:text-emerald-300 hover:underline"
                    >
                      {t('reg.captchaNew')}
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
                      {t('auth.creating')}
                    </span>
                  ) : t('auth.registerTitle')}
                </button>
              </form>
            </div>
          </div>

          <div className="hidden lg:block order-1 lg:order-2 animate-fade-in-up">
            <div className="card overflow-hidden p-4 aspect-[4/5] shadow-2xl relative">
              {registerSlides.map((slide, index) => (
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
                {registerSlides.map((slide, index) => (
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
        </div>
        <div className="text-center mt-6 space-y-3 animate-fade-in-up stagger-3">
          <p className="text-gray-400">
            {t('auth.hasAccount')}{' '}
            <Link href="/auth/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition">
              {t('auth.loginHere')}
            </Link>
          </p>
          <Link href="/" className="block text-gray-500 hover:text-gray-300 transition text-sm">
            {t('auth.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
