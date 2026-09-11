import { Suspense, useEffect, useState, type ComponentType } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { TRAYECTORIA_ENABLED } from '@/lib/features';
import type { SiteContent } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import ErrorBoundary from './ErrorBoundary';
import {
  NoraClapperboardIcon,
  NoraCurtainIcon,
  NoraMasksIcon,
  NoraSignatureIcon,
  NoraSpotlightIcon,
  NoraStarIcon,
  NoraTicketIcon,
} from './icons/nora';

/** Cuánto queda la pantalla tapada del todo antes de reabrir, en ms. */
const HOLD_MS = 200;
const COVER_DURATION = 0.35;
const COVER_MS = COVER_DURATION * 1000;

/** Numeral de Acto por ruta — mismo valor que ya usan `Act`/`Seam` en `App.tsx`, no es dato nuevo. */
const NUMERAL: Record<string, string> = {
  '/crear': 'I',
  '/ensenar': 'II',
  '/producir': 'III',
};

/**
 * Ícono por destino — el mismo set de marca (`icons/nora`) que ya usan
 * `ProgramIndex`/`Highlights` para Crear/Enseñar/Producir/Trayectoria; Home,
 * "Sobre mí" y Contacto suman los tres íconos del set que no tenían un lugar
 * fijo todavía (cortina = apertura, firma = biografía personal, entrada =
 * contacto), sin inventar ningún ícono nuevo.
 */
const DESTINATION_ICON: Record<string, ComponentType<{ className?: string }>> = {
  home: NoraCurtainIcon,
  about: NoraSignatureIcon,
  crear: NoraMasksIcon,
  ensenar: NoraSpotlightIcon,
  producir: NoraClapperboardIcon,
  trayectoria: NoraStarIcon,
  contacto: NoraTicketIcon,
};

/** Resuelve qué se está por mostrar (label + ícono) a partir de la ruta+hash de destino. */
function resolveDestination(pathname: string, hash: string, t: SiteContent) {
  if (pathname === '/') {
    return hash === '#sobre-mi'
      ? { key: 'about', label: t.nav.about }
      : { key: 'home', label: t.nav.home };
  }
  const pillar = t.pillars.find((p) => p.href === pathname);
  if (pillar) return { key: pillar.key, label: pillar.label };
  if (pathname === '/trayectoria' && TRAYECTORIA_ENABLED) {
    return { key: 'trayectoria', label: t.nav.trayectoria };
  }
  if (pathname === '/contacto') return { key: 'contacto', label: t.nav.contacto };
  return null;
}

