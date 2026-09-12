import type { CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { ActGalleryPhoto } from '@/src/i18n/content';
import { useLightbox } from './Lightbox';
import Picture from './Picture';
import Reveal from './Reveal';

interface VerticalPhotoSliderProps {
  photos: ActGalleryPhoto[];
  /** Prefijo del pie del lightbox (ej. "Crear" / "Producir") — no un dato nuevo, ya vive en `eyebrow`. */
  sectionLabel: string;
  className?: string;
}

/**
 * Slider vertical infinito y navegable — reemplaza a la foto ancla única de
 * `Act.tsx` (`image`) en Crear/Producir (2026-09-12). La selección viene del
 * artifact "Casting del Archivo" (ver memoria `casting-del-archivo-artifact`):
 * en vez de UNA foto curada, cada Acto ahora muestra TODO el material que el
 * usuario eligió, ambiental — "infinito" lo resuelve el mismo recurso que ya
 * usa el marquee de `AboutMe` (`@keyframes` CSS puro vía
 * `.animate-marquee-vertical`, `src/index.css` — nunca un tween de `motion`
 * por frame, que ya se probó lento en `PhotoMarquee`/tildó el scroll del
 * marquee horizontal, ver sus propios docblocks) — no `motion.div`/`animate`.
 *
 * "Navegable" lo da el `Lightbox` global que ya usa el resto del sitio
 * (`Act.tsx`, `CreditList.tsx`): clickear cualquier foto lo abre con TODA la
 * galería de la sección y sus flechas ←/→ — no hace falta reinventar
 * navegación acá, la tira solo aporta el movimiento ambiental y el punto de
 * entrada. El loop también se pausa en hover/foco (mismo mecanismo CSS,
 * `animation-play-state`) para poder clickear con precisión sin perseguir la
 * foto que se mueve.
 *
 * Sin rotación por foto (a diferencia del marco único que reemplaza, que
 * llevaba `-rotate-2`): una tira de ~10-45 fotos rotadas se leería como
 * ruido, no como un afiche. El marco compartido (borde fino `cream/15`, sin
 * sombra — `design-system` no usa `box-shadow`) y el fade de `mask-image`
 * arriba/abajo (mismo dispositivo que ya usan los sliders horizontales del
 * Hero/AboutMe) son los que dan la lectura de "programa de teatro", no cada
 * foto individual.
 *
 * **Mobile: tira horizontal swipeable, no el marquee vertical (2026-09-12),
 * pedido explícito ("ocupan mucho lugar y tampoco se puede navegar en
 * ellos").** Dos problemas reales del marquee vertical por debajo de `md`:
 * 1. **Alto fijo de 26rem (416px)** en una columna angosta (`max-w-xs` en
 *    `Act.tsx`) es una cantidad enorme de scroll vertical solo para la
 *    galería, en una página que ya es larga en mobile.
 * 2. **El pause-on-hover no existe en touch.** El marquee nunca se detiene
 *    en un teléfono, así que tocar una foto puntual para abrir el lightbox
 *    es perseguir un blanco móvil — de ahí "no se puede navegar".
 *
 * La solución no es agregarle lógica de pausa por touch al marquee: es un
 * componente DISTINTO por debajo de `md`, `overflow-x-auto` con
 * `snap-x`/`scroll-smooth` nativo del navegador — cero JS de scroll propio
 * (mismo criterio de siempre: nada de reimplementar lo que el navegador ya
 * da gratis). Cada foto es un botón `shrink-0` de ancho fijo, quieto hasta
 * que el usuario lo desliza con el dedo — tocar una foto puntual vuelve a
 * ser preciso porque nada se mueve solo. Alto bajado a 9.5rem (152px, contra
 * 416px) — el mismo material de archivo, mucho menos scroll para llegar al
 * resto del Acto. De `md` para arriba sigue el marquee vertical de siempre,
 * sin cambios (ahí el hover-to-pause sí existe y el alto no compite tanto
 * con el resto de la página).
 */
export default function VerticalPhotoSlider({
  photos,
  sectionLabel,
  className,
}: VerticalPhotoSliderProps) {
  const reduced = useReducedMotion();
  const { open: openLightbox } = useLightbox();

  if (photos.length === 0) return null;

  const loop = reduced ? photos : [...photos, ...photos];
  // Más fotos, tira más larga → más tiempo para recorrerla a velocidad
  // constante. 2.6s/foto es el mismo ritmo que ya usa el marquee horizontal
  // de AboutMe (34s / ~13 fichas visibles con duplicado ≈ 2.6s c/u).
  const duration = Math.max(photos.length * 2.6, 18);

  return (
    <>
      {/* Mobile: tira horizontal, scroll nativo — ver docblock. */}
      <Reveal
        as="div"
        className={cn(
          'relative snap-x snap-proximity overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden',
          '[mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]',
          '[-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]',
          className
        )}
      >
        <div className="flex w-max gap-2">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() =>
                openLightbox(
                  photos.map((p) => ({ src: p.src, alt: p.alt, label: `${sectionLabel} — Foto: ${p.credit}` })),
                  i
                )
              }
              className="block shrink-0 snap-center border-[6px] border-cream/10 outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            >
              <Picture
                src={photo.src}
                alt={photo.alt}
                sizes="112px"
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                pictureClassName="block"
                className="h-[9.5rem] w-28 object-cover"
              />
            </button>
          ))}
        </div>
      </Reveal>

      {/* Desktop: marquee vertical infinito de siempre, sin cambios. */}
      <Reveal
        as="div"
        className={cn(
          'relative hidden h-[32rem] overflow-hidden border-[6px] border-cream/10 md:block',
          '[mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]',
          '[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]',
          className
        )}
      >
        <div
          className={cn('flex flex-col gap-2', !reduced && 'animate-marquee-vertical')}
          style={{ '--marquee-duration': `${duration}s` } as CSSProperties}
        >
          {loop.map((photo, i) => (
            <button
              key={`${photo.src}-${i}`}
              type="button"
              onClick={() =>
                openLightbox(
                  photos.map((p) => ({ src: p.src, alt: p.alt, label: `${sectionLabel} — Foto: ${p.credit}` })),
                  i % photos.length
                )
              }
              className="block w-full shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              tabIndex={i < photos.length ? 0 : -1}
              aria-hidden={i >= photos.length}
            >
              <Picture
                src={photo.src}
                alt={photo.alt}
                sizes="24rem"
                loading={i < 4 ? 'eager' : 'lazy'}
                decoding="async"
                pictureClassName="block"
                className="h-56 w-full object-cover transition-opacity duration-300 hover:opacity-80"
              />
            </button>
          ))}
        </div>
      </Reveal>
    </>
  );
}
