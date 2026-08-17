import { useMemo, useState } from 'react';
import type { TimelineCategory } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';
import Section from './Section';

type FilterKey = 'todos' | TimelineCategory;

/**
 * `#trayectoria` — SUPERPROMPT.md §6, F5. A diferencia de Crear/Enseñar/
 * Producir (selecciones curadas por pilar), acá se consolidan los 4 CVs en
 * una sola cronología 1990→2026, filtrable por disciplina. Varios hitos ya
 * aparecen en las secciones de pilar (ej. Rapiña en Crear, Los golpes de
 * Clara en Producir) — es intencional, esta es la vista completa, no una
 * versión resumida de las otras.
 *
 * El filtro es puramente client-side (sin animación de entrada/salida por
 * ítem): con ~34 hitos no hace falta más que ocultar/mostrar, y así no hay
 * nada que gatear detrás de `prefers-reduced-motion`.
 */
export default function Trayectoria() {
  const { t } = useLanguage();
  const { trayectoria } = t;
  const [filter, setFilter] = useState<FilterKey>('todos');

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'todos', label: trayectoria.filterAll },
    { key: 'actuacion', label: trayectoria.filterActing },
    { key: 'docencia', label: trayectoria.filterTeaching },
    { key: 'produccion', label: trayectoria.filterProducing },
    { key: 'formacion', label: trayectoria.filterTraining },
  ];

  const items = useMemo(
    () => trayectoria.items.filter((i) => filter === 'todos' || i.category === filter),
    [trayectoria.items, filter]
  );

  return (
    <Section
      id="trayectoria"
      eyebrow={trayectoria.eyebrow}
      titleLead={trayectoria.titleLead}
      titleAccent={trayectoria.titleAccent}
      body={<p>{trayectoria.body}</p>}
    >
      <Reveal as="div" delay={0.1} className="flex flex-wrap gap-2">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={cn(
              'rounded-full border px-4 py-1.5 font-label text-xs uppercase tracking-[0.1em] transition-colors duration-300',
              filter === key
                ? 'border-brand-red bg-brand-red/10 text-brand-red'
                : 'border-cream/15 text-cream/50 hover:border-cream/30 hover:text-cream'
            )}
          >
            {label}
          </button>
        ))}
      </Reveal>

      <Reveal as="ul" delay={0.2} className="mt-10 flex flex-col">
        {items.map((item, i) => (
          <li
            key={`${item.year}-${item.title}`}
            className={cn(
              'grid grid-cols-[5.5rem_1fr] gap-4 py-4 sm:grid-cols-[7rem_1fr]',
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
      </Reveal>
    </Section>
  );
}
