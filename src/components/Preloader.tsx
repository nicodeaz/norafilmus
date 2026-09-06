import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import NFMark from './NFMark';

/** Cuánto queda el monograma en pantalla antes de cerrar solo, en ms. */
const AUTO_MS = 1200;
/** Clave de sesión: la obertura corre una vez por pestaña, no en cada navegación. */
const SEEN_KEY = 'nora-obertura-vista';

interface PreloaderProps {
  /** Se dispara cuando terminó de salir (no cuando termina el hold). */
  onComplete?: () => void;
}

/**
 * La obertura — vuelve 2026-09-04 como el loader de todo el sitio, mismo
 * `NFMark` (el monograma NF) que usa `PageCurtain` en cada cambio de ruta:
 * "quiero usar un loader en todo el sitio, quiero que el loader sea la n y
 * la f". Antes de esto, en la misma sesión, se probaron y se sacaron a
 * pedido explícito tanto un telón de dos hojas como una obertura en video —
 * ninguno de los dos vuelve acá, es deliberadamente el mínimo: `ink` de
 * fondo, el monograma al centro, nada más.
 *
 * 1. **Se saltea con cualquier tecla, click o scroll** — nadie queda preso.
 * 2. **Corre una vez por pestaña** (`sessionStorage`).
 * 3. **Con `prefers-reduced-motion` no aparece.**
 * 4. Cierre por un solo `setTimeout` (`AUTO_MS`) — no hay cadena de timeouts
 *    encadenados (gotcha del preloader original, ver historial en CLAUDE.md).
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

  // Salida automática a los AUTO_MS + escape por tecla, click o scroll.
  useEffect(() => {
    if (skip) return;
    const timer = setTimeout(cerrar, AUTO_MS);
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
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          role="status"
          aria-label="Nora Filmus"
        >
          <NFMark className="w-[clamp(96px,20vw,160px)]" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
