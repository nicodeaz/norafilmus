// Tokens de motion compartidos — de beui.dev/components/motion/button.

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/**
 * Ease canónico de las entradas por scroll — SUPERPROMPT.md §02. Vivía
 * repetido inline en Hero y PillarMenu; a partir de F0 vive acá y `Reveal`
 * (src/components/Reveal.tsx) lo usa por default.
 */
export const EASE_REVEAL = [0.22, 1, 0.36, 1] as const;

/** CSS string form de EASE_OUT para transiciones inline. */
export const EASE_OUT_CSS = 'cubic-bezier(0.16, 1, 0.3, 1)';

/**
 * Easings **escalares** (`f(t) → t'`, los dos en 0→1) para animación atada
 * al scroll. Son otra cosa que los tokens de arriba: esos son tuplas de
 * cubic-bezier que se le pasan declarativamente a una `transition` de
 * `motion`. Un scrub por scroll no pasa por `motion` — mapea el progreso a
 * mano en cada frame y escribe el estilo (ver `Hero.tsx`), así que necesita
 * la función, no la curva.
 *
 * `easeInOutSine` es deliberadamente suave: para un movimiento de cámara,
 * una curva más pronunciada (cubic) se siente elástica cuando además el
 * progreso ya viene amortiguado.
 */
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;
/** Salidas: se mantiene arriba y cae rápido al final. */
export const easeInQuad = (t: number) => t * t;
/** Entradas: sube rápido y se asienta. */
export const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t);

/** Feedback de presión en botones y otras superficies tappeables. */
export const SPRING_PRESS = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;
