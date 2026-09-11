import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { content, type Language, type SiteContent } from './content';

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  /** El contenido ya resuelto al idioma activo. */
  t: SiteContent;
}

const STORAGE_KEY = 'nora-lang';

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

/**
 * Mismo patrón que `nora-landing` (proyecto hermano), con agregados: la
 * elección se persiste en localStorage, y el `lang` del <html> se actualiza
 * (el sitio vive en Dublín y una parte del público lo lee en inglés, así que
 * buscadores y lectores de pantalla tienen que saber en qué idioma está la
 * página).
 *
 * Hubo una detección por región (`/api/geo`, Edge Function de Vercel que leía
 * `x-vercel-ip-country`) entre 2026-09-06 y el pivot de hosting a Apache/PHP
 * del 2026-09-07 (ver CLAUDE.md) — Apache no expone un header equivalente sin
 * un módulo GeoIP que este hosting no tiene, y sumar una IP-API de terceros
 * para reemplazarlo fue una decisión ya descartada explícitamente en su
 * momento. Se sacó entera; el idioma inicial vuelve a depender solo de
 * `navigator.language` (heurística de `getInitialLang`) hasta que el visitante
 * lo cambia a mano con el toggle.
 */
function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'es';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;

  // Sin preferencia guardada: se usa el idioma del navegador — el español es
  // el default salvo que el navegador declare explícitamente que no lee
  // español.
  return window.navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(getInitialLang);

  const setLang = useCallback((next: Language) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'es' ? 'en' : 'es');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = content[lang].htmlLang;
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t: content[lang] }),
    [lang, setLang, toggleLang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage necesita estar dentro de <LanguageProvider>');
  return ctx;
}
