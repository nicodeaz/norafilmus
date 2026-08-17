import { motion, useScroll } from 'motion/react';

/**
 * Barra fina de progreso de scroll — SUPERPROMPT.md §6 (F1). `useScroll()`
 * sin `target` seguí el scroll de la ventana entera y devuelve un
 * `MotionValue` (no state de React): el `scaleX` se anima en el compositor
 * del navegador sin re-renderizar en cada evento de scroll, a diferencia del
 * listener manual + `useState` que usa `nora-landing`.
 *
 * Sólido en `brand-red`, no en degradé — el sitio evita gradientes
 * multicolor (ver §02), y ni siquiera hacía falta uno acá: es una barra de
 * progreso, no un adorno.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-cream/10">
      <motion.div
        className="h-full origin-left bg-brand-red"
        style={{ scaleX: scrollYProgress }}
      />
    </div>
  );
}
