import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import type { Decade, TimelineCategory, TimelineEntry } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import Picture from './Picture';
import Reveal from './Reveal';

type FilterKey = 'todos' | TimelineCategory;
type Side = 'left' | 'right';
const DECADES: Decade[] = ['2020s', '2010s', '2000s', '1990s'];

/**
 * "El programa" — Trayectoria, la línea de tiempo completa. Rediseñada
 * 2026-09-04 a pedido explícito del usuario: antes cada década era un
 * acordeón con la lista de hitos apilada en una sola columna de texto — acá
 * es una **espina vertebral** de verdad, de 1990 al presente, con los hitos
 * alternando a la izquierda y a la derecha de la línea y, cuando hay una
 * foto real disponible, la foto sale junto al hito.
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
    // .reverse() sobre una copia: hito más reciente primero dentro de cada
    // década, para que toda la espina lea "desde hoy para atrás" — pedido
    // explícito del usuario (antes era ascendente, 1990s arriba).
    const filtered = trayectoria.items
      .filter((i) => filter === 'todos' || i.category === filter)
      .slice()
      .reverse();
    return DECADES.map((decade) => ({
      decade,
      items: filtered.filter((i) => i.decade === decade),
    })).filter((g) => g.items.length > 0);
  }, [trayectoria.items, filter]);

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
                      {decade}
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
                <Picture
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  sizes="(min-width: 768px) 8rem, 30vw"
                  loading="lazy"
                  decoding="async"
                  pictureClassName="block"
                  className={cn(
                    'aspect-[3/4] w-20 border-[3px] border-cream/15 object-cover sm:w-24',
                    i % 2 === 0 ? '-rotate-2' : 'rotate-2'
                  )}
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
