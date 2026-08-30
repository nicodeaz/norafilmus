import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useLanguage } from '@/src/i18n/LanguageContext';

/** Cuánto queda la pantalla tapada del todo antes de reabrir, en ms. */
const HOLD_MS = 200;
const LEAF_DURATION = 0.35;
const LEAF_MS = LEAF_DURATION * 1000;
const LEAF_EASE = [0.76, 0, 0.24, 1] as const;

/** Numeral de Acto por ruta — mismo valor que ya usan `Act`/`Seam` en `App.tsx`, no es dato nuevo. */
const NUMERAL: Record<string, string> = {
  '/crear': 'I',
  '/ensenar': 'II',
  '/producir': 'III',
};

/**
 * Transición entre páginas — Fase 1 (arquitectura de rutas, 2026-08-28).
 *
 * Repite el dispositivo de dos hojas de telón + filo rojo que usaba
 * `Preloader.tsx` hasta el 28/8, pero invertido y mucho más corto: acá el
 * telón entra (cierra) al cambiar de ruta, tapa el swap de página, y vuelve a
 * salir (abre) sobre el contenido nuevo. Implementación propia, no
 * compartida — la obertura reemplazó su curtain por un video el 30/8 (ver
 * docblock de `Preloader.tsx`), pero acá el mecanismo de telón sigue siendo
 * el correcto: es un swap de página, no una obertura con contenido propio.
 *
 * `useOutlet()` en vez de recibir `children`: así puede quedarse mostrando
 * la página VIEJA mientras el telón cierra, y recién cambiar al contenido
 * nuevo cuando la pantalla ya está completamente tapada — si el `<Outlet />`
 * se reemplazara directo, React Router swapea la página apenas cambia la URL
 * (antes de que el telón termine de cerrar) y se ve un flash del contenido
 * nuevo por debajo de las hojas todavía abriéndose.
 */
export default function PageCurtain() {
  const location = useLocation();
  const outlet = useOutlet();
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  const [shown, setShown] = useState(outlet);
  const [shownPath, setShownPath] = useState(location.pathname);
  const [covering, setCovering] = useState(false);

  useEffect(() => {
    if (shownPath === location.pathname) {
      // Misma ruta (ej. el idioma cambió el contenido) — no hay nada que tapar.
      setShown(outlet);
      return;
    }

    if (reduced) {
      setShown(outlet);
      setShownPath(location.pathname);
      return;
    }

    setCovering(true);
    const swap = setTimeout(() => {
      setShown(outlet);
      setShownPath(location.pathname);
    }, LEAF_MS);
    const reveal = setTimeout(() => setCovering(false), LEAF_MS + HOLD_MS);
    return () => {
      clearTimeout(swap);
      clearTimeout(reveal);
    };
    // `outlet` cambia en cada render de ruta — solo importa disparar esto
    // cuando cambia el pathname, no en cada re-render del contenido.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, reduced]);

  const numeral = NUMERAL[location.pathname];
  const eyebrow =
    location.pathname === '/crear'
      ? t.crear.eyebrow
      : location.pathname === '/ensenar'
        ? t.ensenar.eyebrow
        : location.pathname === '/producir'
          ? t.producir.eyebrow
          : location.pathname === '/trayectoria'
            ? t.trayectoria.eyebrow
            : location.pathname === '/presente'
              ? t.presente.eyebrow
              : null;

  return (
    <>
      {shown}
      <AnimatePresence>
        {covering && (
          <div className="pointer-events-none fixed inset-0 z-[90]" aria-hidden>
            <motion.div
              initial={{ x: '-101%' }}
              animate={{ x: 0 }}
              exit={{ x: '-101%' }}
              transition={{ duration: LEAF_DURATION, ease: LEAF_EASE }}
              className="absolute inset-y-0 left-0 w-1/2 bg-ink"
            />
            <motion.div
              initial={{ x: '101%' }}
              animate={{ x: 0 }}
              exit={{ x: '101%' }}
              transition={{ duration: LEAF_DURATION, ease: LEAF_EASE }}
              className="absolute inset-y-0 right-0 w-1/2 bg-ink"
            />
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-brand-red"
            />
            {eyebrow && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.15 }}
                className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-baseline gap-3 whitespace-nowrap"
              >
                {numeral && (
                  <span className="font-display text-2xl leading-none text-brand-red">
                    {numeral}
                  </span>
                )}
                <span className="font-label text-[11px] uppercase tracking-[0.35em] text-cream/70">
                  {eyebrow}
                </span>
              </motion.span>
            )}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
