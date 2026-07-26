'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Lang,
  StoredField,
  TranslationKey,
  createTranslator,
  translateStored,
} from './translations';

/** Clave de persistencia. Se conserva aunque se cierre la sesión. */
export const LANG_STORAGE_KEY = 'mascotas3d.lang';

const DEFAULT_LANG: Lang = 'es';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Traduce una clave; `vars` reemplaza marcadores `{nombre}`. */
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  /**
   * Traduce un valor guardado en la base de datos (tamaño, color, raza).
   * Devuelve el texto original si la persona lo escribió a mano.
   */
  tv: (field: StoredField, value?: string | null) => string;
  /** Elige entre dos textos ya escritos (útil para contenido dinámico). */
  pick: (es: string, kw: string) => string;
  /** false hasta que se lee `localStorage`, para evitar desajuste de hidratación. */
  ready: boolean;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLang(value: unknown): value is Lang {
  return value === 'es' || value === 'kw' || value === 'both';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      if (isLang(stored)) setLangState(stored);
    } catch {
      // Si el navegador bloquea el almacenamiento se usa el idioma por defecto.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    // El atributo `lang` del documento debe reflejar la lengua mostrada:
    // `qu` es el código ISO 639-1 de la familia quechua/kichwa.
    document.documentElement.lang = lang === 'es' ? 'es' : 'qu';
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Sin persistencia el cambio sigue valiendo para esta pestaña.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const t = createTranslator(lang);

    const tv = (field: StoredField, storedValue?: string | null) =>
      translateStored(field, storedValue ?? '', lang);

    const pick = (es: string, kw: string) => {
      if (lang === 'es') return es;
      if (lang === 'kw') return kw;
      return kw === es ? es : `${kw} · ${es}`;
    };

    return { lang, setLang, t, tv, pick, ready };
  }, [lang, setLang, ready]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage debe usarse dentro de <LanguageProvider>');
  }
  return ctx;
}

/**
 * Guarda el idioma antes de limpiar `localStorage` al cerrar sesión y lo
 * vuelve a escribir: la preferencia de lengua no es un dato de sesión.
 */
export function clearSessionKeepingLanguage() {
  let saved: string | null = null;
  try {
    saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    window.localStorage.clear();
    if (saved) window.localStorage.setItem(LANG_STORAGE_KEY, saved);
  } catch {
    // Nada que restaurar si el almacenamiento no está disponible.
  }
}
