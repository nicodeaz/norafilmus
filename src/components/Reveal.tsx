import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_REVEAL } from '@/lib/ease';

type Tag = 'div' | 'section' | 'p' | 'span' | 'h2' | 'h3' | 'li' | 'ul' | 'article' | 'figure';

interface RevealProps {
  children: ReactNode;
  /** Delay del stagger entre piezas hermanas — 0.15s es el paso de siempre (Hero, AboutMe). */
  delay?: number;
  className?: string;
  /** Tag HTML que arma motion — default 'div'. */
  as?: Tag;
  /** Desplazamiento inicial en px. Con `prefers-reduced-motion` se ignora igual (ver abajo). */
  y?: number;
}

/**
 * Wrapper de entrada por scroll — SUPERPROMPT.md §02. Centraliza el patrón
 * `initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true}}`
 * que se repetía a mano en cada `<motion.*>` de sección (ver AboutMe antes de F0).
 *
 * `prefers-reduced-motion` colapsa la entrada a un fade de 0.2s sin `y`: pedir
 * menos movimiento y moverte igual no cuenta como respetarlo. Usa el
 * `useReducedMotion` de 'motion/react' (ya lo usaba PillarMenu) en vez de un
 * hook propio — no tiene sentido reenvolver lo que la librería ya resuelve.
 */
export default function Reveal({ children, delay = 0, className, as = 'div', y = 16 }: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as];

  return (
    <MotionTag
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{
        duration: reduced ? 0.2 : 0.6,
        delay: reduced ? 0 : delay,
        ease: EASE_REVEAL,
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
