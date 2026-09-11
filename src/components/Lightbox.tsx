import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLanguage } from '@/src/i18n/LanguageContext';
import Picture from './Picture';

export interface LightboxImage {
  src: string;
  alt: string;
  /** Pie visible bajo la foto ampliada — normalmente el nombre de la obra/crédito. */
  label?: string;
}

interface LightboxState {
  images: LightboxImage[];
  index: number;
}

interface LightboxContextValue {
  open: (images: LightboxImage[], index?: number) => void;
}

const LightboxContext = createContext<LightboxContextValue | null>(null);

/** Cualquier componente que muestre una foto real llama a esto para poder ampliarla. */
export function useLightbox(): LightboxContextValue {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox debe usarse dentro de <LightboxProvider>');
  return ctx;
}

/**
 * Lightbox global (2026-09-06) — pedido explícito del usuario: "cada foto
 * que se vea en el sitio se pueda ampliar". Antes esto vivía solo dentro de
 * `Presente.tsx` (borrado 2026-09-04, ver git history) como estado local de
 * esa sección. El pedido ahora toca demasiados componentes (`Act`,
 * `CreditList`, `Trayectoria`) para que cada uno reimplemente su propio modal
 * con foco atrapado — se saca el mecanismo tal cual (foco al abrir, Tab
 * atrapado, Escape/flechas, scroll del body bloqueado, mismo look) a un
 * contexto compartido, montado una sola vez en `SiteLayout`. Cualquier
 * componente pide abrirlo con `useLightbox().open(imágenes, índice)`.
 *
 * Montado en `SiteLayout` (no dentro de una página) a propósito: `position:
 * fixed` necesita que ningún ancestro tenga `transform` (rompería su
 * containing block, mismo tipo de gotcha que ya documenta `Trayectoria` para
 * `position: sticky`) — `SiteLayout` es la raíz del árbol de rutas, sin
 * ningún `motion.div` animado por encima.
 */
export function LightboxProvider({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  const [state, setState] = useState<LightboxState | null>(null);
  const reduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);

  const openLightbox = (images: LightboxImage[], index = 0) => setState({ images, index });
  const close = () => setState(null);
  const step = (delta: number) =>
    setState((s) => (s ? { ...s, index: (s.index + delta + s.images.length) % s.images.length } : s));

  const current = state ? state.images[state.index] : null;

  // Mismo mecanismo de foco que tenía el lightbox de `Presente` (F9): mueve
  // el foco adentro al abrir y atrapa Tab/Shift+Tab entre cerrar/anterior/
  // siguiente — sin esto, un usuario de teclado seguía tabulando por la
  // página de atrás (tapada pero no `inert`).
  useEffect(() => {
    if (!state) return;
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
  }, [state?.index, Boolean(state)]);

  return (
    <LightboxContext.Provider value={{ open: openLightbox }}>
      {children}
      <AnimatePresence>
        {state && current && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={current.label ?? current.alt}
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
              aria-label={t.lightbox.close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center text-cream/60 transition-colors duration-300 hover:text-brand-red sm:right-8 sm:top-8"
            >
              <X className="h-6 w-6" />
            </button>

            {state.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    step(-1);
                  }}
                  aria-label={t.lightbox.previous}
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
                  aria-label={t.lightbox.next}
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
              {current.label && (
                <figcaption className="mt-4 font-label text-xs uppercase tracking-[0.2em] text-cream/50">
                  {current.label}
                </figcaption>
              )}
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </LightboxContext.Provider>
  );
}
