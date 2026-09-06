import { motion, useReducedMotion } from 'motion/react';
import Picture from './Picture';

interface NFMarkProps {
  className?: string;
}

/**
 * El monograma NF como loader — 2026-09-04. Pedido explícito del usuario:
 * "quiero usar un loader en todo el sitio, quiero que el loader sea la n y
 * la f". Reemplaza al "telón de dos hojas" que tenían tanto `Preloader`
 * (obertura inicial) como `PageCurtain` (transición entre rutas) — el
 * usuario lo vio en la obertura y pidió sacarlo del todo; acá es el mismo
 * criterio aplicado a los dos lugares, no solo a uno.
 *
 * Respira (opacity en loop) mientras está montado — es un indicador de
 * carga real, no una entrada de una sola vez. Con `prefers-reduced-motion`
 * se queda quieto (visible, sin pulso).
 */
export default function NFMark({ className }: NFMarkProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      animate={reduced ? undefined : { opacity: [0.5, 1, 0.5] }}
      transition={reduced ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Picture src="/img/nf-monograma.png" alt="" aria-hidden sizes="160px" />
    </motion.div>
  );
}
