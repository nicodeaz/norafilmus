import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { animate, motion, useMotionValue, useReducedMotion } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TRAYECTORIA_ENABLED } from '@/lib/features';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/src/i18n/LanguageContext';

/**
 * Ancho de cada ítem de la "rueda" mobile. Subido de 60 a 70 (2026-09-11,
 * pedido explícito: "que se vea un poco más grande en mobile") — la caja del
 * nav (`w-[280px] h-14` → `w-[320px] h-16`) creció en la misma proporción.
 */
const ITEM_WIDTH = 70;

/**
 * Cuánto tarda una selección (drag o tap) en confirmarse y navegar de verdad.
 * Bajado de 2000 a 800 (2026-09-11, pedido explícito: "demora mucho en
 * redirigir, bajar el tiempo") — suficiente para que la barra de progreso
 * bajo la píldora siga siendo visible (no un parpadeo) sin sentirse trabado.
 */
const SELECT_DELAY_MS = 800;

const SPRING = { type: 'spring', stiffness: 380, damping: 34 } as const;

/** Offset (negativo) del track para que el ítem `index` quede centrado. */
function offsetForIndex(index: number) {
  return -(index * ITEM_WIDTH + ITEM_WIDTH / 2);
}

function clampIndex(index: number, max: number) {
  return Math.min(Math.max(index, 0), max);
}

interface NavItem {
  key: string;
  href: string;
  label: string;
  active: boolean;
}

/**
 * Nav de sitio, calcado de `nora-landing/src/components/SectionNav.tsx`
 * (2026-09-11, pedido explícito: "usemos el mismo menú que la landing, me
 * encantó incluso en mobile"). Reemplaza a la fila horizontal de texto que
 * vivía dentro de `Header.tsx` — ver su docblock.
 *
 * Dos diferencias reales frente al original, las dos porque `norafilmus` es
 * multi-página (Fase 1, 2026-08-28) y `nora-landing` es una sola página que
 * se recorre scrolleando:
 * - El original trackea el ítem activo con un `IntersectionObserver` sobre
 *   secciones de la misma página. Acá no hay secciones que observar — el
 *   ítem activo sale de `useLocation()` (pathname + hash para `/#sobre-mi`,
 *   el único caso con dos ítems en la misma ruta).
 * - El original scrollea (`scrollIntoView`) al hacer click. Acá cada ítem es
 *   un `<Link>` de react-router que navega de verdad.
 *
 * El resto es el mismo mecanismo: rail vertical con puntos + label que se
 * expande en el activo (desktop, `lg:`) y una "rueda" horizontal fija al pie
 * con el ítem activo centrado como píldora y los demás como puntos que
 * se apagan con la distancia (mobile, bajo `lg:`), con máscara de fade en
 * los bordes. Colores por tokens del sitio (`bg-brand-red`/`text-cream`/
 * `bg-ink`) en vez de los hex sueltos que usa `nora-landing` — son los
 * mismos valores (paleta compartida, ver CLAUDE.md), pero acá ya existen
 * como utilities.
 *
 * **La rueda mobile está siempre visible desde `scroll: 0`, incluso en `/`
 * (2026-09-12), pedido explícito: "sacar los iconos de las redes en la home
 * en la vista mobile y en su lugar quiero que el menú esté siempre
 * visible".** Antes compartía `useRevealPastHero` con `Header` y recién
 * aparecía pasado el Hero — la banda de contacto al pie de `Hero.tsx` (los
 * íconos de Instagram/LinkedIn/mail) existía justamente para no competir con
 * la rueda mientras estuvo oculta. Con la rueda ahora siempre puesta, esos
 * íconos se sacan en mobile (`Hero.tsx`, `hidden md:block` en la banda) para
 * no duplicar contacto/navegación en el mismo tramo de pantalla — quedan
 * SOLO en desktop, donde la rueda no existe (ahí el nav es el rail vertical
 * de más abajo) y la banda de contacto sigue teniendo trabajo que hacer.
 *
 * **El rail desktop es distinto desde 2026-09-11** (pedido explícito: "en la
 * home, resoluciones de escritorio, hacemos que el menú se vea desde el
 * principio") — se muestra siempre, sin esperar a pasar el Hero. A ese
 * ancho el rail vive angosto contra el borde izquierdo (`left-6`) y el Hero
 * corrió su propio contenido de texto un poco a la derecha para hacerle
 * lugar (ver `Hero.tsx`, `lg:pl-28` en `topBarRef`/`bodyRef`) — a diferencia
 * de la rueda mobile, no compite con la banda de pie del Hero (esa banda
 * hoy son solo los íconos de contacto, centrados).
 *
 * `SiteBanner` (franja de "sitio en obra") comparte el borde inferior del
 * viewport en mobile — su offset (`bottom-20 lg:bottom-0`) deja lugar para
 * que la rueda no quede tapada ni la tape.
 *
 * **La rueda mobile es de verdad una rueda desde 2026-09-11** (pedido
 * explícito: "que pueda cambiar de sección girando el componente como forma
 * de rueda... luego de seleccionado unos 2 seg más tarde va a esa sección" —
 * bajado a `SELECT_DELAY_MS` más tarde el mismo día, ver su propio comentario,
 * por sentirse lento). Antes cada punto era un `<Link>` que navegaba al toque; ahora el track es
 * `drag="x"` (`motion.div` sobre un `useMotionValue`) — se gira con el dedo,
 * se suelta, y el ítem que queda centrado (`pendingIndex`, el "dial" del
 * usuario) es el seleccionado. Tocar un ítem directamente hace lo mismo
 * (gira la rueda hasta centrarlo) en vez de navegar en el acto, para que el
 * gesto sea consistente entre arrastrar y tocar.
 *
 * La navegación real no pasa hasta `SELECT_DELAY_MS` después de la última
 * selección (se ve venir: una barra fina bajo la píldora activa se llena en
 * esos 2s — `key={selectionTick}` la reinicia en cada selección nueva,
 * incluso si es el mismo ítice de antes). Volver a arrastrar o tocar otro
 * ítem antes de que se cumpla cancela el timeout anterior — nunca navega a
 * dos lugares.
 *
 * **Excepción de teclado, a propósito:** un usuario de teclado no está
 * "girando" nada — activar un ítem con Enter/Space navega en el acto, sin
 * esperar los 2s. Se distingue de un tap/click real con `event.detail === 0`
 * (los clicks sintéticos que dispara el navegador al activar un `<button>`
 * por teclado llegan con `detail: 0`; un click real de mouse/touch trae
 * `detail: 1`) — sin esto, un visitante con lector de pantalla en mobile
 * (la única rueda que tiene disponible, el rail de escritorio vive bajo
 * `lg:`) quedaría forzado a esperar 2s por cada navegación.
 *
 * `pendingIndex` se limpia solo cuando la ruta real ya coincide con el ítem
 * elegido (`items[pendingIndex].active`) — nunca antes: limpiarlo apenas se
 * dispara `navigate()` haría que la rueda saltara de vuelta a la posición
 * vieja por un frame mientras React Router todavía no terminó de resolver
 * la ruta nueva.
 */
