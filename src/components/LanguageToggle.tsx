import { cn } from '@/lib/utils';
import { useLanguage } from '@/src/i18n/LanguageContext';

/**
 * Interruptor ES/EN. Muestra el idioma al que se PUEDE ir (no el activo),
 * que es lo que espera alguien que no entiende la página que está mirando.
 *
 * La caja mide 44px aunque el texto sean dos letras de 11px: es uno de los
 * controles más importantes del sitio (una parte del público lo lee en
 * inglés) y medía 19×17px, el objetivo táctil más chico de todos
 * (auditoría E1/H5). El `-mr-3` compensa el padding para que no se despegue
 * del borde derecho del header.
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const { t, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.langToggle.label}
      className={cn(
        '-mr-3 inline-flex min-h-11 items-center justify-center px-3 font-label text-[11px] font-bold uppercase tracking-[0.2em] text-cream/50 transition-colors duration-300 hover:text-brand-red',
        className
      )}
    >
      {t.langToggle.short}
    </button>
  );
}
