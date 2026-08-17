import { useState } from 'react';
import type { Credit } from '@/src/i18n/content';
import { cn } from '@/lib/utils';
import Picture from './Picture';

/** i, ii, iii... — alcanza con lo que mide una lista de créditos real (nunca más de ~6). */
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];

/**
 * Lista de créditos con formato de "cast list" de programa de teatro —
 * redirección de dirección artística post-F5 (ver informe en el chat).
 * La versión anterior (chevron + pill redondeada) leía como un acordeón de
 * FAQ genérico; esta usa el mismo índice tipográfico que un programa real
 * (i., ii., iii.) en itálica y una regla roja que aparece al abrir, en vez
 * de un ícono de flecha.
 *
 * Colapsado: índice + título + año. Expandido: detalle y, si ese crédito
 * puntual tiene `image`, su propia foto — nunca una imagen fija de toda la
 * sección (eso repetía con el mosaico del Hero). Todo arranca cerrado.
 */
export default function CreditList({ title, items }: { title: string; items: Credit[] }) {
  const [openWork, setOpenWork] = useState<string | null>(null);

  return (
    <div>
      <h3 className="font-label text-label uppercase tracking-[0.2em] text-brand-red">{title}</h3>
      <ul className="mt-4 flex flex-col">
        {items.map((c, i) => {
          const isOpen = openWork === c.work;
          return (
            <li key={c.work} className="border-t border-cream/10 last:border-b">
              <button
                type="button"
                onClick={() => setOpenWork(isOpen ? null : c.work)}
                aria-expanded={isOpen}
                className="flex w-full items-baseline gap-3 py-3 text-left"
              >
                <span className="font-body italic text-cream/35">{ROMAN[i] ?? i + 1}.</span>
                <span
                  className={cn(
                    'font-body transition-colors duration-300',
                    isOpen ? 'text-brand-red' : 'text-cream'
                  )}
                >
                  {c.work}
                </span>
                <span className="ml-auto shrink-0 font-label text-xs text-cream/40">{c.years}</span>
              </button>

              {/* Grid-rows trick: anima alto sin medir con JS; con
                  prefers-reduced-motion el corte es instantáneo. */}
              <div
                className={cn(
                  'grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <div className="ml-6 border-l-2 border-brand-red/60 pb-4 pl-4">
                    {c.image && (
                      <Picture
                        src={c.image.src}
                        alt={c.image.alt}
                        sizes="(min-width: 768px) 20rem, 80vw"
                        loading="lazy"
                        decoding="async"
                        className="mb-3 w-full max-w-[14rem] rounded object-cover"
                      />
                    )}
                    <p className="font-label text-xs leading-relaxed text-cream/50">{c.detail}</p>
                    {c.image && (
                      <p className="mt-1 font-label text-[10px] text-cream/30">Foto: {c.image.credit}</p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
