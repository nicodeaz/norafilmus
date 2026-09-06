import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useLocation, useOutlet } from 'react-router-dom';
import { useLanguage } from '@/src/i18n/LanguageContext';
import NFMark from './NFMark';

/** Cuánto queda la pantalla tapada del todo antes de reabrir, en ms. */
const HOLD_MS = 200;
const COVER_DURATION = 0.35;
const COVER_MS = COVER_DURATION * 1000;

/** Numeral de Acto por ruta — mismo valor que ya usan `Act`/`Seam` en `App.tsx`, no es dato nuevo. */
const NUMERAL: Record<string, string> = {
  '/crear': 'I',
  '/ensenar': 'II',
  '/producir': 'III',
};

/**
 * Transición entre páginas — reescrita 2026-09-04.
 *
 * Tenía un "telón de dos hojas" (dos paneles deslizando desde los bordes +
 * filo rojo). El usuario vio ese mismo dispositivo en la obertura inicial
 * (`Preloader`, versión previa) y pidió sacarlo del todo — acá corría el
 * mecanismo gemelo para el swap de ruta, así que se reemplaza también, no
 * solo donde lo vio: "quiero usar un loader en todo el sitio, quiero que el
 * loader sea la n y la f". Ahora es un fundido simple a `ink` con `NFMark`
 * (el monograma, compartido con `Preloader`) al centro — sin hojas, sin
 * video, el mismo loader en cualquier lugar del sitio donde haya que tapar
 * un cambio de contenido.
 *
 * `useOutlet()` en vez de recibir `children`: así puede quedarse mostrando
 * la página VIEJA mientras el fundido cierra, y recién cambiar al contenido
 * nuevo cuando la pantalla ya está completamente tapada — si el `<Outlet />`
 * se reemplazara directo, React Router swapea la página apenas cambia la URL
 * (antes de que el fundido termine de cerrar) y se ve un flash del contenido
 * nuevo por debajo.
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
    }, COVER_MS);
    const reveal = setTimeout(() => setCovering(false), COVER_MS + HOLD_MS);
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
            : null;

  return (
    <>
      {shown}
      <AnimatePresence>
        {covering && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: COVER_DURATION, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed inset-0 z-[90] flex flex-col items-center justify-center gap-4 bg-ink"
            aria-hidden
          >
            <NFMark className="w-[clamp(72px,14vw,120px)]" />
            {eyebrow && (
              <span className="flex items-baseline gap-3 whitespace-nowrap">
                {numeral && (
                  <span className="font-display text-2xl leading-none text-brand-red">
                    {numeral}
                  </span>
                )}
                <span className="font-label text-[11px] uppercase tracking-[0.35em] text-cream/70">
                  {eyebrow}
                </span>
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
