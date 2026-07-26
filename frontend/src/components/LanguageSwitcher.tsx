'use client';

import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { LANGUAGES, Lang } from '@/lib/i18n/translations';

interface LanguageSwitcherProps {
  /** `full` muestra los nombres completos; `compact` solo las siglas. */
  variant?: 'full' | 'compact';
  className?: string;
  /**
   * Modo controlado: si se pasan, el conmutador deja de tocar el idioma
   * global. Sirve para elegir un idioma distinto solo para el PDF.
   */
  value?: Lang;
  onChange?: (lang: Lang) => void;
  /** Rótulo del grupo; por defecto "Idioma". */
  label?: string;
}

/**
 * Conmutador de lengua. Está disponible tanto en la portada pública como
 * dentro de la sesión, para que la elección de idioma no dependa de haber
 * iniciado sesión.
 */
export default function LanguageSwitcher({
  variant = 'compact',
  className = '',
  value,
  onChange,
  label,
}: LanguageSwitcherProps) {
  const { lang: globalLang, setLang: setGlobalLang, t } = useLanguage();
  const lang = value ?? globalLang;
  const setLang = onChange ?? setGlobalLang;

  return (
    <div
      role="group"
      aria-label={label ?? t('lang.choose')}
      className={`inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 ${className}`}
    >
      {variant === 'full' && (
        <span className="px-2 text-xs font-medium uppercase tracking-wider text-gray-400">
          {label ?? t('lang.label')}
        </span>
      )}
      {LANGUAGES.map((option) => {
        const active = option.code === lang;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLang(option.code)}
            aria-pressed={active}
            title={option.label}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              active
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-gray-400 hover:bg-white/10 hover:text-gray-200'
            }`}
          >
            {variant === 'full' ? option.label : option.short}
          </button>
        );
      })}
    </div>
  );
}
