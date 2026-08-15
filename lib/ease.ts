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

/** Feedback de presión en botones y otras superficies tappeables. */
export const SPRING_PRESS = {
  type: 'spring',
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;
