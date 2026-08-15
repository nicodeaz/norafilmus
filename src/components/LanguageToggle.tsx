import { cn } from '@/lib/utils';
import { useLanguage } from '@/src/i18n/LanguageContext';

/**
 * Interruptor ES/EN. Muestra el idioma al que se PUEDE ir (no el activo),
 * que es lo que espera alguien que no entiende la página que está mirando.
 */
export default function LanguageToggle({ className }: { className?: string }) {
  const { t, toggleLang } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={t.langToggle.label}
      className={cn(
        'font-label text-[11px] font-bold uppercase tracking-[0.2em] text-cream/50 transition-colors duration-300 hover:text-brand-red',
        className
      )}
    >
      {t.langToggle.short}
    </button>
  );
}