/**
 * Transición entre páginas — reescrita 2026-09-04.
 *
 * Tenía un "telón de dos hojas" (dos paneles deslizando desde los bordes +
 * filo rojo). El usuario vio ese mismo dispositivo en la obertura inicial
 * (`Preloader`, versión previa) y pidió sacarlo del todo — acá corría el
 * mecanismo gemelo para el swap de ruta, así que se reemplaza también, no
 * solo donde lo vio: "quiero usar un loader en todo el sitio, quiero que el
 * loader sea la n y la f". Ahora es un fundido simple a `ink` con `NFMark`
 * (el monograma, compartido con `Preloader`) al centro — sin hojas, sin
 * video, el mismo loader en cualquier lugar del sitio donde haya que tapar
 * un cambio de contenido.
 *
 * `useOutlet()` en vez de recibir `children`: así puede quedarse mostrando
 * la página VIEJA mientras el fundido cierra, y recién cambiar al contenido
 * nuevo cuando la pantalla ya está completamente tapada — si el `<Outlet />`
 * se reemplazara directo, React Router swapea la página apenas cambia la URL
 * (antes de que el fundido termine de cerrar) y se ve un flash del contenido
 * nuevo por debajo.
 *
 * **Bug real en producción (2026-09-07), corregido acá:** navegar entre
 * páginas se quedaba trabado con el telón cerrado para siempre — reproducido
 * contra el build real (`vite preview` + Apache aislado), no solo en dev.
 * Causa: el único `<Suspense>` del sitio envolvía `<Routes>` entero en
 * `App.tsx`, por ARRIBA de `SiteLayout` — así que cuando el chunk lazy de la
 * página nueva (`EnsenarPage`, etc.) todavía no había terminado de cargar,
 * suspendía TODO el subárbol de ese Suspense, `SiteLayout` incluido: el
 * propio `PageCurtain` (con su `covering: true` ya commiteado) se
 * desmontaba a mitad de la animación, y el timeout de `reveal` que iba a
 * volver a abrir el telón se perdía con él — nunca llegaba a dispararse en
 * la instancia nueva porque esa instancia arranca con `covering: false`. El
 * `<Suspense>` de `App.tsx` se saca de ahí; acá abajo se agrega uno propio,
 * ceñido solo a `{shown}` (el contenido de la página) — así una carga lenta
 * de chunk deja a `PageCurtain`, `Header` y `Footer` completamente
 * intactos, montados una sola vez por sesión de ruta, y el timer de
 * `reveal` siempre llega a correr.
 *
 * **Rediseño 2026-09-11, pedido explícito** ("un blur suave en toda la
 * página, el logo de la sección en cuestión y un texto de yendo"): el
 * fundido opaco a `bg-ink` con `NFMark` (el monograma genérico, el mismo en
 * cualquier lugar del sitio) pasa a `bg-ink/70 backdrop-blur-2xl` —
 * translúcido, no opaco — con el ícono de marca de la sección DESTINO
 * (`DESTINATION_ICON`, el mismo set que ya usan `ProgramIndex`/`Highlights`)
 * y el texto "Yendo a {label}" (`t.pageTransition.goingTo`). Dos efectos de
 * este cambio, buscados los dos: la sección siguiente ya no queda oculta del
 * todo — se ve a través del blur, semitransparente, apenas termina de
 * swapear el `outlet` por debajo — y el loader ahora identifica A DÓNDE va
 * el visitante (antes solo confirmaba que algo estaba cargando). `NFMark`
 * sigue siendo el loader de la obertura inicial (`Preloader.tsx`, sin
 * tocar) — ese es un momento de marca de una sola vez por sesión, este es
 * navegación repetida donde importa más la orientación que el logo del sitio.
 */
export default function PageCurtain() {
  const location = useLocation();
  const outlet = useOutlet();
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  const [shown, setShown] = useState(outlet);
  const [shownPath, setShownPath] = useState(location.pathname);
  const [covering, setCovering] = useState(false);

  useEffect(() => {
    if (shownPath === location.pathname) {
      // Misma ruta (ej. el idioma cambió el contenido) — no hay nada que tapar.
      setShown(outlet);
      return;
    }

    if (reduced) {
      setShown(outlet);
      setShownPath(location.pathname);
      return;
    }

    setCovering(true);
    const swap = setTimeout(() => {
      setShown(outlet);
      setShownPath(location.pathname);
    }, COVER_MS);
    const reveal = setTimeout(() => setCovering(false), COVER_MS + HOLD_MS);
    return () => {
      clearTimeout(swap);
      clearTimeout(reveal);
    };
    // `outlet` cambia en cada render de ruta — solo importa disparar esto
    // cuando cambia el pathname, no en cada re-render del contenido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, reduced]);

  const numeral = NUMERAL[location.pathname];
  const destination = resolveDestination(location.pathname, location.hash, t);
  const DestinationIcon = destination ? DESTINATION_ICON[destination.key] : null;

  return (
    <>
      {/* `key={shownPath}`: si un chunk falla en `/crear` y el visitante
          navega después a `/ensenar` con la conexión ya recuperada, el
          `ErrorBoundary` se remonta limpio en vez de seguir mostrando el
          error viejo — ver su docblock. */}
      <ErrorBoundary key={shownPath}>
        <Suspense fallback={null}>{shown}</Suspense>
      </ErrorBoundary>
      <AnimatePresence>
        {covering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: COVER_DURATION, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-ink/70 backdrop-blur-2xl"
            aria-hidden
          >
            {DestinationIcon && (
              <DestinationIcon className="h-[clamp(56px,11vw,88px)] w-[clamp(56px,11vw,88px)] text-brand-red" />
            )}
            {destination && (
              <span className="flex flex-col items-center gap-1.5">
                <span className="font-label text-[11px] uppercase tracking-[0.35em] text-cream/70">
                  {t.pageTransition.goingTo}
                </span>
                <span className="flex items-baseline gap-3 whitespace-nowrap font-display text-2xl uppercase leading-none text-cream sm:text-3xl">
                  {numeral && <span className="text-brand-red">{numeral}</span>}
                  {destination.label}
                </span>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
