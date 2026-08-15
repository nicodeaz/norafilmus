import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Saludos que se encadenan. El último es el que queda al salir. */
const WORDS = ['Hola', 'Hello', 'Dia dhuit', 'Ciao', 'Bonjour', 'Olá', 'Hallo', 'Nora Filmus'];

/** Curva "in-out" fuerte, la misma del componente original. */
const EASE = [0.76, 0, 0.24, 1] as const;

/** Panzazo máximo (px) de la cortina: cuánto se hunde la curva de abajo. */
const MAX_CURVE_HEIGHT = 300;

const slideUp = {
  initial: { y: 0 },
  exit: { y: '-100%', transition: { duration: 0.8, ease: EASE, delay: 0.3 } },
};

interface PreloaderProps {
  /** Se dispara cuando terminó de salir (no cuando terminan las palabras). */
  onComplete?: () => void;
}

/**
 * Adaptado de "preloader" (21st.dev/@info-mdshakeeb — código fuente detrás
 * del paywall, reconstruido desde la descripción + la captura con los tokens
 * de Nora): cortina ink full-screen que encadena saludos en varios idiomas
 * (Buenos Aires → Dublín) y sale hacia arriba con el borde inferior curvo
 * que se aplana durante el barrido.
 */
export default function Preloader({ onComplete }: PreloaderProps) {
  const [index, setIndex] = useState(0);
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(true);
  // Lazy init, a propósito NO el `useReducedMotion` de 'motion/react' que usan
  // Reveal/PillarMenu: se probó acá (F0.4) y con su valor reactivo la cadena
  // de palabras se quedaba trabada en la última sin salir nunca — algo en
  // cómo su listener interactúa con este `useEffect` en cadena (cada uno
  // dispara el siguiente por `setTimeout`) lo rompe. Como acá alcanza con el
  // valor del primer render (el loader ya terminó de decidir su camino antes
  // de que el usuario pueda cambiar la preferencia del SO), un `matchMedia`
  // leído una sola vez es más simple Y más confiable que la versión reactiva.
  const [reducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // El path del SVG se dibuja en px, así que necesita el ancho real (y
  // seguirlo si la ventana cambia de tamaño mientras el loader está puesto).
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Cadena de palabras: la primera respira, las demás pasan rápido.
  useEffect(() => {
    if (reducedMotion) return;
    if (index === WORDS.length - 1) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setIndex(index + 1), index === 0 ? 900 : 150);
    return () => clearTimeout(timer);
  }, [index, reducedMotion]);

  // Sin scroll mientras la cortina tapa el sitio. Atado al montaje, no a
  // `visible`: la salida sigue corriendo después de esconderla y el scrollbar
  // reaparecía en el medio del barrido.
  useEffect(() => {
    if (reducedMotion) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) onComplete?.();
  }, [reducedMotion, onComplete]);

  const handleExitComplete = useCallback(() => onComplete?.(), [onComplete]);

  // Cortina: panza hacia abajo en reposo, borde recto al salir. La panza es
  // proporcional al ancho — 300px fijos en mobile daban una V, no una curva.
  const depth = Math.min(MAX_CURVE_HEIGHT, width * 0.22);
  const initialPath = `M0 0 L${width} 0 Q${width / 2} ${depth} 0 0 Z`;
  const targetPath = `M0 0 L${width} 0 Q${width / 2} 0 0 0 Z`;

  const curve = {
    initial: { d: initialPath, transition: { duration: 0.7, ease: EASE } },
    exit: { d: targetPath, transition: { duration: 0.7, ease: EASE, delay: 0.3 } },
  };

  // El sitio también es ink: una cortina negra sobre fondo negro no se ve
  // salir. El filo rojo (la misma curva, sin relleno) es lo que dibuja el
  // barrido. Se puede sacar sin tocar nada más.
  const edge = {
    initial: {
      d: `M${width} 0 Q${width / 2} ${depth} 0 0`,
      transition: { duration: 0.7, ease: EASE },
    },
    exit: {
      d: `M${width} 0 Q${width / 2} 0 0 0`,
      transition: { duration: 0.7, ease: EASE, delay: 0.3 },
    },
  };

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {visible && !reducedMotion && (
        <motion.div
          variants={slideUp}
          initial="initial"
          exit="exit"
          className="fixed inset-x-0 top-0 z-[100] flex h-screen w-screen items-center justify-center bg-ink"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center font-display text-3xl uppercase leading-none text-cream sm:text-4xl md:text-5xl"
          >
            <span className="mr-4 inline-block h-2.5 w-2.5 rounded-full bg-brand-red" />
            {WORDS[index]}
          </motion.p>

          {/* Vive por debajo del borde inferior (top-full): es la panza de la
              cortina, no un fondo. Se mueve junto con el padre al salir. */}
          {width > 0 && (
            <svg
              className="absolute left-0 top-full"
              width={width}
              height={depth}
              aria-hidden="true"
            >
              <motion.path
                variants={curve}
                initial="initial"
                exit="exit"
                fill="var(--color-ink)"
              />
              <motion.path
                variants={edge}
                initial="initial"
                exit="exit"
                fill="none"
                stroke="var(--color-brand-red)"
                strokeWidth={2}
              />
            </svg>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
