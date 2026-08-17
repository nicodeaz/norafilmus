import { ArrowUp, Instagram, Linkedin, Mail } from 'lucide-react';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Reveal from './Reveal';

/**
 * Cierre de sitio — SUPERPROMPT.md §6 (F1). Hasta acá la página terminaba en
 * seco al final del marquee de `AboutMe`, sin nada que la cierre. Repite el
 * wordmark + contacto del footer del Hero (mismos `LINKS`, mismos íconos)
 * pero como pieza permanente al pie de la página, no como el footer
 * transitorio que vive adentro del viewport del Hero.
 *
 * Nav: igual que `Header`, solo enlaza pilares con `href` no nulo en
 * `content.ts` — no hay lista manual que desincronizar cuando F3/F4 agreguen
 * Enseñar/Producir.
 */
export default function Footer() {
  const { t } = useLanguage();
  const linkedPillars = t.pillars.filter((p) => p.href);

  const socialLinks = [
    { label: t.social.instagram, href: LINKS.instagram, icon: Instagram, external: true },
    { label: t.social.linkedin, href: LINKS.linkedin, icon: Linkedin, external: true },
    { label: t.social.email, href: LINKS.email, icon: Mail, external: false },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative z-10 w-full border-t border-cream/15 bg-ink">
      <Reveal
        as="div"
        className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 sm:px-10 md:px-12 md:py-20"
      >
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="flex items-baseline gap-2">
            <span className="font-signature text-4xl leading-none text-brand-red">Nora</span>
            <span className="font-display text-2xl uppercase leading-none text-cream">Filmus</span>
          </div>

          <nav className="flex items-center gap-6">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="font-label text-[11px] uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
            >
              {t.nav.home}
            </a>
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
                className="font-label text-[11px] uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red"
              >
                {p.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={label}
                title={label}
                className="text-cream/60 transition-colors duration-300 hover:text-brand-red"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-8 font-label text-[11px] uppercase tracking-[0.15em] text-cream/40 sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} Nora Filmus — {t.footer.rights}
          </span>
          <div className="flex items-center gap-4">
            <span>{t.hero.location}</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-cream/40 transition-colors duration-300 hover:text-brand-red"
            >
              {t.footer.backToTop}
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
