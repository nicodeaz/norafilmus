import { useState } from 'react';
import type { Credit } from '@/src/i18n/content';
import { cn } from '@/lib/utils';
import Picture from './Picture';

/** i, ii, iii... — alcanza con lo que mide una lista de créditos real (nunca más de ~6). */
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];

export type CreditListVariant = 'cast' | 'notebook' | 'dossier';

/**
 * Marcador de índice por variante — Fase 3 (2026-08-28), diferenciación
 * visual real entre Actos. Sin fuentes nuevas ni cambios de paleta: cada
 * variante reusa un token tipográfico que el sitio ya carga.
 *
 * - `cast` (Crear, default): números romanos en itálica — el "programa de
 *   sala" original, sin cambios.
 * - `notebook` (Enseñar): el mismo índice pero en `font-signature`
 *   (manuscrita) — lee como una anotación a mano, coherente con el "cuaderno
 *   de trabajo" que es el Acto II.
 * - `dossier` (Producir): número arábigo con cero a la izquierda entre
 *   corchetes, en `font-mono` (la stack monoespacio del sistema, no una
 *   fuente nueva) — lee como planilla/expediente de producción.
 */
function IndexMarker({ index, variant }: { index: number; variant: CreditListVariant }) {
  if (variant === 'dossier') {
    return (
      <span className="font-mono text-[11px] tabular-nums tracking-tight text-cream/50">
        [{String(index + 1).padStart(2, '0')}]
      </span>
    );
  }
  if (variant === 'notebook') {
    return (
      <span className="font-signature text-lg leading-none text-cream/50">
        {ROMAN[index] ?? index + 1}.
      </span>
    );
  }
  return <span className="font-body italic text-cream/50">{ROMAN[index] ?? index + 1}.</span>;
}

/**
 * Identidad de un crédito. **No alcanza con `work`**: `ensenar.coordCredits`
 * tiene tres entradas llamadas "Programa Adolescencia" (una por institución),
 * así que usar el nombre como key hacía que React tirara `same key` en cada
 * carga y que un click abriera los tres paneles a la vez (auditoría E1/H1).
 * `work + years` sí es único y, a diferencia del índice, sobrevive a un
 * reordenamiento de la lista en `content.ts`.
 */
const creditId = (c: Credit) => `${c.work}::${c.years}`;

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
export default function CreditList({
  title,
  items,
  variant = 'cast',
}: {
  title: string;
  items: Credit[];
  variant?: CreditListVariant;
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <h3 className="font-label text-label uppercase tracking-[0.2em] text-brand-red">{title}</h3>
      <ul className="mt-4 flex flex-col">
        {items.map((c, i) => {
          const id = creditId(c);
          const isOpen = openId === id;
          return (
            <li key={id} className="border-t border-cream/10 last:border-b">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : id)}
                aria-expanded={isOpen}
                className="flex min-h-11 w-full items-baseline gap-3 py-3 text-left"
              >
                <IndexMarker index={i} variant={variant} />
                <span
                  className={cn(
                    'font-body transition-colors duration-300',
                    isOpen ? 'text-brand-red' : 'text-cream'
                  )}
                >
                  {c.work}
                </span>
                <span className="ml-auto shrink-0 font-label text-xs text-cream/50">{c.years}</span>
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
                      <p className="mt-1 font-label text-[10px] text-cream/50">Foto: {c.image.credit}</p>
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
