import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Image as ImageIcon, Play } from 'lucide-react';
import type { Credit } from '@/src/i18n/content';
import { useLanguage } from '@/src/i18n/LanguageContext';
import { cn } from '@/lib/utils';
import Picture from './Picture';
import { useLightbox } from './Lightbox';

/**
 * Numeral romano en minúscula, sin tope — la lista de teatro de `Crear` ya
 * pasó las 8 entradas que cubría el lookup fijo que había acá antes (9., 10.,
 * 11. caían a arábigo plano, rompiendo el dispositivo de "programa de sala"
 * a mitad de lista). Alcanza hasta miles, muy por encima de cualquier lista
 * de créditos real.
 */
function toRoman(num: number): string {
  const VALUES: [number, string][] = [
    [1000, 'm'], [900, 'cm'], [500, 'd'], [400, 'cd'],
    [100, 'c'], [90, 'xc'], [50, 'l'], [40, 'xl'],
    [10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i'],
  ];
  let n = num;
  let out = '';
  for (const [value, symbol] of VALUES) {
    while (n >= value) {
      out += symbol;
      n -= value;
    }
  }
  return out;
}

export type CreditListVariant = 'cast' | 'notebook' | 'dossier';

/**
 * Marcador de índice por variante — Fase 3 (2026-08-28), diferenciación
 * visual real entre Actos. Sin fuentes nuevas ni cambios de paleta: cada
 * variante reusa un token tipográfico que el sitio ya carga.
 *
 * - `cast` (Crear, default): números romanos en itálica — el "programa de
 *   sala" original, sin cambios.
 * - `notebook` (Enseñar): el mismo índice en serif itálica — lee como una
 *   anotación editorial, coherente con el "cuaderno de trabajo" sin reutilizar
 *   la fuente de firma fuera de la marca.
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
      <span className="font-body text-lg italic leading-none text-cream/50">
        {toRoman(index + 1)}.
      </span>
    );
  }
  return <span className="font-body italic text-cream/50">{toRoman(index + 1)}.</span>;
}

/**
 * Identidad de un crédito. **No alcanza con `work`**: `ensenar.coordCredits`
 * tiene tres entradas llamadas "Programa Adolescencia" (una por institución),
 * así que usar el nombre como key hacía que React tirara `same key` en cada
 * carga y que un click abriera los tres paneles a la vez (auditoría E1/H1).
 * `work + years` sí es único y, a diferencia del índice, sobrevive a un
 * reordenamiento de la lista en `content.ts`.
 *
 * Exportado (2026-09-06): `GALLERY_ES`/`GALLERY_EN` en `content.ts` arman el
 * `href` del slider de `AboutMe` con este mismo formato (`work::years`,
 * codificado), y este componente lee `location.hash` para abrir y scrollear
 * al crédito que matchea al aterrizar — ver el `useEffect` más abajo.
 */
export const creditId = (c: Credit) => `${c.work}::${c.years}`;

/**
 * Lista de créditos con formato de "cast list" de programa de teatro —
 * redirección de dirección artística post-F5 (ver informe en el chat).
 * La versión anterior (chevron + pill redondeada) leía como un acordeón de
 * FAQ genérico; esta usa el mismo índice tipográfico que un programa real
 * (i., ii., iii.) en itálica y una regla roja que aparece al abrir, en vez
 * de un ícono de flecha.
 *
 * Colapsado: índice + título + año. Expandido: detalle y, si ese crédito
 * puntual tiene `images`, sus propias fotos — nunca una imagen fija de toda
 * la sección (eso repetía con el mosaico del Hero). La mayoría de los
 * créditos con material trae una sola; un puñado (Rapiña, ¡Mujeres a la
 * obra!, Los golpes de Clara) trae varias — 2026-09-04, a pedido del
 * usuario de mostrar más fotos de una obra **pegadas a su crédito**, no en
 * una galería aparte al pie del Acto (así queda inequívoco de qué obra es
 * cada una). Todo arranca cerrado.
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
  const { t } = useLanguage();
  const { open: openLightbox } = useLightbox();
  const location = useLocation();
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});

  // Deep-link desde el slider de `AboutMe` (2026-09-06): si el hash matchea
  // un crédito DE ESTA lista puntual, lo abre y le hace scroll. Corre en
  // cada cambio de hash/idioma — si el idioma cambia con el hash puesto y el
  // crédito tradujo su `work` (solo Pizarn-i-kett), simplemente no matchea
  // más y no pasa nada, no rompe.
  useEffect(() => {
    if (!location.hash) return;
    const targetId = decodeURIComponent(location.hash.slice(1));
    const match = items.find((c) => creditId(c) === targetId);
    if (!match) return;
    setOpenId(targetId);
    requestAnimationFrame(() => {
      itemRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [location.hash, items]);

  return (
    <div>
      <h3 className="font-label text-label uppercase tracking-[0.2em] text-brand-red">{title}</h3>
      <ul className="mt-4 flex flex-col">
        {items.map((c, i) => {
          const id = creditId(c);
          const isOpen = openId === id;
          const hasImages = Boolean(c.images?.length);
          return (
            <li
              key={id}
              ref={(el) => {
                itemRefs.current[id] = el;
              }}
              className="border-t border-cream/10 last:border-b"
            >
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
                {(hasImages || c.video) && (
                  <span
                    aria-hidden
                    className="flex shrink-0 items-center gap-1 text-brand-red/80"
                  >
                    {hasImages && <ImageIcon className="h-3.5 w-3.5" />}
                    {c.video && <Play className="h-3.5 w-3.5" />}
                  </span>
                )}
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
                    {/* Cualquier foto del sitio se puede ampliar (2026-09-06,
                        pedido explícito del usuario) — el botón abre el
                        lightbox global con TODAS las fotos de este crédito
                        puntual, así ←/→ navega entre ellas sin salir del
                        crédito. */}
                    {c.images?.length === 1 && (
                      <button
                        type="button"
                        onClick={() =>
                          openLightbox(
                            c.images!.map((img) => ({ src: img.src, alt: img.alt, label: c.work })),
                            0
                          )
                        }
                        className="mb-3 block w-full max-w-[14rem] outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                      >
                        <Picture
                          src={c.images[0].src}
                          alt={c.images[0].alt}
                          sizes="(min-width: 768px) 20rem, 80vw"
                          loading="lazy"
                          decoding="async"
                          className="w-full rounded object-cover transition-opacity duration-300 hover:opacity-80"
                        />
                      </button>
                    )}
                    {c.images && c.images.length > 1 && (
                      <div className="mb-3 grid max-w-md grid-cols-3 gap-1.5">
                        {c.images.map((img, imgIndex) => (
                          <button
                            key={img.src}
                            type="button"
                            onClick={() =>
                              openLightbox(
                                c.images!.map((im) => ({ src: im.src, alt: im.alt, label: c.work })),
                                imgIndex
                              )
                            }
                            className="outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                          >
                            <Picture
                              src={img.src}
                              alt={img.alt}
                              sizes="120px"
                              loading="lazy"
                              decoding="async"
                              className="aspect-[3/4] w-full rounded object-cover transition-opacity duration-300 hover:opacity-80"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="font-label text-xs leading-relaxed text-cream/50">{c.detail}</p>
                    {c.images && c.images.length > 0 && (
                      <p className="mt-1 font-label text-[10px] text-cream/50">Foto: {c.images[0].credit}</p>
                    )}
                    {c.video && (
                      <a
                        href={c.video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex min-h-11 items-center gap-2 font-label text-xs uppercase tracking-[0.15em] text-cream/70 underline decoration-brand-red/60 underline-offset-4 transition-colors hover:text-brand-red"
                      >
                        <Play className="h-3.5 w-3.5" aria-hidden="true" />
                        {t.creditVideo.watch}
                      </a>
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
