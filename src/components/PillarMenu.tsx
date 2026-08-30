import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { EASE_REVEAL } from '@/lib/ease';
import { cn } from '@/lib/utils';
import type { Pillar } from '@/src/i18n/content';
import { getImageSources } from './Picture';

interface PillarMenuProps {
  items: Pillar[];
  className?: string;
  /**
   * `vertical` — lista apilada + mosaico al costado (el layout original).
   * `inline` — banda horizontal, **sin mosaico**: es la que usa el Hero desde
   * el rediseño de composición, para que los pilares ocupen el ancho del pie
   * en vez de flotar chicos a la derecha. El mosaico se cae a propósito — en
   * el Hero el protagonista es el retrato, y una segunda imagen chica ahí
   * abajo se montaba sobre el torso y dejaba su pie ilegible sobre la remera
   * blanca. En `vertical` (fuera del Hero) el mosaico sigue vivo.
   */
  orientation?: 'vertical' | 'inline';
}

/** El mosaico es una grilla de GRID x GRID pedazos de la misma foto. */
const GRID = 3;
const TILES = GRID * GRID;
/** Separación entre pedazos, en px — tiene que coincidir con el `gap-` de la grilla. */
const GAP = 3;

/** Orden de entrada/salida de los pedazos — salteado a propósito (no de
 *  arriba a abajo) para que el mosaico se arme y se desarme desordenado. */
const SCATTER = [4, 0, 8, 2, 6, 1, 7, 3, 5];

const TILE_DURATION = 0.3;
const TILE_STAGGER = 0.025;

/**
 * Adaptado de "connoisseur-stack-interactor"
 * (21st.dev/@hardikkashiyani123456788) — el código fuente está detrás del
 * paywall (solo se publica el `Usage.tsx`), así que está reconstruido desde
 * la captura y el video de preview: lista numerada (01/02/03) de títulos
 * grandes en mayúsculas donde el activo se prende y los otros quedan
 * apagados, más una foto al costado que se rompe en pedazos y se rearma con
 * los pedazos de la foto siguiente cuando cambia el ítem activo.
 *
 * Tres desvíos del original: el original usa gsap para la animación de los
 * pedazos y acá va con `motion` + `AnimatePresence mode="wait"` (el resto del
 * sitio no tiene gsap y con un stagger de scale/opacity alcanza); el activo
 * se sigue con hover/focus por ítem en vez de scroll, porque acá esto es el
 * menú del Hero, no una sección que se recorre scrolleando; y tanto la foto
 * como el link son opcionales (ver abajo).
 *
 * **Por qué son opcionales** (auditoría de contenido, 2026-08-14): los 3
 * pilares apuntaban a `#crear`/`#ensenar`/`#producir`, anclas que no existen
 * en el sitio — los 3 links principales no llevaban a ningún lado. Mientras
 * `href` sea `null` el ítem se renderiza como texto (sigue siendo hoverable y
 * focusable para manejar el mosaico) en vez de ser un link roto. Y `Enseñar`
 * va sin foto a propósito: el material de docencia disponible muestra
 * adolescentes identificables del Programa Adolescencia — ver `content.ts`.
 */
