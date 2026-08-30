import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Picture from './Picture';
import Reveal from './Reveal';

/**
 * Presente (F6, 2026-08-19) — cierra el arco de "El Programa" con el work
 * más reciente, después de Trayectoria (que termina en el presente pero solo
 * en texto) y antes del Footer. Como Trayectoria, no es uno de los tres
 * Actos: sin numeral, sin foto ancla única — acá la foto ES el contenido.
 *
 * Las fotos son de la sesión de estudio de Nora (2026-03-08, fotógrafa
 * Paula — la misma del retrato del Hero, ver `hero.portraitCredit`), cuatro
 * de cada registro: book de estudio, clown, editorial (ampliado de dos a
 * cuatro por registro el 2026-08-30, a pedido del usuario de mostrar más
 * material de la misma sesión). El crédito va una sola vez para toda la
 * sección (`presente.credit`) en vez de repetirse por ítem, porque todas
 * comparten fotógrafa y fecha — a diferencia del archivo de `AboutMe`,
 * donde cada pieza es de una obra y un fotógrafo distintos.
 *
 * La grilla usa un offset vertical por columna (`i % 3`) en vez de filas
 * parejas: da una pared de fotos tipo contact sheet, no un grid genérico de
 * 3×2. Mismo criterio de asimetría que ya usan `Act` (numeral que sangra) y
 * `Trayectoria` (espina de ancho completo) — evita la cuarta sección
 * centrada y simétrica seguida.
 *
 * Fase 5 (2026-08-28) — lightbox al clickear una foto: en la grilla se ven
 * recortadas a `aspect-[3/4] object-cover`, sin forma de verlas enteras. Es
 * la pieza que las tres IAs pidieron para que Presente se sienta menos
 * "galería" y más "mirá esto de cerca" — con navegación ←/→ entre las seis,
 * no solo abrir/cerrar una por una.
 */
export default function Presente() {
  const { t } = useLanguage();
  const { presente } = t;
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const isOpen = openIndex !== null;
  const current = isOpen ? presente.items[openIndex] : null;
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = () => setOpenIndex(null);
  const step = (delta: number) =>
    setOpenIndex((i) => (i === null ? i : (i + delta + presente.items.length) % presente.items.length));

  // F9 (pulido, teclado/lector de pantalla): sin esto, un usuario de teclado
  // que abre el lightbox con Enter/Espacio seguía tabulando por la grilla de
  // atrás (tapada por el overlay pero no `inert`) en vez de moverse entre
  // cerrar/anterior/siguiente. Mueve el foco adentro al abrir y atrapa el Tab
  // mientras está abierto — al cerrar, el foco vuelve solo al botón que lo
  // abrió porque nunca se le sacó el foco del DOM.
  useEffect(() => {
    if (!isOpen) return;
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, openIndex]);

  return (
    <section id="presente" className="relative w-full overflow-hidden bg-ink py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <Reveal as="div" className="flex items-center gap-3">
          <span className="h-px w-8 bg-brand-red" aria-hidden />
          <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
            {presente.eyebrow}
          </span>
        </Reveal>

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-4 text-display-l font-display uppercase leading-[0.95] text-cream"
        >
          {presente.titleLead} <span className="text-brand-red">{presente.titleAccent}</span>
        </Reveal>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <Reveal as="p" delay={0.15} className="max-w-[60ch] text-body font-body leading-relaxed text-cream/80">
            {presente.body}
          </Reveal>
          <Reveal as="p" delay={0.2} className="shrink-0 font-label text-xs uppercase tracking-[0.15em] text-cream/50">
            {presente.credit}
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {presente.items.map((item, i) => (
            <Reveal
              key={item.src}
              as="figure"
              delay={0.05 * i}
              className={i % 3 === 1 ? 'sm:-mt-10' : i % 3 === 2 ? 'sm:mt-10' : undefined}
            >
              {/* `group` para el overlay de abajo — mismo dispositivo que
                  pedían las tres IAs consultadas ("hover: VIEW") pero sin
                  cursor custom: un overlay fijo es más robusto (funciona
                  igual en touch/focus-visible, sin trackear mouse). */}
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="group relative block w-full overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              >
                <Picture
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                  sizes="(min-width: 640px) 30vw, 45vw"
                  pictureClassName="block"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-ink/50 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="flex items-center gap-2 rounded-full border border-cream/30 bg-ink/60 px-4 py-2 font-label text-[10px] uppercase tracking-[0.2em] text-cream">
                    <Eye className="h-3.5 w-3.5" />
                    {presente.view}
                  </span>
                </span>
              </button>
              <figcaption className="mt-2 font-label text-[10px] uppercase tracking-[0.15em] text-cream/50">
                {item.label}
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && current && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0.15 : 0.25 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/95 p-6 backdrop-blur-sm"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label={presente.close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red sm:right-8 sm:top-8"
            >
              <X className="h-6 w-6" />
            </button>

            {presente.items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={presente.previous}
                  className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red sm:left-6"
                >
                  <ChevronLeft className="h-7 w-7" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(1);
                  }}
                  aria-label={presente.next}
                  className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red sm:right-6"
                >
                  <ChevronRight className="h-7 w-7" />
                </button>
              </>
            )}

            <motion.figure
              key={current.src}
              initial={reduced ? undefined : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: reduced ? 0.15 : 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full max-w-full flex-col items-center"
            >
              <Picture
                src={current.src}
                alt={current.alt}
                sizes="90vw"
                pictureClassName="block max-h-[80vh]"
                className="max-h-[80vh] w-auto max-w-[90vw] rounded object-contain"
              />
              <figcaption className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-cream/50">
                {current.label}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
