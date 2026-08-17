import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/src/i18n/LanguageContext';
import LanguageToggle from './LanguageToggle';

/**
 * Chrome global del sitio — SUPERPROMPT.md §6 (F1). El Hero ya trae su propio
 * toggle de idioma y su propio footer de contacto adentro del viewport de la
 * pantalla de inicio (ver Hero.tsx), así que este header NO está visible
 * desde `scroll: 0` — aparecería duplicado sobre el Hero. En cambio se
 * revela recién después de pasar el alto del Hero (`window.innerHeight`),
 * que es el momento en que `AboutMe` ya tapó al Hero y hace falta un ancla
 * fija para volver arriba o navegar sin scrollear a mano.
 *
 * Nav: solo enlaza pilares cuya sección ya existe — se lee del propio
 * `href` de `content.ts` pillars[] (no `null`) en vez de una lista manual
 * acá, así no hay que recordar tocar dos archivos cuando F3/F4 agreguen
 * Enseñar/Producir.
 */
export default function Header() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);
  const linkedPillars = t.pillars.filter((p) => p.href);

  useEffect(() => {
    const threshold = () => window.innerHeight * 0.9;
    const onScroll = () => setVisible(window.scrollY > threshold());
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <motion.header
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b border-cream/10 bg-ink/90 backdrop-blur-md',
        !visible && 'pointer-events-none'
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-10 md:px-12">
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-baseline gap-2"
          aria-label={t.nav.home}
        >
          <span className="font-signature text-2xl leading-none text-brand-red">Nora</span>
          <span className="font-display text-base uppercase leading-none text-cream">Filmus</span>
        </button>

        <nav className="flex items-center gap-6">
          <a
            href="#sobre-mi"
            className="font-label text-[11px] uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
          >
            {t.nav.about}
          </a>
          {linkedPillars.map((p) => (
            <a
              key={p.key}
              href={p.href!}
              className="hidden font-label text-[11px] uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red sm:inline"
            >
              {p.label}
            </a>
          ))}
          <LanguageToggle />
        </nav>
      </div>
    </motion.header>
  );
}