export default function PillarMenu({ items, className, orientation = 'vertical' }: PillarMenuProps) {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const current = items[active];
  const inline = orientation === 'inline';

  return (
    <div
      className={cn(
        'flex w-full gap-6',
        inline
          ? 'flex-row items-end justify-between gap-4 md:gap-8'
          : 'flex-col items-center md:flex-row md:items-center md:gap-7',
        className
      )}
    >
      {/* Lista de pilares */}
      <ul className={cn('flex', inline ? 'flex-row flex-wrap items-baseline gap-x-6 gap-y-1 md:gap-x-10' : 'flex-col gap-1 md:gap-2')}>
        {items.map(({ key, label, href }, index) => {
          const isActive = index === active;
          const itemClassName = 'flex min-h-11 cursor-pointer items-baseline gap-3 outline-none md:gap-4';
          const content = (
            <>
              <span
                className={cn(
                  'font-label text-[11px] font-bold tracking-[0.2em] transition-colors duration-300',
                  isActive ? 'text-brand-red' : 'text-cream/25'
                )}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <span
                className={cn(
                  'font-display uppercase leading-[0.95] transition-colors duration-300',
                  inline ? 'text-xl sm:text-2xl md:text-3xl' : 'text-4xl sm:text-5xl',
                  isActive ? 'text-cream' : 'text-cream/25'
                )}
              >
                {label}
              </span>
            </>
          );
          const handlers = {
            onMouseEnter: () => setActive(index),
            onFocus: () => setActive(index),
            // En touch no hay hover: sin esto el mosaico se quedaría
            // siempre en la primera foto.
            onTouchStart: () => setActive(index),
            'aria-current': isActive ? ('true' as const) : undefined,
          };
          return (
            <li key={key}>
              {href ? (
                // Ruta interna (Fase 1: los pilares ahora apuntan a `/crear`,
                // `/ensenar`, `/producir` en vez de anchors) — `Link` navega
                // sin recargar y dispara la transición de `PageCurtain`.
                <Link to={href} {...handlers} className={itemClassName}>
                  {content}
                </Link>
              ) : (
                // Sin sección a la que ir, el ítem no es un link (ver
                // docblock) — sigue siendo focusable para que con teclado se
                // puedan recorrer los pilares y leer sus pies, pero no se le
                // pone `role="button"`: no dispara ninguna acción.
                <span tabIndex={0} {...handlers} className={itemClassName}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>

      {/* Mosaico + pie del pilar activo. En `inline` el mosaico es chico y va
          al final de la banda: es la vista previa del pilar activo, no el
          protagonista (en el Hero el protagonista es el retrato). */}
      <div className={cn('shrink-0 flex-col gap-2', inline ? 'hidden' : 'flex w-36 sm:w-44')}>
        <div className="relative aspect-square w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.key}
              className="absolute inset-0 grid grid-cols-3 grid-rows-3"
              style={{ gap: `${GAP}px` }}
            >
              {Array.from({ length: TILES }, (_, tile) => {
                const col = tile % GRID;
                const row = Math.floor(tile / GRID);
                const delay = reduced ? 0 : SCATTER.indexOf(tile) * TILE_STAGGER;
                return (
                  <motion.span
                    key={tile}
                    initial={{ opacity: 0, scale: reduced ? 1 : 0.2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reduced ? 1 : 0.2 }}
                    transition={{ duration: TILE_DURATION, delay, ease: EASE_REVEAL }}
                    className={cn(
                      'relative overflow-hidden rounded-[2px]',
                      // Sin foto, cada pedazo es un bloque apenas visible: se
                      // lee como un hueco a la espera de material, no como una
                      // imagen que no cargó.
                      !current.image && 'border border-cream/10 bg-cream/[0.03]'
                    )}
                  >
                    {/* Cada pedazo lleva la foto entera al tamaño del panel
                        (GRID x el tile) y la corre a su celda: recortada por el
                        overflow, el conjunto vuelve a formar la imagen completa.
                        El <picture>/<img> van con object-cover y no con
                        background-image porque `background-size: 300% 300%`
                        deforma la foto — estira cada eje por separado en vez
                        de recortar. El tamaño/posición en calc() es el mismo
                        cálculo de siempre, solo que ahora vive en el <picture>
                        (que es quien tiene el `position:absolute`) y el <img>
                        adentro simplemente lo llena al 100%. */}
                    {current.image
                      ? (() => {
                          const sources = getImageSources(current.image);
                          const sliceStyle = {
                            width: `calc(${GRID * 100}% + ${(GRID - 1) * GAP}px)`,
                            height: `calc(${GRID * 100}% + ${(GRID - 1) * GAP}px)`,
                            left: `calc(${col * -100}% - ${col * GAP}px)`,
                            top: `calc(${row * -100}% - ${row * GAP}px)`,
                          };
                          if (!sources) {
                            return (
                              <img
                                src={current.image}
                                alt=""
                                aria-hidden
                                className="absolute max-w-none object-cover"
                                style={sliceStyle}
                              />
                            );
                          }
                          return (
                            <picture className="absolute max-w-none" style={sliceStyle}>
                              <source type="image/avif" srcSet={sources.avifSet} />
                              <source type="image/webp" srcSet={sources.webpSet} />
                              <img
                                src={current.image}
                                alt=""
                                aria-hidden
                                className="h-full w-full object-cover"
                              />
                            </picture>
                          );
                        })()
                      : null}
                  </motion.span>
                );
              })}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">{current.alt}</span>
        </div>

        {/* Qué es el pilar + crédito de la fotógrafa (nunca se usa una foto
            ajena sin acreditarla — varias traen marca de agua). */}
        <p className="font-label text-[10px] leading-snug text-cream/50">
          {current.caption}
          {current.credit ? (
            <span className="mt-0.5 block text-cream/50">Foto: {current.credit}</span>
          ) : null}
        </p>
      </div>
    </div>
  );
}
