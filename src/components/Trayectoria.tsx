import { useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import type { Decade, TimelineCategory, TimelineEntry } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import { useLightbox } from './Lightbox';
import Picture from './Picture';
import Reveal from './Reveal';

type FilterKey = 'todos' | TimelineCategory;
type Side = 'left' | 'right';
// Orden descendente — el usuario pidió (2026-09-08) que el timeline arranque
// en el presente y vaya hacia atrás, no al revés. `content.ts` sigue
// curado en orden ascendente (1990→hoy, más fácil de mantener), así que acá
// se invierte tanto el orden de décadas como el de los hitos dentro de cada
// una — no se toca el dato fuente.
const DECADES: Decade[] = ['2020s', '2010s', '2000s', '1990s'];
// Año de CIERRE de cada década ya completa — 2026-09-08, corrigiendo el
// "año de arranque" (2026-09-06) que tenía sentido leyendo 1990→hoy pero
// confundía en el orden invertido: el divisor "2020" aparecía primero,
// antes que los hitos de 2026/2025/2024 que en realidad se leen ahí. Para
// las tres décadas cerradas el cierre es fijo (1999/2009/2019); para la
// década en curso (2020s) no hay un cierre fijo todavía — se calcula en
// `useDecadeEndYears` a partir del año más reciente presente en los datos.
const DECADE_END_YEAR: Record<Exclude<Decade, '2020s'>, string> = {
  '1990s': '1999',
  '2000s': '2009',
  '2010s': '2019',
};

/**
 * "El programa" — Trayectoria, la línea de tiempo completa. Rediseñada
 * 2026-09-04 a pedido explícito del usuario: antes cada década era un
 * acordeón con la lista de hitos apilada en una sola columna de texto — acá
 * es una **espina vertebral** de verdad, con los hitos alternando a la
 * izquierda y a la derecha de la línea y, cuando hay una foto real
 * disponible, la foto sale junto al hito. Orden invertido 2026-09-08 a
 * pedido del usuario: arranca en el presente (2020s) y va hacia atrás hasta
 * 1990 — `DECADES` y los hitos de cada grupo se recorren en reversa, el dato
 * fuente de `content.ts` sigue curado en orden ascendente.
 *
 * **Solo un puñado de los 39 hitos tiene `images`** — no es un déficit del
 * diseño, es la regla 1 de `content.ts` ("todo dato es verificable"): cada
 * foto que aparece acá es una que el sitio YA usa y acredita en otro lado
 * (Crear/Producir/`GALLERY_ES`), reusada con el mismo `alt`/crédito exactos.
 * No se inventó ninguna atribución nueva y no se forzó ninguna foto a un
 * hito con el que no coincide (ej. la foto de Marcos Paz — docencia con
 * menores identificables, cara desenfocada — se dejó afuera: el hito de
 * Trayectoria más parecido, "Instituto de Menores San Martín", es una
 * institución distinta, no la misma que la foto documenta).
 *
 * Ya no es un acordeón: no hay estado de década abierta/cerrada, todos los
 * hitos filtrados se renderizan siempre. Se pierde el efecto `sticky` de la
 * Fase 4 (dejó de tener sentido sin accordion — el "encabezado actual"
 * pinneado solo servía para marcar cuál década estaba desplegada), pero se
 * conserva la espina que se llena con el scroll (`scrollYProgress` →
 * `scaleY`, misma técnica de `ScrollProgress.tsx`) — el "avance mecánico
 * por el tiempo" sigue siendo la pieza "frame por frame" del sitio.
 *
 * Alternancia izquierda/derecha: un contador corrido (no por década) para
 * que dos hitos consecutivos nunca caigan del mismo lado aunque una década
 * tenga un número impar de hitos filtrados.
 *
 * El cometa (2026-09-06): un halo rojo pegado a la punta de la línea que se
 * llena, siguiendo el mismo `scrollYProgress`. La Fase 4 dejó la espina
 * "llenándose" pero sin nada que marque el punto exacto de avance — con
 * décadas largas (2020s tiene 17 hitos) la línea rellena se leía como una
 * barra de progreso más, no como algo recorriéndose en el momento.
 *
 * Divisores de grupo, sin "2020s" (2026-09-06): el usuario pidió no ver el
 * bucket crudo. El rótulo gigante es un año, derivado de la década (no del
 * primer hito filtrado, para que no cambie según el filtro activo).
 * 2026-09-08: ese año pasó de ser el de ARRANQUE de la década a el de
 * CIERRE (`DECADE_END_YEAR` + `computeCurrentDecadeEndYear`) — con el orden
 * ya invertido (presente→pasado), el numeral que se encuentra primero al
 * entrar a cada bloque tiene que ser el año por el que se lo está leyendo
 * (el más reciente), no el arranque técnico de la década. Para 2020s, que
 * sigue en curso, ese año se calcula del dato real (año más alto presente
 * en `trayectoria.items`) en vez de un fijo — así no queda desalineado del
 * calendario real a medida que se agreguen hitos más nuevos.
 *
 * **Fotos "flotantes" (2026-09-09)** — el usuario pidió un tratamiento tipo
 * "parallax floating" (referencia: componente `Floating`/`FloatingElement`
 * de 21st.dev/@danielpetho) para las fotos del timeline. No se portó esa
 * arquitectura tal cual: ese componente registra N elementos absolutos en
 * un contexto compartido y los mueve todos juntos según la posición del
 * mouse sobre un contenedor del tamaño del viewport — pensado para un
 * collage de hero, no para fotos sueltas dentro de una lista larga que
 * scrollea. `TimelinePhoto` (abajo) adapta el mecanismo real —
 * `useMotionValue`/`useSpring` de `motion`, misma librería, sin hook
 * nuevo— a escala de una sola foto: cada thumbnail sigue al cursor con un
 * desplazamiento sutil (±6px) mientras el mouse está encima y vuelve a su
 * lugar con un spring al salir. El click a ampliar (`openLightbox`) y el
 * orden más-reciente-primero ya existían antes de este pedido — son la
 * espina invertida (2026-09-08, ver arriba) y el lightbox que ya usa
 * `Act.tsx`, reusado tal cual acá.
 */
export default function Trayectoria() {
  const { t } = useLanguage();
  const { trayectoria } = t;
  const [filter, setFilter] = useState<FilterKey>('todos');
  const spineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: spineProgress } = useScroll({
    target: spineRef,
    offset: ['start 0.85', 'end 0.15'],
  });
  // Punta encendida de la espina — un "cometa" que camina con el mismo
  // progreso que ya llena la línea (2026-09-06). Es la pieza que le faltaba
  // al efecto "frame por frame" de la Fase 4: la línea se llenaba pero no
  // había nada marcando DÓNDE está el avance ahora mismo, solo hasta dónde
  // llegó. clamp evita que el halo se salga del contenedor en los extremos
  // del scroll (el propio `useScroll` ya devuelve 0..1, pero un rebote del
  // trackpad puede pasarse por muy poco).
  const cometTop = useTransform(spineProgress, (v) => `${Math.min(100, Math.max(0, v * 100))}%`);

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'todos', label: trayectoria.filterAll },
    { key: 'actuacion', label: trayectoria.filterActing },
    { key: 'docencia', label: trayectoria.filterTeaching },
    { key: 'produccion', label: trayectoria.filterProducing },
    { key: 'formacion', label: trayectoria.filterTraining },
  ];

  const groups = useMemo(() => {
    const filtered = trayectoria.items.filter((i) => filter === 'todos' || i.category === filter);
    return DECADES.map((decade) => ({
      decade,
      // .reverse() invierte el orden ascendente en que están curados en
      // content.ts, así cada década también se lee del hito más reciente al
      // más viejo, consistente con el orden de décadas de arriba.
      items: filtered.filter((i) => i.decade === decade).reverse(),
    })).filter((g) => g.items.length > 0);
  }, [trayectoria.items, filter]);

  // Año de cierre de la década en curso — sobre el dataset SIN filtrar (el
  // mismo criterio que ya regía DECADE_END_YEAR: el divisor no cambia según
  // el filtro activo). Un solo regex sobre 39 hitos, no vale la pena cachear
  // fuera del render.
  const currentDecadeEndYear = useMemo(() => {
    const years = trayectoria.items
      .filter((i) => i.decade === '2020s')
      .flatMap((i) => Array.from(i.year.matchAll(/\d{4}/g), (m) => Number(m[0])));
    return years.length ? String(Math.max(...years)) : '2020';
  }, [trayectoria.items]);

  const decadeEndYear = (decade: Decade) =>
    decade === '2020s' ? currentDecadeEndYear : DECADE_END_YEAR[decade];

  // Corrido a través de todas las décadas — no se reinicia en cada grupo, así
  // el lado nunca se repite en el borde entre una década y la siguiente.
  let sideCounter = -1;

  return (
    <section id="trayectoria" className="relative w-full bg-ink py-16 md:py-24">
      {/* max-w-7xl y no 5xl: alinea la espina con la grilla de los Actos y del
          Hero — con 5xl la sección quedaba angosta y descentrada respecto al
          resto del sitio. */}
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <Reveal as="div" className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {trayectoria.eyebrow}
          </span>
        </Reveal>

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-4 text-display-l font-display uppercase leading-[0.95] text-cream"
        >
          {trayectoria.titleLead} <span className="text-brand-red">{trayectoria.titleAccent}</span>
        </Reveal>

        <Reveal as="p" delay={0.15} className="mt-6 max-w-[60ch] text-body font-body leading-relaxed text-cream/80">
          {trayectoria.body}
        </Reveal>

        <Reveal as="div" delay={0.2} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={cn(
                // min-h-11 + items-end: la caja táctil llega a 44px sin mover
                // el subrayado ni cambiar el tamaño del texto (E1/H5 — los
                // filtros medían 22px de alto).
                'inline-flex min-h-11 items-end border-b-2 pb-1 font-label text-xs uppercase tracking-[0.15em] transition-colors duration-300',
                filter === key
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-cream/50 hover:text-cream'
              )}
            >
              {label}
            </button>
          ))}
        </Reveal>

        {/* La espina: una línea vertical continua, centrada desde `md` (los
            hitos alternan a cada lado) y pegada al borde izquierdo en mobile
            (una sola columna, como el resto del sitio a ese ancho). Sin
            `Reveal` en el contenedor — sería un observer por sección, no por
            hito; el fade-in de grupo alcanza (ver más abajo) y evita el costo
            de 39 observers individuales. */}
        <div className="relative mt-16 md:mt-20">
          <div ref={spineRef} className="relative">
            <div
              aria-hidden
              className="absolute inset-y-0 left-4 w-px bg-cream/15 md:left-1/2 md:-translate-x-1/2"
            />
            {!reduced && (
              <>
                <motion.div
                  aria-hidden
                  style={{ scaleY: spineProgress }}
                  className="absolute inset-y-0 left-4 w-px origin-top bg-brand-red md:left-1/2 md:-translate-x-1/2"
                />
                {/* El cometa: un halo chico que marca la punta encendida de la
                    espina, no solo cuánto se llenó. `radial-gradient`, no
                    `box-shadow` (design-system) ni `backdrop-blur` (el área es
                    mínima así que un blur normal es barato, pero ni hace
                    falta). */}
                <motion.div
                  aria-hidden
                  style={{ top: cometTop }}
                  className="absolute left-4 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full md:left-1/2"
                >
                  <div
                    className="h-full w-full rounded-full blur-[2px]"
                    style={{
                      background:
                        'radial-gradient(closest-side, rgba(229,57,53,0.95), rgba(229,57,53,0.25) 45%, rgba(229,57,53,0) 72%)',
                    }}
                  />
                  <div className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream" />
                </motion.div>
              </>
            )}

            <Reveal as="div" className="relative">
              {groups.map(({ decade, items }, gi) => (
                <div key={decade} className={cn(gi !== 0 && 'mt-6 md:mt-10')}>
                  <div className="relative flex items-center gap-3 py-8 pl-10 md:justify-center md:py-10 md:pl-0">
                    <span className="relative z-10 bg-ink font-display text-4xl uppercase leading-none text-cream sm:text-5xl md:px-4 md:text-6xl">
                      {decadeEndYear(decade)}
                    </span>
                    <span className="font-label text-xs text-cream/50">{items.length}</span>
                  </div>

                  <ul className="flex flex-col">
                    {items.map((item) => {
                      sideCounter += 1;
                      const side: Side = sideCounter % 2 === 0 ? 'left' : 'right';
                      return <TimelineRow key={`${item.year}-${item.title}`} item={item} side={side} />;
                    })}
                  </ul>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineRow({ item, side }: { item: TimelineEntry; side: Side }) {
  const mirrored = side === 'right';
  const { open: openLightbox } = useLightbox();
  const photoCredits = item.images?.length
    ? Array.from(new Set(item.images.map((img) => img.credit)))
    : [];

  return (
    <li className="relative py-5 md:py-7">
      <span
        aria-hidden
        className="absolute left-4 top-1.5 h-2.5 w-2.5 rounded-full bg-brand-red md:left-1/2 md:-translate-x-1/2"
      />
      <div
        className={cn(
          'ml-10 md:w-[calc(50%-2rem)]',
          mirrored ? 'md:ml-auto' : 'md:ml-0'
        )}
      >
        <span className="font-label text-xs text-brand-red">{item.year}</span>
        <p className="mt-1 font-body text-cream">{item.title}</p>
        <p className="mt-1 font-label text-xs text-cream/50">{item.detail}</p>

        {item.images && item.images.length > 0 && (
          <>
            <div className={cn('mt-4 flex flex-wrap gap-3', mirrored && 'md:justify-end')}>
              {item.images.map((img, i) => (
                <TimelinePhoto
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  rotate={i % 2 === 0 ? '-rotate-2' : 'rotate-2'}
                  onClick={() =>
                    openLightbox(
                      item.images!.map((im) => ({ src: im.src, alt: im.alt, label: item.title })),
                      i
                    )
                  }
                />
              ))}
            </div>
            <p className="mt-2 font-label text-[11px] text-cream/50">Foto: {photoCredits.join(' · ')}</p>
          </>
        )}
      </div>
    </li>
  );
}

/**
 * Una foto del timeline con paralaje de cursor — ver docblock de arriba
 * ("Fotos flotantes"). `x`/`y` son `MotionValue`s crudos que se leen del
 * puntero; `useSpring` los suaviza (el mismo patrón que ya usa `motion` en
 * el resto del sitio, ej. `ScrollProgress`) en vez de animar directo, así
 * el regreso al soltar el mouse frena con inercia en vez de saltar a 0.
 * `reduced` corta el efecto entero: sin `onPointerMove` ni transform, la
 * imagen queda estática (mismo criterio que el resto del sitio con
 * `prefers-reduced-motion`).
 */
function TimelinePhoto({
  src,
  alt,
  rotate,
  onClick,
}: {
  src: string;
  alt: string;
  rotate: string;
  onClick: () => void;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 20, mass: 0.4 });

  function handlePointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - rect.left) / rect.width - 0.5) * 12);
    y.set(((e.clientY - rect.top) / rect.height - 0.5) * 12);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={reduced ? undefined : { x: springX, y: springY }}
      className="outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
    >
      <Picture
        src={src}
        alt={alt}
        sizes="(min-width: 768px) 8rem, 30vw"
        loading="lazy"
        decoding="async"
        pictureClassName="block"
        className={cn(
          'aspect-[3/4] w-20 border-[3px] border-cream/15 object-cover transition-opacity duration-300 hover:opacity-80 sm:w-24',
          rotate
        )}
      />
    </motion.button>
  );
}
