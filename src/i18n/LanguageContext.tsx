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
 * Mismo patrón que `nora-landing` (proyecto hermano), con dos agregados:
 * la elección se persiste en localStorage y el `lang` del <html> se
 * actualiza — el sitio vive en Dublín y una parte del público lo lee en
 * inglés, así que buscadores y lectores de pantalla tienen que saber en qué
 * idioma está la página que están viendo.
 */
function getInitialLang(): Language {
  if (typeof window === 'undefined') return 'es';

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'es' || stored === 'en') return stored;

  // Sin preferencia guardada: el español es el default (es la voz de Nora),
  // salvo que el navegador declare explícitamente que no lee español.
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
