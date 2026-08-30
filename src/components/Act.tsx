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
  /**
   * Los `children` se salen de la columna de texto y ocupan las 12 columnas.
   * Resuelve el hueco medido en H10: bajo el numeral+foto la columna izquierda
   * se vaciaba mientras la de texto seguía. Con esto el material llena ese
   * ancho en vez de dejarlo en negro.
   */
  childrenFullWidth?: boolean;
  /**
   * Achica el numeral. Para actos que ya traen un número grande propio — hoy
   * solo Enseñar, donde el "12" es el contenido y el "II" es solo el marcador
   * del acto.
   */
  numeralDiscreto?: boolean;
  /** Alterna de qué lado bleedea el numeral/foto — da variedad entre actos consecutivos. */
  align?: 'left' | 'right';
  /**
   * Ícono junto al eyebrow — Fase 3 (2026-08-28): un marcador chico y legible
   * por Acto (Crear/Enseñar/Producir), más barato y confiable que diferenciar
   * por color o textura de fondo. Ver docblock de cada `*.tsx` de Acto para
   * el ícono elegido.
   */
  icon?: ReactNode;
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
  childrenFullWidth = false,
  numeralDiscreto = false,
  align = 'left',
  icon,
}: ActProps) {
  const mirrored = align === 'right';

  return (
    // py bajó de 24/36 a 16/24: sumado al de la sección vecina daba 288px de
    // negro muerto en cada borde. Lo que se recorta acá lo ocupa `<Seam>`,
    // que ahora vive en esas costuras (E3 / H7).
    <section id={id} className="relative w-full overflow-hidden bg-ink py-16 md:py-24">
      {/* Luz de escena: un óvalo de cream al 3 % detrás del numeral. Le da
          profundidad al ink plano —que la auditoría marcó como el 100 % de la
          superficie bajo el Hero (H13)— sin agregar un color a la paleta, y
          de paso es coherente con el concepto: un acto tiene su luz. Sigue el
          lado por el que sangra el numeral.

          El óvalo se queda holgadamente adentro de la sección (45×38 % centrado
          al 50 % de alto, apagándose al 70 %): con un radio más grande el
          degradé todavía tenía valor al llegar al borde y se veía un escalón
          tonal contra la sección vecina — un rectángulo más claro, que es peor
          que el negro plano que venía a resolver. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(45% 38% at ${mirrored ? '75%' : '25%'} 50%, rgba(245,239,230,0.03), transparent 70%)`,
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 md:px-12">
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
            {/* Numeral. En mobile pasa a **marca de agua**: a 390px el clamp
                anterior daba 96px y el "I" se leía como un guioncito rojo
                accidental —el dispositivo que sostiene todo el concepto
                desaparecía justo donde más gente lo ve (auditoría H12)—. Ahora
                crece a 38vw y baja a 20% de opacidad, así que ordena el bloque
                sin pelear con el texto. De `md` para arriba vuelve a ser la
                pieza sólida de siempre.

                `numeralDiscreto` lo achica cuando el acto ya tiene un número
                grande propio (el "12" de Enseñar): dos números rojos a la misma
                escala se leían como un error de numeración (H9). */}
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute -top-6 select-none font-display leading-none md:-top-10',
                'text-brand-red/20 md:text-brand-red',
                numeralDiscreto
                  ? 'text-[22vw] md:text-[5.5rem]'
                  : 'text-[38vw] md:text-[min(22vw,13rem)]',
                mirrored ? '-right-2 md:-right-4' : '-left-2 md:-left-4'
              )}
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
              {icon && (
                <span className="text-brand-red" aria-hidden>
                  {icon}
                </span>
              )}
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

            {children && !childrenFullWidth && (
              <Reveal as="div" delay={0.3} className="mt-12">
                {children}
              </Reveal>
            )}
          </div>

          {/* Material a ancho completo: se sale de la columna de texto y ocupa
              las 12, así llena el vacío que quedaba bajo el numeral+foto
              (auditoría H10). Va al final del orden en desktop. */}
          {children && childrenFullWidth && (
            <Reveal as="div" delay={0.3} className="md:order-3 md:col-span-12 md:mt-4">
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