export default function SectionNav() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const reduced = useReducedMotion();
  const isHome = location.pathname === '/';
  const linkedPillars = t.pillars.filter((p) => p.href);

  const items: NavItem[] = useMemo(() => {
    const list: NavItem[] = [
      { key: 'home', href: '/', label: t.nav.home, active: isHome },
      ...linkedPillars.map((p) => ({
        key: p.key,
        href: p.href!,
        label: p.label,
        active: location.pathname === p.href,
      })),
    ];
    if (TRAYECTORIA_ENABLED) {
      list.push({
        key: 'trayectoria',
        href: '/trayectoria',
        label: t.nav.trayectoria,
        active: location.pathname === '/trayectoria',
      });
    }
    list.push({
      key: 'contacto',
      href: '/contacto',
      label: t.nav.contacto,
      active: location.pathname === '/contacto',
    });
    return list;
  }, [isHome, location.pathname, linkedPillars, t]);

  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.active)
  );

  // `pendingIndex`: el ítem que el usuario dejó centrado girando/tocando la
  // rueda, todavía sin navegar de verdad. `null` = la rueda sigue la ruta
  // actual sin más (ver docblock del componente).
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [selectionTick, setSelectionTick] = useState(0);
  const x = useMotionValue(offsetForIndex(activeIndex));
  const timeoutRef = useRef<number | undefined>(undefined);
  const currentHrefRef = useRef(location.pathname + location.hash);

  useEffect(() => {
    currentHrefRef.current = location.pathname + location.hash;
  }, [location.pathname, location.hash]);

  // La rueda ya llegó a destino: soltarla para que vuelva a seguir la ruta.
  useEffect(() => {
    if (pendingIndex !== null && items[pendingIndex]?.active) {
      setPendingIndex(null);
    }
  }, [items, pendingIndex]);

  // Sin selección en curso: la rueda sigue a la ruta actual (navegación por
  // Header/Footer/CTA, o el asentamiento tras una selección ya resuelta).
  useEffect(() => {
    if (pendingIndex !== null) return;
    const controls = animate(x, offsetForIndex(activeIndex), reduced ? { duration: 0 } : SPRING);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, pendingIndex, reduced]);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  function selectIndex(rawIndex: number, immediate: boolean) {
    const idx = clampIndex(rawIndex, items.length - 1);
    window.clearTimeout(timeoutRef.current);
    setPendingIndex(idx);
    setSelectionTick((tick) => tick + 1);
    animate(x, offsetForIndex(idx), reduced ? { duration: 0 } : SPRING);

    const confirm = () => {
      const target = items[idx];
      if (target.href !== currentHrefRef.current) {
        navigate(target.href);
      } else {
        setPendingIndex(null);
      }
    };

    if (immediate) {
      confirm();
    } else {
      timeoutRef.current = window.setTimeout(confirm, SELECT_DELAY_MS);
    }
  }

  function handleDragEnd() {
    const idx = Math.round((-x.get() - ITEM_WIDTH / 2) / ITEM_WIDTH);
    selectIndex(idx, false);
  }

  const displayIndex = pendingIndex ?? activeIndex;

  return (
    <>
      {/* Desktop: rail vertical a la izquierda, punto + label que se expande.
          Siempre visible (ver docblock) — a diferencia de la rueda mobile de
          abajo, no depende de `useRevealPastHero`. */}
      <nav
        aria-label={t.nav.sectionNav}
        className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-5 opacity-100 lg:flex"
      >
        {items.map((item) => (
          <Link
            key={item.key}
            to={item.href}
            aria-current={item.active ? 'page' : undefined}
            className="group flex min-h-11 items-center gap-3"
          >
            <span
              aria-hidden
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300',
                item.active
                  ? 'scale-125 bg-brand-red'
                  : 'bg-cream/30 group-hover:bg-cream/60 group-focus-visible:bg-cream/60'
              )}
            />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap font-label text-[10px] uppercase tracking-[0.2em] transition-all duration-300',
                item.active
                  ? 'max-w-[8rem] text-cream opacity-100'
                  : 'max-w-0 text-cream/60 opacity-0 group-hover:max-w-[8rem] group-hover:opacity-100 group-focus-visible:max-w-[8rem] group-focus-visible:opacity-100'
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Mobile: rueda horizontal fija al pie, ítem activo centrado como
          píldora — y desde 2026-09-11 una rueda de verdad, `drag="x"` sobre
          `x` (ver docblock del componente para el mecanismo completo).
          Agrandada 2026-09-11 (pedido explícito: "un poco más grande en
          mobile, y con la letra blanca"): caja 280×56 → 320×64, píldora activa
          pasa de `bg-brand-red`+`text-ink` a `bg-brand-red-deep`+`text-cream`
          — con `text-ink` el contraste ya rendía justo (4.56:1); con blanco
          sobre el rojo saturado da 3.70:1 (no alcanza el piso de 4.5:1 del
          sitio), así que el fondo pasa al rojo más oscuro de la paleta
          (`--color-brand-red-deep`, #c62828), que sí llega a ~5.6:1 con texto
          claro — medido, no a ojo. */}
      <nav
        aria-label={t.nav.sectionNav}
        className="fixed bottom-4 left-1/2 z-40 h-16 w-[320px] -translate-x-1/2 overflow-hidden rounded-full border border-cream/15 bg-ink/95 backdrop-blur-md lg:hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{
            left: offsetForIndex(items.length - 1),
            right: offsetForIndex(0),
          }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute left-1/2 top-0 flex h-full cursor-grab touch-pan-y items-center select-none active:cursor-grabbing"
        >
          {items.map((item, idx) => {
            const distance = Math.abs(idx - displayIndex);
            return (
              <button
                key={item.key}
                type="button"
                aria-current={item.active ? 'page' : undefined}
                aria-label={item.label}
                className="relative flex h-full shrink-0 items-center justify-center"
                style={{ width: ITEM_WIDTH }}
                // Tap/drag: gira la rueda y espera SELECT_DELAY_MS antes de
                // navegar de verdad. Activación por teclado (detail === 0,
                // ver docblock): navega en el acto, sin esperar.
                onClick={(e) => selectIndex(idx, e.detail === 0)}
              >
                {distance === 0 ? (
                  <span className="relative whitespace-nowrap rounded-full border border-cream/15 bg-brand-red-deep px-4 py-2 font-label text-xs font-bold uppercase tracking-wider text-cream">
                    {item.label}
                    {pendingIndex !== null && !reduced && (
                      <span
                        key={selectionTick}
                        aria-hidden
                        className="animate-wheel-select-progress absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-cream/80"
                        style={{ '--select-delay': `${SELECT_DELAY_MS}ms` } as CSSProperties}
                      />
                    )}
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="block rounded-full bg-cream transition-all duration-500"
                    style={{
                      width: distance === 1 ? 8 : 5,
                      height: distance === 1 ? 8 : 5,
                      opacity: distance === 1 ? 0.55 : 0.22,
                    }}
                  />
                )}
              </button>
            );
          })}
        </motion.div>
      </nav>
    </>
  );
}
