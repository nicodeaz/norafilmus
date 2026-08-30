import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Tope de seguridad si el video no dispara `onEnded` (falla de red, etc). */
const FALLBACK_MS = 3600;
/** Clave de sesión: la obertura corre una vez por pestaña, no en cada navegación. */
const SEEN_KEY = 'nora-obertura-vista';

interface PreloaderProps {
  /** Se dispara cuando terminó de salir (no cuando termina el hold). */
  onComplete?: () => void;
}

/**
 * **La obertura** — versión con video (2026-08-30), reemplaza a la cortina
 * CSS/motion que había desde el 18/8.
 *
 * El usuario adjuntó un video generado con IA (`gemini_generated_video_...`,
 * 10 s, 1280×720): un pincel dibujando a mano el monograma NF — la misma
 * marca de `nf-monograma.png`, con el mismo destello que ya usa el resto del
 * sitio. Curado antes de publicarlo (no se usó tal cual):
 *
 * - **Recortado a los primeros 6 s del original.** El trazo real (incluido
 *   el punto de la "F", lo último en dibujarse) termina entre 4,9 y 5,2 s;
 *   de 6 s en adelante el pincel ya salió de cuadro y el resto (hasta 10 s)
 *   es el logo quieto — tiempo muerto para un loader.
 * - **Acelerado 2×** → 3,08 s de video final. Se verificó frame a frame
 *   (`ffprobe`/`ffmpeg` desde CLI, este entorno no tiene reproductor de
 *   video con inspección de frames) que el punto de la F sigue completo al
 *   doble de velocidad, no se pierde ningún trazo.
 * - **Sin audio** (`-an`): un preloader que autoplayea con sonido no
 *   arranca en ningún navegador, y no aportaba nada al trazo.
 * - Reescalado a 960×540 y reencodeado (h264, crf 22) → 160 KB, contra los
 *   2,5 MB del original.
 *
 * Sale de `public/video/nf-draw.mp4`; el original curado queda en
 * `content/gemini_generated_video_199E0FF9.mp4` (fuente, no se toca).
 *
 * El video reemplaza tanto el logo estático como la cortina de dos hojas que
 * había antes — ya no hace falta un "telón" separado que se abra: el propio
 * trazo del pincel es la revelación, y al terminar la obertura entera se
 * desvanece (un solo `opacity`) para dejar ver el Hero.
 *
 * Se mantiene todo lo demás igual que la versión anterior:
 *
 * 1. **Se saltea con cualquier tecla, click o scroll** — nadie queda preso.
 * 2. **Corre una vez por pestaña** (`sessionStorage`).
 * 3. **Con `prefers-reduced-motion` no aparece** — nunca se autoplayea un
 *    video con movimiento a quien pidió menos movimiento.
 * 4. Sin cadena de `setTimeout` (gotcha del preloader original, ver
 *    historial) — acá el cierre lo dispara el evento `onEnded` del propio
 *    `<video>`, con `FALLBACK_MS` como red de seguridad si el video no carga.
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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Salida por fin del video + escape por tecla, click o scroll, + red de
  // seguridad si el video no dispara `onEnded` (ver docblock).
  useEffect(() => {
    if (skip) return;
    videoRef.current?.play().catch(cerrar);
    const timer = setTimeout(cerrar, FALLBACK_MS);
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
          <video
            ref={videoRef}
            src="/video/nf-draw.mp4"
            muted
            playsInline
            onEnded={cerrar}
            className="w-[min(80vw,420px)] md:w-[min(60vw,520px)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
