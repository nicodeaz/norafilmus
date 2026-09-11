import { motion } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { useRevealPastHero } from '@/lib/hooks/use-reveal-past-hero';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/src/i18n/LanguageContext';
import BetaBadge from './BetaBadge';
import LanguageToggle from './LanguageToggle';
import Picture from './Picture';

/**
 * Chrome global del sitio — SUPERPROMPT.md §6 (F1). El Hero ya trae su propio
 * toggle de idioma y su propio footer de contacto adentro del viewport de la
 * pantalla de inicio (ver Hero.tsx), así que este header NO está visible
 * desde `scroll: 0` — aparecería duplicado sobre el Hero. En cambio se
 * revela recién después de pasar el alto del Hero (`useRevealPastHero`), que
 * es el momento en que `AboutMe` ya tapó al Hero y hace falta un ancla fija
 * para volver arriba.
 *
 * **Sin nav propio desde 2026-09-11** (pedido explícito: "usemos el mismo
 * menú que la landing de Nora, me encantó incluso en mobile") — los links
 * (Sobre mí/pilares/Trayectoria/Contacto) que antes vivían acá como fila
 * horizontal se mudaron a `SectionNav.tsx` (rail vertical en desktop,
 * "rueda" horizontal fija al pie en mobile, calcado de
 * `nora-landing/src/components/SectionNav.tsx` y adaptado a rutas en vez de
 * anclas de una sola página). Este Header queda como el de `nora-landing`:
 * logo + toggle de idioma, nada más — comparte el mismo `useRevealPastHero`
 * que `SectionNav` para que las dos piezas aparezcan/desaparezcan juntas.
 *
 * **Sin barra en mobile, desde 2026-09-12** (pedido explícito: "quiero sacar
 * el menu mobile de arriba, dejar solo el EN ES flotando arriba a la
 * derecha, sin fondo, apenas un backdrop filter blur redondeado") — la barra
 * completa (logo + fondo `bg-ink/90` + borde) queda `lg:block`, solo
 * desktop; en mobile la navegación ya la resuelve la rueda de `SectionNav`
 * al pie, así que el logo acá era redundante. Lo único que sigue flotando
 * en mobile es el toggle de idioma, en su propio `motion.div` (mismo
 * `visible`/`inert` que la barra de desktop, para que las dos aparezcan
 * juntas pasado el Hero) — transparente, sin `bg-ink`, con
 * `backdrop-blur-[3px]` apenas perceptible (mismo valor que `.text-legible-
 * blur` en `src/index.css`, "apenas blur, que sea legible el texto" — acá
 * en Tailwind arbitrario en vez de esa clase porque esta pieza vive hasta
 * `lg:` (1024px) y esa clase solo actúa por debajo de 767px) y `rounded-full`
 * en vez del borde recto de la barra.
 */
export default function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const visible = useRevealPastHero(isHome);

  return (
    <>
      {/* Desktop: barra completa, logo + toggle, fondo e blur de siempre. */}
      <motion.header
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
        transition={{ duration: 0.3 }}
        // `inert` mientras está oculto: `opacity:0` + `pointer-events-none` NO
        // saca del orden de tabulación (la caja sigue con `visibility: visible`),
        // así que a scroll 0 sus controles seguían siendo focusables e
        // invisibles (auditoría E1/H3). `inert` los saca del tab order Y del
        // árbol de accesibilidad de una.
        inert={!visible}
        className={cn(
          'fixed inset-x-0 top-0 z-40 hidden border-b border-cream/10 bg-ink/90 backdrop-blur-md lg:block',
          !visible && 'pointer-events-none'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 sm:px-10 md:px-12">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="flex min-h-11 shrink-0 items-center" aria-label={t.nav.home}>
              <Picture
                src="/img/nora-firma-roja.png"
                alt="Nora Filmus"
                className="h-9 w-auto"
                sizes="120px"
              />
            </Link>
            <BetaBadge />
          </div>
          <LanguageToggle />
        </div>
      </motion.header>

      {/* Mobile: solo el toggle de idioma, flotando arriba a la derecha. */}
      <motion.div
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
        transition={{ duration: 0.3 }}
        inert={!visible}
        className={cn('fixed right-4 top-4 z-40 lg:hidden', !visible && 'pointer-events-none')}
      >
        <LanguageToggle className="mr-0 rounded-full backdrop-blur-[3px]" />
      </motion.div>
    </>
  );
}
