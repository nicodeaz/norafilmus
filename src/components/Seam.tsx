import { motion, useReducedMotion } from 'motion/react';
import { EASE_REVEAL } from '@/lib/ease';
import { cn } from '@/lib/utils';

interface SeamProps {
  /** Numeral del acto que viene (I · II · III). Se omite para secciones que no son actos. */
  numeral?: string;
  /** Rótulo de lo que viene — se reusa el `eyebrow` de la sección, no se inventa copy nueva. */
  label: string;
  className?: string;
}

/**
 * La costura entre secciones — E3 / hallazgo H7.
 *
 * La auditoría midió que **los dos únicos tramos ≥300 px sin tinta de todo el
 * sitio caían exactamente en los bordes entre secciones** (`AboutMe→Acto I` y
 * `Acto II→Acto III`): el `py` de una sección sumado al de la siguiente daba
 * 288 px de negro donde no pasaba nada. No sobraba aire adentro de las
 * secciones — faltaba algo en las costuras.
 *
 * Acá el borde pasa a ser un evento: una regla que se dibuja de izquierda a
 * derecha al entrar en viewport y, en su extremo, el numeral y el rótulo de lo
 * que viene. Es el gesto de un programa de teatro anunciando el acto
 * siguiente, y de paso le dice al lector dónde está.
 *
 * Anima solo `transform` y `opacity` (§7.2 del contrato de movimiento), y con
 * `prefers-reduced-motion` la regla aparece entera sin dibujarse.
 *
 * **Por qué el `whileInView` va en el contenedor y no en la regla:** una regla
 * que arranca en `scaleX(0)` tiene ancho renderizado cero, y un elemento sin
 * área **nunca dispara `IntersectionObserver`** — así que nunca entra "en
 * viewport", así que nunca se anima, así que sigue en cero. Punto muerto
 * (pasó: las cuatro costuras quedaron invisibles y solo aparecía el rótulo,
 * que sí tiene tamaño propio). El disparador vive en el contenedor —que mide
 * el ancho completo— y los hijos siguen por variantes.
 */
const contenedor = {
  oculto: {},
  visible: { transition: { staggerChildren: 0.45 } },
};

const regla = {
  oculto: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.9, ease: EASE_REVEAL } },
};

const rotulo = {
  oculto: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

export default function Seam({ numeral, label, className }: SeamProps) {
  const reduced = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn('relative z-10 w-full bg-ink px-6 py-10 sm:px-10 md:px-12 md:py-14', className)}
    >
      <motion.div
        variants={contenedor}
        initial={reduced ? 'visible' : 'oculto'}
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        className="mx-auto flex max-w-7xl items-center gap-4"
      >
        <motion.span variants={regla} className="h-px flex-grow origin-left bg-cream/20" />

        <motion.span variants={rotulo} className="flex shrink-0 items-baseline gap-3">
          {numeral && (
            <span className="font-display text-lg leading-none text-brand-red md:text-xl">
              {numeral}
            </span>
          )}
          <span className="font-label text-[10px] uppercase tracking-[0.3em] text-cream/45">
            {label}
          </span>
        </motion.span>
      </motion.div>
    </div>
  );
}
