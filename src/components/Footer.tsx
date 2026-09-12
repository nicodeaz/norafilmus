import { ArrowUp, Instagram, Linkedin, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { TRAYECTORIA_ENABLED } from '@/lib/features';
import { LINKS } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import BetaBadge from './BetaBadge';
import Picture from './Picture';
import Reveal from './Reveal';
import Seam from './Seam';

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
 *
 * Fase 5 (2026-08-28): el `Seam` de arriba estaba huérfano desde la Fase 1
 * (anunciaba "lo que viene" entre secciones que ahora son páginas propias) —
 * acá vuelve con un trabajo distinto: cerrar el Programa en vez de anunciar
 * el próximo Acto, con `colophon` en vez del `eyebrow` de una sección. La
 * línea de créditos fotográficos debajo agrega a las fotógrafas/fotógrafos
 * reales que ya se acreditan en el sitio (Crear/Enseñar/Producir) — ninguna
 * cara nueva, es la nómina completa en un solo lugar, como el colofón de un
 * programa de teatro real.
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
  const location = useLocation();
  const linkedPillars = t.pillars.filter((p) => p.href);
  const isActive = (path: string) => location.pathname === path;
  const activeClass = 'text-brand-red';

  const socialLinks = [
    { label: t.social.instagram, href: LINKS.instagram, icon: Instagram, external: true },
    { label: t.social.linkedin, href: LINKS.linkedin, icon: Linkedin, external: true },
    { label: t.social.email, href: LINKS.email, icon: Mail, external: false },
  ];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    // Sin `border-t` propio (sacado 2026-09-09, pedido explícito: "el último
    // hr que hay en la home, justo antes de fin del programa"). El `Seam` de
    // abajo ya dibuja su propia línea terminando en el colofón — este border
    // estático era una segunda raya pegada encima, redundante.
    <footer className="relative z-10 w-full overflow-hidden bg-ink">
      {/* La marca de agua decorativa de acá (`NoraStarIcon`, set de íconos de
          marca generado con IA) se sacó 2026-09-12 — el usuario pidió sacar
          todo ese set del sitio. Sin reemplazo: el footer no necesita un
          flourish de fondo para funcionar. */}
      <Seam label={t.footer.colophon} />
      <Reveal
        as="div"
        className="mx-auto flex max-w-7xl flex-col gap-10 px-6 pb-28 pt-16 sm:px-10 md:px-12 md:py-20"
      >
        <div className="flex flex-row items-center justify-between gap-4 sm:gap-8">
          <div className="flex min-w-0 items-center gap-3">
            <Picture
              src="/img/nora-firma-roja.png"
              alt="Nora Filmus"
              className="h-14 w-auto"
              sizes="180px"
            />
            <BetaBadge />
          </div>

          {/* Oculto en mobile a pedido del usuario (2026-09-11): en esa
              pantalla el footer queda solo con logo + íconos de redes en una
              sola línea, sin el nav — el nav completo (Inicio/Sobre mí/los
              pilares/Contacto) ya vive en `Header`, accesible desde arriba
              en cualquier ruta. `flex-wrap` + gap asimétrico: con 6 links y
              `nowrap` este nav medía 469px en ES contra un viewport de 390 y
              hacía scrollear el documento entero de lado (auditoría E1/H2 —
              el caso peor era el español, que es el idioma por defecto). */}
          <nav className="hidden flex-wrap items-center gap-x-6 gap-y-1 md:flex">
            <Link
              to="/"
              aria-current={isActive('/') ? 'page' : undefined}
              className={`${NAV_LINK} ${isActive('/') && !location.hash ? activeClass : ''}`}
            >
              {t.nav.home}
            </Link>
            <Link
              to="/#sobre-mi"
              aria-current={isActive('/') && location.hash === '#sobre-mi' ? 'page' : undefined}
              className={`${NAV_LINK} ${isActive('/') && location.hash === '#sobre-mi' ? activeClass : ''}`}
            >
              {t.nav.about}
            </Link>
            {linkedPillars.map((p) => {
              const active = isActive(p.href!);
              return (
                <Link
                  key={p.key}
                  to={p.href!}
                  aria-current={active ? 'page' : undefined}
                  className={`${NAV_LINK} ${active ? activeClass : ''}`}
                >
                  {p.label}
                </Link>
              );
            })}
            {/* Trayectoria fuera de producción hasta que esté pronta y
                funcional (2026-09-09) — ver lib/features.ts. */}
            {TRAYECTORIA_ENABLED && (
              <Link
                to="/trayectoria"
                aria-current={isActive('/trayectoria') ? 'page' : undefined}
                className={`${NAV_LINK} ${isActive('/trayectoria') ? activeClass : ''}`}
              >
                {t.nav.trayectoria}
              </Link>
            )}
            <Link
              to="/contacto"
              aria-current={isActive('/contacto') ? 'page' : undefined}
              className={`${NAV_LINK} ${isActive('/contacto') ? activeClass : ''}`}
            >
              {t.nav.contacto}
            </Link>
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

        <div className="flex flex-col gap-4 border-t border-cream/10 pt-8 font-label text-[11px] uppercase tracking-[0.15em] text-cream/50">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <span>
              © {new Date().getFullYear()} Nora Filmus — {t.footer.rights}
            </span>
            <div className="flex items-center gap-4">
              <span>{t.hero.location}</span>
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex min-h-11 items-center gap-1.5 text-cream/50 transition-colors duration-300 hover:text-brand-red"
              >
                {t.footer.backToTop}
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {/* Colofón fotográfico (Fase 5) — normal-case y tracking más suelto
              que el resto de la fila: es una nota de crédito, no un label de
              nav, no tiene que gritar igual. `/50` igual (F9): es el piso de
              contraste del sitio, no hay excepción para texto "quieto". */}
          <p className="normal-case tracking-normal text-cream/50">{t.footer.photoCredits}</p>
        </div>
      </Reveal>
    </footer>
  );
}
