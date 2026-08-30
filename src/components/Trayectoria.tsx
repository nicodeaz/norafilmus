import { useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import type { Decade, TimelineCategory } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

type FilterKey = 'todos' | TimelineCategory;
const DECADES: Decade[] = ['1990s', '2000s', '2010s', '2020s'];

/**
 * "El programa" — Trayectoria, la línea de tiempo completa. Redirección de
 * dirección artística post-F5 (ver informe de dirección creativa en el
 * chat): la versión anterior agrupaba por década en acordeones que leían
 * como un FAQ. Acá es una espina vertical — una sola línea roja continua
 * que atraviesa las cuatro décadas, con cada una como una parada sobre esa
 * línea en vez de una fila de acordeón genérica.
 *
 * No es uno de los tres Actos (no tiene numeral romano ni foto): es el
 * archivo completo, consolida los 4 CVs — varios hitos ya aparecen en
 * Crear/Enseñar/Producir (selecciones curadas), acá está todo junto.
 *
 * Los filtros de categoría dejaron de ser pills redondeadas (ese patrón se
 * repetía demasiado en el sitio) y pasaron a ser texto subrayado, más cerca
 * de una tabla de contenidos que de un control de formulario.
 *
 * Fase 4 (2026-08-28) — la pieza "frame por frame" que las tres IAs
 * consultadas en la auditoría de Fase 1 señalaron como la mayor oportunidad
 * del sitio. Sin canvas image-sequence (no hay 20-60 fotos de una misma
 * escena para animar cuadro a cuadro — inventar esa secuencia habría violado
 * la regla 1 de `content.ts`, "todo dato es verificable"): en cambio, la
 * espina y el encabezado de década responden de verdad al scroll con datos
 * reales, con la misma técnica ya validada en `ScrollProgress.tsx`
 * (`useScroll` → `MotionValue`, animado en el compositor, sin re-render de
 * React por tick de scroll).
 *
 * 1. **La espina se llena.** Una segunda línea roja, con `scaleY` atado a
 *    `scrollYProgress` del contenedor de décadas, se dibuja encima de la
 *    línea de fondo a medida que se scrollea la sección — el "avance
 *    mecánico por el tiempo" que pedían las tres auditorías, sin inventar
 *    material fotográfico.
 * 2. **El encabezado de década que está abierto queda `sticky`.** Como
 *    `openDecade` es de a una (accordion, no multi-expand), esto alcanza
 *    para dar el efecto "el año cambia mientras scrolleás" sin un segundo
 *    mecanismo de tracking: la década pinneada en pantalla ES la actual.
 */
export default function Trayectoria() {
  const { t } = useLanguage();
  const { trayectoria } = t;
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [openDecade, setOpenDecade] = useState<Decade | null>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: spineProgress } = useScroll({
    target: spineRef,
    offset: ['start 0.75', 'end 0.25'],
  });

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
      items: filtered.filter((i) => i.decade === decade),
    })).filter((g) => g.items.length > 0);
  }, [trayectoria.items, filter]);

  return (
    // Sin `overflow-hidden` a propósito (Fase 4): a diferencia de `Act.tsx`
    // (que lo usa para recortar el óvalo de luz que sangra fuera de la
    // sección), acá nada bleedea — y `overflow` != `visible` en cualquier
    // ancestro rompe `position: sticky` de sus descendientes en Chrome (se
    // confirmó con getComputedStyle: el botón medía `position: sticky` pero
    // su rect seguía scrolleando normal, sin pinnearse). Con esto puesto el
    // encabezado de década no se quedaba nunca arriba.
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

        {/* La espina: una línea vertical continua que atraviesa las décadas.
            Sin `Reveal` acá a propósito (Fase 4): `Reveal` es un `motion.div`
            que deja un `transform` inline puesto incluso en reposo, y
            `transform` en cualquier ancestro rompe `position: sticky` de sus
            descendientes (el encabezado de década dejaba de pinnearse — se
            probó con `Reveal` puesto y el sticky no hacía nada). El resto de
            la sección (eyebrow/título/filtros arriba) sigue con `Reveal`, acá
            no hay más entradas individuales que animar de todos modos. */}
        <div className="relative mt-16 pl-8 md:pl-14">
          <div ref={spineRef} className="relative">
            <div className="absolute inset-y-0 left-0 w-px bg-cream/15 md:left-1" aria-hidden />
            {!reduced && (
              <motion.div
                aria-hidden
                style={{ scaleY: spineProgress }}
                className="absolute inset-y-0 left-0 w-px origin-top bg-brand-red md:left-1"
              />
            )}

            {groups.map(({ decade, items }, gi) => {
            const isOpen = openDecade === decade;
            return (
              <div key={decade} className={cn('relative', gi !== 0 && 'mt-14')}>
                <span
                  aria-hidden
                  className="absolute -left-8 top-2 h-2 w-2 rounded-full bg-brand-red md:-left-14"
                />
                {/* La fila ocupa el ancho completo, con la cuenta y el signo
                    empujados al borde derecho por una hairline: antes el botón
                    medía solo lo que medía el texto y dejaba el 65 % derecho de
                    la sección en negro — el peor tramo muerto del sitio una vez
                    resueltos los actos. Mismo dispositivo que usan las costuras.

                    `sticky top-16 bg-ink` (Fase 4): mientras se scrollea una
                    década abierta (2010s/2020s tienen 16 ítems cada una), su
                    encabezado queda pinneado bajo el Header en vez de
                    desaparecer arriba del viewport — es la "década actual"
                    sin un segundo mecanismo de tracking por scroll. */}
                <button
                  type="button"
                  onClick={() => setOpenDecade(isOpen ? null : decade)}
                  aria-expanded={isOpen}
                  className="sticky top-16 z-10 flex min-h-11 w-full items-baseline gap-4 bg-ink text-left"
                >
                  <span className="font-display text-4xl uppercase leading-none text-cream sm:text-5xl">
                    {decade}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'mb-2 h-px flex-grow transition-colors duration-300',
                      isOpen ? 'bg-brand-red/50' : 'bg-cream/15'
                    )}
                  />
                  <span className="shrink-0 font-label text-xs text-cream/40">{items.length}</span>
                  <span className="w-3 shrink-0 text-right font-label text-xs uppercase tracking-[0.1em] text-brand-red">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <div
                  className={cn(
                    'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none',
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  )}
                >
                  <div className="overflow-hidden">
                    <ul className="mt-6 flex flex-col">
                      {items.map((item, i) => (
                        <li
                          key={`${item.year}-${item.title}`}
                          className={cn(
                            'grid grid-cols-[5.5rem_1fr] gap-4 py-3 sm:grid-cols-[7rem_1fr]',
                            i !== 0 && 'border-t border-cream/10'
                          )}
                        >
                          <span className="font-label text-xs text-brand-red">{item.year}</span>
                          <div className="min-w-0">
                            <p className="font-body text-cream">{item.title}</p>
                            <p className="mt-0.5 font-label text-xs text-cream/50">{item.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
