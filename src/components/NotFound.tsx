import { Link } from 'react-router-dom';
import { Home, Instagram } from 'lucide-react';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';

/**
 * Adaptado de "not-found-2" (21st.dev/@sshahaider, Efferd) con los estilos
 * de Nora: "404" en font-display con máscara de gradiente (el efecto
 * "masked typography" del original) + glow rojo de marca en vez del
 * degradé metálico gris original.
 */
export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-ink px-6 text-center">
      <h1
        className="bg-gradient-to-b from-cream via-cream/80 to-cream/10 bg-clip-text font-display uppercase leading-none text-transparent text-[7rem] sm:text-[9rem] md:text-[11rem]"
        style={{ textShadow: '0 0 80px rgba(229, 57, 53, 0.35)' }}
      >
        404
      </h1>

      <p className="mt-6 max-w-sm font-label text-sm leading-relaxed text-cream/70">
        {t.notFound.text}
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2.5 font-label text-xs font-medium uppercase tracking-[0.15em] text-ink transition-colors duration-300 hover:bg-brand-red hover:text-cream"
        >
          <Home className="h-4 w-4" />
          {t.notFound.home}
        </Link>
        <a
          href={LINKS.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-6 py-2.5 font-label text-xs font-medium uppercase tracking-[0.15em] text-cream transition-colors duration-300 hover:border-brand-red hover:text-brand-red"
        >
          <Instagram className="h-4 w-4" />
          {t.social.instagram}
        </a>
      </div>
    </div>
  );
}
