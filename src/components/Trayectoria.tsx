import { useMemo, useState } from 'react';
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
 */
export default function Trayectoria() {
  const { t } = useLanguage();
  const { trayectoria } = t;
  const [filter, setFilter] = useState<FilterKey>('todos');
  const [openDecade, setOpenDecade] = useState<Decade | null>(null);

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
    <section id="trayectoria" className="relative w-full overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 md:px-12">
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
                'border-b-2 pb-1 font-label text-xs uppercase tracking-[0.15em] transition-colors duration-300',
                filter === key
                  ? 'border-brand-red text-brand-red'
                  : 'border-transparent text-cream/50 hover:text-cream'
              )}
            >
              {label}
            </button>
          ))}
        </Reveal>

        {/* La espina: una línea vertical continua que atraviesa las décadas */}
        <Reveal as="div" delay={0.25} className="relative mt-16 pl-8 md:pl-14">
          <div className="absolute inset-y-0 left-0 w-px bg-cream/15 md:left-1" aria-hidden />

          {groups.map(({ decade, items }, gi) => {
            const isOpen = openDecade === decade;
            return (
              <div key={decade} className={cn('relative', gi !== 0 && 'mt-14')}>
                <span
                  aria-hidden
                  className="absolute -left-8 top-2 h-2 w-2 rounded-full bg-brand-red md:-left-14"
                />
                <button
                  type="button"
                  onClick={() => setOpenDecade(isOpen ? null : decade)}
                  aria-expanded={isOpen}
                  className="flex items-baseline gap-4 text-left"
                >
                  <span className="font-display text-4xl uppercase leading-none text-cream sm:text-5xl">
                    {decade}
                  </span>
                  <span className="font-label text-xs text-cream/40">
                    {items.length}
                  </span>
                  <span className="font-label text-xs uppercase tracking-[0.1em] text-brand-red">
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
        </Reveal>
      </div>
    </section>
  );
}
