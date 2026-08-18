import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Cuánto dura la cortina antes de salir sola, en ms. */
const HOLD_MS = 900;
/** Clave de sesión: la obertura corre una vez por pestaña, no en cada navegación. */
const SEEN_KEY = 'nora-obertura-vista';

interface PreloaderProps {
  /** Se dispara cuando terminó de salir (no cuando termina el hold). */
  onComplete?: () => void;
}

/**
 * **La obertura** — reemplaza al preloader anterior (2026-08-18).
 *
 * El anterior era una cortina que encadenaba saludos en seis idiomas y salía
 * con un borde curvo. Se cambió por pedido del usuario ("completamente
 * diferente") y porque la auditoría lo había medido (hallazgo H14): costaba
 * **3,5 s en cada carga** (900 + 6×150 + 600 de palabras, +300 de delay +800
 * de salida), no se podía saltar, no recordaba la visita previa y corría
 * también sobre el 404. Con la prioridad puesta en "impresionar en 15
 * segundos", esos 3,5 s eran el 23 % del presupuesto de atención gastado en
 * una cortina.
 *
 * Ahora es una obertura de teatro, y cambia en las cuatro cosas que importan:
 *
 * 1. **Dura ~1,2 s** en vez de 3,5 (`HOLD_MS` + la salida).
 * 2. **Se saltea con cualquier tecla, click o scroll** — nadie queda preso.
 * 3. **Corre una vez por pestaña** (`sessionStorage`): quien vuelve al home
 *    desde otra vista no vuelve a pagar el peaje.
 * 4. **Sale desde el centro hacia los bordes**, como se abre un telón, en vez
 *    de barrer hacia arriba: dos hojas que se separan y dejan ver el Hero.
 *
 * El contenido es la marca —el monograma NF y una regla roja que se
 * extiende— y no una lista de saludos: el logo oficial pasó a ser el logo del
 * sitio y esta es su primera aparición en pantalla.
 *
 * **Gotcha heredado, resuelto por diseño:** el `useReducedMotion` de
 * `motion/react` rompía la cadena de `setTimeout` encadenados del preloader
 * viejo. Acá no hay cadena — hay un solo `setTimeout` y una sola condición de
 * salida, así que se puede usar `matchMedia` sin encadenar nada. Con
 * `prefers-reduced-motion` la obertura directamente no aparece.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);

  // Lectura única en el primer render: si el usuario pidió menos movimiento, o
  // ya vio la obertura en esta pestaña, no se monta nada.
  const [skip] = useState(() => {
    if (typeof window === 'undefined') return true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return reduced || sessionStorage.getItem(SEEN_KEY) === '1';
  });

  const cerrar = useCallback(() => setVisible(false), []);

  // Salida automática + escape por tecla, click o scroll. Un solo timeout, sin
  // cadena (ver docblock).
  useEffect(() => {
    if (skip) return;
    const timer = setTimeout(cerrar, HOLD_MS);
    window.addEventListener('keydown', cerrar);
    window.addEventListener('pointerdown', cerrar);
    window.addEventListener('wheel', cerrar, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', cerrar);
      window.removeEventListener('pointerdown', cerrar);
      window.removeEventListener('wheel', cerrar);
    };
  }, [skip, cerrar]);

  // Si no corresponde mostrarla, se avisa enseguida y el Hero arranca solo.
  useEffect(() => {
    if (skip) onComplete?.();
  }, [skip, onComplete]);

  // Sin scroll mientras la obertura tapa el sitio.
  useEffect(() => {
    if (skip) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [skip]);

  const handleExitComplete = useCallback(() => {
    sessionStorage.setItem(SEEN_KEY, '1');
    onComplete?.();
  }, [onComplete]);

  if (skip) return null;

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && (
        <div className="fixed inset-0 z-[100]" role="status" aria-label="Nora Filmus">
          {/* Dos hojas de telón: se separan desde el centro. Animan solo
              `transform`, así que la salida no toca layout (§7.2 del
              contrato de movimiento). */}
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '-101%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            className="absolute inset-y-0 left-0 w-1/2 bg-ink"
          />
          <motion.div
            initial={{ x: 0 }}
            exit={{ x: '101%' }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}
            className="absolute inset-y-0 right-0 w-1/2 bg-ink"
          />

          {/* Filo rojo en la junta: es lo que hace visible la apertura sobre
              un sitio que también es ink (mismo problema que resolvía el
              stroke rojo del loader anterior). */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-brand-red"
          />

          {/* Marca al centro: el lockup del logo — monograma + wordmark. Se usa
              el monograma con alfa (`/img/nf-monograma.png`) y no el favicon:
              ese trae el cuadro ink horneado y sobre la cortina se veía como
              una placa redondeada. Sin regla horizontal a propósito: con la
              junta vertical del telón formaba una cruz. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <motion.img
              src="/img/nf-monograma.png"
              alt=""
              aria-hidden
              width={360}
              height={287}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-auto w-[7.5rem] md:w-[9.5rem]"
            />
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
              className="font-label text-[11px] uppercase tracking-[0.42em] text-cream/70"
            >
              Nora&nbsp;Filmus
            </motion.span>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
