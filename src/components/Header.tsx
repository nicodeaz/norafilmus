import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/src/i18n/LanguageContext';
import LanguageToggle from './LanguageToggle';
import Picture from './Picture';

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
 *
 * Fase 1 (arquitectura de rutas, 2026-08-28): el "aparece recién pasado el
 * Hero" es un comportamiento que solo tiene sentido en `/` — ahí el Hero ya
 * trae su propio wordmark+toggle adentro del viewport, así que el Header
 * duplicaría eso si apareciera desde scroll 0. En cualquier otra ruta
 * (`/crear`, `/trayectoria`, etc.) no hay Hero debajo: el Header tiene que
 * estar visible desde arriba o esas páginas cargan sin nav. `isHome` decide
 * cuál de los dos comportamientos aplica.
 */
/** Mismo criterio que el nav del `Footer`: caja de impacto de 44px sin tocar el tamaño del texto (E1/H5). */
const NAV_LINK =
  'inline-flex min-h-11 items-center font-label text-[11px] uppercase tracking-[0.15em] text-cream/60 transition-colors duration-300 hover:text-brand-red';

export default function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [visible, setVisible] = useState(!isHome);
  const linkedPillars = t.pillars.filter((p) => p.href);

  useEffect(() => {
    if (!isHome) {
      setVisible(true);
      return;
    }
    const threshold = () => window.innerHeight * 0.9;
    const onScroll = () => setVisible(window.scrollY > threshold());
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isHome]);

  return (
    <motion.header
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
      transition={{ duration: 0.3 }}
      // `inert` mientras está oculto: `opacity:0` + `pointer-events-none` NO
      // saca del orden de tabulación (la caja sigue con `visibility: visible`),
      // así que a scroll 0 estos 7 controles seguían siendo focusables y quien
      // navegaba con Tab pasaba por 7 controles que no veía — el anillo de foco
      // no aparecía en ningún lado (auditoría E1/H3). `inert` los saca del tab
      // order Y del árbol de accesibilidad de una.
      inert={!visible}
      className={cn(
        'fixed inset-x-0 top-0 z-40 border-b border-cream/10 bg-ink/90 backdrop-blur-md',
        !visible && 'pointer-events-none'
      )}
    >
      {/* `gap-6` (auditoría 2026-08-31): con `justify-between` puro, a 768-850px
          — donde el nav ya muestra 8 ítems (md: se cumple justo ahí) — el
          espacio libre entre logo y nav llegaba a cero: "ABOUT" quedaba
          literalmente pegado a "Filmus." Confirmado con getBoundingClientRect
          real en ese rango (Playwright, viewport 800px), no a simple vista.
          `gap-*` en flexbox actúa como piso mínimo incluso con `justify-between`
          (que solo reparte el espacio SOBRANTE), así que ahora nunca colapsa a
          cero por más que el nav crezca. */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 sm:px-10 md:px-12">
        <Link to="/" className="flex min-h-11 shrink-0 items-center" aria-label={t.nav.home}>
          <Picture
            src="/img/nora-firma-roja.png"
            alt="Nora Filmus"
            className="h-9 w-auto"
            sizes="120px"
          />
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/#sobre-mi" className={NAV_LINK}>
            {t.nav.about}
          </Link>
          {linkedPillars.map((p) => (
            <Link key={p.key} to={p.href!} className={cn(NAV_LINK, 'hidden sm:inline-flex')}>
              {p.label}
            </Link>
          ))}
          <Link to="/trayectoria" className={cn(NAV_LINK, 'hidden md:inline-flex')}>
            {t.nav.trayectoria}
          </Link>
          <Link to="/presente" className={cn(NAV_LINK, 'hidden md:inline-flex')}>
            {t.nav.presente}
          </Link>
          {/* Archivo/Contacto pasan a `lg:` (auditoría 2026-08-31): son links
              de utilidad, no piezas del "Programa" (Crear/Enseñar/Producir/
              Trayectoria/Presente) — correrlos a `lg` libera exactamente el
              rango 768-1023px donde chocaban con el logo, y de paso separa
              "páginas del programa" de "utilidad" en vez de una lista plana
              de 8 links del mismo peso. */}
          <Link to="/archivo" className={cn(NAV_LINK, 'hidden lg:inline-flex')}>
            {t.nav.archivo}
          </Link>
          <Link to="/contacto" className={cn(NAV_LINK, 'hidden lg:inline-flex')}>
            {t.nav.contacto}
          </Link>
          <LanguageToggle />
        </nav>
      </div>
    </motion.header>
  );
}
