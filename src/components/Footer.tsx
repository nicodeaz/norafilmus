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
/**
 * Los links del nav llevan `min-h-11` (44px) para cumplir el mínimo táctil sin
 * cambiar el tamaño del texto: crece la caja de impacto, no la tipografía
 * (auditoría E1/H5 — 31 de 67 interactivos estaban por debajo del mínimo).
 */
const NAV_LINK =
  'inline-flex min-h-11 items-center font-label text-[11px] uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red';

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

          {/* `flex-wrap` + gap asimétrico: con 6 links y `nowrap` este nav medía
              469px en ES contra un viewport de 390 y hacía scrollear el
              documento entero de lado (auditoría E1/H2 — el caso peor era el
              español, que es el idioma por defecto). */}
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className={NAV_LINK}
            >
              {t.nav.home}
            </a>
            <a href="#sobre-mi" className={NAV_LINK}>
              {t.nav.about}
            </a>
            {linkedPillars.map((p) => (
              <a key={p.key} href={p.href!} className={NAV_LINK}>
                {p.label}
              </a>
            ))}
            <a href="#trayectoria" className={NAV_LINK}>
              {t.nav.trayectoria}
            </a>
            <a href="#presente" className={NAV_LINK}>
              {t.nav.presente}
            </a>
          </nav>

          {/* -m-1.5 compensa el padding táctil para que la fila de íconos no
              crezca visualmente: el ícono sigue midiendo 20px, la caja 44. */}
          <div className="-m-1.5 flex items-center">
            {socialLinks.map(({ label, href, icon: Icon, external }) => (
              <a
                key={label}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                aria-label={label}
                title={label}
                className="inline-flex h-11 w-11 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red"
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
              className="inline-flex min-h-11 items-center gap-1.5 text-cream/40 transition-colors duration-300 hover:text-brand-red"
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
