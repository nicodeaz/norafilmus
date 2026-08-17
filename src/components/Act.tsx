import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import Picture from './Picture';
import Reveal from './Reveal';

interface ActImage {
  src: string;
  alt: string;
  credit: string;
  caption: string;
}

interface ActProps {
  id: string;
  /** Numeral romano gigante — I / II / III. Es el dispositivo organizador del "Programa", no un adorno. */
  numeral: string;
  eyebrow: string;
  titleLead: string;
  titleAccent?: string;
  body: ReactNode;
  /** Foto ancla del acto — nunca el mismo archivo que ya usa el mosaico del Hero para este pilar. */
  image?: ActImage;
  /**
   * Reemplaza el lugar de la foto cuando no hay una (ej. Enseñar, regla 4 —
   * nada de fotos de menores identificables). No es un placeholder vacío:
   * es donde va el "12" de años coordinando el programa, resuelto con
   * tipografía en vez de una imagen sustituta.
   */
  aside?: ReactNode;
  /** Créditos u otro material — va debajo de la columna de texto. */
  children?: ReactNode;
  /** Alterna de qué lado bleedea el numeral/foto — da variedad entre actos consecutivos. */
  align?: 'left' | 'right';
}

/**
 * Redirección de dirección artística (2026-08-17, post-F5): reemplaza a
 * `Section.tsx` para Crear/Enseñar/Producir. El problema que resuelve — ver
 * el informe de dirección creativa en el chat — es que `Section` generaba
 * la misma composición centrada cuatro veces seguida (eyebrow-pill → título
 * → cuerpo → lista), indistinguible de sección a sección.
 *
 * Acá cada "Acto" es asimétrico: un numeral romano enorme en `font-display`
 * sangra fuera de su caja por arriba de una foto real con marco — el
 * conjunto se lee como un recorte de programa de teatro, no como una card.
 * La columna de texto queda corrida (no centrada bajo el numeral). `align`
 * alterna de qué lado va ese bloque para que Acto I y Acto III no se vean
 * idénticos en espejo.
 *
 * Sigue sin ser un "template": Enseñar no tiene `image` (regla 4 — nada de
 * fotos de menores identificables) así que ese acto no pasa `image` y el
 * numeral queda solo con la foto ausente a propósito, no rellenada.
 */
export default function Act({
  id,
  numeral,
  eyebrow,
  titleLead,
  titleAccent,
  body,
  image,
  aside,
  children,
  align = 'left',
}: ActProps) {
  const mirrored = align === 'right';

  return (
    <section id={id} className="relative w-full overflow-hidden bg-ink py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          {/* Numeral + foto — columna angosta, sangra hacia el borde.
              `order` (no un truco de `direction: rtl`) alterna el lado: más
              seguro con texto que lleva comillas/guiones largos en español. */}
          <div
            className={cn(
              'relative md:col-span-5',
              mirrored ? 'md:order-2' : 'md:order-1'
            )}
          >
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute -top-6 select-none font-display leading-none text-brand-red md:-top-10',
                mirrored ? '-right-2 md:-right-4' : '-left-2 md:-left-4'
              )}
              style={{ fontSize: 'clamp(6rem, 22vw, 13rem)' }}
            >
              {numeral}
            </span>

            {image ? (
              <Reveal
                as="figure"
                className={cn(
                  'relative mt-[4.5rem] max-w-xs md:mt-[6.5rem]',
                  mirrored ? 'mr-[3.5rem] md:mr-[5.5rem]' : 'ml-[3.5rem] md:ml-[5.5rem]'
                )}
              >
                <Picture
                  src={image.src}
                  alt={image.alt}
                  sizes="(min-width: 768px) 24rem, 70vw"
                  loading="lazy"
                  decoding="async"
                  pictureClassName="block"
                  className={cn(
                    'w-full -rotate-2 border-[6px] border-cream/10 object-cover shadow-[0_20px_60px_rgba(0,0,0,0.5)]',
                    mirrored && 'rotate-2'
                  )}
                />
                <figcaption className="mt-3 font-label text-[11px] leading-snug text-cream/40">
                  <span className="block text-cream/60">{image.caption}</span>
                  <span className="block text-cream/25">Foto: {image.credit}</span>
                </figcaption>
              </Reveal>
            ) : aside ? (
              <Reveal
                as="div"
                className={cn(
                  'relative mt-[4.5rem] max-w-xs md:mt-[6.5rem]',
                  mirrored ? 'mr-[3.5rem] md:mr-[5.5rem]' : 'ml-[3.5rem] md:ml-[5.5rem]'
                )}
              >
                {aside}
              </Reveal>
            ) : (
              /* Ni foto ni aside: el numeral queda solo, con aire abajo en vez de un hueco relleno. */
              <div className="h-24 md:h-40" />
            )}
          </div>

          {/* Columna de texto — corrida, no centrada bajo el numeral */}
          <div className={cn('md:col-span-7 md:pt-10', mirrored ? 'md:order-1' : 'md:order-2')}>
            <Reveal as="div" delay={0.1} className="flex items-center gap-3">
              <span className="h-px w-8 bg-brand-red" aria-hidden />
              <span className="font-label text-xs uppercase tracking-[0.25em] text-brand-red">
                {eyebrow}
              </span>
            </Reveal>

            <Reveal
              as="h2"
              delay={0.15}
              className="mt-4 text-display-l font-display uppercase leading-[0.95] text-cream"
            >
              {titleLead}
              {titleAccent ? <span className="text-brand-red"> {titleAccent}</span> : null}
            </Reveal>

            <Reveal
              as="div"
              delay={0.2}
              className="mt-6 max-w-[60ch] text-body font-body leading-relaxed text-cream/80"
            >
              {body}
            </Reveal>

            {children && (
              <Reveal as="div" delay={0.3} className="mt-12">
                {children}
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
