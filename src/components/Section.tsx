import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Reveal from './Reveal';

interface SectionProps {
  id: string;
  eyebrow?: string;
  /** Titular en dos piezas — la segunda va en brand-red (ver AboutMe: "Treinta y seis años" + "arriba y detrás del escenario."). */
  titleLead: string;
  titleAccent?: string;
  /** Cuerpo — uno o más `<p>`. Se acota a 65ch acá adentro, no hace falta que el llamador lo haga. */
  body?: ReactNode;
  /** Material de la sección: grilla, timeline, CTA — lo que sea, va después de la copy. */
  children?: ReactNode;
  className?: string;
}

/**
 * Primitiva de sección — SUPERPROMPT.md §02, gramática de sección:
 * eyebrow → titular (lead cream + accent brand-red) → cuerpo (65ch, cream/80)
 * → material. Es la forma en la que ya está armado `AboutMe`; a partir de F0
 * las secciones nuevas (Crear/Enseñar/Producir/Trayectoria/Presente/Contacto)
 * pasan por acá en vez de repetir el layout a mano.
 *
 * `AboutMe` y `Hero` no se migraron: son piezas ya auditadas con layouts
 * propios (marquee, grid de 2 columnas) que no entran en esta gramática
 * genérica sin forzarla — se dejan como están.
 */
export default function Section({
  id,
  eyebrow,
  titleLead,
  titleAccent,
  body,
  children,
  className,
}: SectionProps) {
  return (
    <section id={id} className={cn('relative z-10 w-full bg-ink py-24 md:py-32', className)}>
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        {eyebrow && (
          <Reveal as="p" className="font-label text-label uppercase tracking-[0.2em] text-brand-red">
            {eyebrow}
          </Reveal>
        )}

        <Reveal
          as="h2"
          delay={0.1}
          className="mt-4 text-display-l font-display uppercase text-cream"
        >
          {titleLead}
          {titleAccent ? <span className="text-brand-red"> {titleAccent}</span> : null}
        </Reveal>

        {body && (
          <Reveal
            as="div"
            delay={0.2}
            className="mt-6 max-w-[65ch] text-body font-body leading-relaxed text-cream/80"
          >
            {body}
          </Reveal>
        )}

        {children && (
          <Reveal as="div" delay={0.3} className="mt-12">
            {children}
          </Reveal>
        )}
      </div>
    </section>
  );
}
