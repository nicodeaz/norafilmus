import { useMemo, useState } from 'react';
import type { ArchiveItem } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import Picture from './Picture';
import Reveal from './Reveal';

type FilterKey = 'todos' | ArchiveItem['pillar'];

/**
 * Archivo (F8) — ruta `/archivo`, 2026-08-28. Galería curada y filtrable por
 * pilar, consolidando material que no vive en ninguna otra página (mismo
 * criterio que ya usan Crear/Producir entre sí: nunca repetir un archivo que
 * ya muestra otra sección — ver `content.ts` → `ARCHIVO_ES`/`ARCHIVO_EN`).
 *
 * El filtro reusa el patrón de texto subrayado de `Trayectoria.tsx` en vez
 * de pills — es el mismo dispositivo, no uno nuevo que aprender. `Enseñar`
 * puede dar 0 resultados a propósito (regla 4: no hay material de docencia
 * con adultos únicamente y crédito confirmado todavía) — en vez de un grid
 * vacío silencioso, ese caso muestra `archivo.emptyEnsenar` explicando por
 * qué, igual que el Acto II resuelve la misma restricción con el "12" en
 * vez de esconder el hueco.
 */
export default function Archivo() {
  const { t } = useLanguage();
  const { archivo } = t;
  const [filter, setFilter] = useState<FilterKey>('todos');

  const filters: { key: FilterKey; label: string }[] = [
    { key: 'todos', label: archivo.filterAll },
    { key: 'crear', label: archivo.filterCrear },
    { key: 'ensenar', label: archivo.filterEnsenar },
    { key: 'producir', label: archivo.filterProducir },
  ];

  const items = useMemo(
    () => archivo.items.filter((i) => filter === 'todos' || i.pillar === filter),
    [archivo.items, filter]
  );

  return (
    <section className="relative w-full overflow-hidden bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <Reveal as="div" className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {archivo.eyebrow}
          </span>
        </Reveal>

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-4 text-display-l font-display uppercase leading-[0.95] text-cream"
        >
          {archivo.titleLead} <span className="text-brand-red">{archivo.titleAccent}</span>
        </Reveal>

        <Reveal as="p" delay={0.15} className="mt-6 max-w-[60ch] text-body font-body leading-relaxed text-cream/80">
          {archivo.body}
        </Reveal>

        <Reveal as="div" delay={0.2} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={cn(
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

        {items.length === 0 ? (
          <Reveal
            as="p"
            delay={0.25}
            className="mt-16 max-w-[50ch] border border-cream/10 bg-cream/[0.03] p-8 font-label text-sm leading-relaxed text-cream/50"
          >
            {archivo.emptyEnsenar}
          </Reveal>
        ) : (
          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
            {items.map((item, i) => (
              <Reveal
                key={item.src}
                as="figure"
                delay={0.04 * i}
                className={i % 3 === 1 ? 'sm:mt-10' : undefined}
              >
                <Picture
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 640px) 30vw, 45vw"
                  pictureClassName="block"
                  className="aspect-[3/4] w-full object-cover"
                />
                <figcaption className="mt-2 font-label text-[10px] uppercase leading-snug tracking-[0.1em] text-cream/50">
                  <span className="block text-cream/70">
                    {item.work} · {item.years}
                  </span>
                  <span className="block text-brand-red">{item.role}</span>
                  <span className="block text-cream/25">Foto: {item.credit}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
